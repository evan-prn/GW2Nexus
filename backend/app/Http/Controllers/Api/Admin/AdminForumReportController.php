<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forum\UpdateForumPostReportRequest;
use App\Http\Resources\AdminForumPostReportResource;
use App\Models\ForumPostReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminForumReportController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min((int) $request->integer('per_page', 20), 100);

        $reports = ForumPostReport::query()
            ->with([
                'reporter',
                'reviewer',
                'post.author',
                'post.thread.category',
            ])
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->when($request->filled('reason'), fn ($query) => $query->where('reason', $request->string('reason')))
            ->latest()
            ->paginate($perPage);

        return AdminForumPostReportResource::collection($reports);
    }

    public function update(
        UpdateForumPostReportRequest $request,
        ForumPostReport $report
    ): JsonResponse {
        $report->update([
            'status' => $request->validated('status'),
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $report->load([
            'reporter',
            'reviewer',
            'post.author',
            'post.thread.category',
        ]);

        return response()->json([
            'message' => $report->status === 'reviewed'
                ? 'Signalement marque comme traite.'
                : 'Signalement rejete.',
            'data' => new AdminForumPostReportResource($report),
        ]);
    }
}
