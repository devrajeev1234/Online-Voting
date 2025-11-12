-- DEMO PROTOTYPE ONLY - DO NOT USE IN PRODUCTION
-- Seed data with clearly fake/mock identifiers

USE vote_system_demo;

-- Insert demo voters (ALL IDs ARE FAKE - FOR DEMO ONLY)
INSERT INTO voters (mock_12_digit_id, mock_voter_id, mock_phone, has_voted) VALUES
('111122223333', 'VOTER001', '9000000001', FALSE),
('111122223334', 'VOTER002', '9000000002', FALSE),
('111122223335', 'VOTER003', '9000000003', FALSE),
('111122223336', 'VOTER004', '9000000004', FALSE),
('111122223337', 'VOTER005', '9000000005', FALSE),
('111122223338', 'VOTER006', '9000000006', FALSE),
('111122223339', 'VOTER007', '9000000007', TRUE),  -- Already voted (for testing)
('111122223340', 'VOTER008', '9000000008', FALSE),
('111122223341', 'VOTER009', '9000000009', FALSE),
('111122223342', 'VOTER010', '9000000010', FALSE);

-- Insert demo parties
INSERT INTO parties (name, symbol_url) VALUES
('Bharatiya Janata Party', 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/100px-Bharatiya_Janata_Party_logo.svg.png'),
('Indian National Congress', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Indian_National_Congress_logo.svg/100px-Indian_National_Congress_logo.svg.png'),
('Aam Aadmi Party', 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/Aam_Aadmi_Party_logo.svg/100px-Aam_Aadmi_Party_logo.svg.png'),
('Bahujan Samaj Party', NULL),
('Samajwadi Party', NULL);

-- Insert demo admin (DEMO CREDENTIALS: username = "nihal", password = "1234567")
-- DEMO: Using plain text hash for demo purposes - MUST BE REPLACED with bcrypt in production
INSERT INTO admins (username, password_hash, phone_mock) VALUES
('nihal', '1234567', '9000000999');



