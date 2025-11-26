@echo off
echo Setting up La Verdad Herald Database...
echo.

cd backend
echo Running database migrations and seeders...
php artisan migrate:fresh --seed

echo.
echo Database setup complete!
pause