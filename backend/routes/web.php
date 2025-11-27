<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/setup-db', function () {
    try {
        Artisan::call('migrate:fresh', ['--force' => true]);
        Artisan::call('db:seed', ['--force' => true]);
        return response()->json(['success' => 'Database setup complete!']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
})->withoutMiddleware(['web']);

Route::get('/', function () {
    return response()->json(['message' => 'La Verdad Herald API']);
});
