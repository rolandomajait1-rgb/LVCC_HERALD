<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class SetupController extends Controller
{
    public function seedDatabase(Request $request)
    {
        try {
            // Check if articles already exist
            $articleCount = DB::table('articles')->count();
            
            if ($articleCount > 0) {
                return response()->json([
                    'message' => 'Database already has articles',
                    'article_count' => $articleCount
                ]);
            }

            // Run seeders
            Artisan::call('db:seed', ['--force' => true]);

            $newCount = DB::table('articles')->count();

            return response()->json([
                'message' => 'Database seeded successfully',
                'article_count' => $newCount
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to seed database',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function checkDatabase()
    {
        try {
            $articles = DB::table('articles')
                ->select('id', 'title', 'slug', 'status')
                ->limit(10)
                ->get();

            return response()->json([
                'total_articles' => DB::table('articles')->count(),
                'published_articles' => DB::table('articles')->where('status', 'published')->count(),
                'sample_articles' => $articles
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to check database',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
