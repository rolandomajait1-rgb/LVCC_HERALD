<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->index(['status', 'published_at']);
            $table->index('slug');
            $table->index('author_id');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->index('slug');
            $table->index('name');
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->index('slug');
            $table->index('name');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('email');
            $table->index('role');
        });

        Schema::table('article_interactions', function (Blueprint $table) {
            $table->index(['article_id', 'type']);
            $table->index(['user_id', 'type']);
        });
    }

    public function down()
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex(['status', 'published_at']);
            $table->dropIndex(['slug']);
            $table->dropIndex(['author_id']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['name']);
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['name']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['email']);
            $table->dropIndex(['role']);
        });

        Schema::table('article_interactions', function (Blueprint $table) {
            $table->dropIndex(['article_id', 'type']);
            $table->dropIndex(['user_id', 'type']);
        });
    }
};