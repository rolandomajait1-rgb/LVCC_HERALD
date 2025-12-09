<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\Tag;
use App\Models\Category;

class HealthController extends Controller
{
    public function check()
    {
        try {
            $articlesCount = Article::count();
            $tagsCount = Tag::count();
            $categoriesCount = Category::count();
            
            return response()->json([
                'status' => 'ok',
                'database' => 'connected',
                'counts' => [
                    'articles' => $articlesCount,
                    'tags' => $tagsCount,
                    'categories' => $categoriesCount
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}