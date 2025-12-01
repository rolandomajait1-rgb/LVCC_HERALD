<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Facades\Log;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        try {
            $validated = $request->validate([
                'q' => 'nullable|string|max:255'
            ]);

            $q = $validated['q'] ?? '';
            $articles = collect();
            
            if (strlen($q) > 1) {
                $searchTerm = '%' . addslashes($q) . '%';
                
                $articles = Article::published()
                    ->with('author.user', 'categories')
                    ->where(function ($query) use ($searchTerm) {
                        $query->where('title', 'like', $searchTerm)
                              ->orWhere('excerpt', 'like', $searchTerm)
                              ->orWhere('content', 'like', $searchTerm)
                              ->orWhereHas('author.user', function ($qry) use ($searchTerm) {
                                  $qry->where('name', 'like', $searchTerm);
                              })
                              ->orWhereHas('tags', function ($qry) use ($searchTerm) {
                                  $qry->where('name', 'like', $searchTerm);
                              });
                    })
                    ->latest('published_at')
                    ->paginate(10);
            }

            return view('search.index', compact('articles', 'q'));
        } catch (\Exception $e) {
            Log::error('Search failed: ' . $e->getMessage());
            return view('search.index', ['articles' => collect(), 'q' => '']);
        }
    }
}


