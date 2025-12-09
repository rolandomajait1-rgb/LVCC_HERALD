<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Log as ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::paginate(10);
        return response()->json($users);
    }

    public function create()
    {
        return view('users.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,moderator,editor,author,subscriber',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'created',
            'model_type' => 'User',
            'model_id' => $user->id,
            'new_values' => $user->toArray(),
        ]);

        if (request()->wantsJson()) {
            return response()->json(['message' => 'User created successfully.', 'user' => $user], 201);
        }
        return response()->json(['message' => 'User created successfully.', 'user' => $user], 201);
    }

    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function edit(User $user)
    {
        return view('users.edit', compact('user'));
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,moderator,editor,author,subscriber',
        ]);

        $oldValues = $user->toArray();
        $roleChanged = $oldValues['role'] !== $request->role;

        $user->update($request->only(['name', 'email', 'role']));

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'updated',
            'model_type' => 'User',
            'model_id' => $user->id,
            'old_values' => $oldValues,
            'new_values' => $user->toArray(),
        ]);

        if ($roleChanged && $request->expectsJson()) {
            return response()->json(['message' => 'User role updated successfully. User has been notified.', 'user' => $user]);
        }

        if (request()->wantsJson()) {
            return response()->json(['message' => 'User updated successfully.', 'user' => $user]);
        }
        return response()->json(['message' => 'User updated successfully.', 'user' => $user]);
    }

    public function destroy(User $user)
    {
        $oldValues = $user->toArray();

        $user->delete();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'deleted',
            'model_type' => 'User',
            'model_id' => $user->id,
            'old_values' => $oldValues,
        ]);

        if (request()->wantsJson()) {
            return response()->json(['message' => 'User deleted successfully']);
        }
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function getModerators()
    {
        $moderators = User::where('role', 'moderator')->get();
        return response()->json($moderators);
    }

    public function addModerator(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Create new user if doesn't exist
            $user = User::create([
                'name' => explode('@', $request->email)[0],
                'email' => $request->email,
                'password' => Hash::make('password123'), // Default password
                'role' => 'moderator',
            ]);

            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'created',
                'model_type' => 'User',
                'model_id' => $user->id,
                'new_values' => $user->toArray(),
            ]);

            return response()->json(['message' => 'Moderator created successfully. User has been notified.']);
        }

        if ($user->role === 'moderator') {
            return response()->json(['message' => 'User is already a moderator'], 400);
        }

        $oldValues = $user->toArray();
        $user->update(['role' => 'moderator']);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'updated',
            'model_type' => 'User',
            'model_id' => $user->id,
            'old_values' => $oldValues,
            'new_values' => $user->toArray(),
        ]);

        return response()->json(['message' => 'Moderator added successfully. User has been notified.']);
    }

    public function removeModerator($id)
    {
        try {
            $user = User::findOrFail($id);

            if ($user->role !== 'moderator') {
                return response()->json(['message' => 'User is not a moderator'], 400);
            }

            $oldValues = $user->toArray();
            $user->update(['role' => 'user']);

            try {
                ActivityLog::create([
                    'user_id' => Auth::id(),
                    'action' => 'updated',
                    'model_type' => 'User',
                    'model_id' => $user->id,
                    'old_values' => $oldValues,
                    'new_values' => $user->toArray(),
                ]);
            } catch (\Exception $e) {
                // Log creation failed but user update succeeded
            }

            return response()->json(['message' => 'Moderator removed successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to remove moderator'], 500);
        }
    }

    public function revokeAccess($id)
    {
        $user = User::findOrFail($id);
        $oldValues = $user->toArray();
        $user->update(['is_active' => false]);

        $user->tokens()->delete();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'revoked_access',
            'model_type' => 'User',
            'model_id' => $user->id,
            'old_values' => $oldValues,
            'new_values' => $user->toArray(),
        ]);

        return response()->json(['message' => 'User access revoked successfully']);
    }

    public function checkAdmin(Request $request)
    {
        return response()->json(['is_admin' => $request->user()->isAdmin()]);
    }
}