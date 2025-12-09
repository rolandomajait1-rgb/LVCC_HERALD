<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AdminController extends Controller
{
    public function fixCategories()
    {
        $literary = \App\Models\Category::where('name', 'Literary')->first();
        if (!$literary) {
            return response()->json(['error' => 'Category not found'], 404);
        }
        $articles = \App\Models\Article::doesntHave('categories')->where('status', 'published')->get();
        foreach ($articles as $article) {
            $article->categories()->attach($literary->id);
        }
        return response()->json(['fixed' => $articles->count()]);
    }
}
