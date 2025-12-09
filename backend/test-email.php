<?php
// Test Brevo Email
require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$apiKey = $_ENV['BREVO_API_KEY'];
$testEmail = 'your-test-email@laverdad.edu.ph'; // CHANGE THIS

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.brevo.com/v3/smtp/email');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'sender' => ['name' => 'La Verdad Herald', 'email' => 'rolandomajait1@gmail.com'],
    'to' => [['email' => $testEmail]],
    'subject' => 'Test Email',
    'htmlContent' => '<h1>Test Email from La Verdad Herald</h1><p>If you receive this, email is working!</p>'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'api-key: ' . $apiKey,
    'Content-Type: application/json'
]);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $result\n";

if ($httpCode === 201) {
    echo "\n✅ EMAIL SENT SUCCESSFULLY!\n";
} else {
    echo "\n❌ EMAIL FAILED!\n";
}
