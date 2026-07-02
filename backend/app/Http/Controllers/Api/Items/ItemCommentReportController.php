<?php

namespace App\Http\Controllers\Api\Items;

use App\Http\Controllers\Controller;
use App\Http\Requests\Items\StoreItemCommentReportRequest;
use App\Models\ItemComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItemCommentReportController extends Controller
{
    /** POST /api/v1/items/comments/{comment}/reports */
    public function store(StoreItemCommentReportRequest $request, ItemComment $comment): JsonResponse
    {
        if ($comment->user_id === $request->user()->id) {
            return response()->json(['message' => 'Vous ne pouvez pas signaler votre propre commentaire.'], 422);
        }

        $report = $comment->reports()->firstOrCreate(
            ['reporter_id' => $request->user()->id],
            [
                'reason' => $request->validated('reason'),
                'details' => $request->validated('details'),
                'status' => 'open',
            ],
        );

        return response()->json([
            'message' => 'Commentaire signale. Un moderateur va l\'examiner.',
            'data' => ['id' => $report->id],
        ], 201);
    }
}
