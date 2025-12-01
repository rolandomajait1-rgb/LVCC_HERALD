# Fix: Articles Not Showing in Category Pages

## Problem
Articles are published and showing in "Latest Articles" but NOT appearing when visiting category pages like `/category/literary`.

## Root Cause
**Articles are not linked to categories in the database.** The `article_category` pivot table is empty or missing entries.

## Solution Applied

### 1. Fixed Case Sensitivity Issue
Updated `ArticleController.php` to handle case-insensitive category filtering:
- Frontend sends: `category: 'literary'` (lowercase)
- Backend now accepts both: `'literary'` and `'Literary'`

### 2. Created Fix Script
Run `FIX_ARTICLES_CATEGORIES.bat` to automatically:
- Ensure all 7 categories exist
- Find articles without categories
- Assign them to appropriate categories

## Quick Fix Steps

### Option 1: Run the Automated Script (RECOMMENDED)
```bash
FIX_ARTICLES_CATEGORIES.bat
```

### Option 2: Manual Fix via Tinker
```bash
cd backend
php artisan tinker
```

Then run these commands:

```php
// 1. Check categories exist
\App\Models\Category::all()->pluck('name');

// 2. Find articles without categories
$orphanArticles = \App\Models\Article::doesntHave('categories')
    ->where('status', 'published')
    ->get();
echo "Articles without categories: " . $orphanArticles->count();

// 3. Assign to Literary category (or choose another)
$literary = \App\Models\Category::where('name', 'Literary')->first();
foreach($orphanArticles as $article) {
    $article->categories()->attach($literary->id);
    echo "Assigned: " . $article->title . "\n";
}

// 4. Verify the fix
\App\Models\Article::with('categories')
    ->where('status', 'published')
    ->get()
    ->each(function($a) {
        echo $a->title . ' -> ' . $a->categories->pluck('name')->join(', ') . "\n";
    });
```

### Option 3: Assign Specific Categories to Specific Articles
```php
// Get categories
$news = \App\Models\Category::where('name', 'News')->first();
$sports = \App\Models\Category::where('name', 'Sports')->first();
$literary = \App\Models\Category::where('name', 'Literary')->first();

// Assign specific article to category
$article = \App\Models\Article::find(1); // Replace 1 with article ID
$article->categories()->attach($literary->id);

// Or assign multiple categories
$article->categories()->sync([$news->id, $literary->id]);
```

## Verify the Fix

1. **Check database directly:**
```sql
SELECT 
    a.id,
    a.title,
    a.status,
    GROUP_CONCAT(c.name) as categories
FROM articles a
LEFT JOIN article_category ac ON a.id = ac.article_id
LEFT JOIN categories c ON ac.category_id = c.id
WHERE a.status = 'published'
GROUP BY a.id, a.title, a.status;
```

2. **Test in browser:**
- Visit: `http://localhost:5173/category/literary`
- Visit: `http://localhost:5173/category/news`
- Visit: `http://localhost:5173/category/sports`

3. **Check API response:**
```bash
curl "http://localhost:8000/api/articles?category=literary"
```

## Prevention: Ensure Future Articles Have Categories

When creating articles via Admin Dashboard, make sure:
1. Category dropdown is selected
2. Category is saved with the article
3. Check `article_category` table has entries

## Troubleshooting

### Still not showing?
1. Clear Laravel cache:
```bash
cd backend
php artisan cache:clear
php artisan config:clear
```

2. Check article status:
```php
\App\Models\Article::find(1)->status; // Should be 'published'
```

3. Check published_at date:
```php
\App\Models\Article::find(1)->published_at; // Should not be null
```

### Articles showing in wrong category?
```php
// Remove wrong category
$article = \App\Models\Article::find(1);
$article->categories()->detach(); // Remove all

// Add correct category
$correct = \App\Models\Category::where('name', 'Literary')->first();
$article->categories()->attach($correct->id);
```
