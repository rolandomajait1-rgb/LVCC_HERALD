# Manual Fix: Category Articles Not Showing

## Quick Fix via Admin Dashboard

1. **Login as admin** sa deployed site
2. **Go to Admin Dashboard**
3. **Click "Articles" or "Edit Article"**
4. **For each article:**
   - Open article
   - Check "Status" = Published ✅
   - Select a "Category" (News, Literary, etc.) ✅
   - Set "Published Date" ✅
   - Click "Save"

## Alternative: Database Fix

### Option 1: Via Render Dashboard
1. Go to Render Dashboard
2. Click your backend service
3. Click "Shell" tab
4. Run:
```bash
php artisan tinker
```

Then paste:
```php
// Get News category
$news = \App\Models\Category::where('name', 'News')->first();

// Assign all published articles to News
\App\Models\Article::where('status', 'published')
    ->whereDoesntHave('categories')
    ->get()
    ->each(function($article) use ($news) {
        $article->categories()->attach($news->id);
        echo "Fixed: {$article->title}\n";
    });

// Make sure all have published_at
\App\Models\Article::where('status', 'published')
    ->whereNull('published_at')
    ->update(['published_at' => now()]);

echo "Done!\n";
```

### Option 2: Via Database Client
1. Connect to your database
2. Run the SQL in `FIX_CATEGORIES_SQL.sql`

## Verify
1. Go to `/category/news`
2. Should show articles
3. Check other categories

## If Still Not Working
The issue might be:
1. Cache - clear browser cache
2. API not returning data - check browser console
3. CORS issue - check `CORS_TROUBLESHOOTING.md`

Send screenshot ng browser console kung may error pa rin.
