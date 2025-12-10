<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SetupController extends Controller
{
    public function checkDatabase()
    {
        try {
            DB::connection()->getPdo();
            $categoriesCount = Category::count();
            $usersCount = User::count();
            
            return response()->json([
                'status' => 'connected',
                'categories' => $categoriesCount,
                'users' => $usersCount
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function seedDatabase()
    {
        try {
            // Create default categories if they don't exist
            $categories = ['News', 'Opinion', 'Features', 'Sports', 'Literary', 'Art', 'Specials'];
            
            foreach ($categories as $categoryName) {
                Category::firstOrCreate(['name' => $categoryName]);
            }

            // Create admin user if doesn't exist
            $adminEmail = 'admin@laverdad.edu.ph';
            if (!User::where('email', $adminEmail)->exists()) {
                User::create([
                    'name' => 'Admin User',
                    'email' => $adminEmail,
                    'password' => Hash::make('admin123'),
                    'role' => 'admin',
                    'email_verified_at' => now(),
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Database seeded successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}