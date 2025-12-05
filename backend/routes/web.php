<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Debug route - CHECK DRAFTS
Route::get('/debug/drafts', function () {
    $drafts = \App\Models\Article::where('status', 'draft')
        ->with('author', 'categories', 'tags')
        ->get();
    
    return response()->json([
        'total_drafts' => $drafts->count(),
        'drafts' => $drafts,
        'all_articles_count' => \App\Models\Article::count(),
        'published_count' => \App\Models\Article::where('status', 'published')->count()
    ]);
});
