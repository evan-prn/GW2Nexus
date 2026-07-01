<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ForumThread extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'forum_category_id',
        'user_id',
        'title',
        'slug',
        'excerpt',
        'is_locked',
        'is_pinned',
        'views_count',
        'last_post_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_locked' => 'boolean',
            'is_pinned' => 'boolean',
            'views_count' => 'integer',
            'last_post_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ForumCategory::class, 'forum_category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function posts(): HasMany
    {
        return $this->hasMany(ForumPost::class, 'forum_thread_id');
    }

    /**
     * @param  Builder<ForumThread>  $query
     * @return Builder<ForumThread>
     */
    public function scopePinned(Builder $query): Builder
    {
        return $query->where('is_pinned', true);
    }

    /**
     * @param  Builder<ForumThread>  $query
     * @return Builder<ForumThread>
     */
    public function scopeUnlocked(Builder $query): Builder
    {
        return $query->where('is_locked', false);
    }

    /**
     * @param  Builder<ForumThread>  $query
     * @return Builder<ForumThread>
     */
    public function scopeLatestActivity(Builder $query): Builder
    {
        return $query
            ->orderByDesc('is_pinned')
            ->orderByDesc('last_post_at')
            ->orderByDesc('created_at');
    }
}
