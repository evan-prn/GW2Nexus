<?php

namespace App\Http\Controllers\Api\Forum;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forum\StoreForumPostReportRequest;
use App\Http\Resources\ForumPostReportResource;
use App\Models\ForumPost;
use App\Models\ForumPostReport;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;

class ForumPostReportController extends Controller
{
    public function store(StoreForumPostReportRequest $request, ForumPost $post): JsonResponse
    {
        $user = $request->user();

        if ($post->user_id === $user->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas signaler votre propre message.',
            ], 422);
        }

        try {
            $report = ForumPostReport::create([
                'forum_post_id' => $post->id,
                'reporter_id' => $user->id,
                'reason' => $request->validated('reason'),
                'details' => $request->validated('details'),
                'status' => 'open',
            ]);
        } catch (QueryException) {
            return response()->json([
                'message' => 'Vous avez deja signale ce message.',
            ], 422);
        }

        return response()->json([
            'message' => 'Signalement envoye a la moderation.',
            'data' => new ForumPostReportResource($report),
        ], 201);
    }
}
