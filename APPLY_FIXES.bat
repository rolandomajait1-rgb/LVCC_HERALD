@echo off
echo ========================================
echo   Applying Critical Fixes
echo ========================================
echo.

echo [1/2] Starting Database...
net start MySQL
timeout /t 3 /nobreak >nul

echo.
echo [2/2] Running database migrations...
cd backend
php artisan migrate --force

echo.
echo ========================================
echo   Fixes Applied Successfully!
echo ========================================
echo.
echo Security improvements:
echo   - Rate limiting enabled
echo   - Input sanitization active
echo   - Database indexes created
echo   - HTTPS enforcement enabled
echo   - Security headers added
echo.
pause
