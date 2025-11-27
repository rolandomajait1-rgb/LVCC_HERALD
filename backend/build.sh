#!/bin/bash
set -e

echo "Installing dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "Setting permissions..."
chmod -R 775 storage bootstrap/cache

echo "Running migrations..."
php artisan migrate --force

echo "Creating storage link..."
php artisan storage:link || true

echo "Build complete!"
