<?php

namespace App\Http\Controllers\Api\Forum;

use App\Http\Controllers\Controller;
use App\Http\Resources\ForumCategoryResource;
use App\Http\Resources\ForumThreadResource;
use App\Models\ForumCategory;
use App\Models\ForumPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ForumCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = ForumCategory::query()
            ->select('forum_categories.*')
            ->selectSub($this->postsCountQuery(), 'posts_count')
            ->active()
            ->ordered()
            ->withCount('threads')
            ->get();

        return response()->json([
            'data' => ForumCategoryResource::collection($categories),
        ]);
    }

    public function show(ForumCategory $category): JsonResponse
    {
        abort_unless($category->is_active, 404);

        $category = ForumCategory::query()
            ->select('forum_categories.*')
            ->selectSub($this->postsCountQuery(), 'posts_count')
            ->withCount('threads')
            ->whereKey($category->id)
            ->firstOrFail();

        $category->loadCount('threads');

        return response()->json([
            'data' => new ForumCategoryResource($category),
        ]);
    }

    public function threads(Request $request, ForumCategory $category): JsonResponse
    {
        abort_unless($category->is_active, 404);

        $perPage = min((int) $request->integer('per_page', 15), 50);

        $threads = $category->threads()
            ->with(['author', 'category'])
            ->withCount('posts')
            ->latestActivity()
            ->paginate($perPage);

        return response()->json([
            'data' => ForumThreadResource::collection($threads->items()),
            'meta' => [
                'current_page' => $threads->currentPage(),
                'last_page' => $threads->lastPage(),
                'per_page' => $threads->perPage(),
                'total' => $threads->total(),
            ],
        ]);
    }

    private function postsCountQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return ForumPost::query()
            ->selectRaw('COUNT(*)')
            ->join('forum_threads', 'forum_posts.forum_thread_id', '=', 'forum_threads.id')
            ->whereColumn('forum_threads.forum_category_id', 'forum_categories.id');
    }
}
