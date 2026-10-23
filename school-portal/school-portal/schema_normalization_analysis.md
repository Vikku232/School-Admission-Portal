# Database Normalization Report: 3NF Transitive Dependency Analysis

This document provides a detailed analysis of the proposed 36-table schema for the **Student Admission Management System**. It evaluates the schema for **Third Normal Form (3NF)** compliance, identifies transitive dependencies, and proposes a fully normalized schema that eliminates redundancies while explaining practical design trade-offs (e.g., financial history immutability and performance caching).

---

## 📌 Executive Summary of 3NF Violations & Resolutions

A table is in **3NF** if and only if it is in **2NF** (no partial dependencies on a composite key) and **every non-prime attribute depends only on the primary key** (no transitive dependencies of the form $PK \rightarrow X \rightarrow Y$, where $X$ and $Y$ are non-prime attributes).

Through a rigorous audit of the 36 tables, we identified **5 structural 3NF violations**, **2 derived attribute anomalies**, and **1 critical financial design pattern** that is compliant but requires documentation.

### Summary Table of Findings

| Table | Violating Field(s) | Dependency Chain | Type of Issue | Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **`teachers`** | `city`, `state` | `teacher_id` $\rightarrow$ `postal_code` $\rightarrow$ `(city, state)` | Transitive Dependency | Extract to a reference `postal_codes` table, or retain as a deliberate denormalization. |
| **`students`** | `city`, `state` | `student_id` $\rightarrow$ `postal_code` $\rightarrow$ `(city, state)` | Transitive Dependency | Same as above. |
| **`students`** | `scholarship_reason` | `student_id` $\rightarrow$ `scholarship_type` $\rightarrow$ `scholarship_reason` | Transitive Dependency | Extract to a reference `scholarships` table if reasons are tied to types. |
| **`payments`** | `student_id` | `payment_id` $\rightarrow$ `invoice_id` $\rightarrow$ `student_id` | Transitive Dependency | **Remove `student_id`** from `payments`. Join via `fee_invoices` instead. |
| **`exams`** | `grade_id` | `exam_id` $\rightarrow$ `course_id` $\rightarrow$ `grade_id` | Transitive Dependency | **Remove `grade_id`** from `exams`. Look up via `courses`. |
| **`assignments`** | `grade_id` | `assignment_id` $\rightarrow$ `course_id` $\rightarrow$ `grade_id` | Transitive Dependency | **Remove `grade_id`** from `assignments`. Look up via `courses`. |
| **`student_attendance`** | `total_hours_worked` | `(clock_in, clock_out)` $\rightarrow$ `total_hours_worked` | Derived Attribute | Calculate dynamically, or retain for query performance. |
| **`teacher_attendance`** | `total_hours_worked` | `(clock_in, clock_out)` $\rightarrow$ `total_hours_worked` | Derived Attribute | Calculate dynamically, or retain for query performance. |
| **`fee_invoices`** | `total_amount` | Sum of `invoice_line_items.amount` | Derived Attribute | Retain for financial ledger locking. |
| **`invoice_line_items`**| `amount` | Copy of `fee_structures.amount` | Point-in-time Snapshot | **No violation**. Retain to ensure invoice immutability. |

---

## 🔍 Detailed 3NF Transitive Dependency Audit

### 1. The Redundant Student Reference in Payments
* **Current Table**:
  `payments: payment_id(PK), invoice_id(FK), student_id(FK), amount_paid, payment_mode_id(FK), ...`
* **Transitive Chain**:
  `payment_id` $\rightarrow$ `invoice_id` $\rightarrow$ `student_id`
* **Explanation**:
  An invoice (`fee_invoices`) is already uniquely assigned to a single student (`student_id` is an FK in `fee_invoices`). Therefore, any payment made toward `invoice_id` is automatically associated with that student. Storing `student_id` directly in `payments` creates a transitive dependency and introduces the risk of data anomalies (e.g., a payment record claiming to be for Student A, but pointing to an invoice billed to Student B).
* **3NF Resolution**:
  Remove `student_id` from the `payments` table.

```mermaid
graph LR
    subgraph Violating Schema
        P1[payment_id] --> I1[invoice_id]
        P1 --> S1[student_id]
        I1 --> S1
    end
    subgraph Normalized Schema (3NF)
        P2[payment_id] --> I2[invoice_id]
        I2 --> S2[student_id]
    end
    style S1 fill:#ff9999,stroke:#ff3333
    style S2 fill:#99ff99,stroke:#33cc33
```

---

### 2. Redundant Grade Association in Exams and Assignments
* **Current Tables**:
  `exams: exam_id(PK), grade_id(FK), course_id(FK), ...`
  `assignments: assignment_id(PK), grade_id(FK), course_id(FK), ...`
