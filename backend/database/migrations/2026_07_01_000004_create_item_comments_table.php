<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Miroir de `forum_posts` — mêmes conventions de clés/suppression. */
    public function up(): void
    {
        Schema::create('item_comments', function (Blueprint $table): void {
            $table->id();

            $table->foreignId('item_id')
                ->constrained('items')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->longText('content');
            $table->timestamps();

            $table->index(['item_id', 'created_at'], 'idx_item_comments_item_created');
            $table->index(['user_id', 'created_at'], 'idx_item_comments_user_created');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_comments');
    }
};
