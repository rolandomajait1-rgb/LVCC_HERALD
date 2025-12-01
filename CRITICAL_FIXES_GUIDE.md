# Critical Security Fixes Implementation Guide

## 🔴 PRIORITY 1: SQL Injection Fixes

### Issue: Raw queries and unsafe LIKE clauses

**Vulnerable Code Example (ArticleController.php:28):**
```php
$query->whereHas('categories', function ($q) use ($request) {
    $q->where('name', 'LIKE', $request->category);
});
```

**Fixed Code:**
```php
$query->whereHas('categories', function ($q) use ($request) {
    $q->where('name', 'LIKE', '%' . $request->input('category') . '%');
});
```

### Fix for SearchController.php (Line 15-28)
**Replace:**
```php
$articles = Article::published()
    ->with('author.user', 'categories')
    ->where(function($q) use ($query) {
        $q->where('title', 'LIKE', "%{$query}%")
        ->orWhere('content', 'LIKE', "%{$query}%")
        ->orWhere('excerpt', 'LIKE', "%{$query}%");
    })
    ->latest('published_at')
    ->take(20)
    ->get();
```

**With:**
```php
$searchTerm = '%' . $request->input('q', '') . '%';
$articles = Article::published()
    ->with('author.user', 'categories')
    ->where(function($q) use ($searchTerm) {
        $q->where('title', 'LIKE', $searchTerm)
          ->orWhere('content', 'LIKE', $searchTerm)
          ->orWhere('excerpt', 'LIKE', $searchTerm);
    })
    ->latest('published_at')
    ->take(20)
    ->get();
```

---

## 🔴 PRIORITY 2: Remove Hardcoded Credentials

### AuthController.php - Remove Password Checks

**Lines 27, 210, 212 - REMOVE THESE:**
```php
// NEVER DO THIS:
if ($request->password === 'hardcoded_password') {
    // ...
}
```

**Use Laravel's Hash facade:**
```php
if (Hash::check($request->password, $user->password)) {
    // Password is correct
}
```

### User.php Model - Remove Hardcoded Password

**Line 54 - REMOVE:**
```php
'password' => 'hashed',  // This is fine
// But if there's a hardcoded password string, remove it
```

---

## 🔴 PRIORITY 3: Fix XSS in ContactController

### ContactController.php - Sanitize All Inputs

**Add at the top:**
```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
```

**Replace sendFeedback method:**
```php
public function sendFeedback(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'message' => 'required|string|max:5000',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $validated = $validator->validated();
    
    // Sanitize inputs
    $name = strip_tags($validated['name']);
    $email = filter_var($validated['email'], FILTER_SANITIZE_EMAIL);
    $message = strip_tags($validated['message']);

    try {
        BrevoMailer::sendFeedback($name, $email, $message);
        return response()->json(['message' => 'Feedback sent successfully!']);
    } catch (\Exception $e) {
        Log::error('Feedback send failed: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to send feedback'], 500);
    }
}
```

---

## 🔴 PRIORITY 4: Fix Insecure Cryptography

### AuthenticationController.php - SHA1 Usage

**Lines 70, 92, 117 - Replace SHA1 with secure hashing:**

**WRONG:**
```php
$hash = sha1($user->email);  // INSECURE!
```

**CORRECT:**
```php
// For email verification, SHA1 is acceptable for non-password hashing
// But ensure it's used with signed URLs (which you already do)
$hash = sha1($user->getEmailForVerification());

// For passwords, ALWAYS use:
$hashedPassword = Hash::make($password);
```

**Note:** SHA1 for email verification tokens in signed URLs is acceptable since it's not for password storage. The real issue is if SHA1 is used for passwords.

---

## 🔴 PRIORITY 5: CSRF Protection (Frontend)

### Create CSRF Token Utility

**File: `frontend/src/utils/csrf.js`**
```javascript
export const getCsrfToken = () => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  return token;
};

export const csrfHeaders = () => ({
  'X-CSRF-TOKEN': getCsrfToken(),
  'X-Requested-With': 'XMLHttpRequest'
});
```

### Update axiosConfig.js

**Add CSRF token to all requests:**
```javascript
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.timeout = 30000;
axios.defaults.withCredentials = true; // Enable cookies for CSRF

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token for state-changing requests
    if (['post', 'put', 'delete', 'patch'].includes(config.method)) {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      if (csrfToken) {
        config.headers['X-CSRF-TOKEN'] = csrfToken;
      }
    }
    
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => Promise.reject(error)
);
```

---

## 🔴 PRIORITY 6: Fix CORS (Already Done)

**Verify `.env` has:**
```env
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**For development:**
```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## 🟠 ADDITIONAL SECURITY HEADERS

### Add to `public/.htaccess` or Nginx config:

```apache
# Security Headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"
Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"

# Content Security Policy
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.cloudinary.com;"
```

---

## 🟠 INPUT VALIDATION BEST PRACTICES

### Always validate in controllers:

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'author_name' => 'required|string|max:255',
        'category_id' => 'required|exists:categories,id',
        'tags' => 'nullable|string|max:500',
        'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
    ]);
    
    // Use $validated array, not $request directly
}
```

---

## 🟠 ERROR HANDLING PATTERN

### Wrap all controller methods:

```php
public function index(Request $request)
{
    try {
        // Your logic here
        $data = Article::with('author')->get();
        return response()->json($data);
        
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json(['error' => 'Resource not found'], 404);
        
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json(['errors' => $e->errors()], 422);
        
    } catch (\Exception $e) {
        Log::error('Error in ArticleController@index: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred'], 500);
    }
}
```

---

## 🟡 PERFORMANCE OPTIMIZATIONS

### Fix N+1 Queries:

**Bad:**
```php
$articles = Article::all();
foreach ($articles as $article) {
    echo $article->author->name; // N+1 query!
}
```

**Good:**
```php
$articles = Article::with('author', 'categories', 'tags')->get();
foreach ($articles as $article) {
    echo $article->author->name; // Single query!
}
```

---

## TESTING CHECKLIST

After implementing fixes:

- [ ] Run `php artisan test`
- [ ] Test SQL injection with tools like SQLMap
- [ ] Test XSS with payloads: `<script>alert('XSS')</script>`
- [ ] Verify CSRF tokens are present in all POST/PUT/DELETE requests
- [ ] Check CORS headers with different origins
- [ ] Verify no hardcoded credentials in codebase
- [ ] Run security scanner (Snyk, SonarQube)
- [ ] Performance test with Apache Bench or k6

---

## DEPLOYMENT CHECKLIST

Before production:

- [ ] All Priority 1 fixes implemented
- [ ] All Priority 2 fixes implemented
- [ ] Environment variables properly set
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting tested
- [ ] Backup strategy in place
- [ ] Monitoring and logging configured
- [ ] Incident response plan documented

---

**Next Steps:**
1. Implement fixes in order of priority
2. Test each fix thoroughly
3. Run security scan again
4. Document all changes
5. Deploy to staging first
6. Monitor for issues
7. Deploy to production
