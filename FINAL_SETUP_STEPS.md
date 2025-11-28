# Final Setup Steps - Simple Guide

## Current Issues
1. Categories not seeded in production database
2. Old articles have broken images (lost forever)
3. New articles need Cloudinary to work

## What You Need To Do

### Step 1: Verify Cloudinary Env Vars in Render
Go to Render Dashboard → Your backend service → Environment tab

Make sure these 4 variables exist:
- CLOUDINARY_URL
- CLOUDINARY_CLOUD_NAME  
- CLOUDINARY_KEY
- CLOUDINARY_SECRET

If missing, add them and wait for redeploy.

### Step 2: Seed Categories (REQUIRED)
Open browser console (F12) on https://lvcc-herald-frontend.vercel.app

Paste this and press Enter:
```javascript
fetch('https://lvcc-herald.onrender.com/api/setup/seed-categories', {method: 'POST'}).then(r => r.json()).then(console.log);
```

You should see: `{success: true, count: 7}`

### Step 3: Test
1. Login to production site
2. Create a NEW article with an image
3. It should work now

## What About Old Broken Articles?
Old articles with broken images (404 errors) cannot be fixed. The images are permanently lost.

Options:
- Delete those articles
- Re-upload their images by editing them

## That's It!
After step 2, everything will work for new articles.
