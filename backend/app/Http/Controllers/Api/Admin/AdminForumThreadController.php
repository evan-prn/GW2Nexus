<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ForumThreadResource;
use App\Models\ForumThread;
use Illuminate\Http\JsonResponse;

class AdminForumThreadController extends Controller
{
    public function toggleLock(ForumThread $thread): JsonResponse
    {
        $thread->update([
            'is_locked' => ! $thread->is_locked,
        ]);

        $thread->load(['author', 'category'])->loadCount('posts');

        return response()->json([
            'message' => $thread->is_locked ? 'Sujet verrouille.' : 'Sujet deverrouille.',
            'data' => new ForumThreadResource($thread),
        ]);
    }

    public function togglePin(ForumThread $thread): JsonResponse
    {
        $thread->update([
            'is_pinned' => ! $thread->is_pinned,
        ]);

        $thread->load(['author', 'category'])->loadCount('posts');

        return response()->json([
            'message' => $thread->is_pinned ? 'Sujet epingle.' : 'Sujet desepingle.',
            'data' => new ForumThreadResource($thread),
        ]);
    }
}
