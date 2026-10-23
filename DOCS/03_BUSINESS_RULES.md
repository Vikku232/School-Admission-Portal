# SchoolERP — Business Rules & Logic Specifications

## 1. Roles & Access Rules

- Exactly one **super admin** exists by default; only a super admin can create additional admins.
- Admins **cannot be deleted**, only deactivated by another super admin.
- Teachers are registered by Admin and **must** change their password on first login.
- Students are registered by Teacher or Admin — never self-registered (v1.0 has no public
  admission form).

---

## 2. Invoice Auto-Generation

- Triggered by Spring Scheduler at the start of each billing period:
  - **MONTHLY** → runs 1st of every month.
  - **QUARTERLY** → runs Apr 1, Jul 1, Oct 1, Jan 1.
  - **YEARLY** → runs Apr 1 (academic year start).
- **Full scholarship** (`scholarship_type = FULL`): invoice generated with `net_amount_due = 0`,
  `status = WAIVED`.
- **Partial scholarship**: `override_amount` (from `student_fee_assignments`) used instead of the
  base `fee_structures.amount`, with a mandatory `reason`.
- **Yearly frequency**: 5% discount auto-applied; `discount_applied` populated on the invoice.
- Invoice number format: `INV-YYYY-00001` (auto-incremented per year).

---

## 3. Payment Approval Flow

**Offline / Cash:**
```
Admin enters payment → status = PENDING
Admin approves       → status = APPROVED → PDF generated (iText) → email sent
```

**Online (Razorpay):**
```
Student pays → Razorpay webhook → payment auto-created, status = APPROVED
             → logged in payment_gateway_logs → PDF generated → email sent
```

**On approval**, the related `fee_invoices.status` updates:
- `PENDING → PAID` if `amount_paid == net_amount_due`
- `PENDING → PARTIAL` if `amount_paid < net_amount_due`

---

## 4. Due Blocking

Before enrolling a student in a new class/batch:

```sql
SELECT COUNT(*) FROM fee_invoices
WHERE student_id = ? AND status = 'OVERDUE';
```

If count > 0 → throw `DuePaymentException`:
> "Clear existing dues before enrolling in a new class."

---

## 5. Attendance Cron Logic

Runs nightly at 11:59 PM, separately for `student_attendance` and `teacher_attendance`:

1. If `clock_in IS NOT NULL AND clock_out IS NULL` → mark **ABSENT** (forgot to clock out).
2. If `total_hours_worked < minimum_hours` (from `school_config` via `config_master`) →
   mark **HALF_DAY**.
3. If no attendance record exists for a working day → mark **ABSENT**.
4. If a notice exists with `notice_type = HOLIDAY` (via `notice_types`) and
   `notice_for_date = today` → mark **HOLIDAY**, skip absent logic entirely.

---

## 6. Fee Change Audit Rule

- Any change to `fee_structures.amount` — whether global (all students) or per-student
  (`student_fee_assignments.override_amount`) — **must** be written to
  `fee_structure_audit` with `old_amount`, `new_amount`, `changed_by`, `changed_at`.
- No fee amount may be updated without a `reason` field populated in the audit row.

---

## 7. Caution Money Rule

- Fixed amount pulled from `school_config` (via `config_master` key `CAUTION_MONEY_AMOUNT`).
- Collected **once** per student at admission (`caution_money` has a UNIQUE FK on `student_id`
  — one row per student).
- Refund tracked via `status` (`HELD` / `REFUNDED`) and `refunded_at`.
- Analytics dashboards must be able to show collections **with and without** caution money
  (per PRD §Finance Dashboard).

---

## 8. Assignment Submission Rule

- `assignment_submissions` has a UNIQUE constraint on `(assignment_id, student_id)` — a student
  can submit only once per assignment (re-submission = update, not new row).
- Grading is restricted to `A/B/C/F` with an optional remarks field.

---

## 9. Leave Approval Rule

- `student_leave_requests.approved_by` and `teacher_leave_requests.approved_by` both reference
  `admins(admin_id)` — **only Admins/Teachers with approval rights** can approve leave, never
  the requester themselves.
- Teachers approve student leave; Admins approve teacher leave.

---

## 10. Notice Visibility Rule

- `notices.grade_id` nullable → `NULL` means the notice is visible to **all grades**.
- `notice_type_id = HOLIDAY` notices feed directly into the attendance cron (see §5.4).

---

## 11. Email Logging Rule

- Every transactional email (due reminder, invoice receipt, welcome credentials) must write a
  row to `email_logs` with `student_id`, `subject`, `status`, `sent_by`, `sent_at` — for
  auditability and re-send tracking.

---

## 12. Daily Cash Summary Rule

- `daily_cash_summary` has a UNIQUE constraint on `summary_date` — one roll-up row per day,
  aggregating online/offline/cash totals for the finance dashboard's daily chart.
