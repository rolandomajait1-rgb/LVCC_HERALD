<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $articles = \App\Models\Article::latest()->take(5)->get();
        return view('admin.dashboard', compact('articles'));
    }

    public function stats(Request $request)
    {
        $users = \App\Models\User::count();
        $articles = \App\Models\Article::where('status', 'published')->count();
        $drafts = \App\Models\Draft::count();
        $views = \App\Models\ArticleInteraction::where('type', 'viewed')->count();
        $likes = \App\Models\ArticleInteraction::where('type', 'liked')->count();

        return response()->json([
            'users' => $users,
            'articles' => $articles,
            'drafts' => $drafts,
            'views' => $views,
            'likes' => $likes
        ]);
    }

    public function recentActivity(Request $request)
    {
        $activities = [];

        $recentArticles = \App\Models\Article::with('author.user')
            ->where('status', 'published')
            ->latest('published_at')
            ->take(20)
            ->get();

        foreach ($recentArticles as $article) {
            $activities[] = [
                'action' => 'Published',
                'title' => $article->title,
                'slug' => $article->slug,
                'user' => $article->author->user->email ?? 'Unknown',
                'timestamp' => $article->published_at->format('n/j/Y g:i A')
            ];
        }

        return response()->json($activities);
    }


}
