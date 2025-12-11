<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Update any null type values to 'viewed' before modifying
        \DB::statement("UPDATE article_user_interactions SET type = 'viewed' WHERE type IS NULL OR type = ''");
        
        // Make user_id nullable
        \DB::statement("ALTER TABLE article_user_interactions ALTER COLUMN user_id DROP NOT NULL");
        
        // Drop old constraint and add new one with 'viewed'
        \DB::statement("ALTER TABLE article_user_interactions DROP CONSTRAINT IF EXISTS article_user_interactions_type_check");
        \DB::statement("ALTER TABLE article_user_interactions ADD CONSTRAINT article_user_interactions_type_check CHECK (type IN ('liked', 'shared', 'viewed'))");
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