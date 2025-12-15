<?php
// Script to verify Login and Protected Route Access

// 1. Login to get token
$loginUrl = 'http://127.0.0.1:8000/api/login';
// Assuming 'admin@ontruck.com' exists from demo data, if not we will register/use known user
// The demo data usually creates random users. I should try to register a new one first to be sure.

// Register first
$registerUrl = 'http://127.0.0.1:8000/api/register';
$userData = [
    'email' => 'auth_test_' . time() . '@example.com',
    'password' => 'password123',
    'firstName' => 'Auth',
    'lastName' => 'Test'
];

$options = [
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n",
        'content' => json_encode($userData),
        'ignore_errors' => true
    ]
];
$context = stream_context_create($options);
echo "Registering user...\n";
file_get_contents($registerUrl, false, $context);

// Login
$loginData = [
    'email' => $userData['email'],
    'password' => $userData['password']
];
$options['http']['content'] = json_encode($loginData);
echo "Logging in...\n";
$response = file_get_contents($loginUrl, false, stream_context_create($options));
$data = json_decode($response, true);
$token = $data['token'] ?? null;

if (!$token) {
    die("Login failed. Response: " . $response . "\n");
}
echo "Token received.\n";

// 2. Access Protected Route
$protectedUrl = 'http://127.0.0.1:8000/api/camiones';
$protectedOptions = [
    'http' => [
        'method' => 'GET',
        'header' => "Authorization: Bearer " . $token . "\r\n",
        'ignore_errors' => true
    ]
];
echo "Accessing protected route...\n";
$protectedResponse = file_get_contents($protectedUrl, false, stream_context_create($protectedOptions));

// Check headers for 401
if (isset($http_response_header)) {
    echo "Headers: " . print_r($http_response_header, true) . "\n";
}
echo "Response body length: " . strlen($protectedResponse) . "\n";
?>