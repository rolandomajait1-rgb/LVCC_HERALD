@echo off
echo Starting La Verdad Herald...
echo.

echo [1/3] Starting Backend Server...
start "Laravel Backend" cmd /k "cd backend && php artisan serve"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Server...
start "React Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo La Verdad Herald is now running!
echo ========================================
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit...
pause >nul
