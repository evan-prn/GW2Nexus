<?php

namespace Tests\Feature\Forum;

use App\Models\ForumCategory;
use App\Models\ForumPost;
use App\Models\ForumPostReport;
use App\Models\ForumThread;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ForumModerationTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function moderator_can_list_and_process_forum_reports(): void
    {
        [$moderator, $report] = $this->createReportFixture('moderateur');
        $token = $moderator->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/v1/admin/forum/reports')
            ->assertOk()
            ->assertJsonPath('data.0.id', $report->id);

        $this->withToken($token)
            ->patchJson("/api/v1/admin/forum/reports/{$report->id}", [
                'status' => 'reviewed',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'reviewed')
            ->assertJsonPath('data.reviewer.id', $moderator->id);

        $this->assertDatabaseHas('forum_post_reports', [
            'id' => $report->id,
            'status' => 'reviewed',
            'reviewed_by' => $moderator->id,
        ]);
    }

    #[Test]
    public function moderator_can_toggle_thread_lock_and_pin(): void
    {
        [$moderator, $report] = $this->createReportFixture('moderateur');
        $thread = $report->post->thread;
        $token = $moderator->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->patchJson("/api/v1/admin/forum/threads/{$thread->id}/lock")
            ->assertOk()
            ->assertJsonPath('data.is_locked', true);

        $this->withToken($token)
            ->patchJson("/api/v1/admin/forum/threads/{$thread->id}/pin")
            ->assertOk()
            ->assertJsonPath('data.is_pinned', true);
    }

    #[Test]
    public function moderator_cannot_access_admin_user_management(): void
    {
        $moderator = User::factory()->create(['role' => 'moderateur']);
        $token = $moderator->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/v1/admin/users')
            ->assertForbidden();
    }

    #[Test]
    public function standard_user_cannot_access_forum_moderation(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/v1/admin/forum/reports')
            ->assertForbidden();
    }

    #[Test]
    public function administrator_keeps_access_to_forum_moderation(): void
    {
        [$admin, $report] = $this->createReportFixture('admin');
        $token = $admin->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/v1/admin/forum/reports')
            ->assertOk()
            ->assertJsonPath('data.0.id', $report->id);
    }

    /**
     * @return array{User, ForumPostReport}
     */
    private function createReportFixture(string $role): array
    {
        $moderator = User::factory()->create(['role' => $role]);
        $author = User::factory()->create();
        $reporter = User::factory()->create();
        $category = ForumCategory::query()->create([
            'name' => 'General',
            'slug' => 'general',
            'is_active' => true,
        ]);
        $thread = ForumThread::query()->create([
            'forum_category_id' => $category->id,
            'user_id' => $author->id,
            'title' => 'Sujet signale',
            'slug' => 'sujet-signale',
        ]);
        $post = ForumPost::query()->create([
            'forum_thread_id' => $thread->id,
            'user_id' => $author->id,
            'content' => 'Message signale.',
        ]);
        $report = ForumPostReport::query()->create([
            'forum_post_id' => $post->id,
            'reporter_id' => $reporter->id,
            'reason' => 'inappropriate',
            'status' => 'open',
        ]);

        return [$moderator, $report];
    }
}
