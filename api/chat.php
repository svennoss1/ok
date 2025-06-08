<?php
require_once 'db-config.php';

// Get JSON POST data
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    
    switch ($action) {
        case 'getPublicChannels':
            getPublicChannels($conn);
            break;
        case 'getPrivateChats':
            getPrivateChats($conn, $_GET['userId'] ?? null);
            break;
        case 'getChannelMessages':
            getChannelMessages($conn, $_GET['channelId'] ?? null, $_GET['limit'] ?? 50);
            break;
        case 'getOnlineUsers':
            getOnlineUsers($conn);
            break;
        default:
            echo json_encode(['error' => 'Invalid action']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    
    switch ($action) {
        case 'sendMessage':
            sendMessage($conn, $data);
            break;
        case 'createPrivateChat':
            createPrivateChat($conn, $data);
            break;
        default:
            echo json_encode(['error' => 'Invalid action']);
    }
}

function getPublicChannels($conn) {
    try {
        $sql = "
            SELECT c.*, u.username as creator_username
            FROM channels c
            LEFT JOIN users u ON c.created_by = u.id
            WHERE c.type = 'public' AND c.is_active = 1
            ORDER BY c.name
        ";
        
        $result = $conn->query($sql);
        $channels = [];
        
        while ($row = $result->fetch_assoc()) {
            $channels[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'type' => $row['type'],
                'createdBy' => $row['created_by'],
                'isActive' => (bool)$row['is_active'],
                'createdAt' => $row['created_at']
            ];
        }
        
        echo json_encode($channels);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Failed to get public channels']);
    }
}

function getPrivateChats($conn, $userId) {
    if (!$userId) {
        echo json_encode(['error' => 'User ID is required']);
        return;
    }
    
    try {
        $sql = "
            SELECT DISTINCT c.*, 
                   CASE 
                     WHEN c.type = 'private' THEN 
                       (SELECT u.username FROM users u 
                        JOIN channel_participants cp ON u.id = cp.user_id 
                        WHERE cp.channel_id = c.id AND u.id != ?)
                     ELSE c.name
                   END as display_name
            FROM channels c
            JOIN channel_participants cp ON c.id = cp.channel_id
            WHERE cp.user_id = ? AND c.type IN ('private', 'group') AND c.is_active = 1
            ORDER BY c.created_at DESC
        ";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ii', $userId, $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $chats = [];
        while ($row = $result->fetch_assoc()) {
            $chats[] = [
                'id' => $row['id'],
                'name' => $row['display_name'] ?? $row['name'],
                'type' => $row['type'],
                'createdBy' => $row['created_by'],
                'isActive' => (bool)$row['is_active'],
                'createdAt' => $row['created_at']
            ];
        }
        
        echo json_encode($chats);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Failed to get private chats']);
    }
}

function getChannelMessages($conn, $channelId, $limit) {
    if (!$channelId) {
        echo json_encode(['error' => 'Channel ID is required']);
        return;
    }
    
    try {
        $sql = "
            SELECT m.*, u.username, u.profile_picture, u.is_creator, u.is_admin,
                   sp.name as role_name
            FROM messages m
            JOIN users u ON m.user_id = u.id
            LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.is_active = 1 AND us.end_date > NOW()
            LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
            WHERE m.channel_id = ? AND m.is_deleted = 0
            ORDER BY m.created_at ASC
            LIMIT ?
        ";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ii', $channelId, $limit);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $messages = [];
        while ($row = $result->fetch_assoc()) {
            $messages[] = [
                'id' => $row['id'],
                'chatId' => $row['channel_id'],
                'userId' => $row['user_id'],
                'text' => $row['content'],
                'isDeleted' => (bool)$row['is_deleted'],
                'createdAt' => $row['created_at'],
                'user' => [
                    'id' => $row['user_id'],
                    'username' => $row['username'],
                    'profilePicture' => $row['profile_picture'],
                    'role' => $row['role_name'] ? strtolower($row['role_name']) : 'user',
                    'isCreator' => (bool)$row['is_creator'],
                    'isAdmin' => (bool)$row['is_admin']
                ]
            ];
        }
        
        echo json_encode($messages);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Failed to get channel messages']);
    }
}

function sendMessage($conn, $data) {
    if (!isset($data['channelId'], $data['userId'], $data['content'])) {
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    try {
        $conn->begin_transaction();
        
        // Insert the message
        $sql = "
            INSERT INTO messages (channel_id, user_id, content, content_type, created_at)
            VALUES (?, ?, ?, ?, NOW())
        ";
        
        $stmt = $conn->prepare($sql);
        $contentType = $data['contentType'] ?? 'text';
        $stmt->bind_param('iiss', $data['channelId'], $data['userId'], $data['content'], $contentType);
        
        if ($stmt->execute()) {
            $messageId = $conn->insert_id;
            
            // Get the complete message with user information
            $sql = "
                SELECT m.*, u.username, u.profile_picture, u.is_creator, u.is_admin,
                       sp.name as role_name
                FROM messages m
                JOIN users u ON m.user_id = u.id
                LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.is_active = 1 AND us.end_date > NOW()
                LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
                WHERE m.id = ?
            ";
            
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('i', $messageId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($row = $result->fetch_assoc()) {
                $message = [
                    'id' => $row['id'],
                    'chatId' => $row['channel_id'],
                    'userId' => $row['user_id'],
                    'text' => $row['content'],
                    'isDeleted' => (bool)$row['is_deleted'],
                    'createdAt' => $row['created_at'],
                    'user' => [
                        'id' => $row['user_id'],
                        'username' => $row['username'],
                        'profilePicture' => $row['profile_picture'],
                        'role' => $row['role_name'] ? strtolower($row['role_name']) : 'user',
                        'isCreator' => (bool)$row['is_creator'],
                        'isAdmin' => (bool)$row['is_admin']
                    ]
                ];
                
                $conn->commit();
                echo json_encode($message);
            } else {
                throw new Exception('Failed to retrieve message');
            }
        } else {
            throw new Exception('Failed to send message');
        }
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['error' => 'Failed to send message']);
    }
}

function createPrivateChat($conn, $data) {
    if (!isset($data['userId1'], $data['userId2'])) {
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    try {
        // Check if private chat already exists
        $sql = "
            SELECT c.id, c.name, c.type, c.created_by, c.is_active, c.created_at
            FROM channels c
            JOIN channel_participants cp1 ON c.id = cp1.channel_id
            JOIN channel_participants cp2 ON c.id = cp2.channel_id
            WHERE c.type = 'private' 
            AND cp1.user_id = ? AND cp2.user_id = ?
            AND c.is_active = 1
        ";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ii', $data['userId1'], $data['userId2']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            echo json_encode([
                'id' => $row['id'],
                'name' => $row['name'],
                'type' => $row['type'],
                'createdBy' => $row['created_by'],
                'isActive' => (bool)$row['is_active'],
                'createdAt' => $row['created_at']
            ]);
            return;
        }
        
        // Create new private chat
        $conn->begin_transaction();
        
        $sql = "
            INSERT INTO channels (name, type, created_by, created_at)
            VALUES ('Private Chat', 'private', ?, NOW())
        ";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $data['userId1']);
        $stmt->execute();
        
        $chatId = $conn->insert_id;
        
        // Add participants
        $sql = "
            INSERT INTO channel_participants (channel_id, user_id, role)
            VALUES (?, ?, 'member'), (?, ?, 'member')
        ";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('iiii', $chatId, $data['userId1'], $chatId, $data['userId2']);
        $stmt->execute();
        
        $conn->commit();
        
        echo json_encode([
            'id' => $chatId,
            'name' => 'Private Chat',
            'type' => 'private',
            'createdBy' => $data['userId1'],
            'isActive' => true,
            'createdAt' => date('Y-m-d H:i:s')
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['error' => 'Failed to create private chat']);
    }
}

function getOnlineUsers($conn) {
    try {
        $sql = "
            SELECT u.id, u.username, u.profile_picture, u.gender, u.birth_date,
                   u.is_creator, u.is_admin, sp.name as role_name
            FROM users u
            LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.is_active = 1 AND us.end_date > NOW()
            LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
            WHERE u.last_login > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
            ORDER BY 
                u.is_admin DESC,
                u.is_creator DESC,
                CASE sp.name 
                    WHEN 'Royal' THEN 1
                    WHEN 'VIP' THEN 2
                    WHEN 'Premium' THEN 3
                    ELSE 4
                END,
                u.username
        ";
        
        $result = $conn->query($sql);
        $users = [];
        
        while ($row = $result->fetch_assoc()) {
            $users[] = [
                'id' => $row['id'],
                'username' => $row['username'],
                'profilePicture' => $row['profile_picture'],
                'gender' => $row['gender'],
                'birthDate' => $row['birth_date'],
                'role' => $row['role_name'] ? strtolower($row['role_name']) : 'user',
                'isCreator' => (bool)$row['is_creator'],
                'isAdmin' => (bool)$row['is_admin']
            ];
        }
        
        echo json_encode($users);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Failed to get online users']);
    }
}
?> 