<?php

namespace App\Http\Controllers\Api\Forum;

use App\Http\Controllers\Controller;
use App\Http\Resources\ForumPostResource;
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
}
