<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminForumPostReportResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reason' => $this->reason,
            'details' => $this->details,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'reporter' => $this->formatUser($this->reporter),
            'reviewer' => $this->reviewer ? $this->formatUser($this->reviewer) : null,
            'post' => [
                'id' => $this->post->id,
                'content' => $this->post->content,
                'created_at' => $this->post->created_at?->toIso8601String(),
                'author' => $this->formatUser($this->post->author),
                'thread' => [
                    'id' => $this->post->thread->id,
                    'title' => $this->post->thread->title,
                    'slug' => $this->post->thread->slug,
                    'is_locked' => $this->post->thread->is_locked,
                    'is_pinned' => $this->post->thread->is_pinned,
                    'category' => [
                        'id' => $this->post->thread->category->id,
                        'name' => $this->post->thread->category->name,
                        'slug' => $this->post->thread->category->slug,
                    ],
                ],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formatUser($user): array
    {
        return [
            'id' => $user->id,
            'nom' => $user->nom,
            'email' => $user->email,
            'role' => $user->role,
        ];
    }
}
