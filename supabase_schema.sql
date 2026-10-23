-- =========================================================================
-- ROYAL INTERNATIONAL SENIOR SECONDARY SCHOOL (RIPS)
-- SUPABASE CLOUD POSTGRESQL SCHEMA MIGRATION SCRIPT
-- =========================================================================
-- Instructions:
-- 1. Open your Supabase Project: https://supabase.com/dashboard
-- 2. Go to "SQL Editor" from the left menu.
-- 3. Click "New Query", paste this entire script, and click "Run".
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & AUTHENTICATION TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'STUDENT', -- 'ADMIN', 'TEACHER', 'STUDENT'
    name VARCHAR(255),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ADMISSION & PROMOTION APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.admissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    target_class VARCHAR(50) NOT NULL, -- 'Class 11' or 'Class 12'
    stream VARCHAR(50) NOT NULL,       -- 'Science (PCM)', 'Science (PCB)', 'Commerce', 'Humanities'
    tenth_percentage NUMERIC(5, 2),
    roll_number VARCHAR(100),
    previous_school VARCHAR(255),
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    parent_phone VARCHAR(50),
    parent_email VARCHAR(255),
    address TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    documents JSONB DEFAULT '{}'::jsonb,           -- URLs to uploaded documents (marksheet, TC, photo)
    admin_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. STUDENTS MASTER TABLE
CREATE TABLE IF NOT EXISTS public.students (
    student_id BIGSERIAL PRIMARY KEY,
    student_code VARCHAR(100) UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    grade VARCHAR(50) NOT NULL,         -- 'Class 11' or 'Class 12'
    stream VARCHAR(50) NOT NULL,        -- 'Science', 'Commerce', 'Humanities'
    section VARCHAR(10) DEFAULT 'A',
    roll_no VARCHAR(50),
    attendance NUMERIC(5, 2) DEFAULT 100.0,
    fees_status VARCHAR(50) DEFAULT 'PAID', -- 'PAID', 'DUE', 'PARTIAL'
    status VARCHAR(50) DEFAULT 'ENROLLED',  -- 'ENROLLED', 'ACTIVE', 'TRANSFERRED'
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    permanent_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    profile_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TEACHERS & FACULTY MASTER TABLE
CREATE TABLE IF NOT EXISTS public.teachers (
    teacher_id BIGSERIAL PRIMARY KEY,
    teacher_code VARCHAR(100) UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    department VARCHAR(100) NOT NULL,   -- 'Science', 'Commerce', 'Humanities', 'Mathematics'
    specialization VARCHAR(255),
    designation VARCHAR(100) DEFAULT 'PGT Faculty',
    qualification VARCHAR(255),
    joining_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'ON_LEAVE', 'INACTIVE'
    profile_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. FEE STRUCTURES TABLE
CREATE TABLE IF NOT EXISTS public.fee_structures (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    stream VARCHAR(50) NOT NULL,
    tuition_fee NUMERIC(10, 2) DEFAULT 0,
    lab_fee NUMERIC(10, 2) DEFAULT 0,
    exam_fee NUMERIC(10, 2) DEFAULT 0,
    total_annual NUMERIC(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PAYMENTS & FEE TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id VARCHAR(100) PRIMARY KEY,
    receipt_no VARCHAR(100) UNIQUE NOT NULL,
    student_id VARCHAR(100),
    student_name VARCHAR(255) NOT NULL,
    grade VARCHAR(50),
    fee_type VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'RAZORPAY_UPI', 'RAZORPAY_CARD', 'CASH_COUNTER', 'CHEQUE'
    reference_no VARCHAR(100),
    date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TIMETABLE SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS public.timetable_slots (
    id VARCHAR(100) PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL, -- '11-Sci-PCM', '11-Com', '12-Sci-PCM', etc.
    day VARCHAR(20) NOT NULL,        -- 'Monday', 'Tuesday', ...
    time VARCHAR(50) NOT NULL,       -- '10:00 AM', '11:00 AM', ...
    subject VARCHAR(255) NOT NULL,
    teacher VARCHAR(255),
    room VARCHAR(100) DEFAULT 'Room 201',
    slot_type VARCHAR(50) DEFAULT 'class',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_slots ENABLE ROW LEVEL SECURITY;

-- Allow public / anon read and write for app portal interaction (adjust in production as needed)
CREATE POLICY "Allow public read access on admissions" ON public.admissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on admissions" ON public.admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin update on admissions" ON public.admissions FOR UPDATE USING (true);

CREATE POLICY "Allow full access on students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow full access on teachers" ON public.teachers FOR ALL USING (true);
CREATE POLICY "Allow full access on fee_structures" ON public.fee_structures FOR ALL USING (true);
CREATE POLICY "Allow full access on payments" ON public.payments FOR ALL USING (true);
CREATE POLICY "Allow full access on timetable_slots" ON public.timetable_slots FOR ALL USING (true);
CREATE POLICY "Allow full access on users" ON public.users FOR ALL USING (true);

-- =========================================================================
-- STORAGE BUCKET FOR UPLOADED ADMISSION DOCUMENTS
-- =========================================================================
-- Create public storage bucket 'documents' for applicant marksheets and certificates
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Access for Documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Public Upload Access for Documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents');

-- =========================================================================
-- SEED DEFAULT ADMIN USER
-- =========================================================================
INSERT INTO public.users (email, password_hash, role, name, phone)
VALUES ('admin@rips.edu.in', '$2a$10$w09ZqW8Vz9a7wN2ZgH5.EuW0qP1M1bY9z8rKzZ7vR5b9d3vBwN5O.', 'ADMIN', 'Super Administrator', '+91 98765 43210')
ON CONFLICT (email) DO NOTHING;

-- Confirmation
SELECT 'Supabase schema created successfully! All RIPS tables and storage buckets are ready.' AS message;
