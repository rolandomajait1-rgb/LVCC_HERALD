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
                return [
                    'action' => $log->action,
                    'article_title' => $log->model_type === 'App\\Models\\Article' ? \App\Models\Article::find($log->model_id)?->title : null,
                    'user_email' => $log->user?->email,
                    'created_at' => $log->created_at,
                ];
            });

        return response()->json($logs)
            ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->header('Access-Control-Allow-Credentials', 'true')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
}
