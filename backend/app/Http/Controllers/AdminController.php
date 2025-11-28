<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AdminController extends Controller
{
    public function resetData(Request $request)
    {
        \App\Models\Article::truncate();
        \App\Models\ArticleInteraction::truncate();
        DB::table('article_category')->truncate();
        DB::table('article_tag')->truncate();

        return response()->json(['message' => 'Data reset successfully']);
    }

    public function getModerators()
    {
        $moderators = User::where('role', 'moderator')->get(['id', 'name', 'email', 'created_at']);
        return response()->json($moderators);
    }

    public function addModerator(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found with this email'], 404);
        }

        if ($user->role === 'moderator') {
            return response()->json(['message' => 'User is already a moderator'], 400);
        }

        $user->role = 'moderator';
        $user->save();

        return response()->json(['message' => 'Moderator added successfully', 'user' => $user]);
    }

    public function removeModerator($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->role = 'user';
        $user->save();

        return response()->json(['message' => 'Moderator removed successfully']);
    }
}
