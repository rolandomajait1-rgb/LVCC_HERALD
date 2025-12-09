<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'La Verdad Herald API', 'status' => 'active']);
});

// Debug route - CHECK DRAFTS
Route::get('/fix-categories', function () {
    $categories = [
        ['name' => 'News', 'slug' => 'news'],
        ['name' => 'Literary', 'slug' => 'literary'],
        ['name' => 'Sports', 'slug' => 'sports'],
        ['name' => 'Opinion', 'slug' => 'opinion'],
        ['name' => 'Features', 'slug' => 'features'],
        ['name' => 'Specials', 'slug' => 'specials'],
        ['name' => 'Art', 'slug' => 'art'],
    ];
    
    foreach ($categories as $cat) {
        \App\Models\Category::firstOrCreate(['name' => $cat['name']], $cat);
    }
    
    $literary = \App\Models\Category::where('name', 'Literary')->first();
    $articles = \App\Models\Article::where('status', 'published')->get();
    
    foreach ($articles as $article) {
        if ($article->categories()->count() == 0) {
            $article->categories()->attach($literary->id);
        }
    }
    
    return response()->json(['success' => true, 'articles_fixed' => $articles->count()]);
});
