# SchoolERP — Design System & Frontend Spec

## 1. Design Philosophy

Inspired by South Point School's website (southpoint.ac.in) — premium Indian school digital
presence: trustworthy, clean, content-rich on the public site; flat, minimal SaaS-style admin
panel for the internal ERP.

---

## 2. Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary Blue | `#1A4A7A` | Navbar, headings, primary buttons, active states |
| Secondary Blue | `#2E6DA4` | Hover states, subheadings, links, badges |
| Light Blue | `#E6F1FB` | Card backgrounds, active nav highlights, info banners |
| Accent Gold | `#D4A017` | Highlighted stats, premium badges, public-site CTA accents |
| Success Green | `#1D9E75` | Paid, approved, present, success messages |
| Danger Red | `#E24B4A` | Due, overdue, rejected, errors |
| Warning Amber | `#EF9F27` | Pending, half-day, partial dues |
| Neutral Gray | `#F5F8FC` | Page backgrounds, table row alternates |
| Text Primary | `#1A1A1A` | Body text |
| Text Secondary | `#666666` | Labels, subtitles, muted text |

---

## 3. Typography

- Font: **Inter** (Google Fonts).
- Headings: 500-600 weight. Body: 400. Labels: 500 at smaller sizes.
- Sizes: Display 36px · H1 28px · H2 22px · H3 18px · Body 15px · Label 13px · Micro 11px.

---

## 4. Layout Rules

- Public site: full-width sections, max-width 1280px container.
- Dashboard: fixed left sidebar 220px + main content, sticky topbar 56px.
- Cards: white bg, 1px border `#E8EDF2`, radius 12px, padding 20px.
- Buttons: Primary (blue fill) · Secondary (white + blue border) · Danger (red fill) · Ghost (transparent).
- Breakpoints: 1280px desktop · 768px tablet · 375px mobile.

---

## 5. Status Badges

| Status | Style |
|---|---|
| Paid / Present / Active / Approved | bg `#EAF3DE`, text `#27500A` |
| Due / Absent / Overdue / Rejected | bg `#FCEBEB`, text `#791F1F` |
| Pending / Half Day / Partial | bg `#FAEEDA`, text `#633806` |
| Inactive / Waived / Scholarship | bg `#F1EFE8`, text `#444441` |
| Online | bg `#E6F1FB`, text `#0C447C` |
| Holiday / General Notice | bg `#E1F5EE`, text `#085041` |

---

## 6. Public Website — Sections

1. **Navbar** — logo + name, center nav links, Login modal (role selector) + Apply Now, gold
   admission alert strip, mobile hamburger.
2. **Hero** — full-bleed banner, gradient overlay, heading + 2 CTAs, legacy stats grid, 3
   quick-access cards.
3. **About** — legacy copy + achievements list, building photo, animated stat counters.
4. **Key Features** — 6-card grid (Smart Classrooms, Fee Management, Digital Attendance, Exam
   Portal, Assignment Tracking, Notice Board).
5. **Admission Zone** — 3 action cards (Apply / Procedure / Check Status) + horizontal
   admission-steps timeline.
6. **News & Events** — 3-col card grid + Upcoming Events sidebar list.
7. **Contact** — address/phone/email + embedded map, contact form (name, email, phone, class
   dropdown, message).
8. **Footer** — dark navy `#0F2744`, 4 columns (School Info, Quick Links, Important Links,
   Contact), copyright strip.

---

## 7. Authentication Pages

- **Login**: centered card, role selector (Admin/Teacher/Student), email/password fields,
  remember-me + forgot-password, full-width submit.
- **First Login (Teacher)**: forced password reset with strength checklist (8+ chars, uppercase,
  number, special char).

---

## 8. Dashboard Shell (all roles)

- **Sidebar** (220px): logo, role badge, grouped nav items with icons, active/hover states,
  notification badges, user avatar + logout at bottom, collapsible on tablet.
- **Topbar**: page title left, notification bell + context-aware primary action + user dropdown
  right.

---

## 9. Admin Panel Pages

| Page | Key Elements |
|---|---|
| Dashboard | 4 summary cards, daily collection bar chart, top-due list, recent payments table |
| All Students | search + filters (grade/batch/status/due), export CSV, paginated table |
| Student Profile | header card + 3 tabs: Personal Details/Docs, Fee & Transactions, Attendance |
| Teachers | same pattern as Students, + First Login badge |
| Grades & Courses | 3-panel: Grades → Courses → Batches |
| Timetable | grid (time × day), Add Slot modal, PDF export |
| Fee Structure | fee-types table (inline edit, toggles), audit history modal, caution/discount settings box |
| Payments | 3 summary cards, Pending Approval / All Payments tabs, approve/reject flow |
| Due Students | total due summary, bulk + individual reminder buttons |
| Analytics | date range picker, 4 chart sections (expected vs collected, payment mode donut, with/without caution money, daily cash table) |
| Settings | School Config form + School Profile form |

---

## 10. Teacher Panel Pages

Dashboard (student/leave/assignment counts + today's timetable) · Exams (table + upload modal)
· Assignments (table + grading sub-view) · Notices (card list + publish modal) · Attendance
(clock in/out, own attendance table, student leave approval, regularization tab).

---

## 11. Student Panel Pages

Dashboard (due/attendance%/pending-assignments cards + today's classes) · Fees (frequency
selector, current invoice, Razorpay pay, history table) · Exams (Upcoming/Past tabs, countdown,
PDF view) · Assignments (cards, submit modal, grade badge) · Attendance (clock in/out, monthly
stat chips + table, apply-leave modal) · Profile (photo, personal/address/emergency-contact
form, documents section).

---

## 12. Shared Components

- **Toasts** — bottom-right, auto-dismiss 4s, color-coded left border by type.
- **Modals** — centered, 520px max-width, radius 16px, Esc/backdrop to close.
- **Tables** — uppercase muted headers, 44px rows, sticky header, pagination (10/20/50),
  empty-state illustration.
- **File Upload Zones** — dashed border, drag-and-drop, filename + remove, progress bar, success
  check icon.

---

## 13. React Route Structure

```
/                         Public Home
/about /admission /news /contact /login

/admin/dashboard  /admin/students  /admin/students/:id
/admin/teachers   /admin/teachers/:id
/admin/grades     /admin/timetable
/admin/fees       /admin/payments  /admin/dues
/admin/analytics  /admin/settings

/teacher/dashboard /teacher/students /teacher/exams
/teacher/assignments /teacher/notices /teacher/attendance /teacher/profile

/student/dashboard /student/fees /student/exams
/student/assignments /student/attendance /student/profile
```

---

## 14. Frontend Tech Stack

React 18 · React Router v6 · Axios · Tailwind CSS · Recharts · React Query (TanStack) ·
Zustand · React Hook Form · date-fns · react-hot-toast · @tabler/icons-react · Vite ·
Razorpay JS SDK.
