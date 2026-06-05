<?php

namespace App\Http\Controllers\Api\Forum;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forum\StoreForumThreadRequest;
use App\Http\Resources\ForumThreadResource;
use App\Models\ForumCategory;
use App\Models\ForumPost;
use App\Models\ForumThread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ForumThreadController extends Controller
{
    public function store(StoreForumThreadRequest $request, ForumCategory $category): JsonResponse
    {
        abort_unless($category->is_active, 404);

        $user = $request->user();
        $validated = $request->validated();
        $now = now();

        $thread = DB::transaction(function () use ($category, $user, $validated, $now): ForumThread {
            $thread = ForumThread::create([
                'forum_category_id' => $category->id,
                'user_id' => $user->id,
                'title' => $validated['title'],
                'slug' => $this->uniqueSlug($validated['title']),
                'excerpt' => Str::limit(strip_tags($validated['content']), 220),
                'last_post_at' => $now,
            ]);

            ForumPost::create([
                'forum_thread_id' => $thread->id,
                'user_id' => $user->id,
                'content' => $validated['content'],
            ]);

            return $thread;
        });

        $thread->load(['author', 'category'])->loadCount('posts');

        return response()->json([
            'message' => 'Sujet cree avec succes.',
            'data' => new ForumThreadResource($thread),
        ], 201);
    }

    public function show(Request $request, ForumThread $thread): JsonResponse
    {
        $this->incrementViewsOnce($request, $thread);

        $thread->refresh()
            ->load(['author', 'category'])
            ->loadCount('posts');

        return response()->json([
            'data' => new ForumThreadResource($thread),
        ]);
    }

    private function incrementViewsOnce(Request $request, ForumThread $thread): void
    {
        $viewerKey = $request->user()?->id !== null
            ? 'user:' . $request->user()->id
            : 'ip:' . sha1((string) $request->ip());

        $cacheKey = sprintf('forum:thread:%d:viewed:%s', $thread->id, $viewerKey);

        if (Cache::add($cacheKey, true, now()->addMinutes(10))) {
            $thread->increment('views_count');
        }
    }

    private function uniqueSlug(string $title): string
    {
        $baseSlug = Str::slug($title);

        if ($baseSlug === '') {
            $baseSlug = 'sujet';
        }

        $slug = $baseSlug;
        $suffix = 2;

        while (ForumThread::query()->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $suffix;
            $suffix++;
        }

        return $slug;
    }
}
