<?php
// --- Session Cookie Parameters (MUST BE SET AT THE ABSOLUTE TOP BEFORE ANY OTHER SESSION CONFIG OR session_start()) --- //
session_set_cookie_params([
    'lifetime' => 86400, // 24 hours
    'path' => '/',
    'domain' => 'sexypraat.nl', // Explicitly set the domain for production
    'secure' => true, // Only send cookie over HTTPS
    'httponly' => true, // Prevent JavaScript access to cookie
    'samesite' => 'None' // Allow cross-site requests
]);

// --- Configuration & Error Handling (MUST BE AT THE VERY TOP) --- //
error_reporting(E_ALL); // Report all errors
ini_set('display_errors', 0); // Do not display errors on screen for security
ini_set('log_errors', 1); // Log errors to a file
ini_set('error_log', __DIR__ . '/php_errors.log'); // Specify error log file location

// Set default timezone to ensure consistent date/time functions
date_default_timezone_set('Europe/Berlin');

// Set session save path to a writable directory
ini_set('session.save_path', __DIR__ . '/sessions_tmp');

// Explicitly set session ID from cookie if it exists and no session is active.
// This is a workaround for some environments where session_start() might not pick it up.
if (isset($_COOKIE[session_name()]) && session_status() === PHP_SESSION_NONE) {
    session_id($_COOKIE[session_name()]);
}

// Start session at the very beginning to ensure it's available for all requests.
session_start();

// Debugging: Log session ID immediately after session_start() in the main script block
error_log("Main script: Session started. ID: " . session_id() . ", Status: " . session_status() . ", Array: " . print_r($_SESSION, true));
error_log("Main script: session.save_path: " . ini_get('session.save_path'));

// --- DIAGNOSTIC: Check session save path writability and readability --- //
$session_save_path = ini_get('session.save_path');
if (!is_writable($session_save_path)) {
    error_log("DIAGNOSTIC: Session save path is NOT writable: " . $session_save_path);
} else {
    error_log("DIAGNOSTIC: Session save path IS writable: " . $session_save_path);
}

if (!is_readable($session_save_path)) {
    error_log("DIAGNOSTIC: Session save path is NOT readable: " . $session_save_path);
} else {
    error_log("DIAGNOSTIC: Session save path IS readable: " . $session_save_path);
}

// Check if a dummy file can be created and read
$dummy_file_path = $session_save_path . '/_test_write_read_' . uniqid();
if (file_put_contents($dummy_file_path, 'test_data') !== false) {
    error_log("DIAGNOSTIC: Successfully wrote dummy file: " . $dummy_file_path);
    if (file_get_contents($dummy_file_path) === 'test_data') {
        error_log("DIAGNOSTIC: Successfully read dummy file.");
    } else {
        error_log("DIAGNOSTIC: Failed to read dummy file content.");
    }
    unlink($dummy_file_path); // Clean up
} else {
    error_log("DIAGNOSTIC: Failed to write dummy file to session save path.");
}
// --- END DIAGNOSTIC --- //

// --- CORS Headers for Production --- //
header_remove('Access-Control-Allow-Origin'); // Remove any pre-existing ACAO headers to prevent duplicates
header('Access-Control-Allow-Origin: https://sexypraat.nl'); // Allow requests only from your specific domain
header('Access-Control-Allow-Credentials: true'); // Allow sending cookies/auth headers with requests
header('Access-Control-Max-Age: 86400'); // Cache preflight requests for 1 day
header('Vary: Origin'); // Inform caches that the response varies depending on the Origin header

// Handle preflight OPTIONS requests for CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    exit(0); // Terminate script after sending preflight headers
}

// --- JSON Output & Error Handling Functions --- //

// Function to safely output JSON responses and terminate the script
function outputJson($data) {
    if (headers_sent()) {
        error_log('Headers already sent when trying to output JSON. Data: ' . json_encode($data));
        return; // Cannot set headers if already sent
    }
    header('Content-Type: application/json');
    echo json_encode($data);
    exit; // Terminate script after sending response
}

// Function to handle and output errors consistently
function handleError($message, $code = 500) {
    error_log("Error [HTTP $code]: $message"); // Log error to file
    http_response_code($code); // Set HTTP status code
    outputJson(['error' => $message]); // Output JSON error response
}

// --- Main Request Processing Logic --- //

ob_start(); // Start output buffering to catch any unexpected output before headers

