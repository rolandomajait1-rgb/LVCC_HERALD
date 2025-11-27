#!/bin/bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
