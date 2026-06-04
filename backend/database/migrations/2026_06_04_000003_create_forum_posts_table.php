<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forum_posts', function (Blueprint $table): void {
            $table->id();

            $table->foreignId('forum_thread_id')
                ->constrained('forum_threads')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->longText('content');
            $table->boolean('is_solution')->default(false);
            $table->timestamps();

            $table->index(['forum_thread_id', 'created_at'], 'idx_forum_posts_thread_created');
            $table->index(['user_id', 'created_at'], 'idx_forum_posts_user_created');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forum_posts');
    }
};
