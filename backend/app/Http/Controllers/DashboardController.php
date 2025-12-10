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
        try {
            $stats = \Illuminate\Support\Facades\Cache::remember('dashboard_stats', 300, function () {
                return [
                    'users' => \App\Models\User::count(),
                    'articles' => \App\Models\Article::where('status', 'published')->count(),
                    'views' => \App\Models\ArticleInteraction::where('type', 'view')->count(),
                    'likes' => \App\Models\ArticleInteraction::where('type', 'like')->count()
                ];
            });

            return response()->json($stats);
        } catch (\Exception $e) {
            \Log::error('Dashboard stats error: ' . $e->getMessage());
            return response()->json([
                'users' => 0,
                'articles' => 0,
                'views' => 0,
                'likes' => 0
            ]);
        }
    }

    public function recentActivity(Request $request)
    {
        try {
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
                    'user' => $article->author && $article->author->user ? $article->author->user->email : 'Unknown',
                    'timestamp' => $article->published_at ? $article->published_at->format('n/j/Y g:i A') : 'N/A'
                ];
            }

            return response()->json($activities);
        } catch (\Exception $e) {
            \Log::error('Recent activity error: ' . $e->getMessage());
            return response()->json([]);
        }
    }


}
