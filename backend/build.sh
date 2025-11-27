#!/bin/bash
set -e

echo "Installing dependencies..."
composer install --no-dev --optimize-autoloader

echo "Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Running migrations..."
php artisan migrate --force || echo "Migration failed, continuing..."

echo "Creating storage link..."
php artisan storage:link || true

echo "Build complete!"
