# SchoolERP — Architecture Document

## 1. System Architecture

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, Tailwind CSS, Recharts |
| Backend | Spring Boot 3, Spring Security, Spring Data JPA, Spring Scheduler |
| Authentication | JWT (JSON Web Tokens), BCrypt |
| Database | MySQL 8.0 / PostgreSQL, Hibernate ORM |
| File Storage | Local (dev) → AWS S3 (prod), MultipartFile upload |
| Email | JavaMailSender (Gmail SMTP / SendGrid) |
| PDF | iText 7 (invoice generation) |
| Payments | Razorpay SDK (online) + admin manual entry (offline/cash) |
| Scheduling | Spring `@Scheduled` cron jobs |
| Build | Maven (backend), Vite (frontend) |
| Deployment | Railway/Render (backend), Vercel/Netlify (frontend) |

---

## 2. High-Level Component Diagram

```
┌─────────────────────┐        ┌──────────────────────────┐
│   Public Website     │        │   ERP Dashboard (SPA)     │
│  (React, unauth)      │        │  Admin / Teacher / Student │
└──────────┬───────────┘        └────────────┬──────────────┘
           │                                  │
           └────────────────┬─────────────────┘
                             │  Axios + JWT interceptor
                             ▼
                 ┌───────────────────────┐
                 │   Spring Boot API      │
                 │  (REST, stateless)     │
                 ├───────────────────────┤
                 │ Controller Layer       │
                 │ Service Layer          │
                 │ Repository (JPA)       │
                 │ Security (JWT filter)  │
                 │ Scheduler (cron jobs)  │
                 └──────────┬────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                     ▼
 ┌─────────────┐     ┌──────────────┐     ┌────────────────┐
 │ MySQL/Postgres│    │ File Storage │     │ External APIs   │
 │  (36 tables)  │    │ (Local/S3)   │     │ Razorpay, SMTP  │
 └─────────────┘     └──────────────┘     └────────────────┘
```

---

## 3. Layered Backend Design

- **Controller layer**: REST endpoints, request validation (`@Valid`), role guards
  (`@PreAuthorize`).
- **Service layer**: business logic — invoice generation, discount/scholarship math, due
  blocking, audit logging.
- **Repository layer**: Spring Data JPA repositories, one per entity/table.
- **Security layer**: JWT filter chain, `UserDetailsService` per role (Admin/Teacher/Student
  share a unified auth principal with a `role` claim).
- **Scheduler layer**: `@Scheduled` cron beans for attendance marking, invoice generation,
  overdue flagging (see `03_BUSINESS_RULES.md`).

---

## 4. Module Boundaries (maps to DB table groups)

| Module | Tables Owned |
|---|---|
| **Auth/Users** | admins, teachers, students, teacher_emergency_contacts, student_emergency_contacts, guardians |
| **Documents** | document_requirements, student_documents |
| **Academic Structure** | grades, courses, batches, student_batch_assignments, timetables |
| **Config** | config_master, school_config |
| **Finance** | fee_types, fee_structures, fee_structure_audit, student_fee_assignments, fee_invoices, invoice_line_items, payment_modes, payments, caution_money, payment_gateway_logs, daily_cash_summary |
| **Academic Activity** | exams, assignments, assignment_submissions, notice_types, notices |
| **Operations** | student_attendance, teacher_attendance, student_leave_requests, teacher_leave_requests |
| **Communication** | email_logs |

Each module = one Spring Boot package (`com.schoolerp.<module>`) with its own
controller/service/repository/dto subpackages. Cross-module calls go through service interfaces,
not repositories, to keep boundaries clean.

---

## 5. API Endpoint Map (representative)

### Auth
```
POST /api/auth/login
POST /api/auth/change-password-first
POST /api/auth/logout
```

### Admin — Users
```
GET    /api/admin/teachers
POST   /api/admin/teachers
PUT    /api/admin/teachers/{id}
GET    /api/admin/students
GET    /api/admin/students/{id}
POST   /api/admin/admins
```

### Admin — Finance
```
GET    /api/finance/fee-structures
POST   /api/finance/fee-structures
PUT    /api/finance/fee-structures/{id}
DELETE /api/finance/fee-structures/{id}
POST   /api/finance/student-fee-assignments
PUT    /api/finance/student-fee-assignments/{id}/override
GET    /api/finance/invoices?studentId=
POST   /api/finance/payments
PUT    /api/finance/payments/{id}/approve
PUT    /api/finance/payments/{id}/reject
GET    /api/finance/dues
POST   /api/finance/email/due-reminder/{studentId}
POST   /api/finance/email/bulk-reminder
GET    /api/finance/dashboard
GET    /api/finance/caution-money/{studentId}
PUT    /api/finance/caution-money/{id}/refund
```

### Academic
```
GET/POST /api/grades
GET/POST /api/courses
GET/POST /api/batches
POST     /api/student-batch-assignments
GET/POST /api/timetables
GET/POST /api/exams
GET/POST /api/assignments
GET      /api/assignments/{id}/submissions
PUT      /api/assignments/submissions/{id}/grade
POST     /api/student/assignments/{id}/submit
GET/POST /api/notices
GET      /api/attendance/student | /api/attendance/teacher
POST     /api/attendance/clock-in
POST     /api/attendance/clock-out
GET/POST /api/leave-requests/student | /api/leave-requests/teacher
PUT      /api/leave-requests/{id}/approve
PUT      /api/leave-requests/{id}/reject
```

> Note: attendance/leave endpoints are now split per-role (`/student` vs `/teacher`) to match
> the de-polymorphized `student_attendance`/`teacher_attendance` and
> `student_leave_requests`/`teacher_leave_requests` tables.

---

## 6. Frontend Architecture

| Library | Purpose |
|---|---|
| React 18 | Component-based SPA |
| React Router v6 | Routing, protected routes per role |
| Axios | HTTP client + JWT interceptor |
| Tailwind CSS | Styling |
| Recharts | Finance analytics charts |
| React Query (TanStack) | Server state, caching, refetch |
| Zustand | Global client state (auth user, role, JWT) |
| React Hook Form | Form state + validation |
| date-fns | Date formatting |
| react-hot-toast | Toasts |
| @tabler/icons-react | Icon set |
| Vite | Dev server + build |
| Razorpay JS SDK | Online payments |

Route structure: `/`, `/about`, `/admission`, `/news`, `/contact`, `/login` (public) and
`/admin/*`, `/teacher/*`, `/student/*` (role-guarded), each with its own layout shell
(sidebar + topbar).

---

## 7. Security Architecture

- JWT issued at login, carries `sub` (user id), `role`, `exp`.
- Stateless — no server-side session; every request re-validates the token via a
  `OncePerRequestFilter`.
- `@PreAuthorize("hasRole('ADMIN')")` etc. at controller method level.
- Passwords hashed with BCrypt (strength 10+).
- File uploads validated by MIME type + size cap (5MB) before storage.
- All monetary and role-changing operations logged (`fee_structure_audit`, `payment_gateway_logs`).

---

## 8. Deployment Topology

```
Vercel/Netlify (React build)  ──HTTPS──▶  Railway/Render (Spring Boot)  ──▶  Managed MySQL/Postgres
                                                    │
                                                    ├──▶ AWS S3 (file storage, prod)
                                                    ├──▶ SMTP (Gmail/SendGrid)
                                                    └──▶ Razorpay API
```
