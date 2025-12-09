<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('article_user_interactions', function (Blueprint $table) {
            // Drop the existing enum constraint
            $table->dropColumn('type');
        });
        
        Schema::table('article_user_interactions', function (Blueprint $table) {
            // Add new enum with 'viewed' type
            $table->enum('type', ['liked', 'shared', 'viewed'])->after('article_id');
            // Make user_id nullable for guest views
            $table->foreignId('user_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('article_user_interactions', function (Blueprint $table) {
            $table->dropColumn('type');
        });
        
        Schema::table('article_user_interactions', function (Blueprint $table) {
            $table->enum('type', ['liked', 'shared'])->after('article_id');
            $table->foreignId('user_id')->nullable(false)->change();
        });
    }
};