* **Transitive Chain**:
  `exam_id` $\rightarrow$ `course_id` $\rightarrow$ `grade_id`
  `assignment_id` $\rightarrow$ `course_id` $\rightarrow$ `grade_id`
* **Explanation**:
  In the `courses` table, each course is assigned to a grade (`grade_id` is an FK in `courses`). Therefore, a course determines its grade. Storing `grade_id` directly in `exams` and `assignments` is a transitive dependency violation.
* **3NF Resolution**:
  Remove `grade_id` from both `exams` and `assignments`. The grade can be resolved in SQL via:
  ```sql
  SELECT g.grade_name 
  FROM exams e
  JOIN courses c ON e.course_id = c.course_id
  JOIN grades g ON c.grade_id = g.grade_id;
  ```

---

### 3. Address Fields (Postal Code Transitives)
* **Current Tables**:
  `teachers: ..., permanent_address, current_address, city, state, postal_code, ...`
  `students: ..., permanent_address, current_address, city, state, postal_code, ...`
* **Transitive Chain**:
  `student_id` $\rightarrow$ `postal_code` $\rightarrow$ `(city, state)`
* **Explanation**:
  Under strict relational theory, a ZIP/postal code uniquely identifies a city and a state. Therefore, storing `city` and `state` alongside `postal_code` in the teacher and student tables violates 3NF.
* **3NF Resolution (Strict)**:
  Extract these into a lookup table:
  `postal_codes: postal_code(PK), city, state`
* **Practical Design Trade-off**:
  In many production systems, address fields are kept denormalized in the entity table to avoid joins and because geographic databases can be complex to maintain. However, for project documentation and strict 3NF database designs, identifying and splitting this is the correct theoretical approach.

---

### 4. Scholarship Metadata
* **Current Table**:
  `students: ..., scholarship_type, scholarship_reason, ...`
* **Transitive Chain**:
  `student_id` $\rightarrow$ `scholarship_type` $\rightarrow$ `scholarship_reason`
* **Explanation**:
  If a scholarship type (e.g., "Sports Merit") has a fixed reason or description (e.g., "Represented state or national level athletics"), storing both fields in `students` is a transitive dependency violation.
* **3NF Resolution**:
  Extract to a lookup table:
  `scholarships: scholarship_type_id(PK), scholarship_type_name(UQ), description_or_reason`
  Then, reference `scholarship_type_id` in the `students` table.

---

### 5. Derived Values (Financials & Attendance)
* **`student_attendance` & `teacher_attendance` (`total_hours_worked`)**:
  * *Dependency*: Calculated as `clock_out - clock_in`.
  * *3NF Status*: Technically a functional dependency violation on non-key fields. For strict 3NF, this should be calculated dynamically on-the-fly. For performant real-world reporting, it is often persisted to avoid costly datetime diffs over millions of records.
* **`fee_invoices` (`total_amount`)**:
  * *Dependency*: Calculated as the sum of all associated `invoice_line_items.amount`.
  * *3NF Status*: Storing calculated sums violates normalization. However, in financial systems, the invoice total must be locked and immutable once issued, protecting it from future edits to line items or tariff tables. Storing this field is a mandatory design pattern for auditing.
* **`invoice_line_items` (`amount`)**:
  * *Dependency*: At first glance, this seems transitively dependent on `fee_structure_id`. However, the amount represents a **historical snapshot** of the price billed at the time the invoice was generated. If the default amount in `fee_structures` changes in the future, the historical invoice must remain unchanged. Thus, it is a separate, independent attribute and **does not violate 3NF**.

---

## 📊 The Fully Normalized 3NF Database Schema

Here is the revised database schema with all transitive dependencies resolved.

### Core & Directory Management

#### 1. admins
* `admin_id` (PK)
* `name`
* `email` (UQ)
* `password_hash`
* `phone`
* `role`
* `is_active`
* `created_by` (FK $\rightarrow$ admins)
* `created_at`
* `updated_at`

#### 2. postal_codes [NEW]
* `postal_code` (PK)
* `city`
* `state`

#### 3. teachers
* `teacher_id` (PK)
* `teacher_code` (UQ)
* `first_name`
* `last_name`
* `email` (UQ)
* `password_hash`
* `phone`
* `date_of_birth`
* `gender` (CHK)
* `permanent_address`
* `current_address`
* `postal_code` (FK $\rightarrow$ postal_codes)
* `blood_group`
* `profile_photo_url`
* `govt_proof_url`
* `is_active`
* `is_first_login`
* `created_by` (FK $\rightarrow$ admins)
* `created_at`
* `updated_at`

#### 4. teacher_emergency_contacts
* `contact_id` (PK)
* `teacher_id` (FK $\rightarrow$ teachers)
* `contact_name`
* `contact_phone`
* `relation`