try {
    require_once 'db-config.php'; // Include database configuration

    // Log the API action for debugging purposes
    $requestedAction = $_GET['action'] ?? 'no_action_specified';
    error_log("API request action: " . $requestedAction);

    // Get and decode JSON POST data if available
    $input = file_get_contents('php://input');
    $data = [];
    if ($input) {
        $data = json_decode($input, true); // Decode JSON into associative array
        if (json_last_error() !== JSON_ERROR_NONE) {
            handleError('Invalid JSON data provided: ' . json_last_error_msg(), 400); // Bad Request
        }
    }

    // Determine request method and call appropriate handler
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        switch ($requestedAction) {
            case 'login':
                handleLogin($conn, $data);
                break;
            case 'register':
                handleRegister($conn, $data);
                break;
            case 'updateProfile':
                handleUpdateProfile($conn, $data);
                break;
            case 'logout':
                handleLogout();
                break;
            default:
                handleError('Invalid POST action: ' . $requestedAction, 400); // Bad Request
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        switch ($requestedAction) {
            case 'getUser':
                handleGetUser($conn, $_GET['id'] ?? null); // User ID from query param
                break;
            case 'getUserByUsername':
                handleGetUserByUsername($conn, $_GET['username'] ?? null); // Username from query param
                break;
            case 'verifySession':
                handleVerifySession($conn);
                break;
            default:
                handleError('Invalid GET action: ' . $requestedAction, 400); // Bad Request
        }
    } else {
        handleError('Method not allowed: ' . $_SERVER['REQUEST_METHOD'], 405); // Method Not Allowed
    }

} catch (Exception $e) {
    handleError('Server Exception: ' . $e->getMessage(), 500); // Internal Server Error
} catch (Error $e) {
    handleError('Server Error: ' . $e->getMessage(), 500); // Internal Server Error (for PHP 7+ errors)
}

ob_end_clean(); // Clean the output buffer at the end of the script


// --- API Handler Functions --- //

/**
 * Fetches user data by user ID.
 */
function handleGetUser($conn, $id) {
    if (!$id) {
        handleError('User ID is required', 400); // Bad Request
    }
    
    $stmt = $conn->prepare("
        SELECT u.*, sp.name as role_name 
        FROM users u 
        LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.is_active = 1 AND us.end_date > NOW()
        LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
        WHERE u.id = ?
    ");
    
    if (!$stmt) {
        handleError('Failed to prepare getUser statement: ' . $conn->error, 500); // Internal Server Error
    }
    
    if (!$stmt->bind_param('i', $id)) {
        handleError('Failed to bind getUser parameter: ' . $stmt->error, 500); // Internal Server Error
    }
    
    if (!$stmt->execute()) {
        handleError('Failed to execute getUser query: ' . $stmt->error, 500); // Internal Server Error
    }
    
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        outputJson(formatUserData($row));
    } else {
        handleError('User not found', 404); // Not Found
    }
}

/**
 * Fetches user data by username.
 */
function handleGetUserByUsername($conn, $username) {
    if (!$username) {
        handleError('Username is required', 400); // Bad Request
    }

    $stmt = $conn->prepare("
        SELECT u.*, sp.name as role_name 
        FROM users u 
        LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.is_active = 1 AND us.end_date > NOW()
        LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
        WHERE u.username = ?
    ");
    
    if (!$stmt) {
        handleError('Failed to prepare getUserByUsername statement: ' . $conn->error, 500); // Internal Server Error
    }
    
    if (!$stmt->bind_param('s', $username)) {
        handleError('Failed to bind getUserByUsername parameter: ' . $stmt->error, 500); // Internal Server Error
    }
    
    if (!$stmt->execute()) {
        handleError('Failed to execute getUserByUsername query: ' . $stmt->error, 500); // Internal Server Error
    }
    
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        outputJson(formatUserData($row));
    } else {
        handleError('User not found', 404); // Not Found
    }
}

/**
 * Handles user login.
 */
