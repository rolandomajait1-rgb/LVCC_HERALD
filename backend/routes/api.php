<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\DraftController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SetupController;

// Setup routes (temporary for production setup)
Route::get('/setup/seed', [SetupController::class, 'seedDatabase']);
Route::get('/setup/check', [SetupController::class, 'checkDatabase']);

// Ping route for testing
Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

// Health check
Route::get('/health', [\App\Http\Controllers\HealthController::class, 'check']);

// Team Members Routes
Route::get('/team-members', [TeamMemberController::class, 'index']);
Route::middleware('auth:sanctum')->post('/team-members/update', [TeamMemberController::class, 'update']);

// Public API Routes with rate limiting
Route::middleware('throttle:5,1')->post('/login', [AuthenticationController::class, 'login']);
Route::middleware('throttle:3,1')->post('/register', [AuthenticationController::class, 'register']);
Route::middleware('throttle:3,1')->post('/forgot-password', [AuthenticationController::class, 'forgotPassword']);
Route::middleware('throttle:3,1')->post('/reset-password', [AuthenticationController::class, 'resetPassword']);

// Search with rate limiting
Route::middleware('throttle:30,1')->get('/articles/search', [ArticleController::class, 'search']);

// Email Verification Routes
Route::get('/email/verify/{id}/{hash}', [AuthenticationController::class, 'verifyEmail'])
    ->middleware('signed')
    ->name('verification.verify');

Route::post('/email/resend', [AuthenticationController::class, 'resendVerificationEmail'])
    ->middleware('auth:sanctum');

Route::middleware('throttle:5,1')->post('/contact/feedback', [ContactController::class, 'sendFeedback']);
Route::middleware('throttle:5,1')->post('/contact/request-coverage', [ContactController::class, 'requestCoverage']);
Route::middleware('throttle:5,1')->post('/contact/join-herald', [ContactController::class, 'joinHerald']);
Route::middleware('throttle:5,1')->post('/contact/subscribe', [ContactController::class, 'subscribe']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/public', [ArticleController::class, 'publicIndex']);
Route::get('/articles/by-slug/{slug}', [ArticleController::class, 'showBySlug'])->where('slug', '[a-zA-Z0-9\-_]+');
Route::get('/articles/id/{id}', [ArticleController::class, 'showById']);
Route::get('/articles/author-public/{authorId}', [ArticleController::class, 'getArticlesByAuthorPublic']);
Route::get('/authors/{authorName}', [AuthorController::class, 'showByName']);
Route::get('/latest-articles', [ArticleController::class, 'latest']);
Route::get('/categories/{category}/articles', [CategoryController::class, 'articles']);
Route::get('/tags', [TagController::class, 'getAllTags']);
Route::get('/tags/{slug}/articles', [TagController::class, 'getArticlesByTag'])->where('slug', '[a-zA-Z0-9\-_]+');

// Protected article routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::get('/articles/{article}', [ArticleController::class, 'show']);
    Route::put('/articles/{article}', [ArticleController::class, 'update']);
    Route::delete('/articles/{article}', [ArticleController::class, 'destroy']);
    Route::post('/articles/{article}/like', [ArticleController::class, 'like']);
    Route::get('/articles/author/{authorId}', [ArticleController::class, 'getArticlesByAuthor']);
});

// API Routes with Sanctum authentication
Route::middleware('auth:sanctum')->group(function () {
    // User API
    Route::get('/user', [AuthenticationController::class, 'userInfo']);

    // Logout API
    Route::post('/logout', [AuthenticationController::class, 'logOut']);

    // Change Password API
    Route::post('/change-password', [AuthController::class, 'changePasswordApi']);

    // Delete Account API
    Route::post('/delete-account', [AuthController::class, 'deleteAccountApi']);

    // User liked and shared articles
    Route::get('/user/liked-articles', [ArticleController::class, 'getLikedArticles']);
    Route::get('/user/shared-articles', [ArticleController::class, 'getSharedArticles']);

    // Categories API
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Tags API
    Route::apiResource('tags', TagController::class);

    // Subscribers API
    Route::apiResource('subscribers', SubscriberController::class);

    // Logs API
    Route::get('/logs', [LogController::class, 'index']);
    Route::get('/logs/{log}', [LogController::class, 'show']);

    // Admin & Moderator shared routes
    Route::middleware(['role:admin,moderator'])->group(function () {
        Route::get('/admin/dashboard-stats', [DashboardController::class, 'stats']);
        Route::get('/admin/recent-activity', [DashboardController::class, 'recentActivity']);
        Route::get('/admin/audit-logs', [LogController::class, 'auditLogs']);
        Route::apiResource('drafts', DraftController::class);
    });

    // Admin-only routes
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin/check-access', [UserController::class, 'checkAdmin']);
        Route::get('/admin/moderators', [UserController::class, 'getModerators']);
        Route::post('/admin/moderators', [UserController::class, 'addModerator']);
        Route::delete('/admin/moderators/{id}', [UserController::class, 'removeModerator']);
        Route::post('/admin/users/{id}/revoke', [UserController::class, 'revokeAccess']);
        Route::apiResource('admin/users', UserController::class);
        Route::apiResource('staff', StaffController::class);
        Route::apiResource('authors', AuthorController::class);
        Route::post('/admin/fix-categories', [AdminController::class, 'fixCategories']);
    });
});
