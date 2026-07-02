<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminItemCommentReportResource extends JsonResource
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
            'comment' => [
                'id' => $this->comment->id,
                'content' => $this->comment->content,
                'created_at' => $this->comment->created_at?->toIso8601String(),
                'author' => $this->formatUser($this->comment->author),
                'item' => [
                    'gw2_id' => $this->comment->item->gw2_id,
                    'name' => $this->comment->item->name,
                    'icon_url' => $this->comment->item->icon_url,
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
