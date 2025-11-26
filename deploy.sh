#!/bin/bash

# Laravel deployment script
echo "Starting Laravel deployment..."

# Install dependencies
composer install --no-dev --optimize-autoloader

# Clear and cache configuration
php artisan config:clear
php artisan config:cache

# Clear and cache routes
php artisan route:clear
php artisan route:cache

# Clear and cache views
php artisan view:clear
php artisan view:cache

# Run database migrations
php artisan migrate --force

# Create storage link
php artisan storage:link

# Set proper permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

echo "Laravel deployment completed successfully!"