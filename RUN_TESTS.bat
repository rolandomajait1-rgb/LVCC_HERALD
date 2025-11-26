@echo off
echo Running La Verdad Herald Test Suite...
echo.

echo Running frontend tests...
npm run test --workspace=frontend

echo.
echo Running backend tests...
cd backend
php artisan test

echo.
echo All tests completed!
pause