function handleLogin($conn, $data) {
    if (!isset($data['email']) || !isset($data['password'])) {
        handleError('Email and password are required', 400); // Bad Request
    }

    $email = $data['email'];
    $password = $data['password'];
    
    $stmt = $conn->prepare("
        SELECT u.*, sp.name as role_name 
        FROM users u 
        LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.is_active = 1 AND us.end_date > NOW()
        LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
        WHERE u.email = ? AND u.email_verified = 1
    ");
    
    if (!$stmt) {
        handleError('Failed to prepare login statement: ' . $conn->error, 500); // Internal Server Error
    }
    
    if (!$stmt->bind_param('s', $email)) {
        handleError('Failed to bind email parameter: ' . $stmt->error, 500); // Internal Server Error
    }
    
    if (!$stmt->execute()) {
        handleError('Failed to execute login query: ' . $stmt->error, 500); // Internal Server Error
    }
    
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        if (password_verify($password, $row['password_hash'])) {
            // Clear any existing session data explicitly to prevent merging with old data
            session_unset(); // Use session_unset to remove all variables from the current session
            $_SESSION = array(); // Ensure $_SESSION is an empty array

            // Set new session variables
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['username'] = $row['username'];
            
            // Log session state before regeneration
            error_log("handleLogin: Session BEFORE regeneration: " . print_r($_SESSION, true) . ", ID: " . session_id() . ", Status: " . session_status());

            // Regenerate session ID for security and to prevent session fixation attacks.
            // This should be called after setting session variables in an active session.
            $regenerated = session_regenerate_id(true);
            if ($regenerated) {
                error_log("handleLogin: Session ID regenerated successfully.");
            } else {
                error_log("handleLogin: Failed to regenerate session ID. Current ID: " . session_id() . ", Status: " . session_status());
            }

            // Debugging: Log session content after login
            error_log("handleLogin: Session after login: " . print_r($_SESSION, true));
            error_log("handleLogin: Session ID after regeneration: " . session_id() . ", Status: " . session_status());
            
            // Log the content of the session file on disk (if available)
            $sessionFilePath = ini_get('session.save_path') . '/sess_' . session_id();
            if (file_exists($sessionFilePath)) {
                error_log("handleLogin: Session file content after login: " . file_get_contents($sessionFilePath));
            } else {
                error_log("handleLogin: Session file not found at: " . $sessionFilePath . " (This is unexpected if regeneration was successful)");
            }

            // Update last login timestamp in the database
            $updateStmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
            if (!$updateStmt) {
                error_log('Failed to prepare last login update: ' . $conn->error);
            } else {
                if (!$updateStmt->bind_param('i', $row['id'])) {
                    error_log('Failed to bind user ID for last login update: ' . $updateStmt->error);
                } else {
                    if (!$updateStmt->execute()) {
                        error_log('Failed to update last login for user ' . $row['id'] . ': ' . $updateStmt->error);
                    }
                }
            }
            
            outputJson(formatUserData($row)); // Return formatted user data
        } else {
            handleError('Invalid credentials (password mismatch)', 401); // Unauthorized
        }
    } else {
        handleError('Invalid credentials (user not found or not verified)', 401); // Unauthorized
    }
}

/**
 * Handles user registration.
 */
function handleRegister($conn, $data) {
    // Validate required fields for registration
    $requiredFields = ['username', 'email', 'password', 'firstName', 'lastName', 'birthDate', 'gender'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            handleError("Missing required field: $field", 400); // Bad Request
        }
    }

    // Check if user (email or username) already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
    if (!$stmt) {
        handleError('Failed to prepare registration check: ' . $conn->error, 500);
    }
    if (!$stmt->bind_param('ss', $data['email'], $data['username'])) {
        handleError('Failed to bind registration check parameters: ' . $stmt->error, 500);
    }
    if (!$stmt->execute()) {
        handleError('Failed to execute registration check query: ' . $stmt->error, 500);
    }
    
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        handleError('User with this email or username already exists', 409); // Conflict
    }
    
    // Hash password securely
    $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
    
    // Insert new user into database
    $stmt = $conn->prepare("
        INSERT INTO users (username, email, password_hash, first_name, last_name,
            birth_date, gender, email_verified, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW())
    ");
    
    if (!$stmt) {
        handleError('Failed to prepare user insertion: ' . $conn->error, 500);
    }
    
    if (!$stmt->bind_param(
        'sssssss',
        $data['username'], $data['email'], $passwordHash,
        $data['firstName'], $data['lastName'], $data['birthDate'], $data['gender']
    )) {
        handleError('Failed to bind user insertion parameters: ' . $stmt->error, 500);
    }
    
    if ($stmt->execute()) {
        $userId = $conn->insert_id; // Get the ID of the newly inserted user
        
        // Create default user settings (assuming user_settings table exists)
        $settingsStmt = $conn->prepare("INSERT INTO user_settings (user_id) VALUES (?)");
        if ($settingsStmt) {
            $settingsStmt->bind_param('i', $userId);
            if (!$settingsStmt->execute()) {
                error_log('Failed to create default user settings for user ' . $userId . ': ' . $settingsStmt->error);
                // Do not throw a hard error here as user registration was successful
            }
        } else {
            error_log('Failed to prepare user settings insertion: ' . $conn->error);
        }

        // Return the newly created user data (without password hash)
        $newUser = getUserById($conn, $userId); // Fetch formatted user data
        if ($newUser) {
            outputJson($newUser);
        } else {
            handleError('Registration successful, but failed to retrieve new user data.', 500);
        }
    } else {
        handleError('User registration failed: ' . $stmt->error, 500);
    }
}

