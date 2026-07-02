<?php

namespace App\Http\Controllers\Api\Items;

use App\Http\Controllers\Controller;
use App\Http\Requests\Items\StoreItemCommentRequest;
use App\Http\Requests\Items\UpdateItemCommentRequest;
use App\Http\Resources\ItemCommentResource;
use App\Models\Item;
use App\Models\ItemComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItemCommentController extends Controller
{
    /** GET /api/v1/items/{item:gw2_id}/comments */
    public function index(Request $request, Item $item): JsonResponse
    {
        $perPage = min((int) $request->integer('per_page', 15), 50);

        $comments = $item->comments()
            ->with('author')
            ->orderBy('created_at')
            ->paginate($perPage);

        return response()->json([
            'data' => ItemCommentResource::collection($comments->items()),
            'meta' => [
                'current_page' => $comments->currentPage(),
                'last_page' => $comments->lastPage(),
                'per_page' => $comments->perPage(),
                'total' => $comments->total(),
            ],
        ]);
    }

    /** POST /api/v1/items/{item:gw2_id}/comments */
    public function store(StoreItemCommentRequest $request, Item $item): JsonResponse
    {
        $comment = $item->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $request->validated('content'),
        ]);

        $comment->load('author');

        return response()->json([
            'message' => 'Commentaire ajoute avec succes.',
            'data' => new ItemCommentResource($comment),
        ], 201);
    }

    /** PATCH /api/v1/items/comments/{comment} */
    public function update(UpdateItemCommentRequest $request, ItemComment $comment): JsonResponse
    {
        abort_unless($this->canManageComment($request, $comment), 403);

        $comment->update(['content' => $request->validated('content')]);
        $comment->load('author');

        return response()->json([
            'message' => 'Commentaire mis a jour.',
            'data' => new ItemCommentResource($comment),
        ]);
    }

    /** DELETE /api/v1/items/comments/{comment} */
    public function destroy(Request $request, ItemComment $comment): JsonResponse
    {
        abort_unless($this->canManageComment($request, $comment), 403);

        $comment->delete();

        return response()->json(['message' => 'Commentaire supprime.']);
    }

    private function canManageComment(Request $request, ItemComment $comment): bool
    {
        $user = $request->user();

        if ($user === null) {
            return false;
        }

        return $comment->user_id === $user->id || $user->isModerator();
    }
}
