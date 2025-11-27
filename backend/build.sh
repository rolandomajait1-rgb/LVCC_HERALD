#!/bin/bash
set -e
echo "Installing dependencies..."
composer install --no-dev --optimize-autoloader
echo "Running migrations..."
php artisan migrate --force --verbose
echo "Build complete"
