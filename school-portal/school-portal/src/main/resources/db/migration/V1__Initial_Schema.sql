-- Group 1: Users & Auth
CREATE TABLE admins (
    admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_admins_created_by FOREIGN KEY (created_by) REFERENCES admins(admin_id)
);

CREATE TABLE teachers (
    teacher_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_code VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    permanent_address TEXT,
    current_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    blood_group VARCHAR(10),
    profile_photo_url VARCHAR(255),
    govt_proof_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_first_login BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_teachers_created_by FOREIGN KEY (created_by) REFERENCES admins(admin_id)
);

CREATE TABLE teacher_emergency_contacts (
    contact_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    relation VARCHAR(100),
    CONSTRAINT fk_teacher_contacts_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

CREATE TABLE students (
    student_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_code VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    permanent_address TEXT,
    current_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    blood_group VARCHAR(10),
    profile_photo_url VARCHAR(255),
    enrollment_date DATE,
    status VARCHAR(50),
    scholarship_type VARCHAR(100),
    scholarship_reason TEXT,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_created_by FOREIGN KEY (created_by) REFERENCES admins(admin_id)
);

CREATE TABLE student_emergency_contacts (
    contact_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    relation VARCHAR(100),
    CONSTRAINT fk_student_contacts_student FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE guardians (
    guardian_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    guardian_name VARCHAR(255) NOT NULL,
    relation VARCHAR(100),
    occupation VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    is_primary_contact BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_guardians_student FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Group 2: Documents
CREATE TABLE document_requirements (
    requirement_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT FALSE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_req_admin FOREIGN KEY (created_by) REFERENCES admins(admin_id)
);

CREATE TABLE student_documents (
    document_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    requirement_id BIGINT NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_status VARCHAR(50),
    uploaded_by BIGINT,
    CONSTRAINT fk_stud_doc_student FOREIGN KEY (student_id) REFERENCES students(student_id),
    CONSTRAINT fk_stud_doc_req FOREIGN KEY (requirement_id) REFERENCES document_requirements(requirement_id),
    CONSTRAINT fk_stud_doc_admin FOREIGN KEY (uploaded_by) REFERENCES admins(admin_id)
);

-- Group 3: Academic Structure
CREATE TABLE grades (
    grade_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grade_name VARCHAR(255) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (grade_name, academic_year),
    CONSTRAINT fk_grades_admin FOREIGN KEY (created_by) REFERENCES admins(admin_id)
);

CREATE TABLE courses (
    course_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grade_id BIGINT NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(100),
    credits INT,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_courses_grade FOREIGN KEY (grade_id) REFERENCES grades(grade_id),
    CONSTRAINT fk_courses_admin FOREIGN KEY (created_by) REFERENCES admins(admin_id)
);

CREATE TABLE batches (
    batch_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grade_id BIGINT NOT NULL,
    batch_name VARCHAR(255) NOT NULL,
    capacity INT,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (grade_id, batch_name),
    CONSTRAINT fk_batches_grade FOREIGN KEY (grade_id) REFERENCES grades(grade_id),
    CONSTRAINT fk_batches_admin FOREIGN KEY (created_by) REFERENCES admins(admin_id)
);

CREATE TABLE student_batch_assignments (
    assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    batch_id BIGINT NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    is_current BOOLEAN DEFAULT TRUE,
    assigned_by BIGINT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, batch_id, academic_year, is_current),
    CONSTRAINT fk_sba_student FOREIGN KEY (student_id) REFERENCES students(student_id),
    CONSTRAINT fk_sba_batch FOREIGN KEY (batch_id) REFERENCES batches(batch_id),
    CONSTRAINT fk_sba_admin FOREIGN KEY (assigned_by) REFERENCES admins(admin_id)
);

CREATE TABLE timetables (
    timetable_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(100),
    created_by BIGINT,
    CONSTRAINT fk_timetable_batch FOREIGN KEY (batch_id) REFERENCES batches(batch_id),
    CONSTRAINT fk_timetable_course FOREIGN KEY (course_id) REFERENCES courses(course_id),
    CONSTRAINT fk_timetable_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
    CONSTRAINT fk_timetable_admin FOREIGN KEY (created_by) REFERENCES admins(admin_id)
);

-- Group 4: Configuration
CREATE TABLE config_master (
    config_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE school_config (
    school_config_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_id BIGINT NOT NULL,
    config_value TEXT,
    academic_year VARCHAR(50),
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_school_config_master FOREIGN KEY (config_id) REFERENCES config_master(config_id),
    CONSTRAINT fk_school_config_admin FOREIGN KEY (updated_by) REFERENCES admins(admin_id)
);

-- Group 5: Finance
CREATE TABLE fee_types (
    fee_type_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fee_type_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE fee_structures (
    fee_structure_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fee_type_id BIGINT NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (fee_type_id, academic_year),
    CONSTRAINT fk_fee_struct_type FOREIGN KEY (fee_type_id) REFERENCES fee_types(fee_type_id),
    CONSTRAINT fk_fee_struct_admin FOREIGN KEY (created_by) REFERENCES admins(admin_id)
);

CREATE TABLE fee_structure_audit (
    audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fee_structure_id BIGINT NOT NULL,
    old_amount DECIMAL(10,2),
    new_amount DECIMAL(10,2),
    reason TEXT,
    changed_by BIGINT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fsa_struct FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(fee_structure_id),
    CONSTRAINT fk_fsa_admin FOREIGN KEY (changed_by) REFERENCES admins(admin_id)
);

CREATE TABLE student_fee_assignments (
    assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    fee_structure_id BIGINT NOT NULL,
    payment_frequency VARCHAR(50),
    override_amount DECIMAL(10,2),
    override_reason TEXT,
    assigned_by BIGINT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sfa_student FOREIGN KEY (student_id) REFERENCES students(student_id),
    CONSTRAINT fk_sfa_struct FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(fee_structure_id),
    CONSTRAINT fk_sfa_admin FOREIGN KEY (assigned_by) REFERENCES admins(admin_id)
);

CREATE TABLE fee_invoices (
    invoice_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    student_id BIGINT NOT NULL,
    billing_period VARCHAR(100),
    net_amount_due DECIMAL(10,2) NOT NULL,
    discount_applied DECIMAL(10,2) DEFAULT 0,
    due_date DATE,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_student FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE invoice_line_items (
    line_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    fee_structure_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    CONSTRAINT fk_ili_invoice FOREIGN KEY (invoice_id) REFERENCES fee_invoices(invoice_id),
    CONSTRAINT fk_ili_struct FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(fee_structure_id)
);

CREATE TABLE payment_modes (
    payment_mode_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mode_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_mode_id BIGINT NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_reference VARCHAR(255),
    collected_by BIGINT,
    status VARCHAR(50),
    approved_by BIGINT,
    approved_at TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pay_invoice FOREIGN KEY (invoice_id) REFERENCES fee_invoices(invoice_id),
    CONSTRAINT fk_pay_student FOREIGN KEY (student_id) REFERENCES students(student_id),
    CONSTRAINT fk_pay_mode FOREIGN KEY (payment_mode_id) REFERENCES payment_modes(payment_mode_id),
    CONSTRAINT fk_pay_coll FOREIGN KEY (collected_by) REFERENCES admins(admin_id),
    CONSTRAINT fk_pay_appr FOREIGN KEY (approved_by) REFERENCES admins(admin_id)
);

CREATE TABLE caution_money (
    caution_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50),
    collected_at TIMESTAMP,
    refunded_at TIMESTAMP,
    CONSTRAINT fk_cm_student FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE payment_gateway_logs (
    gateway_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NOT NULL,
    gateway_name VARCHAR(100),
    gateway_transaction_id VARCHAR(255),
    gateway_response TEXT,
    status VARCHAR(50),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pgl_payment FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
);

CREATE TABLE daily_cash_summary (
    summary_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    summary_date DATE NOT NULL UNIQUE,
    total_collected DECIMAL(10,2) DEFAULT 0,
    total_refunded DECIMAL(10,2) DEFAULT 0,
    entered_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dcs_admin FOREIGN KEY (entered_by) REFERENCES admins(admin_id)
);

-- Group 6: Academic Activity
CREATE TABLE exams (
    exam_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grade_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    exam_name VARCHAR(255) NOT NULL,
    exam_date DATE,
    start_time TIME,
    end_time TIME,
    exam_pdf_url VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_exam_grade FOREIGN KEY (grade_id) REFERENCES grades(grade_id),
    CONSTRAINT fk_exam_course FOREIGN KEY (course_id) REFERENCES courses(course_id),
    CONSTRAINT fk_exam_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

CREATE TABLE assignments (
    assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grade_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    note TEXT,
    deadline TIMESTAMP,
    attachment_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assgn_grade FOREIGN KEY (grade_id) REFERENCES grades(grade_id),
    CONSTRAINT fk_assgn_course FOREIGN KEY (course_id) REFERENCES courses(course_id),
    CONSTRAINT fk_assgn_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

CREATE TABLE assignment_submissions (
    submission_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    submission_url VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade VARCHAR(50),
    remarks TEXT,
    UNIQUE (assignment_id, student_id),
    CONSTRAINT fk_sub_assgn FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id),
    CONSTRAINT fk_sub_student FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE notice_types (
    notice_type_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    notice_type_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE notices (
    notice_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grade_id BIGINT,
    teacher_id BIGINT NOT NULL,
    notice_type_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    attachment_url VARCHAR(255),
    notice_for_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_not_grade FOREIGN KEY (grade_id) REFERENCES grades(grade_id),
    CONSTRAINT fk_not_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
    CONSTRAINT fk_not_type FOREIGN KEY (notice_type_id) REFERENCES notice_types(notice_type_id)
);

-- Group 7: Operations (Attendance & Leave)
CREATE TABLE student_attendance (
    attendance_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    date DATE NOT NULL,
    clock_in TIME,
    clock_out TIME,
    total_hours_worked DECIMAL(5,2),
    attendance_status VARCHAR(50),
    is_regularized BOOLEAN DEFAULT FALSE,
    regularization_reason TEXT,
    regularized_by BIGINT,
    UNIQUE (student_id, date),
    CONSTRAINT fk_sa_student FOREIGN KEY (student_id) REFERENCES students(student_id),
    CONSTRAINT fk_sa_admin FOREIGN KEY (regularized_by) REFERENCES admins(admin_id)
);

CREATE TABLE teacher_attendance (
    attendance_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    date DATE NOT NULL,
    clock_in TIME,
    clock_out TIME,
    total_hours_worked DECIMAL(5,2),
    attendance_status VARCHAR(50),
    is_regularized BOOLEAN DEFAULT FALSE,
    regularization_reason TEXT,
    regularized_by BIGINT,
    UNIQUE (teacher_id, date),
    CONSTRAINT fk_ta_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
    CONSTRAINT fk_ta_admin FOREIGN KEY (regularized_by) REFERENCES admins(admin_id)
);

CREATE TABLE student_leave_requests (
    leave_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    leave_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(50),
    approved_by BIGINT,
    approved_at TIMESTAMP,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_slr_student FOREIGN KEY (student_id) REFERENCES students(student_id),
    CONSTRAINT fk_slr_admin FOREIGN KEY (approved_by) REFERENCES admins(admin_id)
);

CREATE TABLE teacher_leave_requests (
    leave_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    leave_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(50),
    approved_by BIGINT,
    approved_at TIMESTAMP,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tlr_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
    CONSTRAINT fk_tlr_admin FOREIGN KEY (approved_by) REFERENCES admins(admin_id)
);

-- Group 8: Communication
CREATE TABLE email_logs (
    email_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT,
    status VARCHAR(50),
    sent_by BIGINT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_el_student FOREIGN KEY (student_id) REFERENCES students(student_id),
    CONSTRAINT fk_el_admin FOREIGN KEY (sent_by) REFERENCES admins(admin_id)
);
