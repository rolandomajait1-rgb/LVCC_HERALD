@echo off
echo ========================================
echo Category Fix Script
echo ========================================
echo.

cd backend

echo Step 1: Seeding categories...
php artisan db:seed --class=CategorySeeder
echo.

echo Step 2: Checking categories in database...
php artisan tinker --execute="echo 'Categories: '; \App\Models\Category::all()->each(function(\$c) { echo \$c->name . ' (slug: ' . \$c->slug . ')' . PHP_EOL; });"
echo.

echo Step 3: Checking published articles...
php artisan tinker --execute="echo 'Published articles: ' . \App\Models\Article::where('status', 'published')->count();"
echo.

echo Step 4: Checking articles with categories...
php artisan tinker --execute="\App\Models\Article::with('categories')->where('status', 'published')->get()->each(function(\$a) { echo \$a->title . ' -> ' . \$a->categories->pluck('name')->join(', ') . PHP_EOL; });"
echo.

echo ========================================
echo Fix complete! Check the output above.
echo ========================================
echo.
echo If articles don't have categories, run:
echo   php artisan tinker
echo Then assign categories manually.
echo.
pause
