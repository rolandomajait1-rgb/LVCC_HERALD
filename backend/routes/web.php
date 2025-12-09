<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'La Verdad Herald API', 'status' => 'active']);
});

// Debug route - CHECK DRAFTS
Route::get('/debug/drafts', function () {
    $all = \App\Models\Article::select('id', 'title', 'status')->get();
    $drafts = \App\Models\Article::where('status', 'draft')->get();
    
    return response()->json([
        'draft_count' => $drafts->count(),
        'published_count' => \App\Models\Article::where('status', 'published')->count(),
        'total_count' => $all->count(),
        'all_articles' => $all
    ]);
});
