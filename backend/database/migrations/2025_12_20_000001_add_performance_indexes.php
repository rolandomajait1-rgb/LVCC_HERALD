<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->index('slug');
            $table->index('status');
            $table->index('published_at');
            $table->index(['status', 'published_at']);
        });

        Schema::table('article_category', function (Blueprint $table) {
            $table->index('article_id');
            $table->index('category_id');
        });

        Schema::table('article_tag', function (Blueprint $table) {
            $table->index('article_id');
            $table->index('tag_id');
        });
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
