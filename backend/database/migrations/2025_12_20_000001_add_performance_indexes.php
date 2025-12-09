<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->createIndexIfNotExists('articles', 'articles_slug_index', ['slug']);
        $this->createIndexIfNotExists('articles', 'articles_status_index', ['status']);
        $this->createIndexIfNotExists('articles', 'articles_published_at_index', ['published_at']);
        $this->createIndexIfNotExists('articles', 'articles_status_published_at_index', ['status','published_at']);

        $this->createIndexIfNotExists('article_category','article_category_article_id_index',['article_id']);
        $this->createIndexIfNotExists('article_category','article_category_category_id_index',['category_id']);

        $this->createIndexIfNotExists('article_tag','article_tag_article_id_index',['article_id']);
        $this->createIndexIfNotExists('article_tag','article_tag_tag_id_index',['tag_id']);
    }

    public function down(): void
    {
        Schema::table('articles', function ($table) {
            $table->dropIndex('articles_slug_index');
            $table->dropIndex('articles_status_index');
            $table->dropIndex('articles_published_at_index');
            $table->dropIndex('articles_status_published_at_index');
        });

        Schema::table('article_category', function ($table) {
            $table->dropIndex('article_category_article_id_index');
            $table->dropIndex('article_category_category_id_index');
        });

        Schema::table('article_tag', function ($table) {
            $table->dropIndex('article_tag_article_id_index');
            $table->dropIndex('article_tag_tag_id_index');
        });
    }

    private function createIndexIfNotExists(string $table, string $index, array $columns)
    {
        $exists = DB::selectOne("
            SELECT 1
            FROM sqlite_master
            WHERE type='index' AND name=?
        ", [$index]);

        if (!$exists) {
            Schema::table($table, function ($table) use ($columns, $index) {
                $table->index($columns, $index);
            });
        }
    }
};
