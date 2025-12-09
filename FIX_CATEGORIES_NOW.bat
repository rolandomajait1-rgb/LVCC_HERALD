@echo off
echo ========================================
echo Fixing Article Categories NOW
echo ========================================
echo.

cd backend

echo Step 1: Checking database connection...
php artisan db:show
echo.

echo Step 2: Seeding categories if needed...
php artisan db:seed --class=CategorySeeder --force
echo.

echo Step 3: Fixing article-category relationships...
php artisan tinker --execute="$articles = \App\Models\Article::whereDoesntHave('categories')->get(); $categories = \App\Models\Category::all(); echo 'Articles without categories: ' . $articles->count() . PHP_EOL; foreach($articles as $article) { $cat = $categories->random(); $article->categories()->syncWithoutDetaching([$cat->id]); echo 'Fixed: ' . $article->title . ' -> ' . $cat->name . PHP_EOL; } echo PHP_EOL . 'DONE!';"
echo.

echo Step 4: Verifying fix...
php artisan tinker --execute="echo 'Total articles: ' . \App\Models\Article::count() . PHP_EOL; echo 'Articles with categories: ' . \App\Models\Article::has('categories')->count() . PHP_EOL;"
echo.

echo ========================================
echo Complete! Test your category pages now.
echo ========================================
pause
