<?php
// Database configuration
define('DB_HOST', 'database-5017946406.webspace-host.com');
define('DB_USER', 'dbu1482305');
define('DB_PASS', 'Sven20071!');
define('DB_NAME', 'dbs14280044');

// Removed CORS headers and Content-Type from here, auth.php will handle them

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Set charset
$conn->set_charset('utf8mb4');
?> 