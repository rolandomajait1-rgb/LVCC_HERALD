<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Notifications\VerifyEmail;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a user can log in with correct credentials.
     *
     * @return void
     */
    public function test_user_can_log_in_with_correct_credentials()
    {
        // Arrange
        $user = User::factory()->create([
            'password' => Hash::make('password123'),
        ]);
        $user->markEmailAsVerified();

        $credentials = [
            'email' => $user->email,
            'password' => 'password123',
        ];

        // Act
        $response = $this->postJson('/api/login', $credentials);

        // Assert
        $response->assertStatus(200);
        $response->assertJsonStructure(['token']);
    }

    /**
     * Test that a user cannot log in with incorrect credentials.
     *
     * @return void
     */
    public function test_user_cannot_log_in_with_incorrect_credentials()
    {
        // Arrange
        $user = User::factory()->create([
            'password' => Hash::make('password123'),
        ]);

        $credentials = [
            'email' => $user->email,
            'password' => 'wrong-password',
        ];

        // Act
        $response = $this->postJson('/api/login', $credentials);

        // Assert
        $response->assertStatus(401);
        $this->assertGuest();
    }

    public function test_user_can_register_with_valid_data()
    {
        Http::fake([
            'api.brevo.com/*' => Http::response(null, 200)
        ]);

        $userData = [
            'name' => 'Test User',
            'email' => 'test@student.laverdad.edu.ph',
            'password' => 'Password@123',
            'password_confirmation' => 'Password@123',
        ];

        $response = $this->postJson('/api/register', $userData);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Registration successful! Please verify your email before logging in.']);

        $this->assertDatabaseHas('users', [
            'email' => 'test@student.laverdad.edu.ph',
        ]);

        Http::assertSent(function ($request) {
            return $request->url() == 'https://api.brevo.com/v3/smtp/email' &&
                   $request['to'][0]['email'] == 'test@student.laverdad.edu.ph';
        });
    }

    public function test_user_cannot_register_with_invalid_data()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ];

        $response = $this->postJson('/api/register', $userData);

        $response->assertStatus(422); // Validation error
    }

    public function test_authenticated_user_can_logout()
    {
        $user = User::factory()->create();
        $user->markEmailAsVerified();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Logged out successfully']);

        $this->assertCount(0, $user->tokens);
    }
    
    public function test_user_can_access_protected_route_with_valid_token()
    {
        $user = User::factory()->create();
        $user->markEmailAsVerified();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user');

        $response->assertStatus(200);
    }

    public function test_user_cannot_access_protected_route_with_invalid_token()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid-token',
        ])->getJson('/api/user');

        $response->assertStatus(401);
    }

    public function test_user_cannot_access_protected_route_without_token()
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }

    public function test_email_verification_flow()
    {
        Http::fake([
            'api.brevo.com/*' => Http::response(null, 200)
        ]);

        $userData = [
            'name' => 'Test User',
            'email' => 'test@student.laverdad.edu.ph',
            'password' => 'Password@123',
            'password_confirmation' => 'Password@123',
        ];

        // 1. Register user
        $response = $this->postJson('/api/register', $userData);
        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'test@student.laverdad.edu.ph',
        ]);
        
        $user = User::where('email', 'test@student.laverdad.edu.ph')->first();
        $this->assertNull($user->email_verified_at);

        // 2. Capture verification URL
        $verificationUrl = '';
        Http::assertSent(function ($request) use (&$verificationUrl) {
            $data = $request->data();
            // This is a bit brittle, but we need to get the URL from the email body
            preg_match('/href="([^"]+)"/', $data['htmlContent'], $matches);
            if (isset($matches[1])) {
                $verificationUrl = $matches[1];
            }
            return true;
        });

        $this->assertNotEmpty($verificationUrl);

        // 3. Visit verification URL
        $response = $this->get($verificationUrl);

        // 4. Assert user is verified and redirected
        $response->assertStatus(302); // Redirect status
        $user->refresh();
        $this->assertNotNull($user->email_verified_at);
        $response->assertRedirect(env('APP_FRONTEND_URL') . '/dashboard');
    }
}
