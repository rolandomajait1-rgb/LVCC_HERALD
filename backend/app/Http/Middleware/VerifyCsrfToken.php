<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected $except = [
        // Exempt API routes from CSRF (using Sanctum tokens instead)
        'api/*',
    ];
}
