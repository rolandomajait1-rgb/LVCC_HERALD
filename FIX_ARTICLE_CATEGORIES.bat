@echo off
echo ========================================
echo Fixing Article Categories
echo ========================================
echo.

cd backend

echo Checking and fixing article-category relationships...
php artisan tinker --execute="$articles = \App\Models\Article::whereDoesntHave('categories')->get(); echo 'Articles without categories: ' . $articles->count() . PHP_EOL; $categories = \App\Models\Category::all(); foreach($articles as $article) { $randomCategory = $categories->random(); $article->categories()->attach($randomCategory->id); echo 'Attached ' . $randomCategory->name . ' to: ' . $article->title . PHP_EOL; } echo PHP_EOL . 'Done! All articles now have categories.';"

echo.
echo ========================================
echo Fix Complete!
echo ========================================
pause
