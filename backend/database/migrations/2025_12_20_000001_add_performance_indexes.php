<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        try {
            Schema::table('articles', function (Blueprint $table) {
                $table->index('slug');
            });
        } catch (\Exception $e) {}
        
        try {
            Schema::table('articles', function (Blueprint $table) {
                $table->index('status');
            });
        } catch (\Exception $e) {}
        
        try {
            Schema::table('articles', function (Blueprint $table) {
                $table->index('published_at');
            });
        } catch (\Exception $e) {}
        
        try {
            Schema::table('articles', function (Blueprint $table) {
                $table->index(['status', 'published_at']);
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('article_category', function (Blueprint $table) {
                $table->index('article_id');
            });
        } catch (\Exception $e) {}
        
        try {
            Schema::table('article_category', function (Blueprint $table) {
                $table->index('category_id');
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('article_tag', function (Blueprint $table) {
                $table->index('article_id');
            });
        } catch (\Exception $e) {}
        
        try {
            Schema::table('article_tag', function (Blueprint $table) {
                $table->index('tag_id');
            });
        } catch (\Exception $e) {}
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['status']);
            $table->dropIndex(['published_at']);
            $table->dropIndex(['status', 'published_at']);
        });

        Schema::table('article_category', function (Blueprint $table) {
            $table->dropIndex(['article_id']);
            $table->dropIndex(['category_id']);
        });

        Schema::table('article_tag', function (Blueprint $table) {
            $table->dropIndex(['article_id']);
            $table->dropIndex(['tag_id']);
        });
    }
};
