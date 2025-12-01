# Diagnose "First Perspective" Category Issue

## Problem
You mentioned you can't see articles in "First Perspective" category, but this category doesn't exist in your system.

## Valid Categories
Your system has these 7 categories:
1. **News** - `/category/news`
2. **Sports** - `/category/sports`
3. **Opinion** - `/category/opinion`
4. **Literary** - `/category/literary`
5. **Features** - `/category/features` ← **Did you mean this one?**
6. **Specials** - `/category/specials`
7. **Art** - `/category/art`

## Possible Issues & Solutions

### Issue 1: You meant "Features" not "First Perspective"
If you're looking for the **Features** category, navigate to:
- URL: `http://localhost:5173/category/features`

### Issue 2: No articles are assigned to the category
Run this SQL to check if articles exist in Features category:

```sql
SELECT 
    a.id,
    a.title,
    a.status,
    c.name as category_name
FROM articles a
JOIN article_category ac ON a.id = ac.article_id
JOIN categories c ON ac.category_id = c.id
WHERE c.name = 'Features'
AND a.status = 'published';
```

### Issue 3: Category doesn't exist in database
Run the seeder to ensure all categories exist:

```bash
cd backend
php artisan db:seed --class=CategorySeeder
```

### Issue 4: Articles exist but aren't showing
Check if articles are published (not draft):

```sql
SELECT id, title, status, published_at 
FROM articles 
WHERE status = 'published'
ORDER BY published_at DESC;
```

## Quick Fix Steps

1. **Check which category you meant:**
   - Open browser to: `http://localhost:5173/category/features`
   - Try other categories: `/category/opinion`, `/category/news`, etc.

2. **Verify categories exist:**
   ```bash
   cd backend
   php artisan tinker
   ```
   Then run:
   ```php
   \App\Models\Category::all()->pluck('name');
   ```

3. **Check if articles have categories:**
   ```php
   \App\Models\Article::with('categories')->where('status', 'published')->get()->map(function($a) {
       return ['title' => $a->title, 'categories' => $a->categories->pluck('name')];
   });
   ```

4. **Assign articles to Features category if needed:**
   ```php
   $features = \App\Models\Category::where('name', 'Features')->first();
   $articles = \App\Models\Article::where('status', 'published')->get();
   foreach($articles as $article) {
       if($article->categories->isEmpty()) {
           $article->categories()->attach($features->id);
       }
   }
   ```

## Test the Fix

After running fixes, test by:
1. Opening `http://localhost:5173/category/features`
2. You should see articles if they exist and are published
3. If you see "Nothing Published Yet", then no articles are assigned to that category

## Need to Create Test Articles?

If you need articles in Features category:
1. Go to Admin Dashboard: `http://localhost:5173/admin/statistics`
2. Click "Create Article"
3. Select "Features" from category dropdown
4. Fill in article details
5. Click "Publish"
