<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Support\Facades\Artisan;

class ApiEndpointAccessTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $moderator;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('route:clear');

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->moderator = User::factory()->create(['role' => 'moderator']);
        $this->user = User::factory()->create(['role' => 'user']);
    }

    public function test_ping_endpoint()
    {
        $response = $this->get('/api/ping');
        $response->assertStatus(200);
    }

    public function test_guest_can_access_public_endpoints()
    {
        $this->mock(Category::class, function ($mock) {
            $mock->shouldReceive('orderBy->get')->andReturn(collect([]));
        });

        $response = $this->get('/api/categories');
        $response->assertStatus(200);
    }

    public function test_authenticated_user_can_access_user_endpoints()
    {
        $this->actingAs($this->user);

        $article = Article::factory()->create();

        $endpoints = [
            ['method' => 'post', 'url' => '/api/email/resend'],
            ['method' => 'get', 'url' => '/api/user'],
            ['method' => 'get', 'url' => '/api/user/liked-articles'],
            ['method' => 'post', 'url' => "/api/articles/{$article->id}/like"],
        ];

        foreach ($endpoints as $endpoint) {
            $response = $this->{$endpoint['method']}($endpoint['url']);
            // some of these will redirect
            $this->assertTrue(in_array($response->status(), [200, 302]));
        }
    }

    public function test_admin_can_access_admin_endpoints()
    {
        $this->actingAs($this->admin);

        $endpoints = [
            ['method' => 'get', 'url' => '/api/admin/dashboard-stats'],
            ['method' => 'get', 'url' => '/api/admin/recent-activity'],
            ['method' => 'get', 'url' => '/api/admin/audit-logs'],
            ['method' => 'get', 'url' => '/api/admin/check-access'],
            ['method' => 'get', 'url' => '/api/admin/stats'],
            ['method' => 'get', 'url' => '/api/admin/moderators'],
            ['method' => 'get', 'url' => '/api/admin/users'],
            ['method' => 'get', 'url' => '/api/staff'],
            ['method' => 'get', 'url' => '/api/authors'],
        ];

        foreach ($endpoints as $endpoint) {
            $response = $this->{$endpoint['method']}($endpoint['url']);
            $response->assertStatus(200);
        }
    }

    public function test_user_cannot_access_admin_endpoints()
    {
        $this->actingAs($this->user);

        $endpoints = [
            ['method' => 'get', 'url' => '/api/admin/dashboard-stats'],
            ['method' => 'get', 'url' => '/api/admin/recent-activity'],
            ['method' => 'get', 'url' => '/api/admin/audit-logs'],
            ['method' => 'get', 'url' => '/api/admin/check-access'],
        ];

        foreach ($endpoints as $endpoint) {
            $response = $this->{$endpoint['method']}($endpoint['url']);
            $response->assertStatus(403);
        }
    }

    public function test_admin_can_manage_articles()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();

        // Create
        $response = $this->postJson('/api/articles', [
            'title' => 'New Article',
            'content' => 'Article content',
            'category_id' => $category->id,
            'author_name' => 'Admin Author',
            'tags' => 'tag1,tag2'
        ]);
        $response->assertStatus(201);
        $articleId = $response->json('id');

        // Read
        $response = $this->getJson("/api/articles/{$articleId}");
        $response->assertStatus(200);

        // Update
        $response = $this->putJson("/api/articles/{$articleId}", [
            'title' => 'Updated Article',
            'content' => 'Updated content',
            'category_id' => $category->id,
            'author_name' => 'Admin Author',
            'tags' => 'tag1,tag2,tag3'
        ]);
        $response->assertStatus(200);

        // Delete
        $response = $this->deleteJson("/api/articles/{$articleId}");
        $response->assertStatus(200);
    }
}
