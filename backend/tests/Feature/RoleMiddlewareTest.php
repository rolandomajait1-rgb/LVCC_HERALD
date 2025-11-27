<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the hasRole method works correctly.
     *
     * @return void
     */
    public function test_has_role_method()
    {
        // Arrange
        $admin = User::factory()->create(['role' => 'admin']);
        $moderator = User::factory()->create(['role' => 'moderator']);
        $user = User::factory()->create(['role' => 'user']);

        // Assert
        $this->assertTrue($admin->hasRole('admin'));
        $this->assertFalse($admin->hasRole('moderator'));

        $this->assertTrue($moderator->hasRole('moderator'));
        $this->assertFalse($moderator->hasRole('admin'));

        $this->assertTrue($user->hasRole('user'));
        $this->assertFalse($user->hasRole('admin'));
    }

    public function test_admin_can_access_admin_route()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/check-access');

        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_access_admin_route()
    {
        $user = User::factory()->create(['role' => 'user']);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/check-access');

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_admin_route()
    {
        $response = $this->getJson('/api/admin/check-access');

        $response->assertStatus(401);
    }

    public function test_moderator_can_access_moderator_route()
    {
        $moderator = User::factory()->create(['role' => 'moderator']);
        Sanctum::actingAs($moderator);

        $response = $this->getJson('/api/admin/dashboard-stats');

        $response->assertStatus(200);
    }
}