#### 5. scholarships [NEW]
* `scholarship_id` (PK)
* `scholarship_type` (UQ)
* `scholarship_reason` (default/description)

#### 6. students
* `student_id` (PK)
* `student_code` (UQ)
* `first_name`
* `last_name`
* `email` (UQ)
* `password_hash`
* `phone`
* `date_of_birth`
* `gender` (CHK)
* `permanent_address`
* `current_address`
* `postal_code` (FK $\rightarrow$ postal_codes)
* `blood_group`
* `profile_photo_url`
* `enrollment_date`
* `status` (CHK)
* `scholarship_id` (FK $\rightarrow$ scholarships, Nullable)
* `created_by` (FK $\rightarrow$ admins)
* `created_at`
* `updated_at`

#### 7. student_emergency_contacts
* `contact_id` (PK)
* `student_id` (FK $\rightarrow$ students)
* `contact_name`
* `contact_phone`
* `relation`

#### 8. guardians
* `guardian_id` (PK)
* `student_id` (FK $\rightarrow$ students)
* `guardian_name`
* `relation`
* `occupation`
* `phone`
* `email`
* `is_primary_contact`

---

### Academic Records

#### 9. document_requirements
* `requirement_id` (PK)
* `document_name` (UQ)
* `description`
* `is_mandatory`
* `created_by` (FK $\rightarrow$ admins)
* `created_at`

#### 10. student_documents
* `document_id` (PK)
* `student_id` (FK $\rightarrow$ students)
* `requirement_id` (FK $\rightarrow$ document_requirements)
* `file_url`
* `upload_date`
* `verification_status`
* `uploaded_by` (FK $\rightarrow$ admins/teachers/students)

#### 11. grades
* `grade_id` (PK)
* `grade_name` (UQ with academic_year)
* `academic_year` (UQ with grade_name)
* `created_by` (FK $\rightarrow$ admins)
* `created_at`

#### 12. courses
* `course_id` (PK)
* `grade_id` (FK $\rightarrow$ grades)
* `course_name`
* `course_code`
* `credits`
* `created_by` (FK $\rightarrow$ admins)
* `created_at`

#### 13. batches
* `batch_id` (PK)
* `grade_id` (FK $\rightarrow$ grades)
* `batch_name` (UQ with grade_id)
* `capacity`
* `created_by` (FK $\rightarrow$ admins)
* `created_at`

#### 14. student_batch_assignments
* `assignment_id` (PK)
* `student_id` (FK $\rightarrow$ students)
* `batch_id` (FK $\rightarrow$ batches)
* `academic_year` (UQ combo)
* `is_current` (UQ combo)
* `assigned_by` (FK $\rightarrow$ admins)
* `assigned_at`

#### 15. timetables
* `timetable_id` (PK)
* `batch_id` (FK $\rightarrow$ batches)
* `course_id` (FK $\rightarrow$ courses)
* `teacher_id` (FK $\rightarrow$ teachers)
* `day_of_week`
* `start_time`
* `end_time`
* `room_number`
* `created_by` (FK $\rightarrow$ admins)

---

### Configuration & Settings

#### 16. config_master
* `config_id` (PK)
* `config_key` (UQ)
* `description`

#### 17. school_config
* `school_config_id` (PK)
* `config_id` (FK $\rightarrow$ config_master)
* `config_value`
* `academic_year`
* `updated_by` (FK $\rightarrow$ admins)
* `updated_at`

---

### Fees, Invoicing & Payments

#### 18. fee_types
* `fee_type_id` (PK)
* `fee_type_name` (UQ)
* `description`

#### 19. fee_structures
* `fee_structure_id` (PK)
* `fee_type_id` (FK $\rightarrow$ fee_types, UQ combo)
* `academic_year` (UQ combo)
* `amount`
* `is_mandatory`
* `is_active`
* `created_by` (FK $\rightarrow$ admins)
* `created_at`
* `updated_at`

#### 20. fee_structure_audit
* `audit_id` (PK)
* `fee_structure_id` (FK $\rightarrow$ fee_structures)
* `old_amount`
* `new_amount`
* `changed_by` (FK $\rightarrow$ admins)
* `changed_at`

#### 21. student_fee_assignments
* `assignment_id` (PK)
* `student_id` (FK $\rightarrow$ students)
* `fee_structure_id` (FK $\rightarrow$ fee_structures)
* `assigned_by` (FK $\rightarrow$ admins)
* `assigned_at`

#### 22. fee_invoices
* `invoice_id` (PK)
* `invoice_number` (UQ)
* `student_id` (FK $\rightarrow$ students)
* `total_amount` (Derived/Calculated, kept for audit trail)
* `due_date`
* `status`
* `created_at`

