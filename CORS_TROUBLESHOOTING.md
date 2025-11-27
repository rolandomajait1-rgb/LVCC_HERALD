# CORS Troubleshooting Guide

## If CORS errors occur in production:

### 1. Check Backend Environment Variables
In Render dashboard, ensure:
```
FRONTEND_URL=https://your-frontend.vercel.app
APP_URL=https://your-backend.onrender.com
```

### 2. Check Frontend Environment Variables
In Vercel dashboard, ensure:
```
VITE_API_URL=https://your-backend.onrender.com
```

### 3. Verify CORS Headers
Test backend endpoint:
```bash
curl -H "Origin: https://your-frontend.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type, Authorization" \
     -X OPTIONS \
     https://your-backend.onrender.com/api/articles
```

Should return:
- `Access-Control-Allow-Origin: https://your-frontend.vercel.app`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS`

### 4. Common Issues

**Issue:** "No 'Access-Control-Allow-Origin' header"
**Fix:** Add your Vercel URL to `FRONTEND_URL` in Render

**Issue:** "CORS policy: credentials mode"
**Fix:** Already set to `false` (using Bearer tokens)

**Issue:** Vercel preview URLs blocked
**Fix:** Pattern `/^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/` allows all preview URLs

### 5. Emergency Fix
If still blocked, temporarily add to `backend/config/cors.php`:
```php
'allowed_origins' => ['*'], // ONLY FOR TESTING
```
Then narrow down to specific domain once working.

### 6. Check Logs
- Render: Dashboard → Logs
- Vercel: Dashboard → Deployments → View Function Logs
- Browser: DevTools → Console → Network tab
