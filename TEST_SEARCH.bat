@echo off
echo 🔍 Testing Search Functionality
echo ==============================

echo.
echo Testing search API directly...
curl -X GET "https://lvcc-herald.onrender.com/api/articles/search?q=news" -H "Accept: application/json"

echo.
echo.
echo Testing with different terms...
curl -X GET "https://lvcc-herald.onrender.com/api/articles/search?q=test" -H "Accept: application/json"

echo.
echo.
echo Testing articles endpoint...
curl -X GET "https://lvcc-herald.onrender.com/api/articles" -H "Accept: application/json"

pause