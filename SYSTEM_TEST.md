# LVCC Herald - Complete System Test

## 🔍 BACKEND TESTS (Render)

### 1. API Health Check
```bash
curl https://lvcc-herald.onrender.com/api/ping
# Expected: {"message":"pong"}
```

### 2. Database Check
```bash
curl https://lvcc-herald.onrender.com/api/setup/check-database
# Expected: JSON with articles, categories, users count
```

### 3. Categories Check
```bash
curl https://lvcc-herald.onrender.com/api/categories
# Expected: Array of 7 categories (News, Sports, Opinion, Literary, Features, Specials, Art)
```

### 4. Articles Check
```bash
curl https://lvcc-herald.onrender.com/api/articles/public
# Expected: Array of published articles
```

### 5. Latest Articles
```bash
curl https://lvcc-herald.onrender.com/api/latest-articles
# Expected: Array of 6 latest articles
```

## 🎨 FRONTEND TESTS (Vercel)

### 1. Homepage Load
- Visit: https://lvcc-herald-frontend.vercel.app
- ✅ Should show: Header, Navigation, Latest Section, Category Sections
- ✅ No console errors about via.placeholder.com
- ✅ Images show (either Cloudinary URLs or SVG placeholders)

### 2. Login Page
- Visit: https://lvcc-herald-frontend.vercel.app/landing
- ✅ Login form visible
- ✅ Can enter credentials
- ✅ Submit button works

### 3. Article Page
- Visit any article (click from homepage)
- ✅ Article title shows
- ✅ Article content shows
- ✅ Author name shows
- ✅ Category badge shows
- ✅ Image shows (or placeholder)

### 4. Category Pages
- Visit: https://lvcc-herald-frontend.vercel.app/category/news
- ✅ Shows articles in News category
- ✅ Category header shows
- ✅ Articles are clickable

### 5. Admin Dashboard (Login Required)
- Login as admin
- Visit: https://lvcc-herald-frontend.vercel.app/admin/statistics
- ✅ Statistics cards show numbers
- ✅ Recent activity table shows
- ✅ Sidebar navigation works

### 6. Create Article (Admin Only)
- Visit: https://lvcc-herald-frontend.vercel.app/admin/create-article
- ✅ Form fields visible
- ✅ Category dropdown has 7 options
- ✅ Image upload works
- ✅ Publish button enabled when form valid
- ✅ Article creates successfully

## 🔧 INTEGRATION TESTS

### Test 1: Full Article Creation Flow
1. Login as admin
2. Go to Create Article
3. Fill all fields:
   - Title: "Test Article"
   - Author: "Test Author"
   - Category: "News"
   - Tags: "#test"
   - Content: "Test content"
   - Image: Upload any image
4. Click Publish
5. ✅ Should redirect to admin page
6. ✅ Article should appear on homepage
7. ✅ Image should be Cloudinary URL

### Test 2: Article Edit Flow
1. Click Edit on any article
2. Change title
3. Click Save
4. ✅ Article should update
5. ✅ Slug should NOT change
6. ✅ Article should still be accessible

### Test 3: Category Filter
1. Go to homepage
2. Click "View All" on News section
3. ✅ Should show only News articles
4. ✅ URL should be /category/news

### Test 4: Search
1. Use search bar
2. Type "test"
3. ✅ Should show matching articles
4. ✅ Results should be clickable

## 📊 DATABASE VERIFICATION

### Check PostgreSQL Connection
```javascript
// Run in browser console at https://lvcc-herald-frontend.vercel.app
fetch('https://lvcc-herald.onrender.com/api/setup/check-database')
  .then(r => r.json())
  .then(data => {
    console.log('Database:', data.database); // Should be "pgsql"
    console.log('Host:', data.connection); // Should contain "render.com"
    console.log('Articles:', data.articles_count);
    console.log('Categories:', data.categories.length); // Should be 7
    console.log('Users:', data.users_count);
  });
```

### Check Categories
```javascript
fetch('https://lvcc-herald.onrender.com/api/categories')
  .then(r => r.json())
  .then(data => {
    console.log('Categories:', data.map(c => c.name));
    // Should show: News, Sports, Opinion, Literary, Features, Specials, Art
  });
```

### Remove Business Category (if exists)
```javascript
fetch('https://lvcc-herald.onrender.com/api/setup/remove-business-category', {
  method: 'POST'
}).then(r => r.json()).then(console.log);
```

## ✅ SUCCESS CRITERIA

### Backend (All must pass)
- [x] API responds to /api/ping
- [x] Database connection works (PostgreSQL)
- [x] Categories endpoint returns 7 categories
- [x] Articles endpoint returns articles
- [x] Authentication endpoints work
- [x] CORS allows frontend domain

### Frontend (All must pass)
- [x] Homepage loads without errors
- [x] No via.placeholder.com errors in console
- [x] Images show (Cloudinary or SVG placeholder)
- [x] Login/Register works
- [x] Admin dashboard accessible
- [x] Article creation works
- [x] Article editing works
- [x] Category filtering works

### Integration (All must pass)
- [x] Can create article with image
- [x] Image uploads to Cloudinary
- [x] Article appears on homepage
- [x] Article is clickable and loads
- [x] Edit doesn't break article URL
- [x] Categories filter correctly

## 🚨 KNOWN ISSUES

1. **Old articles have broken images** - Cannot be fixed (ephemeral filesystem)
2. **Business category may exist** - Run removal command
3. **Vercel cache** - May need to clear build cache if old code persists

## 🔄 DEPLOYMENT STATUS

Check deployment status:
- **Backend**: https://dashboard.render.com
- **Frontend**: https://vercel.com/dashboard

Both should show "Live" status with latest commit.

## 📝 FINAL CHECKLIST

Before marking system as complete:
- [ ] All backend tests pass
- [ ] All frontend tests pass
- [ ] All integration tests pass
- [ ] No console errors on homepage
- [ ] Can create new article successfully
- [ ] New article image shows correctly
- [ ] Admin dashboard loads
- [ ] Categories are correct (no Business)
- [ ] Database is PostgreSQL
- [ ] Both deployments are live
