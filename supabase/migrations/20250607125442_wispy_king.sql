-- SexyPraat.nl Database Structure
-- Import this file into your phpMyAdmin database

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

-- Table structure for table `users`
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email_verified` tinyint(1) DEFAULT 0,
  `email_verification_token` varchar(100) DEFAULT NULL,
  `reset_password_token` varchar(100) DEFAULT NULL,
  `reset_password_expires` datetime DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `birth_date` date NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT 0.00,
  `role_id` int(11) DEFAULT NULL,
  `is_creator` tinyint(1) DEFAULT 0,
  `is_admin` tinyint(1) DEFAULT 0,
  `is_verified` tinyint(1) DEFAULT 0,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `subscription_plans`
CREATE TABLE `subscription_plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `price_monthly` decimal(10,2) NOT NULL,
  `price_yearly` decimal(10,2) NOT NULL,
  `features` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `user_subscriptions`
CREATE TABLE `user_subscriptions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `payment_status` enum('pending','completed','failed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_subscription` (`user_id`,`plan_id`),
  KEY `fk_subscription_plan` (`plan_id`),
  CONSTRAINT `fk_subscription_plan` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`),
  CONSTRAINT `fk_subscription_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `channels`
CREATE TABLE `channels` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` enum('public','private','group') NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_channel_type` (`type`),
  KEY `fk_channel_creator` (`created_by`),
  CONSTRAINT `fk_channel_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `channel_participants`
CREATE TABLE `channel_participants` (
  `channel_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `role` enum('owner','admin','moderator','member') DEFAULT 'member',
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`channel_id`,`user_id`),
  KEY `fk_participant_user` (`user_id`),
  CONSTRAINT `fk_participant_channel` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_participant_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `messages`
CREATE TABLE `messages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `channel_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `content` text NOT NULL,
  `content_type` enum('text','image','video','quote') DEFAULT 'text',
  `media_url` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_channel_messages` (`channel_id`,`created_at`),
  KEY `fk_message_user` (`user_id`),
  CONSTRAINT `fk_message_channel` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_message_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `quotes`
CREATE TABLE `quotes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `creator_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `channel_id` bigint(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','accepted','rejected','completed') DEFAULT 'pending',
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_quote_status` (`status`),
  KEY `fk_quote_creator` (`creator_id`),
  KEY `fk_quote_user` (`user_id`),
  KEY `fk_quote_channel` (`channel_id`),
  CONSTRAINT `fk_quote_channel` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`),
  CONSTRAINT `fk_quote_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_quote_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `transactions`
CREATE TABLE `transactions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `type` enum('deposit','withdrawal','quote_payment','subscription','platform_fee') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `fee_amount` decimal(10,2) DEFAULT 0.00,
  `reference_id` varchar(100) DEFAULT NULL,
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_transactions` (`user_id`,`type`),
  CONSTRAINT `fk_transaction_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `notifications`
CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `type` enum('message','quote','subscription','system') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_notifications` (`user_id`,`is_read`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `user_settings`
CREATE TABLE `user_settings` (
  `user_id` bigint(20) NOT NULL,
  `notification_email` tinyint(1) DEFAULT 1,
  `notification_quotes` tinyint(1) DEFAULT 1,
  `notification_messages` tinyint(1) DEFAULT 1,
  `notification_subscriptions` tinyint(1) DEFAULT 1,
  `privacy_profile` enum('public','private') DEFAULT 'public',
  `privacy_online_status` tinyint(1) DEFAULT 1,
  `theme_preference` varchar(50) DEFAULT 'light',
  `language` varchar(10) DEFAULT 'nl',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_settings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `friends`
CREATE TABLE `friends` (
  `user_id` bigint(20) NOT NULL,
  `friend_id` bigint(20) NOT NULL,
  `status` enum('pending','accepted','blocked') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`friend_id`),
  KEY `fk_friend_user` (`friend_id`),
  CONSTRAINT `fk_friend_requester` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_friend_user` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `sessions`
CREATE TABLE `sessions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_token` (`token`),
  KEY `idx_user_session` (`user_id`,`token`),
  CONSTRAINT `fk_session_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Insert initial data

-- Subscription Plans
INSERT INTO `subscription_plans` (`id`, `name`, `description`, `price_monthly`, `price_yearly`, `features`) VALUES
(1, 'Premium', 'Premium gebruiker met extra voordelen', 2.04, 24.48, '["Andere gebruikers blokkeren", "Opvallende Premium-badge", "Bovenaan in de online lijst", "Max. 2 privé groepen aanmaken", "Audio- en videogesprekken met iedereen"]'),
(2, 'VIP', 'VIP gebruiker met exclusieve voordelen', 3.29, 39.48, '["Exclusieve VIP-badge", "Extra galerijfoto\'s", "Andere lettertypes", "Eigen profielbanner", "Tot 5 privé groepen", "Unieke chatachtergronden", "Alles van Premium"]'),
(3, 'Royal', 'Royal gebruiker met alle voordelen', 4.15, 49.80, '["Royal-badge", "Aangepaste berichtstijl", "Onbeperkte privé groepen", "Upload je eigen chatachtergrond", "Advertentievrij gebruik", "Alles van VIP & Premium"]');

-- Admin User
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `email_verified`, `first_name`, `last_name`, `birth_date`, `gender`, `profile_picture`, `balance`, `role_id`, `is_creator`, `is_admin`, `is_verified`, `created_at`) VALUES
(1, 'admin', 'svenfilm2007@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 'Admin', 'User', '1990-01-01', 'male', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150', 1000.00, NULL, 0, 1, 1, NOW());

-- Public Channels
INSERT INTO `channels` (`id`, `name`, `type`, `created_by`, `is_active`) VALUES
(1, 'Geil', 'public', 1, 1),
(2, 'Pikant', 'public', 1, 1),
(3, 'Babes', 'public', 1, 1);

-- Add admin to all public channels
INSERT INTO `channel_participants` (`channel_id`, `user_id`, `role`) VALUES
(1, 1, 'owner'),
(2, 1, 'owner'),
(3, 1, 'owner');

-- Default user settings for admin
INSERT INTO `user_settings` (`user_id`) VALUES (1);

COMMIT;