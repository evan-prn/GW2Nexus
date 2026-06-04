<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ForumPostResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'forum_thread_id' => $this->forum_thread_id,
            'user_id' => $this->user_id,
            'content' => $this->content,
            'is_solution' => $this->is_solution,
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
