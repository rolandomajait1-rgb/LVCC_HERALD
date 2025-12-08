<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function index()
    {
        $logs = Log::with('user')->paginate(20);
        return view('logs.index', compact('logs'));
    }

    public function show(Log $log)
    {
        return view('logs.show', compact('log'));
    }

    public function auditLogs(Request $request)
    {
        $logs = \App\Models\Log::with('user')
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get()
            ->map(function ($log) {
                $articleTitle = null;
                if ($log->model_type === 'Article' || $log->model_type === 'App\\Models\\Article') {
                    if ($log->action === 'deleted' && isset($log->old_values['title'])) {
                        $articleTitle = $log->old_values['title'];
                    } else {
                        $article = \App\Models\Article::find($log->model_id);
                        $articleTitle = $article?->title;
                    }
                }
                
                return [
                    'action' => ucfirst($log->action),
                    'article_title' => $articleTitle,
                    'user_email' => $log->user?->email,
                    'created_at' => $log->created_at,
                ];
            });

        return response()->json($logs);
    }
}
