<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('article_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('article_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['like', 'view', 'share']);
            $table->string('ip_address')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'article_id', 'type']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('article_interactions');
    }
};