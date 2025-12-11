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

/*
|--------------------------------------------------------------------------
| API Routes - La Verdad Herald
|--------------------------------------------------------------------------
| Organized by: Public → Auth → User → Admin
*/

// ============================================================================
// SYSTEM ROUTES
// ============================================================================
Route::get('/ping', fn() => response()->json(['message' => 'pong']));
Route::get('/health', [\App\Http\Controllers\HealthController::class, 'check']);
Route::get('/setup/seed', [SetupController::class, 'seedDatabase']);
Route::get('/setup/check', [SetupController::class, 'checkDatabase']);

// ============================================================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================================================

// --- Authentication ---
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthenticationController::class, 'login']);
    Route::post('/forgot-password', [AuthenticationController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthenticationController::class, 'resetPassword']);
});
Route::middleware('throttle:3,1')->post('/register', [AuthenticationController::class, 'register']);
Route::get('/email/verify/{id}/{hash}', [AuthenticationController::class, 'verifyEmail'])->middleware('signed')->name('verification.verify');

// --- Articles (Public) ---
Route::get('/articles/public', [ArticleController::class, 'publicIndex']);
Route::get('/articles/by-slug/{slug}', [ArticleController::class, 'showBySlug'])->where('slug', '[a-zA-Z0-9\-_]+');
Route::get('/articles/id/{id}', [ArticleController::class, 'showById']);
Route::get('/latest-articles', [ArticleController::class, 'latest']);
Route::middleware('throttle:30,1')->get('/articles/search', [ArticleController::class, 'search']);

// --- Categories (Public) ---
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}/articles', [CategoryController::class, 'articles']);

// --- Tags (Public) ---
Route::get('/tags', [TagController::class, 'getAllTags']);
Route::get('/tags/{slug}/articles', [TagController::class, 'getArticlesByTag'])->where('slug', '[a-zA-Z0-9\-_]+');

// --- Authors (Public) ---
Route::get('/authors/{authorName}', [AuthorController::class, 'showByName']);
Route::get('/articles/author-public/{authorId}', [ArticleController::class, 'getArticlesByAuthorPublic']);

// --- Team Members (Public) ---
Route::get('/team-members', [TeamMemberController::class, 'index']);

// --- Contact Forms ---
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/contact/feedback', [ContactController::class, 'sendFeedback']);
    Route::post('/contact/request-coverage', [ContactController::class, 'requestCoverage']);
    Route::post('/contact/join-herald', [ContactController::class, 'joinHerald']);
    Route::post('/contact/subscribe', [ContactController::class, 'subscribe']);
});

// ============================================================================
// AUTHENTICATED ROUTES (Requires Login)
// ============================================================================
Route::middleware('auth:sanctum')->group(function () {
    
    // --- User Profile ---
    Route::get('/user', [AuthenticationController::class, 'userInfo']);
    Route::post('/logout', [AuthenticationController::class, 'logOut']);
    Route::post('/change-password', [AuthController::class, 'changePasswordApi']);
    Route::post('/delete-account', [AuthController::class, 'deleteAccountApi']);
    Route::post('/email/resend', [AuthenticationController::class, 'resendVerificationEmail']);
    
    // --- User Articles ---
    Route::get('/user/liked-articles', [ArticleController::class, 'getLikedArticles']);
    Route::get('/user/shared-articles', [ArticleController::class, 'getSharedArticles']);
    Route::post('/articles/{article}/like', [ArticleController::class, 'like']);
    
    // --- Articles (Authenticated) ---
    Route::get('/articles/{article}', [ArticleController::class, 'show']);
    Route::get('/articles/author/{authorId}', [ArticleController::class, 'getArticlesByAuthor']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{article}', [ArticleController::class, 'update']);
    Route::delete('/articles/{article}', [ArticleController::class, 'destroy']);
    
    // ========================================================================
    // ADMIN & MODERATOR ROUTES
    // ========================================================================
    Route::middleware(['role:admin,moderator'])->group(function () {
        
        // --- Dashboard ---
        Route::get('/admin/dashboard-stats', [DashboardController::class, 'stats']);
        Route::get('/admin/recent-activity', [DashboardController::class, 'recentActivity']);
        Route::get('/admin/audit-logs', [LogController::class, 'auditLogs']);
        
        // --- Drafts ---
        Route::apiResource('drafts', DraftController::class);
        
        // --- Categories ---
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::get('/categories/{category}', [CategoryController::class, 'show']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
        
        // --- Tags ---
        Route::apiResource('tags', TagController::class);
        
        // --- Subscribers ---
        Route::apiResource('subscribers', SubscriberController::class);
        
        // --- Logs ---
        Route::get('/logs', [LogController::class, 'index']);
        Route::get('/logs/{log}', [LogController::class, 'show']);
    });
    
    // ========================================================================
    // ADMIN ONLY ROUTES
    // ========================================================================
    Route::middleware(['role:admin'])->group(function () {
        
        // --- Admin Access ---
        Route::get('/admin/check-access', [UserController::class, 'checkAdmin']);
        Route::post('/admin/fix-categories', [AdminController::class, 'fixCategories']);
        
        // --- User Management ---
        Route::apiResource('admin/users', UserController::class);
        Route::post('/admin/users/{id}/revoke', [UserController::class, 'revokeAccess']);
        
        // --- Moderator Management ---
        Route::get('/admin/moderators', [UserController::class, 'getModerators']);
        Route::post('/admin/moderators', [UserController::class, 'addModerator']);
        Route::delete('/admin/moderators/{id}', [UserController::class, 'removeModerator']);
        
        // --- Staff Management ---
        Route::apiResource('staff', StaffController::class);
        
        // --- Author Management ---
        Route::apiResource('authors', AuthorController::class);
        
        // --- Team Members ---
        Route::post('/team-members/update', [TeamMemberController::class, 'update']);
    });
});
