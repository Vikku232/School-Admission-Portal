-- Seed Config Master for Senior Secondary (Classes 11th & 12th)
INSERT INTO config_master (config_key, description) VALUES 
('SCHOOL_NAME', 'Royal International Senior Secondary School (11th & 12th)'),
('ACADEMIC_YEAR', '2027-2028'),
('SCHOOL_LEVEL', 'Senior Secondary (Classes 11 & 12)'),
('SUPPORTED_STREAMS', 'Science (PCM/PCB), Commerce, Humanities / Arts'),
('AFFILIATION_CODE', 'CBSE Affiliation No. 1930284')
ON DUPLICATE KEY UPDATE config_key=config_key;

-- Seed Payment Modes
INSERT INTO payment_modes (mode_name) VALUES 
('CASH'),
('UPI'),
('CARD'),
('BANK_TRANSFER'),
('RAZORPAY')
ON DUPLICATE KEY UPDATE mode_name=mode_name;

-- Seed Notice Types
INSERT INTO notice_types (notice_type_name) VALUES 
('GENERAL'),
('EXAM'),
('ACADEMIC'),
('HOLIDAY'),
('BOARD_PRACTICAL'),
('STREAM_ALLOTMENT')
ON DUPLICATE KEY UPDATE notice_type_name=notice_type_name;

-- Seed Document Requirements for Class 11th & 12th Admissions
INSERT INTO document_requirements (document_name, description, is_mandatory, created_at) VALUES
('Class 10th Board Marksheet', 'Original or DigiLocker verified copy of Class 10th secondary school board exam marksheet', TRUE, NOW()),
('Transfer Certificate (TC)', 'Original Transfer Certificate / School Leaving Certificate issued by previous school', TRUE, NOW()),
('Character & Conduct Certificate', 'Official certificate of conduct issued by previous secondary school principal', TRUE, NOW()),
('Migration Certificate', 'Required for students joining CBSE from ICSE, IGCSE, or State boards', FALSE, NOW()),
('Student Aadhaar Card', 'Clear photocopy of Student Government Identity Card (Aadhaar)', TRUE, NOW())
ON DUPLICATE KEY UPDATE document_name=document_name;

-- Seed Senior Secondary Fee Types
INSERT INTO fee_types (fee_type_name, description) VALUES
('Tuition Fee (Quarterly)', 'Regular senior academic classroom tuition instruction charges'),
('Science Practical & AI Lab Fee', 'Consumables, optical equipment, chemicals, and computing labs for Class 11-12'),
('CBSE Board Examination & Viva Fee', 'Class 12th CBSE registration, external practical examiner, and admit card fee'),
('Commerce & Arts Project Evaluation Fee', 'Case study, mock stock exchange, and field survey evaluation charges'),
('Competitive Coaching Module (JEE/NEET/CUET)', 'Optional weekend test series and diagnostic doubt clearing masterclasses')
ON DUPLICATE KEY UPDATE fee_type_name=fee_type_name;

-- Seed Class 11th & 12th Grades for 2027-2028
INSERT INTO grades (grade_name, academic_year, created_at) VALUES
('Class 11 - Science (PCM)', '2027-2028', NOW()),
('Class 11 - Science (PCB)', '2027-2028', NOW()),
('Class 11 - Commerce', '2027-2028', NOW()),
('Class 11 - Humanities', '2027-2028', NOW()),
('Class 12 - Science (PCM)', '2027-2028', NOW()),
('Class 12 - Science (PCB)', '2027-2028', NOW()),
('Class 12 - Commerce', '2027-2028', NOW()),
('Class 12 - Humanities', '2027-2028', NOW())
ON DUPLICATE KEY UPDATE grade_name=grade_name;

