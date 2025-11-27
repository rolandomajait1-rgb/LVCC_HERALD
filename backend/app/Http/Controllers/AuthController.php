<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Staff;
use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }

    private function attemptLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            return Auth::user();
        }

        return null;
    }

    public function login(Request $request)
    {
        $user = $this->attemptLogin($request);

        if ($user) {
            $request->session()->regenerate();
            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function loginApi(Request $request)
    {
        $user = $this->attemptLogin($request);

        if ($user) {
            if (is_null($user->email_verified_at)) {
                Auth::logout();
                return response()->json(['message' => 'Please verify your email before logging in'], 403);
            }
            
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json(['token' => $token, 'role' => $user->role, 'user' => $user]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }


    public function showRegistrationForm()
    {
        return view('auth.register');
    }

    private function createUser(Request $request): User
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/',
        ]);

        return new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
    }

    public function register(Request $request)
    {
        $user = $this->createUser($request);
        // Manually set role after creation to avoid mass assignment
        $user->role = 'user';
        $user->save();


        Auth::login($user);

        return redirect('/dashboard')->with('success', 'Registration successful. Welcome!');
    }

    public function registerApi(Request $request)
    {
        $user = $this->createUser($request);
        // Manually set role after creation to avoid mass assignment
        $user->role = 'user';
        $user->save();

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Registration successful. You can now log in.'], 201);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function logoutApi(Request $request)
    {
        // Revoke the current access token
        $request->user()->tokens()->where('id', $request->user()->currentAccessToken()->id)->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function changePasswordApi(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/',
        ]);

        $user = $request->user();

        // Check if current password is correct
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Password changed successfully']);
    }

    public function deleteAccountApi(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        // Check if password is correct
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Password is incorrect'], 400);
        }

        // Delete related records
        $user->tokens()->delete(); // Sanctum tokens

        // Delete article interactions
        \App\Models\ArticleInteraction::where('user_id', $user->id)->delete();

        // If user is an author, delete their articles and drafts
        $author = \App\Models\Author::where('user_id', $user->id)->first();
        if ($author) {
            \App\Models\Article::where('author_id', $author->id)->delete();
        }

        // Delete the user
        $user->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    }

    public function verifyEmail(Request $request, $id, $hash)
    {
        $user = \App\Models\User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification link'], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified'], 200);
        }

        $user->markEmailAsVerified();

        return response()->json(['message' => 'Email verified successfully! You can now log in.'], 200);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)], 200)
            : response()->json(['message' => __($status)], 400);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)], 200)
            : response()->json(['message' => __($status)], 400);
    }
}
