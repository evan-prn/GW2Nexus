<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Items\UpdateItemCommentReportRequest;
use App\Http\Resources\AdminItemCommentReportResource;
use App\Models\ItemCommentReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Miroir de AdminForumReportController — modération des commentaires d'objets. */
class AdminItemCommentReportController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min((int) $request->integer('per_page', 20), 100);

        $reports = ItemCommentReport::query()
            ->with(['reporter', 'reviewer', 'comment.author', 'comment.item'])
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->when($request->filled('reason'), fn ($query) => $query->where('reason', $request->string('reason')))
            ->latest()
            ->paginate($perPage);

        return AdminItemCommentReportResource::collection($reports);
    }

    public function update(UpdateItemCommentReportRequest $request, ItemCommentReport $report): JsonResponse
    {
        $report->update([
            'status' => $request->validated('status'),
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $report->load(['reporter', 'reviewer', 'comment.author', 'comment.item']);

        return response()->json([
            'message' => $report->status === 'reviewed'
                ? 'Signalement marque comme traite.'
                : 'Signalement rejete.',
            'data' => new AdminItemCommentReportResource($report),
        ]);
    }
}
