<?php

namespace App\Http\Controllers\Api\Forum;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forum\StoreForumPostRequest;
use App\Http\Requests\Forum\UpdateForumPostRequest;
use App\Http\Resources\ForumPostResource;
use App\Models\ForumPost;
use App\Models\ForumThread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ForumPostController extends Controller
{
    public function index(Request $request, ForumThread $thread): JsonResponse
    {
        $perPage = min((int) $request->integer('per_page', 15), 50);

        $posts = $thread->posts()
            ->with('author')
            ->orderBy('created_at')
            ->paginate($perPage);

        return response()->json([
            'data' => ForumPostResource::collection($posts->items()),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    public function store(StoreForumPostRequest $request, ForumThread $thread): JsonResponse
    {
        if ($thread->is_locked) {
            return response()->json([
                'message' => 'Ce sujet est verrouille.',
            ], 403);
        }

        $post = $thread->posts()->create([
            'user_id' => $request->user()->id,
            'content' => $request->validated('content'),
        ]);

        $thread->update([
            'last_post_at' => $post->created_at,
        ]);

        $post->load('author');

        return response()->json([
            'message' => 'Reponse ajoutee avec succes.',
            'data' => new ForumPostResource($post),
        ], 201);
    }

    public function update(UpdateForumPostRequest $request, ForumPost $post): JsonResponse
    {
        abort_unless($this->canManagePost($request, $post), 403);

        $post->update([
            'content' => $request->validated('content'),
        ]);

        $post->load('author');

        return response()->json([
            'message' => 'Message mis a jour.',
            'data' => new ForumPostResource($post),
        ]);
    }

    public function destroy(Request $request, ForumPost $post): JsonResponse
    {
        abort_unless($this->canManagePost($request, $post), 403);

        $thread = $post->thread;
        $post->delete();

        $thread->update([
            'last_post_at' => $thread->posts()->latest('created_at')->value('created_at'),
        ]);

        return response()->json([
            'message' => 'Message supprime.',
        ]);
    }

    private function canManagePost(Request $request, ForumPost $post): bool
    {
        $user = $request->user();

        if ($user === null) {
            return false;
        }

        return $post->user_id === $user->id || $user->isModerator();
    }
}
