<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/** Miroir de ForumPost — mêmes conventions de relations. */
class ItemComment extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'item_id',
        'user_id',
        'content',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(ItemCommentReport::class);
    }
}
