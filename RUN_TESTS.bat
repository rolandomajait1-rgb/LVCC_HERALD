@echo off
echo 🧪 La Verdad Herald - Test Suite
echo ================================

cd tests

echo Installing test dependencies...
call npm install

echo.
echo 🚀 Running Smoke Tests...
call npm run smoke

echo.
echo 📊 Running Performance Tests...
call npm run performance

echo.
echo ✅ Test suite complete!
pause