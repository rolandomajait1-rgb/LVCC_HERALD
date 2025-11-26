<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function resetData(Request $request)
    {
        \App\Models\Article::truncate();
        \App\Models\ArticleInteraction::truncate();
        DB::table('article_category')->truncate();
        DB::table('article_tag')->truncate();

        return response()->json(['message' => 'Data reset successfully'])
            ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->header('Access-Control-Allow-Credentials', 'true')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
}
