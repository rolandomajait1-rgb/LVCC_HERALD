# Production Fix - 422 Error on Article Creation

## Problem
Article creation failing with 422 error because:
1. Categories not seeded in production database
2. Images still broken (Cloudinary not configured)

## Fix Steps

### 1. Add Cloudinary Environment Variables in Render
Go to Render Dashboard → Backend Service → Environment

Add these variables:
```
CLOUDINARY_URL=cloudinary://442671287954241:P9VbLNBU0nqy7GNOnGtge4sTRkc@da9wvkqcl
CLOUDINARY_CLOUD_NAME=da9wvkqcl
CLOUDINARY_KEY=442671287954241
CLOUDINARY_SECRET=P9VbLNBU0nqy7GNOnGtge4sTRkc
```

### 2. Run Migrations and Seeders in Render Shell
```bash
php artisan migrate --force
php artisan db:seed --class=CategorySeeder --force
php artisan config:clear
php artisan cache:clear
```

### 3. Verify Categories Exist
```bash
php artisan tinker --execute="echo 'Categories: '; var_dump(\App\Models\Category::count());"
```

Should show 12 categories.

### 4. Test Article Creation
1. Login to production site
2. Go to Create Article
3. Fill all fields
4. Upload image
5. Click Publish

## If Still Broken

### Check Logs
In Render Shell:
```bash
tail -f storage/logs/laravel.log
```

### Manual Category Creation
If seeder fails, run in Render Shell:
```bash
php artisan tinker
```

Then paste:
```php
$categories = ['News', 'Sports', 'Opinion', 'Literary', 'Features', 'Specials', 'Art'];
foreach ($categories as $name) {
    \App\Models\Category::firstOrCreate(['name' => $name], ['slug' => strtolower($name)]);
}
echo "Categories created\n";
exit;
```

## Verification Checklist
- [ ] Cloudinary env vars added to Render
- [ ] Migrations run
- [ ] Categories seeded
- [ ] Config cleared
- [ ] Test article creation works
- [ ] Test image upload works
- [ ] Verify image displays correctly