/**
 * Fetches user data by user ID.
 */
function getUserById($conn, $userId) {
    if (!$userId) {
        return null; // Should ideally be handled by calling function's error handling
    }
    
    $stmt = $conn->prepare("
        SELECT u.*, sp.name as role_name 
        FROM users u 
        LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.is_active = 1 AND us.end_date > NOW()
        LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
        WHERE u.id = ?
    ");
    
    if (!$stmt) {
        error_log("Failed to prepare getUserById statement: " . $conn->error);
        return null;
    }
    
    if (!$stmt->bind_param('i', $userId)) {
        error_log("Failed to bind getUserById parameter: " . $stmt->error);
        return null;
    }
    
    if (!$stmt->execute()) {
        error_log("Failed to execute getUserById query: " . $stmt->error);
        return null;
    }
    
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        return [
            'id' => $row['id'],
            'username' => $row['username'],
            'email' => $row['email'],
            'firstName' => $row['first_name'],
            'lastName' => $row['last_name'],
            'birthDate' => $row['birth_date'],
            'gender' => $row['gender'],
            'profilePicture' => $row['profile_picture'],
            'bannerImage' => $row['banner_image'],
            'bio' => $row['bio'] ?? null,
            'balance' => floatval($row['balance']),
            'role' => $row['role_name'] ? strtolower($row['role_name']) : 'user',
            'isCreator' => (bool)$row['is_creator'],
            'isAdmin' => (bool)$row['is_admin'],
            'isVerified' => (bool)$row['is_verified'],
            'lastLogin' => $row['last_login'],
            'createdAt' => $row['created_at']
        ];
    }
    
    return null;
}

/**
 * Handles user profile updates.
 */
function handleUpdateProfile($conn, $data) {
    if (!isset($data['userId'])) {
        handleError('User ID is required for profile update', 400); // Bad Request
    }

    $userId = $data['userId'];
    $updateFields = [];
    $updateParams = [];
    $types = '';

    // Mapping frontend field names to database column names
    $fieldMapping = [
        'username' => 'username',
        'email' => 'email',
        'bio' => 'bio',
        'profilePicture' => 'profile_picture',
        'bannerImage' => 'banner_image',
        'firstName' => 'first_name',
        'lastName' => 'last_name',
        'birthDate' => 'birth_date',
        'gender' => 'gender',
        'balance' => 'balance' // Assuming balance can be updated via profile for now, or remove if not
    ];

    // Allowed fields and their types for validation and update
    $allowedFields = [
        'username' => 's',
        'email' => 's',
        'bio' => 's',
        'profilePicture' => 's',
        'bannerImage' => 's',
        'firstName' => 's',
        'lastName' => 's',
        'birthDate' => 's',
        'gender' => 's',
        'balance' => 'd' // double for float
    ];

    foreach ($allowedFields as $field => $type) {
        if (isset($data[$field])) {
            $dbField = $fieldMapping[$field];
            $updateFields[] = "`{$dbField}` = ?";
            $updateParams[] = $data[$field];
            $types .= $type;
        }
    }

    if (empty($updateFields)) {
        handleError('No fields provided for update', 400); // Bad Request
    }

    // Construct SQL query
    $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        handleError('Failed to prepare update statement: ' . $conn->error, 500); // Internal Server Error
    }

    // Add userId to parameters and its type to types string
    $updateParams[] = $userId; // Add userId to the end of parameters
    $types .= 'i'; // Add 'i' for integer type of userId

    if (!$stmt->bind_param($types, ...$updateParams)) {
        handleError('Failed to bind update parameters: ' . $stmt->error, 500); // Internal Server Error
    }

    if (!$stmt->execute()) {
        handleError('Failed to execute profile update: ' . $stmt->error, 500); // Internal Server Error
    }

    // After successful update, fetch and return the updated user data to sync frontend
    $updatedUser = getUserById($conn, $userId);
    if ($updatedUser) {
        // Update session variables with new user data to ensure persistence
        $_SESSION['user_id'] = $updatedUser['id']; // Ensure user_id is set
        $_SESSION['username'] = $updatedUser['username'];
        $_SESSION['profilePicture'] = $updatedUser['profilePicture'] ?? null;
        $_SESSION['bannerImage'] = $updatedUser['bannerImage'] ?? null;
        $_SESSION['bio'] = $updatedUser['bio'] ?? null;
        // Add other session data if necessary

        outputJson(['success' => 'Profile updated successfully', 'user' => $updatedUser]);
    } else {
        handleError('Profile updated, but failed to retrieve updated user data.', 500); // Internal Server Error
    }
}

