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
        $drafts = \App\Models\Article::where('status', 'draft')->count();
        $views = \App\Models\ArticleInteraction::where('type', 'shared')->count();
        $likes = \App\Models\ArticleInteraction::where('type', 'liked')->count();

        return response()->json([
            'users' => $users,
            'articles' => $articles,
            'drafts' => $drafts,
            'views' => $views,
            'likes' => $likes
        ])
            ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->header('Access-Control-Allow-Credentials', 'true')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
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
                'user' => $article->author->user->email ?? 'Unknown',
                'timestamp' => $article->published_at->format('n/j/Y g:i A')
            ];
        }

        return response()->json($activities)
            ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->header('Access-Control-Allow-Credentials', 'true')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }

    public function adminStats(Request $request)
    {
        $totalArticles = \App\Models\Article::count();
        $totalUsers = \App\Models\User::count();
        $totalViews = \App\Models\ArticleInteraction::where('type', 'shared')->count();
        $recentArticles = \App\Models\Article::with('author.user', 'categories')
            ->latest('published_at')
            ->take(5)
            ->get();

        return response()->json([
            'totalArticles' => $totalArticles,
            'totalUsers' => $totalUsers,
            'totalViews' => $totalViews,
            'recentArticles' => $recentArticles
        ])
            ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->header('Access-Control-Allow-Credentials', 'true')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
}
