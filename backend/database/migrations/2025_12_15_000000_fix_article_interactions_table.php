<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tmp_article_user_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['liked', 'shared', 'viewed'])->after('article_id');
            $table->foreignId('user_id')->nullable();
            $table->timestamps();

            $table->unique(['article_id', 'user_id', 'type'], 'aui_unique');
        });

        // Copy old data
        DB::statement("
            INSERT INTO tmp_article_user_interactions (id, article_id, user_id, created_at, updated_at)
            SELECT id, article_id, user_id, created_at, updated_at FROM article_user_interactions
        ");

        Schema::drop('article_user_interactions');

        Schema::rename('tmp_article_user_interactions', 'article_user_interactions');
    }

    public function down(): void
    {
        Schema::create('tmp_article_user_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['liked', 'shared'])->after('article_id');
            $table->foreignId('user_id'); // back to NOT NULL
            $table->timestamps();

            $table->unique(['article_id', 'user_id', 'type'], 'aui_unique');
        });

        DB::statement("
            INSERT INTO tmp_article_user_interactions (id, article_id, user_id, type, created_at, updated_at)
            SELECT id, article_id, user_id, NULL, created_at, updated_at
            FROM article_user_interactions
        ");

        Schema::drop('article_user_interactions');

        Schema::rename('tmp_article_user_interactions', 'article_user_interactions');
    }
};
