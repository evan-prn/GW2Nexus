<?php

namespace App\Http\Controllers\Api\Forum;

use App\Http\Controllers\Controller;
use App\Http\Resources\ForumThreadResource;
use App\Models\ForumThread;
use Illuminate\Http\JsonResponse;

class ForumThreadController extends Controller
{
    public function show(ForumThread $thread): JsonResponse
    {
        $thread->increment('views_count');

        $thread->refresh()
            ->load(['author', 'category'])
            ->loadCount('posts');

        return response()->json([
            'data' => new ForumThreadResource($thread),
        ]);
    }
}
