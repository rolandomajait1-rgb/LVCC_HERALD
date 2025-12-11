# 🔗 Frontend-Backend Connection Guide

## Paano Gumagana ang Connection

### 1. FRONTEND (React) → BACKEND (Laravel)

```
FRONTEND (localhost:5173)  →  BACKEND (localhost:8000/api)
   React App                    Laravel API
```

---

## 📍 Configuration Files

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

### Backend (.env)
```
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## 🔧 Axios Configuration (Frontend)

**File:** `frontend/src/utils/axiosConfig.js`

```javascript
// Base URL setup
axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = false

// Automatic token attachment
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
```

---

## 📡 API Endpoints Structure

### PUBLIC ENDPOINTS (No Auth Required)

#### Articles
```
GET  /api/articles/public          - Get all published articles
GET  /api/articles/by-slug/{slug}  - Get article by slug
GET  /api/articles/search?q=       - Search articles
GET  /api/latest-articles          - Get latest 6 articles
```

#### Categories
```
GET  /api/categories                      - Get all categories
GET  /api/categories/{category}/articles  - Get articles by category
```

#### Tags
```
GET  /api/tags                    - Get all tags
GET  /api/tags/{slug}/articles    - Get articles by tag
```

#### Authors
```
GET  /api/authors/{authorName}                  - Get author info
GET  /api/articles/author-public/{authorId}     - Get author's articles
```

#### Contact
```
POST /api/contact/feedback          - Send feedback
POST /api/contact/request-coverage  - Request coverage
POST /api/contact/join-herald       - Join herald
POST /api/contact/subscribe         - Subscribe to newsletter
```

#### Authentication
```
POST /api/login                - Login
POST /api/register             - Register
POST /api/forgot-password      - Forgot password
POST /api/reset-password       - Reset password
```

---

### PROTECTED ENDPOINTS (Auth Required)

#### User
```
GET  /api/user                      - Get current user info
POST /api/logout                    - Logout
POST /api/change-password           - Change password
POST /api/delete-account            - Delete account
GET  /api/user/liked-articles       - Get liked articles
GET  /api/user/shared-articles      - Get shared articles
```

#### Articles (Admin/Moderator)
```
POST   /api/articles              - Create article
PUT    /api/articles/{id}         - Update article
DELETE /api/articles/{id}         - Delete article
POST   /api/articles/{id}/like    - Like article
```

#### Admin Dashboard
```
GET  /api/admin/dashboard-stats    - Dashboard statistics
GET  /api/admin/recent-activity    - Recent activity
GET  /api/admin/audit-logs         - Audit logs
GET  /api/admin/moderators         - Get moderators
POST /api/admin/moderators         - Add moderator
```

---

## 🔐 Authentication Flow

### 1. Login Process
```javascript
// Frontend: LoginPage.jsx
const response = await axios.post('/api/login', {
    email: 'user@example.com',
    password: 'password'
})

// Backend returns:
{
    token: 'xxx',
    user: { id, name, email, role }
}

// Frontend saves:
localStorage.setItem('auth_token', token)
localStorage.setItem('user_role', user.role)
```

### 2. Making Authenticated Requests
```javascript
// Token automatically attached by axios interceptor
const articles = await axios.get('/api/articles')
// Header: Authorization: Bearer xxx
```

### 3. Logout Process
```javascript
await axios.post('/api/logout')
localStorage.clear()
window.location.href = '/landing'
```

---

## 📂 Frontend Service Files

### articleService.js
```javascript
// Example: Get articles by category
export const getArticlesByCategory = async (category) => {
    const response = await axios.get(`/api/articles/public`, {
        params: { category, limit: 9 }
    })
    return response.data
}
```

---

## 🛡️ CORS Configuration

**Backend:** `config/cors.php`
```php
'allowed_origins' => [
    'http://localhost:5173',
    'https://lvcc-herald.vercel.app'
],
'supports_credentials' => true
```

**Middleware:** `app/Http/Middleware/CorsMiddleware.php`
- Handles preflight OPTIONS requests
- Adds CORS headers to responses

---

## 🔄 Request Flow Example

### Example: Fetch Homepage Articles

1. **Frontend Request**
```javascript
// HomePage.jsx
const fetchArticles = async () => {
    const response = await axios.get('/api/articles/public', {
        params: { category: 'news', limit: 9 }
    })
    setArticles(response.data)
}
```

2. **Full URL Called**
```
http://localhost:8000/api/articles/public?category=news&limit=9
```

3. **Backend Route**
```php
// routes/api.php
Route::get('/articles/public', [ArticleController::class, 'publicIndex']);
```

4. **Backend Controller**
```php
// ArticleController.php
public function publicIndex(Request $request) {
    $articles = Article::published()
        ->with('author', 'categories')
        ->where('category', $request->category)
        ->limit($request->limit)
        ->get();
    return response()->json($articles);
}
```

5. **Backend Response**
```json
{
    "data": [
        {
            "id": 1,
            "title": "Article Title",
            "slug": "article-title",
            "content": "...",
            "author_name": "John Doe",
            "categories": [{"name": "News"}]
        }
    ]
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Check `CORS_ALLOWED_ORIGINS` in backend `.env`
- Verify `CorsMiddleware` is registered
- Clear Laravel cache: `php artisan config:clear`

### Issue 2: 401 Unauthorized
```
Unauthenticated
```
**Solution:**
- Check if token exists: `localStorage.getItem('auth_token')`
- Verify token is valid (not expired)
- Check if route requires authentication

### Issue 3: Network Error
```
Network Error / ECONNABORTED
```
**Solution:**
- Verify backend is running: `php artisan serve`
- Check `VITE_API_URL` in frontend `.env`
- Verify port 8000 is not blocked

### Issue 4: 404 Not Found
```
Route not found
```
**Solution:**
- Check route exists in `routes/api.php`
- Verify URL format matches route definition
- Clear route cache: `php artisan route:clear`

---

## 🚀 Starting the Application

### Backend
```bash
cd backend
php artisan serve
# Runs on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 📊 API Response Format

### Success Response
```json
{
    "data": [...],
    "message": "Success"
}
```

### Error Response
```json
{
    "error": "Error message",
    "message": "Detailed error description"
}
```

### Paginated Response
```json
{
    "data": [...],
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50
}
```

---

## 🔍 Debugging Tips

### Check Backend Logs
```bash
tail -f backend/storage/logs/laravel.log
```

### Check Frontend Network Tab
1. Open Browser DevTools (F12)
2. Go to Network tab
3. Filter by XHR/Fetch
4. Check request/response details

### Test API Directly
```bash
# Using curl
curl http://localhost:8000/api/articles/public

# Using Postman
GET http://localhost:8000/api/articles/public
```

---

## 📝 Summary

1. **Frontend** calls API using axios
2. **Axios** adds base URL and auth token
3. **Request** goes to Laravel backend
4. **CORS middleware** validates origin
5. **Route** matches and calls controller
6. **Controller** processes and returns data
7. **Frontend** receives and displays data

**Key Files:**
- Frontend: `src/utils/axiosConfig.js`
- Backend: `routes/api.php`
- Backend: `app/Http/Controllers/*`
- Config: `.env` files (both frontend & backend)
