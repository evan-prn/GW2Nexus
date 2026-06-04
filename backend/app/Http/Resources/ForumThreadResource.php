<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ForumThreadResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'forum_category_id' => $this->forum_category_id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'is_locked' => $this->is_locked,
            'is_pinned' => $this->is_pinned,
            'views_count' => $this->views_count,
            'posts_count' => $this->whenCounted('posts'),
            'last_post_at' => $this->last_post_at?->toIso8601String(),
            'category' => new ForumCategoryResource($this->whenLoaded('category')),
            'author' => $this->whenLoaded('author', fn () => $this->formatAuthor()),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formatAuthor(): array
    {
        return [
            'id' => $this->author->id,
            'nom' => $this->author->nom,
            'pseudo_gw2' => $this->author->pseudo_gw2,
            'avatar' => $this->author->avatar,
            'role' => $this->author->role,
        ];
    }
}