/**
 * Verifies if a session is active and returns user data.
 */
function handleVerifySession($conn) {
    // Debugging: Log session status at the beginning of verifySession
    error_log("handleVerifySession called. Current session ID: " . session_id() . ", Status: " . session_status() . ", Array: " . print_r($_SESSION, true));
    error_log("handleVerifySession called. Cookie: " . print_r($_COOKIE, true));
    error_log("handleVerifySession called. Request headers: " . print_r(getallheaders(), true));
    
    // Log the content of the session file on disk (if available)
    $sessionFilePath = ini_get('session.save_path') . '/sess_' . session_id();
    if (file_exists($sessionFilePath)) {
        error_log("handleVerifySession: Session file content: " . file_get_contents($sessionFilePath));
    } else {
        error_log("handleVerifySession: Session file not found or inaccessible at: " . $sessionFilePath);
    }

    // If session_id() is empty but session_status() is active, there's a problem.
    // In this case, we treat it as no active session.
    if (session_status() === PHP_SESSION_ACTIVE && empty(session_id())) {
        error_log("handleVerifySession: WARNING! Session active but ID is empty. Treating as no session.");
        session_unset();
        session_destroy();
        handleError('Session corrupted or not properly initialized.', 401); // Unauthorized
    }
    
    // Check if session exists and has user_id
    if (!isset($_SESSION['user_id'])) {
        error_log("No user_id in session. Session name: " . session_name());
        error_log("Session cookie parameters: " . print_r(session_get_cookie_params(), true));
        handleError('No active user session found.', 401); // Unauthorized
    }

    $userId = $_SESSION['user_id'];
    error_log("User ID from session: " . $userId);

    // Fetch user data from database using the session user ID
    $user = getUserById($conn, $userId);
    
    if ($user) {
        error_log("User found in database: " . json_encode($user));
        // Update session with latest user data
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        outputJson($user); // Return formatted user data
    } else {
        error_log("User not found in database for ID: " . $userId);
        // If user not found in DB, clear session (it might be stale/invalid)
        session_unset();
        session_destroy();
        handleError('User not found in database for active session.', 404); // Not Found
    }
}

/**
 * Handles user logout.
 */
function handleLogout() {
    // Ensure session is started before trying to unset/destroy it
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    session_unset();   // Unset all session variables
    session_destroy(); // Destroy the session
    // Clear the session cookie from the browser
    setcookie(session_name(), '', time() - 3600, '/', 'sexypraat.nl', true, true); // Ensure domain matches for cookie clearing
    error_log("handleLogout: Session after logout. ID: " . session_id() . ", Status: " . session_status() . ", Array: " . print_r($_SESSION, true));
    outputJson(['success' => 'Logged out successfully']);
}

/**
 * Helper function to format user data for consistent frontend response.
 */
function formatUserData($row) {
    if (!$row) return null;

    return [
        'id' => $row['id'],
        'username' => $row['username'],
        'email' => $row['email'],
        'firstName' => $row['first_name'],
        'lastName' => $row['last_name'],
        'birthDate' => $row['birth_date'],
        'gender' => $row['gender'],
        'profilePicture' => $row['profile_picture'],
        'bannerImage' => $row['banner_image'],
        'bio' => $row['bio'] ?? null,
        'balance' => floatval($row['balance']),
        'role' => $row['role_name'] ? strtolower($row['role_name']) : 'user',
        'isCreator' => (bool)$row['is_creator'],
        'isAdmin' => (bool)$row['is_admin'],
        'isVerified' => (bool)$row['is_verified'],
        'lastLogin' => $row['last_login'],
        'createdAt' => $row['created_at']
    ];
}
?> 