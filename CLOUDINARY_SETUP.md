# Cloudinary Setup Guide

## Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/users/register_free
2. Sign up with email
3. Verify email
4. Login to dashboard

## Step 2: Get API Credentials
1. Go to Dashboard: https://console.cloudinary.com/
2. Copy these values:
   - Cloud Name
   - API Key
   - API Secret
3. Your CLOUDINARY_URL format:
   ```
   cloudinary://API_KEY:API_SECRET@CLOUD_NAME
   ```

## Step 3: Install Package (Run Locally First)
```bash
cd backend
composer require cloudinary-labs/cloudinary-laravel
```

## Step 4: Add to Render Environment Variables
1. Go to Render Dashboard
2. Select your backend service
3. Go to Environment tab
4. Add new variable:
   ```
   CLOUDINARY_URL=cloudinary://YOUR_API_KEY:YOUR_API_SECRET@YOUR_CLOUD_NAME
   ```
5. Save changes (will trigger redeploy)

## Step 5: Test Locally
1. Add to `backend/.env`:
   ```
   CLOUDINARY_URL=cloudinary://YOUR_API_KEY:YOUR_API_SECRET@YOUR_CLOUD_NAME
   ```
2. Start backend: `php artisan serve`
3. Try creating an article with image
4. Check Cloudinary dashboard for uploaded image

## Step 6: Deploy to Production
```bash
git add .
git commit -m "Add Cloudinary image storage"
git push origin main
```

## Verification
1. Wait for Render deployment to complete
2. Login to production site
3. Create new article with image
4. Verify image displays correctly
5. Check Cloudinary dashboard for uploaded file
6. Redeploy backend and verify image still works

## Troubleshooting

### Error: "Class 'Cloudinary' not found"
- Run: `composer dump-autoload`
- Verify package installed: `composer show cloudinary-labs/cloudinary-laravel`

### Error: "Invalid credentials"
- Check CLOUDINARY_URL format
- Verify API key and secret are correct
- No spaces in environment variable

### Images not uploading
- Check Render logs for errors
- Verify CLOUDINARY_URL is set in Render
- Check file size limits (10MB default)

### Images not displaying
- Check browser console for errors
- Verify Cloudinary URL is accessible
- Check CORS settings in Cloudinary dashboard
