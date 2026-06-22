<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ForumCategoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'icon' => $this->icon,
            'position' => $this->position,
            'is_active' => $this->is_active,
            'threads_count' => $this->whenCounted('threads'),
            'posts_count' => $this->when(isset($this->posts_count), $this->posts_count),
            'last_thread' => $this->whenLoaded('latestThread', function () {
                return $this->latestThread ? new ForumThreadResource($this->latestThread) : null;
            }),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
