<?php
require_once 'db-config.php';

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['image'])) {
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['image'];
$type = $_POST['type'] ?? '';

// Validate file type
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($file['type'], $allowedTypes)) {
    echo json_encode(['error' => 'Invalid file type. Only JPG, PNG and GIF are allowed.']);
    exit;
}

// Validate file size (max 5MB)
if ($file['size'] > 5 * 1024 * 1024) {
    echo json_encode(['error' => 'File too large. Maximum size is 5MB.']);
    exit;
}

// Create upload directory if it doesn't exist
$uploadDir = '../uploads/' . $type . 's/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid() . '.' . $extension;
$filepath = $uploadDir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $filepath)) {
    // Return the URL of the uploaded file
    $url = '/uploads/' . $type . 's/' . $filename;
    echo json_encode(['url' => $url]);
} else {
    echo json_encode(['error' => 'Failed to upload file']);
}
?> 