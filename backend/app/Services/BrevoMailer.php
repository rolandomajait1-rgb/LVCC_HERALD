<?php

namespace App\Services;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BrevoMailer
{
    public static function sendResetLink($email, $resetUrl)
    {
        $apiKey = env('BREVO_API_KEY');
        $year = date('Y');

        $htmlContent = "
        <!DOCTYPE html>
        <html lang=\"en\">
        <head>
          <meta charset=\"UTF-8\" />
          <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
          <title>Reset Password - La Verdad Herald</title>
          <style>
            body {
              margin: 0;
              font-family: 'Poppins', Arial, sans-serif;
              background-color: #f5f7fa;
              color: #000090;
            }
            .email-container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            }
            .header {
              background-color: #265f7c;
              padding: 24px;
              text-align: center;
            }
            .header h1 {
              color: #fadb06;
              font-size: 28px;
              font-weight: 600;
              margin: 0;
              letter-spacing: 0.5px;
            }
            .body {
              padding: 30px;
              text-align: left;
              background-color: #f0f4f8;
              border-radius: 12px;
            }
            .body h2 {
              color: #000090;
              font-size: 22px;
              margin-bottom: 10px;
            }
            .body p {
              font-size: 16px;
              line-height: 1.6;
              margin: 10px 0;
              color: #000090;
            }
            .button {
              display: inline-block;
              margin: 25px 0;
              padding: 12px 24px;
              background-color: #d89401;
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 500;
              font-size: 16px;
              letter-spacing: 0.3px;
              transition: background 0.3s;
            }
            .button:hover {
              background-color: #b97c01;
            }
            .footer {
              background-color: #265f7c;
              color: #ffffff;
              text-align: center;
              padding: 20px;
              font-size: 14px;
            }
            .footer p {
              margin: 0;
            }
            @media (max-width: 600px) {
              .email-container {
                margin: 10px;
                border-radius: 12px;
              }
              .body {
                padding: 20px;
              }
              .header h1 {
                font-size: 24px;
              }
              .button {
                padding: 10px 18px;
                font-size: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class=\"email-container\">

            <div class=\"header\">
              <h1>La Verdad Herald</h1>
            </div>

            <div class=\"body\">
              <h2>Reset Your Password</h2>
              <p>Hello,</p>
              <p>
                We received a request to reset the password for your La Verdad Herald account.
                If you made this request, you can set a new password by clicking the button below.
              </p>
              <p>
                If you did not request a password reset, you can safely ignore this email.
              </p>

              <a href=\"{$resetUrl}\" class=\"button\">Reset Password</a>
            </div>

            <div class=\"footer\">
              <p>© {$year} La Verdad Herald. All rights reserved.</p>
            </div>

          </div>
        </body>
        </html>
        ";

        $http = env('APP_ENV') === 'local' ? Http::withOptions(['verify' => false]) : Http::timeout(30);
        
        $response = $http->withHeaders([
            'api-key' => $apiKey,
            'accept' => 'application/json',
            'content-type' => 'application/json',
        ])->post('https://api.brevo.com/v3/smtp/email', [
            'sender' => [
                'name' => 'La Verdad Herald',
                'email' => 'amberprincessrosana05@gmail.com',
            ],
            'to' => [
                ['email' => $email],
            ],
            'subject' => 'Reset Your La Verdad Herald Password',
            'htmlContent' => $htmlContent,
        ]);

        if (!$response->successful()) {
            Log::error('Brevo password reset email failed', [
                'email' => $email,
                'status' => $response->status(),
                'body' => $response->body()
            ]);
        }

        return $response->successful();
    }
    public static function sendVerificationLink($email, $verificationUrl)
    {
        $apiKey = env('BREVO_API_KEY');
        $year = date('Y');

        $htmlContent = "
        <!DOCTYPE html>
        <html lang=\"en\">
        <head>
          <meta charset=\"UTF-8\" />
          <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
          <title>Verify Your Email - La Verdad Herald</title>
          <style>
            body {
              margin: 0;
              font-family: 'Poppins', Arial, sans-serif;
              background-color: #f5f7fa;
              color: #000090;
            }
            .email-container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            }
            .header {
              background-color: #265f7c;
              padding: 24px;
              text-align: center;
            }
            .header h1 {
              color: #fadb06;
              font-size: 28px;
              font-weight: 600;
              margin: 0;
              letter-spacing: 0.5px;
            }
            .body {
              padding: 30px;
              text-align: left;
              background-color: #f0f4f8;
              border-radius: 12px;
            }
            .body h2 {
              color: #000090;
              font-size: 22px;
              margin-bottom: 10px;
            }
            .body p {
              font-size: 16px;
              line-height: 1.6;
              margin: 10px 0;
              color: #000090;
            }
            .button {
              display: inline-block;
              margin: 25px 0;
              padding: 12px 24px;
              background-color: #d89401;
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 500;
              font-size: 16px;
              letter-spacing: 0.3px;
              transition: background 0.3s;
            }
            .button:hover {
              background-color: #b97c01;
            }
            .footer {
              background-color: #265f7c;
              color: #ffffff;
              text-align: center;
              padding: 20px;
              font-size: 14px;
            }
            .footer p {
              margin: 0;
            }
            @media (max-width: 600px) {
              .email-container {
                margin: 10px;
                border-radius: 12px;
              }
              .body {
                padding: 20px;
              }
              .header h1 {
                font-size: 24px;
              }
              .button {
                padding: 10px 18px;
                font-size: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class=\"email-container\">

            <div class=\"header\">
              <h1>La Verdad Herald</h1>
            </div>

            <div class=\"body\">
              <h2>Verify Your Email</h2>
              <p>Hello,</p>
              <p>
                Thank you for registering! Please verify your email to continue using La Verdad Herald.
              </p>

              <a href=\"{$verificationUrl}\" class=\"button\">Verify Email</a>
            </div>

            <div class=\"footer\">
              <p>© {$year} La Verdad Herald. All rights reserved.</p>
            </div>

          </div>
        </body>
        </html>
        ";

        $http = env('APP_ENV') === 'local' ? Http::withOptions(['verify' => false]) : Http::timeout(30);
        
        $response = $http->withHeaders([
            'api-key' => $apiKey,
            'Content-Type' => 'application/json'
        ])->post('https://api.brevo.com/v3/smtp/email', [
            'sender' => ['name' => 'La Verdad Herald', 'email' => 'amberprincessrosana05@gmail.com'],
            'to' => [['email' => $email]],
            'subject' => 'Verify Your Email',
            'htmlContent' => $htmlContent,
        ]);

        if (!$response->successful()) {
            Log::error('Brevo verification email failed', [
                'email' => $email,
                'status' => $response->status(),
                'body' => $response->body()
            ]);
        }

        return $response->successful();
    }
}
