# DOKUMENTASYON NG SISTEMA - LA VERDAD HERALD

## PANGKALAHATANG PAGLALARAWAN

Ang La Verdad Herald ay isang web-based na sistema ng pahayagan na dinisenyo para sa La Verdad Christian College. Ito ay isang full-stack application na gumagamit ng React para sa frontend at Laravel para sa backend.

---

## ARKITEKTURA NG SISTEMA

### 1. FRONTEND (React + Vite)
- **Teknolohiya**: React 18, Vite, TailwindCSS
- **Lokasyon**: `/frontend` folder
- **Port**: 5173 (development)

### 2. BACKEND (Laravel)
- **Teknolohiya**: Laravel 11, PHP 8.2+
- **Lokasyon**: `/backend` folder
- **Port**: 8000 (development)
- **Database**: PostgreSQL

### 3. DEPLOYMENT
- **Frontend**: Vercel (https://lvcc-herald.vercel.app)
- **Backend**: Render (https://lvcc-herald.onrender.com)

---

## MGA PANGUNAHING FEATURE

### 1. AUTHENTICATION SYSTEM (Sistema ng Pagpapatunay)

#### Paglalarawan:
Ang sistema ay may tatlong uri ng user:
- **Admin** - May karapatang mag-manage ng lahat
- **Moderator** - Maaaring mag-create at mag-edit ng articles
- **Regular User** - Maaaring magbasa at mag-like ng articles

#### Mga File na Kasangkot:
```
frontend/src/authentication/
├── LoginPage.jsx - Pahina ng pag-login
├── SignUpPage.jsx - Pahina ng pag-register
└── ForgotPasswordPage.jsx - Pahina ng password recovery

backend/app/Http/Controllers/
└── AuthenticationController.php - Nag-hahandle ng authentication
```

#### Paano Gumagana:
1. **Pag-register** (`register` method):
   - Tinatanggap ang name, email, at password
   - Nag-validate na La Verdad email lang (@laverdad.edu.ph)
   - Nag-hash ng password gamit ang bcrypt
   - Nag-send ng verification email
   - Nag-return ng authentication token

```php
public function register(Request $request)
{
    // Validate input
    $request->validate([
        'email' => 'required|email|regex:/@(student\.)?laverdad\.edu\.ph$/i',
        'password' => 'required|min:8|confirmed',
    ]);
    
    // Create user
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);
    
    // Send verification email
    BrevoMailer::sendVerificationLink($user->email, $signedUrl);
    
    return response()->json(['token' => $token]);
}
```

2. **Pag-login** (`login` method):
   - Tinatanggap ang email at password
   - Nag-verify ng credentials
   - Nag-check kung verified na ang email
   - Nag-return ng token at user info

3. **Token Management**:
   - Gumagamit ng Laravel Sanctum para sa API tokens
   - Naka-store ang token sa localStorage (frontend)
   - Automatic na nag-expire after 24 hours

---

### 2. ARTICLE MANAGEMENT SYSTEM

#### Paglalarawan:
Ito ang core feature ng sistema kung saan nag-create, edit, at delete ng mga articles.

#### Mga File na Kasangkot:
```
frontend/src/AdminDashboard/
├── CreateArticle.jsx - Form para sa pag-create ng article
├── EditArticle.jsx - Form para sa pag-edit ng article
└── DraftArticles.jsx - Listahan ng mga draft articles

backend/app/Http/Controllers/
└── ArticleController.php - Main controller para sa articles
```

#### Paano Gumagana ang Pag-create ng Article:

```php
public function store(ArticleRequest $request)
{
    // 1. Validate input
    $validated = $request->validated();
    
    // 2. Upload image sa Cloudinary
    if ($request->hasFile('featured_image')) {
        $uploadedFile = cloudinary()->uploadApi()->upload(
            $request->file('featured_image')->getRealPath()
        );
        $imagePath = $uploadedFile['secure_url'];
    }
    
    // 3. Create article
    $article = Article::create([
        'title' => $validated['title'],
        'slug' => Str::slug($validated['title']),
        'content' => $validated['content'],
        'author_id' => $author->id,
        'status' => 'published',
        'featured_image' => $imagePath,
    ]);
    
    // 4. Attach categories at tags
    $article->categories()->attach($validated['category_id']);
    $article->tags()->sync($tagIds);
    
    // 5. Log activity
    ActivityLog::create([
        'user_id' => Auth::id(),
        'action' => 'created',
        'model_type' => 'Article',
    ]);
    
    return response()->json($article, 201);
}
```

#### Mga Importante Features:
- **Slug Generation**: Automatic na ginagawa ang URL-friendly slug
- **Image Upload**: Nag-upload sa Cloudinary para sa mabilis na loading
- **Draft System**: Pwedeng i-save as draft bago i-publish
- **Activity Logging**: Lahat ng changes ay naka-record

---

### 3. CATEGORY SYSTEM

#### Paglalarawan:
Ang mga articles ay naka-organize sa mga categories:
- News
- Opinion
- Features
- Sports
- Literary
- Art
- Specials

#### Paano Gumagana:
```php
// Get articles by category
public function articles($category)
{
    $categoryModel = Category::where('name', $category)->firstOrFail();
    
    $articles = Article::whereHas('categories', function ($query) use ($categoryModel) {
        $query->where('category_id', $categoryModel->id);
    })
    ->where('status', 'published')
    ->with(['author', 'categories', 'tags'])
    ->latest('published_at')
    ->paginate(10);
    
    return response()->json($articles);
}
```

---

### 4. SEARCH FUNCTIONALITY

#### Paglalarawan:
Nag-aalow sa users na maghanap ng articles gamit ang keywords.

#### Mga File:
```
frontend/src/components/SearchBar.jsx
frontend/src/pages/SearchResults.jsx
backend/app/Http/Controllers/ArticleController.php (search method)
```

#### Paano Gumagana:
```php
public function search(Request $request)
{
    $query = $request->get('q', '');
    
    // Minimum 3 characters
    if (strlen(trim($query)) < 3) {
        return response()->json(['data' => []]);
    }
    
    $searchTerm = '%' . $query . '%';
    
    $articles = Article::where('status', 'published')
        ->where(function($q) use ($searchTerm) {
            $q->where('title', 'LIKE', $searchTerm)
              ->orWhere('content', 'LIKE', $searchTerm)
              ->orWhereHas('tags', function($query) use ($searchTerm) {
                  $query->where('name', 'LIKE', $searchTerm);
              })
              ->orWhereHas('author', function($query) use ($searchTerm) {
                  $query->where('name', 'LIKE', $searchTerm);
              });
        })
        ->orderBy('published_at', 'desc')
        ->take(20)
        ->get();
    
    // Log search
    SearchLog::create([
        'query' => $query,
        'results_count' => $articles->count(),
    ]);
    
    return response()->json(['data' => $articles]);
}
```

---

### 5. LIKE AND SHARE SYSTEM

#### Paglalarawan:
Nag-aalow sa users na mag-like at mag-share ng articles.

#### Paano Gumagana ang Like:
```php
public function like(Article $article)
{
    // Check if already liked
    $existing = ArticleInteraction::where('user_id', Auth::id())
        ->where('article_id', $article->id)
        ->where('type', 'like')
        ->first();
    
    if ($existing) {
        // Unlike
        $existing->delete();
        $liked = false;
    } else {
        // Like
        ArticleInteraction::create([
            'user_id' => Auth::id(),
            'article_id' => $article->id,
            'type' => 'like',
            'ip_address' => request()->ip()
        ]);
        $liked = true;
    }
    
    $count = ArticleInteraction::where('article_id', $article->id)
        ->where('type', 'like')
        ->count();
    
    return response()->json([
        'liked' => $liked,
        'likes_count' => $count
    ]);
}
```

#### Share Functionality (Frontend):
```javascript
const handleShare = (platform) => {
    const url = window.location.href;
    const title = article.title;
    
    switch (platform) {
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
            break;
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
            break;
        case 'copy':
            navigator.clipboard.writeText(url);
            break;
    }
};
```

---

### 6. ADMIN DASHBOARD

#### Paglalarawan:
Ito ang control panel para sa Admin at Moderator.

#### Mga Features:
1. **Statistics** - Nagpapakita ng:
   - Total registered users
   - Total views
   - Published articles
   - Total likes

2. **Recent Activity** - Listahan ng mga bagong published articles

3. **Manage Moderators** (Admin only) - Pag-add at pag-remove ng moderators

#### Code ng Statistics:
```php
public function stats(Request $request)
{
    $users = User::count();
    $articles = Article::where('status', 'published')->count();
    $views = ArticleInteraction::where('type', 'view')->count();
    $likes = ArticleInteraction::where('type', 'like')->count();
    
    return response()->json([
        'users' => $users,
        'articles' => $articles,
        'views' => $views,
        'likes' => $likes
    ]);
}
```

---

### 7. ROLE-BASED ACCESS CONTROL (RBAC)

#### Paglalarawan:
Ang sistema ay may tatlong levels ng access:

#### Middleware Implementation:
```php
// backend/app/Http/Middleware/RoleMiddleware.php
public function handle($request, Closure $next, ...$roles)
{
    if (!Auth::check()) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }
    
    $userRole = Auth::user()->role;
    
    if (!in_array($userRole, $roles)) {
        return response()->json(['error' => 'Forbidden'], 403);
    }
    
    return $next($request);
}
```

#### Routes Protection:
```php
// Admin-only routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/moderators', [UserController::class, 'getModerators']);
    Route::post('/admin/moderators', [UserController::class, 'addModerator']);
    Route::delete('/admin/moderators/{id}', [UserController::class, 'removeModerator']);
});

// Admin and Moderator routes
Route::middleware(['auth:sanctum', 'role:admin,moderator'])->group(function () {
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{article}', [ArticleController::class, 'update']);
});
```

---

### 8. IMAGE UPLOAD SYSTEM

#### Paglalarawan:
Gumagamit ng Cloudinary para sa image hosting.

#### Configuration:
```php
// backend/config/cloudinary.php
return [
    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    'api_key' => env('CLOUDINARY_KEY'),
    'api_secret' => env('CLOUDINARY_SECRET'),
];
```

#### Upload Process:
```php
if ($request->hasFile('featured_image')) {
    try {
        // Upload to Cloudinary
        $uploadedFile = cloudinary()->uploadApi()->upload(
            $request->file('featured_image')->getRealPath(),
            ['folder' => 'laverdad-herald/articles']
        );
        $imagePath = $uploadedFile['secure_url'];
    } catch (\Exception $e) {
        // Fallback to local storage
        $image = $request->file('featured_image');
        $imageName = time() . '.' . $image->getClientOriginalExtension();
        $image->move(public_path('storage/articles'), $imageName);
        $imagePath = '/storage/articles/' . $imageName;
    }
}
```

---

### 9. EMAIL NOTIFICATION SYSTEM

#### Paglalarawan:
Gumagamit ng Brevo (dating SendinBlue) para sa email notifications.

#### Mga Email Types:
1. **Email Verification** - Pagkatapos mag-register
2. **Password Reset** - Para sa forgot password
3. **Welcome Email** - Pagkatapos ma-verify

#### Implementation:
```php
// backend/app/Services/BrevoMailer.php
class BrevoMailer
{
    public static function sendVerificationLink($email, $verificationUrl)
    {
        $config = Configuration::getDefaultConfiguration()
            ->setApiKey('api-key', env('BREVO_API_KEY'));
        
        $apiInstance = new TransactionalEmailsApi(new Client(), $config);
        
        $sendSmtpEmail = new SendSmtpEmail([
            'to' => [['email' => $email]],
            'sender' => [
                'email' => env('MAIL_FROM_ADDRESS'),
                'name' => env('MAIL_FROM_NAME')
            ],
            'subject' => 'Verify Your Email',
            'htmlContent' => "<p>Click here to verify: <a href='$verificationUrl'>Verify Email</a></p>"
        ]);
        
        $apiInstance->sendTransacEmail($sendSmtpEmail);
    }
}
```

---

### 10. DATABASE SCHEMA

#### Users Table:
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Articles Table:
```sql
CREATE TABLE articles (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    author_id BIGINT REFERENCES authors(id),
    status VARCHAR(50) DEFAULT 'draft',
    published_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

#### Article Interactions Table:
```sql
CREATE TABLE article_user_interactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    article_id BIGINT REFERENCES articles(id),
    type VARCHAR(50) NOT NULL, -- 'like', 'view', 'share'
    ip_address VARCHAR(45),
    created_at TIMESTAMP
);
```

---

## SECURITY FEATURES

### 1. Password Security
- Minimum 8 characters
- Required: uppercase, lowercase, number, special character
- Hashed using bcrypt (cost factor: 12)

### 2. CSRF Protection
- Laravel Sanctum tokens
- CSRF tokens para sa forms

### 3. SQL Injection Prevention
- Eloquent ORM (automatic parameter binding)
- Prepared statements

### 4. XSS Prevention
- DOMPurify sa frontend
- Laravel's automatic escaping

### 5. Rate Limiting
```php
// Search endpoint - 30 requests per minute
Route::middleware('throttle:30,1')->get('/articles/search', [ArticleController::class, 'search']);

// Contact forms - 5 requests per minute
Route::middleware('throttle:5,1')->post('/contact/feedback', [ContactController::class, 'sendFeedback']);
```

---

## ERROR HANDLING

### Backend Error Handling:
```php
try {
    // Code execution
} catch (\Exception $e) {
    Log::error('Error message: ' . $e->getMessage());
    return response()->json([
        'error' => 'User-friendly error message',
        'message' => 'Detailed error for debugging'
    ], 500);
}
```

### Frontend Error Handling:
```javascript
try {
    const response = await axios.get('/api/articles');
    setArticles(response.data);
} catch (error) {
    console.error('Error:', error);
    if (error.response?.status === 401) {
        // Redirect to login
        navigate('/login');
    } else {
        // Show error notification
        showNotification('Error', error.message, 'error');
    }
}
```

---

## DEPLOYMENT PROCESS

### Frontend (Vercel):
1. Push code sa GitHub
2. Vercel automatic na nag-deploy
3. Environment variables naka-set sa Vercel dashboard

### Backend (Render):
1. Push code sa GitHub
2. Render automatic na nag-build at deploy
3. Database migrations automatic na tumatakbo
4. Environment variables naka-set sa Render dashboard

---

## TESTING

### Manual Testing Checklist:
- [ ] User registration at login
- [ ] Email verification
- [ ] Password reset
- [ ] Article creation
- [ ] Article editing
- [ ] Article deletion
- [ ] Image upload
- [ ] Search functionality
- [ ] Like/Unlike articles
- [ ] Share articles
- [ ] Category filtering
- [ ] Tag filtering
- [ ] Admin dashboard statistics
- [ ] Moderator management

---

## MAINTENANCE

### Regular Tasks:
1. **Database Backup** - Weekly
2. **Log Monitoring** - Daily
3. **Security Updates** - Monthly
4. **Performance Monitoring** - Weekly

### Common Issues at Solutions:

#### Issue 1: "Database connection failed"
**Solution**: Check .env file, verify database credentials

#### Issue 2: "Image upload failed"
**Solution**: Check Cloudinary credentials, verify file size limits

#### Issue 3: "Email not sending"
**Solution**: Check Brevo API key, verify email templates

---

## FUTURE ENHANCEMENTS

1. **Comments System** - Para sa user engagement
2. **Newsletter Subscription** - Email notifications para sa new articles
3. **Advanced Analytics** - Detailed statistics at reports
4. **Mobile App** - React Native version
5. **Push Notifications** - Real-time updates
6. **Multi-language Support** - English at Tagalog versions

---

## CONTACT AT SUPPORT

Para sa technical support o questions:
- Email: rolandomajait1@gmail.com
- GitHub: https://github.com/rolandomajait1-rgb/LVCC_HERALD

---

## KONKLUSYON

Ang La Verdad Herald system ay isang komprehensibong web application na dinisenyo para sa efficient na pamamahala ng school publication. Ito ay gumagamit ng modern web technologies at best practices para sa security, performance, at user experience.

Ang sistema ay madaling i-maintain at i-extend para sa future requirements. Lahat ng code ay well-documented at sumusunod sa industry standards.

---

**Inihanda ni**: Development Team
**Petsa**: Enero 2025
**Bersyon**: 1.0
