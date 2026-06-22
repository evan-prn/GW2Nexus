<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forum_threads', function (Blueprint $table): void {
            $table->id();

            $table->foreignId('forum_category_id')
                ->constrained('forum_categories')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->string('title', 150);
            $table->string('slug', 180)->unique();
            $table->string('excerpt', 300)->nullable();
            $table->boolean('is_locked')->default(false);
            $table->boolean('is_pinned')->default(false);
            $table->unsignedInteger('views_count')->default(0);
            $table->timestamp('last_post_at')->nullable();
            $table->timestamps();

            $table->index(
                ['forum_category_id', 'is_pinned', 'last_post_at'],
                'idx_forum_threads_category_pinned_last_post'
            );
            $table->index(['user_id', 'created_at'], 'idx_forum_threads_user_created');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forum_threads');
    }
};
