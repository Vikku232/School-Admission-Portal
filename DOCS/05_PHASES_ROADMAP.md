# SchoolERP — Development Phases & Roadmap

Solo full-stack build plan (Spring Boot + React), sequenced so each phase produces a testable
vertical slice. Assumes the 36-table 2NF schema in `04_DATABASE_SCHEMA.md`.

---

## Phase 0 — Project Setup (2-3 days)
- Init Spring Boot 3 project (Web, JPA, Security, Validation, Mail, Scheduler starters).
- Init React + Vite + Tailwind + React Router + Zustand + React Query.
- Set up MySQL/Postgres, write Flyway/Liquibase migration scripts for all 36 tables.
- Configure JWT filter chain, BCrypt, global exception handler, CORS.
- Set up Git repo, `.env`/`application.yml` structure, base CI (build + lint).

**Deliverable:** empty app that boots, connects to DB, has a working `/api/auth/login` stub.

---

## Phase 1 — Auth & Core User Management (1 week)
- `admins`, `teachers`, `students`, emergency contact tables, `guardians`.
- Login, JWT issuance, role-based route guards (backend + frontend).
- Teacher first-login forced password change.
- Admin: register/list/deactivate teachers; register/list students; create additional admins.

**Deliverable:** all 3 roles can log in; Admin can manage teacher & student accounts.

---

## Phase 2 — Academic Structure (1 week)
- `grades`, `courses`, `batches`, `student_batch_assignments`, `timetables`.
- Admin pages: Grades & Courses (3-panel), Timetable grid + slot modal.
- Document requirements + student document upload (`document_requirements`, `student_documents`).

**Deliverable:** Admin can fully set up a school's grade/course/batch/timetable structure.

---

## Phase 3 — Finance Core (1.5-2 weeks)
- `fee_types`, `fee_structures`, `fee_structure_audit`, `student_fee_assignments`.
- `fee_invoices`, `invoice_line_items`, `payment_modes`, `payments`, `caution_money`,
  `payment_gateway_logs`.
- Business logic: discount/scholarship math, invoice numbering, due blocking (see
  `03_BUSINESS_RULES.md` §2-4).
- Admin pages: Fee Structure, Payments (pending/all tabs), Due Students.
- Student page: Fees (frequency selector, pay flow — Razorpay stubbed until Phase 6).
- iText PDF invoice generation + email on approval.

**Deliverable:** end-to-end fee lifecycle (assign → invoice → pay offline → approve → PDF/email).

---

## Phase 4 — Academic Activity (1 week)
- `exams`, `assignments`, `assignment_submissions`, `notice_types`, `notices`.
- Teacher pages: Exams, Assignments (+ grading), Notices.
- Student pages: Exams, Assignments (submit + view grade), Notices.

**Deliverable:** teachers can run the full exam/assignment/notice cycle; students consume it.

---

## Phase 5 — Attendance & Leave (1 week)
- `student_attendance`, `teacher_attendance`, `student_leave_requests`, `teacher_leave_requests`.
- Clock in/out UI for teacher & student.
- Leave apply/approve flows (teacher approves student; admin approves teacher).
- Attendance regularization (admin/teacher).
- Cron jobs: nightly ABSENT/HALF_DAY marking, holiday auto-population (§5 in Business Rules).

**Deliverable:** attendance is trackable and self-correcting via scheduled jobs.

---

## Phase 6 — Payments Integration & Automation (1 week)
- Razorpay SDK integration (checkout + webhook handler → `payment_gateway_logs`).
- Invoice auto-generation cron (monthly/quarterly/yearly triggers).
- Overdue invoice flagging cron.
- Due reminder emails (single + bulk), `email_logs` wiring.
- `daily_cash_summary` roll-up job.

**Deliverable:** fully automated billing cycle, no manual invoice creation needed.

---

## Phase 7 — Analytics & Dashboards (3-5 days)
- Admin Finance Dashboard: summary cards, daily cash chart, top-due list, recent payments.
- Admin Analytics page: expected vs collected, payment mode donut, with/without caution money.
- `school_config`/`config_master` driven Settings page.

**Deliverable:** Admin has full financial visibility.

---

## Phase 8 — Public Website (1 week)
- Landing page sections per `06_DESIGN_SYSTEM.md`: Hero, About, Features, Admission Zone,
  News & Events, Contact form, Footer.
- Contact form → stores inquiry (new lightweight table or reuses `email_logs`-style logging).
- Login modal with role selector.

**Deliverable:** public-facing marketing site, fully responsive.

---

## Phase 9 — Polish, Testing, Deployment (1 week)
- Shared component pass: toasts, modals, tables, pagination, empty states, file upload zones.
- Cross-role QA pass against every page in the PDF's Part 3 (Frontend spec).
- Load/perf check against NFR targets (<500ms API, <2s dashboard).
- Deploy: backend → Railway/Render, frontend → Vercel/Netlify, DB → managed MySQL/Postgres.
- Point AWS S3 for file storage in prod, verify SMTP + Razorpay live keys.

**Deliverable:** production deployment, ready for real school onboarding.

---

## Suggested Timeline

| Phase | Duration | Cumulative |
|---|---|---|
| 0. Setup | 2-3 days | Week 1 |
| 1. Auth & Users | 1 week | Week 2 |
| 2. Academic Structure | 1 week | Week 3 |
| 3. Finance Core | 1.5-2 weeks | Week 5 |
| 4. Academic Activity | 1 week | Week 6 |
| 5. Attendance & Leave | 1 week | Week 7 |
| 6. Payments & Automation | 1 week | Week 8 |
| 7. Analytics | 3-5 days | Week 8-9 |
| 8. Public Website | 1 week | Week 10 |
| 9. Polish & Deploy | 1 week | Week 11 |

**Total: ~10-11 weeks** for a solo developer at a steady, portfolio-quality pace.
