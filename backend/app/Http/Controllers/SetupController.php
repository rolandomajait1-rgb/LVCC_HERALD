<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class SetupController extends Controller
{
    public function seedCategories()
    {
        try {
            $categories = [
                ['name' => 'News', 'slug' => 'news'],
                ['name' => 'Sports', 'slug' => 'sports'],
                ['name' => 'Opinion', 'slug' => 'opinion'],
                ['name' => 'Literary', 'slug' => 'literary'],
                ['name' => 'Features', 'slug' => 'features'],
                ['name' => 'Specials', 'slug' => 'specials'],
                ['name' => 'Art', 'slug' => 'art'],
            ];

            foreach ($categories as $cat) {
                Category::firstOrCreate(['name' => $cat['name']], $cat);
            }

            return response()->json([
                'success' => true,
                'message' => 'Categories seeded successfully',
                'count' => Category::count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function runMigrations()
    {
        try {
            Artisan::call('migrate', ['--force' => true]);
            return response()->json([
                'success' => true,
                'message' => 'Migrations run successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function clearCache()
    {
        try {
            Artisan::call('config:clear');
            Artisan::call('cache:clear');
            return response()->json([
                'success' => true,
                'message' => 'Cache cleared successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function fixArticleCategory(Request $request)
    {
        try {
            $article = \App\Models\Article::where('slug', $request->slug)->firstOrFail();
            $category = Category::where('name', $request->category)->firstOrFail();
            $article->categories()->sync([$category->id]);
            
            return response()->json([
                'success' => true,
                'message' => 'Article category updated',
                'article' => $article->load('categories')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
