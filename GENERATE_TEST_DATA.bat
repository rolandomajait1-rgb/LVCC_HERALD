@echo off
echo 🏗️  Generating Test Data for La Verdad Herald
echo ============================================

cd tests

echo Installing dependencies...
call npm install

echo.
echo Creating test users, categories, and articles...
call npm run generate-data

echo.
echo ✅ Test data generation complete!
echo.
echo Test accounts created:
echo - testadmin@test.com (Admin)
echo - testmod@test.com (Moderator) 
echo - testuser@test.com (User)
echo Password for all: testpass123
echo.
pause