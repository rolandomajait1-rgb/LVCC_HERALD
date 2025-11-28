# Setup Production Without Shell Access

Since Render free tier doesn't have shell access, use these API endpoints:

## Step 1: Add Cloudinary Environment Variables
In Render Dashboard → Environment, add:
```
CLOUDINARY_URL=cloudinary://442671287954241:P9VbLNBU0nqy7GNOnGtge4sTRkc@da9wvkqcl
CLOUDINARY_CLOUD_NAME=da9wvkqcl
CLOUDINARY_KEY=442671287954241
CLOUDINARY_SECRET=P9VbLNBU0nqy7GNOnGtge4sTRkc
```

## Step 2: Run Setup via API

Open browser console (F12) on your production site and run:

### Seed Categories:
```javascript
fetch('https://lvcc-herald.onrender.com/api/setup/seed-categories', {
  method: 'POST'
}).then(r => r.json()).then(console.log);
```

### Run Migrations:
```javascript
fetch('https://lvcc-herald.onrender.com/api/setup/run-migrations', {
  method: 'POST'
}).then(r => r.json()).then(console.log);
```

### Clear Cache:
```javascript
fetch('https://lvcc-herald.onrender.com/api/setup/clear-cache', {
  method: 'POST'
}).then(r => r.json()).then(console.log);
```

## Step 3: Verify
Check response shows:
- `"success": true`
- `"count": 7` (for categories)

## Step 4: Test
Try creating an article - should work now!

## Security Note
After setup is complete, you can remove these routes from `routes/api.php` for security.
