-- DEMO PROTOTYPE ONLY - DO NOT USE IN PRODUCTION
-- This is a development/testing prototype for UX demonstration
-- NEVER store real Aadhaar IDs, real phone numbers, or real voter data

-- Create database (adjust name if needed)
CREATE DATABASE IF NOT EXISTS vote_system_demo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vote_system_demo;

-- Voters table (DEMO: uses mock identifiers only)
CREATE TABLE IF NOT EXISTS voters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mock_12_digit_id VARCHAR(12) NOT NULL UNIQUE COMMENT 'DEMO: Mock 12-digit identifier (NOT real Aadhaar)',
    mock_voter_id VARCHAR(50) NOT NULL,
    mock_phone VARCHAR(10) NOT NULL COMMENT 'DEMO: Mock phone number (NOT real phone)',
    has_voted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mock_ids (mock_12_digit_id, mock_voter_id, mock_phone),
    INDEX idx_has_voted (has_voted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Political parties table
CREATE TABLE IF NOT EXISTS parties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    symbol_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voter_id INT NOT NULL,
    party_id INT DEFAULT NULL COMMENT 'NULL if NOTA',
    is_nota BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voter_id) REFERENCES voters(id) ON DELETE CASCADE,
    FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL,
    UNIQUE KEY unique_voter_vote (voter_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_party (party_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admins table (DEMO: plain password hash allowed for demo purposes)
CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL COMMENT 'DEMO: In production use bcrypt with salt',
    phone_mock VARCHAR(10) DEFAULT NULL COMMENT 'DEMO: Mock phone for OTP simulation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



