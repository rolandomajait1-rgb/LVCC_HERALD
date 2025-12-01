@echo off
echo ========================================
echo Fix Articles Categories Script
echo ========================================
echo.
echo This script will:
echo 1. Check if categories exist
echo 2. Assign all published articles to categories
echo.

cd backend

echo Step 1: Ensuring categories exist...
php artisan db:seed --class=CategorySeeder
echo.

echo Step 2: Checking articles without categories...
php artisan tinker --execute="$count = \App\Models\Article::doesntHave('categories')->where('status', 'published')->count(); echo 'Articles without categories: ' . $count . PHP_EOL;"
echo.

echo Step 3: Assigning categories to articles...
php artisan tinker --execute="$literary = \App\Models\Category::where('name', 'Literary')->first(); $articles = \App\Models\Article::doesntHave('categories')->where('status', 'published')->get(); foreach($articles as $article) { $article->categories()->attach($literary->id); } echo 'Assigned ' . $articles->count() . ' articles to Literary category' . PHP_EOL;"
echo.

echo Step 4: Verifying fix...
php artisan tinker --execute="\App\Models\Article::with('categories')->where('status', 'published')->get()->each(function($a) { echo $a->title . ' -> ' . $a->categories->pluck('name')->join(', ') . PHP_EOL; });"
echo.

echo ========================================
echo Fix complete!
echo ========================================
echo.
echo Now test by visiting:
echo   http://localhost:5173/category/literary
echo.
pause
