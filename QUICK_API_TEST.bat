@echo off
echo 🔍 Quick API Test - La Verdad Herald
echo ===================================

echo.
echo 1. Testing health check...
curl -s "https://lvcc-herald.onrender.com/api/health"

echo.
echo.
echo 2. Testing ping...
curl -s "https://lvcc-herald.onrender.com/api/ping"

echo.
echo.
echo 3. Testing articles...
curl -s "https://lvcc-herald.onrender.com/api/articles" | head -c 200

echo.
echo.
echo 4. Testing tags...
curl -s "https://lvcc-herald.onrender.com/api/tags" | head -c 200

echo.
echo.
echo 5. Testing search...
curl -s "https://lvcc-herald.onrender.com/api/articles/search?q=test" | head -c 200

echo.
echo.
echo ✅ API Test Complete!
pause