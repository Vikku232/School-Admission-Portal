# SchoolERP — Database Schema (v2.0, 2NF, 36 Tables)

All tables use single-column surrogate primary keys, so 2NF is satisfied automatically
(partial dependency requires a composite key, which none of these have). Grouped below by
module, matching `02_ARCHITECTURE.md` module boundaries.

---

## Group 1: Users & Auth

**admins**
`admin_id`(PK), name, email(UQ), password_hash, phone, role, is_active, created_by(FK→admins), created_at, updated_at

**teachers**
`teacher_id`(PK), teacher_code(UQ), first_name, last_name, email(UQ), password_hash, phone, date_of_birth, gender(CHK), permanent_address, current_address, city, state, postal_code, blood_group, profile_photo_url, govt_proof_url, is_active, is_first_login, created_by(FK→admins), created_at, updated_at

**teacher_emergency_contacts**
`contact_id`(PK), teacher_id(FK→teachers), contact_name, contact_phone, relation

**students**
`student_id`(PK), student_code(UQ), first_name, last_name, email(UQ), password_hash, phone, date_of_birth, gender(CHK), permanent_address, current_address, city, state, postal_code, blood_group, profile_photo_url, enrollment_date, status, scholarship_type, scholarship_reason, created_by(FK→admins), created_at, updated_at

**student_emergency_contacts**
`contact_id`(PK), student_id(FK→students), contact_name, contact_phone, relation

**guardians**
`guardian_id`(PK), student_id(FK→students), guardian_name, relation, occupation, phone, email, is_primary_contact

---

## Group 2: Documents

**document_requirements**
`requirement_id`(PK), document_name(UQ), description, is_mandatory, created_by(FK→admins), created_at

**student_documents**
`document_id`(PK), student_id(FK→students), requirement_id(FK→document_requirements), file_url, upload_date, verification_status, uploaded_by(FK→admins)

---

## Group 3: Academic Structure

**grades**
`grade_id`(PK), grade_name(UQ w/ year), academic_year(UQ w/ name), created_by(FK→admins), created_at

**courses**
`course_id`(PK), grade_id(FK→grades), course_name, course_code, credits, created_by(FK→admins), created_at

**batches**
`batch_id`(PK), grade_id(FK→grades), batch_name(UQ w/ grade_id), capacity, created_by(FK→admins), created_at

**student_batch_assignments**
`assignment_id`(PK), student_id(FK→students), batch_id(FK→batches), academic_year(UQ combo), is_current(UQ combo), assigned_by(FK→admins), assigned_at

**timetables**
`timetable_id`(PK), batch_id(FK→batches), course_id(FK→courses), teacher_id(FK→teachers), day_of_week, start_time, end_time, room_number, created_by(FK→admins)

---

## Group 4: Configuration

**config_master**
`config_id`(PK), config_key(UQ), description

**school_config**
`school_config_id`(PK), config_id(FK→config_master), config_value, academic_year, updated_by(FK→admins), updated_at

---

## Group 5: Finance

**fee_types**
`fee_type_id`(PK), fee_type_name(UQ), description

**fee_structures**
`fee_structure_id`(PK), fee_type_id(FK→fee_types, UQ combo), academic_year(UQ combo), amount, is_mandatory, is_active, created_by(FK→admins), created_at, updated_at

**fee_structure_audit**
`audit_id`(PK), fee_structure_id(FK→fee_structures), old_amount, new_amount, reason, changed_by(FK→admins), changed_at

**student_fee_assignments**
`assignment_id`(PK), student_id(FK→students), fee_structure_id(FK→fee_structures), payment_frequency, override_amount, override_reason, assigned_by(FK→admins), assigned_at

**fee_invoices**
`invoice_id`(PK), invoice_number(UQ), student_id(FK→students), billing_period, net_amount_due, discount_applied, due_date, status, created_at

**invoice_line_items**
`line_item_id`(PK), invoice_id(FK→fee_invoices), fee_structure_id(FK→fee_structures), amount, description

**payment_modes**
`payment_mode_id`(PK), mode_name(UQ)

**payments**
`payment_id`(PK), invoice_id(FK→fee_invoices), student_id(FK→students), amount_paid, payment_mode_id(FK→payment_modes), payment_date, transaction_reference, collected_by(FK→admins), status, approved_by(FK→admins), approved_at, remarks, created_at

**caution_money**
`caution_id`(PK), student_id(FK→students, UNIQUE 1-to-1), amount, status, collected_at, refunded_at

**payment_gateway_logs**
`gateway_log_id`(PK), payment_id(FK→payments), gateway_name, gateway_transaction_id, gateway_response, status, logged_at

**daily_cash_summary**
`summary_id`(PK), summary_date(UQ), total_collected, total_refunded, entered_by(FK→admins), created_at

---

## Group 6: Academic Activity

**exams**
`exam_id`(PK), grade_id(FK→grades), course_id(FK→courses), teacher_id(FK→teachers), exam_name, exam_date, start_time, end_time, exam_pdf_url, status, created_at

**assignments**
`assignment_id`(PK), grade_id(FK→grades), course_id(FK→courses), teacher_id(FK→teachers), title, description, note, deadline, attachment_url, created_at

**assignment_submissions**
`submission_id`(PK), assignment_id(FK→assignments, UQ combo), student_id(FK→students, UQ combo), submission_url, submitted_at, grade, remarks

**notice_types**
`notice_type_id`(PK), notice_type_name(UQ)

**notices**
`notice_id`(PK), grade_id(FK→grades, nullable = all grades), teacher_id(FK→teachers), notice_type_id(FK→notice_types), title, content, attachment_url, notice_for_date, created_at

---

## Group 7: Operations (Attendance & Leave)

**student_attendance**
`attendance_id`(PK), student_id(FK→students, UQ combo), date(UQ combo), clock_in, clock_out, total_hours_worked, attendance_status(CHK), is_regularized, regularization_reason, regularized_by(FK→admins)

**teacher_attendance**
`attendance_id`(PK), teacher_id(FK→teachers, UQ combo), date(UQ combo), clock_in, clock_out, total_hours_worked, attendance_status(CHK), is_regularized, regularization_reason, regularized_by(FK→admins)

**student_leave_requests**
`leave_id`(PK), student_id(FK→students), leave_date, reason, status(CHK), approved_by(FK→admins), approved_at, applied_at

**teacher_leave_requests**
`leave_id`(PK), teacher_id(FK→teachers), leave_date, reason, status(CHK), approved_by(FK→admins), approved_at, applied_at

---

## Group 8: Communication

**email_logs**
`email_log_id`(PK), student_id(FK→students), subject, body, status, sent_by(FK→admins), sent_at

---

## Summary

| Metric | Count |
|---|---|
| Tables | 36 |
| Primary Keys | 36 |
| Foreign Keys | ~50+ |
| Unique Constraints | ~15 |
| Check Constraints | gender, attendance_status, leave status, payment status |
| Normal Form | 2NF (fully) |

### Key differences vs. the original 29-table design (from the PDF)
- No polymorphic `user_id/user_type` columns anywhere — every FK points to exactly one table.
- No free-text "type" strings on transactional tables — all replaced by master tables +
  FK (`fee_types`, `notice_types`, `payment_modes`, `config_master`).
- Emergency contacts normalized out of `students`/`teachers` into their own tables.