#### 23. invoice_line_items
* `line_item_id` (PK)
* `invoice_id` (FK $\rightarrow$ fee_invoices)
* `fee_structure_id` (FK $\rightarrow$ fee_structures)
* `amount` (Snapshot at point of billing, distinct from fee_structures.amount)
* `description`

#### 24. payment_modes
* `payment_mode_id` (PK)
* `mode_name` (UQ)

#### 25. payments
* `payment_id` (PK)
* `invoice_id` (FK $\rightarrow$ fee_invoices)
* *Note: Removed student_id (FK) to satisfy 3NF. Join through invoice_id instead.*
* `amount_paid`
* `payment_mode_id` (FK $\rightarrow$ payment_modes)
* `payment_date`
* `transaction_reference`
* `collected_by` (FK $\rightarrow$ admins)
* `status`
* `approved_by` (FK $\rightarrow$ admins, Nullable)
* `approved_at`
* `remarks`
* `created_at`

#### 26. caution_money
* `caution_id` (PK)
* `student_id` (FK $\rightarrow$ students)
* `amount`
* `status`
* `collected_at`
* `refunded_at`

#### 27. payment_gateway_logs
* `gateway_log_id` (PK)
* `payment_id` (FK $\rightarrow$ payments)
* `gateway_name`
* `gateway_transaction_id`
* `gateway_response`
* `status`
* `logged_at`

---

### Academic Tasks, Assessments & Notices

#### 28. exams
* `exam_id` (PK)
* *Note: Removed grade_id (FK) to satisfy 3NF. Determined via course_id.*
* `course_id` (FK $\rightarrow$ courses)
* `teacher_id` (FK $\rightarrow$ teachers)
* `exam_name`
* `exam_date`
* `max_marks`
* `created_at`

#### 29. assignments
* `assignment_id` (PK)
* *Note: Removed grade_id (FK) to satisfy 3NF. Determined via course_id.*
* `course_id` (FK $\rightarrow$ courses)
* `teacher_id` (FK $\rightarrow$ teachers)
* `title`
* `description`
* `due_date`
* `max_marks`
* `created_at`

#### 30. assignment_submissions
* `submission_id` (PK)
* `assignment_id` (FK $\rightarrow$ assignments, UQ combo)
* `student_id` (FK $\rightarrow$ students, UQ combo)
* `submission_url`
* `submitted_at`
* `marks_obtained`
* `feedback`

#### 31. notice_types
* `notice_type_id` (PK)
* `notice_type_name` (UQ)

#### 32. notices
* `notice_id` (PK)
* `grade_id` (FK $\rightarrow$ grades, Nullable)
* `teacher_id` (FK $\rightarrow$ teachers, Nullable)
* `notice_type_id` (FK $\rightarrow$ notice_types)
* `title`
* `content`
* `attachment_url`
* `notice_for_date`
* `created_at`

---

### Attendance & Leaves

#### 33. student_attendance
* `attendance_id` (PK)
* `student_id` (FK $\rightarrow$ students, UQ combo)
* `date` (UQ combo)
* `clock_in`
* `clock_out`
* `total_hours_worked` (Derived value, optional denormalization)
* `attendance_status` (CHK)
* `is_regularized`
* `regularization_reason`
* `regularized_by` (FK $\rightarrow$ admins)

#### 34. teacher_attendance
* `attendance_id` (PK)
* `teacher_id` (FK $\rightarrow$ teachers, UQ combo)
* `date` (UQ combo)
* `clock_in`
* `clock_out`
* `total_hours_worked` (Derived value, optional denormalization)
* `attendance_status` (CHK)
* `is_regularized`
* `regularization_reason`
* `regularized_by` (FK $\rightarrow$ admins)

#### 35. student_leave_requests
* `leave_id` (PK)
* `student_id` (FK $\rightarrow$ students)
* `leave_date`
* `reason`
* `status` (CHK)
* `approved_by` (FK $\rightarrow$ admins/teachers)
* `approved_at`
* `applied_at`

#### 36. teacher_leave_requests
* `leave_id` (PK)
* `teacher_id` (FK $\rightarrow$ teachers)
* `leave_date`
* `reason`
* `status` (CHK)
* `approved_by` (FK $\rightarrow$ admins)
* `approved_at`
* `applied_at`

---

### Communications & Summary Logs

#### 37. email_logs
* `email_log_id` (PK)
* `student_id` (FK $\rightarrow$ students)
* `subject`
* `body`
* `status`
* `sent_by` (FK $\rightarrow$ admins)
* `sent_at`

#### 38. daily_cash_summary
* `summary_id` (PK)
* `summary_date` (UQ)
* `total_collected` (Derived sum, optional denormalization)
* `total_refunded` (Derived sum, optional denormalization)
* `entered_by` (FK $\rightarrow$ admins)
* `created_at`
