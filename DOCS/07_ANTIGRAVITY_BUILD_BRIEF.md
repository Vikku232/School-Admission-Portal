# SchoolERP — Antigravity Build Brief

**Design source of truth:** `06_DESIGN_SYSTEM.md` (linked below — read this first and re-check it before building each page; do not invent colors, spacing, or components not defined there).

> 📎 Linked file: [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md)
> Every section reference below (e.g. "§6.2 Hero") points to a section in that file.

This brief turns the design system into an ordered build plan: what to scaffold, in what order, with what acceptance criteria — so an agentic coding tool can implement the project end-to-end without ambiguity.

---

## 0. Before Writing Any Code

1. Open and fully parse `06_DESIGN_SYSTEM.md`.
2. Extract and hard-code as reusable tokens (do this once, first):
   - Color palette (§2) → Tailwind theme colors
   - Typography scale (§3) → Tailwind font sizes + Inter font import
   - Layout rules (§4) → container widths, card style, button variants, breakpoints
   - Status badge styles (§5) → a single `<Badge status="..." />` component
3. Confirm tech stack (§14) before installing anything — do not substitute libraries.
4. Confirm route structure (§13) before creating folders — file/folder names should mirror the route tree exactly.

---

## 1. Project Setup

```bash
npm create vite@latest school-erp -- --template react
cd school-erp
npm install react-router-dom axios tailwindcss postcss autoprefixer recharts \
  @tanstack/react-query zustand react-hook-form date-fns react-hot-toast \
  @tabler/icons-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- Add Razorpay JS SDK via script tag in `index.html` (per §14), not npm.
- Configure `tailwind.config.js` with the exact tokens from §2/§3 — use the token names below so class names read clearly (`bg-primary-blue`, `text-secondary`, etc.):

```js
// tailwind.config.js excerpt — values from 06_DESIGN_SYSTEM.md §2/§3
colors: {
  'primary-blue': '#1A4A7A',
  'secondary-blue': '#2E6DA4',
  'light-blue': '#E6F1FB',
  'accent-gold': '#D4A017',
  'success-green': '#1D9E75',
  'danger-red': '#E24B4A',
  'warning-amber': '#EF9F27',
  'neutral-gray': '#F5F8FC',
  'text-primary': '#1A1A1A',
  'text-secondary': '#666666',
},
fontFamily: { sans: ['Inter', 'sans-serif'] },
```

- Global card/button utility classes (from §4): card = `bg-white border border-[#E8EDF2] rounded-xl p-5`; buttons = primary (blue fill), secondary (white + blue border), danger (red fill), ghost (transparent) — build these as a single `<Button variant="primary|secondary|danger|ghost">` component before any page work starts.

---

## 2. Build Order (do not skip ahead — each phase depends on the last)

### Phase 1 — Foundation (build once, reuse everywhere)
- [ ] Tailwind theme tokens (Section 1 above)
- [ ] `<Button>`, `<Card>`, `<Badge status="...">` (mapped exactly to §5 badge table), `<Modal>` (520px max-width, radius 16px, Esc/backdrop close — §12), `<Toast>` wiring via `react-hot-toast` (bottom-right, 4s auto-dismiss, colored left border — §12), `<Table>` (uppercase muted headers, 44px rows, sticky header, pagination 10/20/50, empty-state — §12), `<FileUploadZone>` (dashed border, drag-and-drop, progress bar, success check — §12)
- [ ] React Router route tree exactly as §13, using placeholder pages first (just a heading) so navigation works end-to-end before content is filled in
- [ ] Zustand auth store (role: admin/teacher/student, token, user) + React Query client setup + Axios instance with interceptor for auth header

**Acceptance:** app boots, all routes from §13 are reachable and render a placeholder heading, design tokens visibly applied (check one button + one card render with correct colors).

### Phase 2 — Auth
- [ ] Login page (§7): centered card, role selector, email/password, remember-me, forgot-password link, full-width submit
- [ ] First Login / forced password reset page (§7): strength checklist (8+ chars, uppercase, number, special char) with live validation ticks
- [ ] Route guards: unauthenticated → redirect to `/login`; role mismatch on `/admin/*`, `/teacher/*`, `/student/*` → redirect to that role's dashboard

**Acceptance:** can log in as each of the 3 roles (mock or real API) and land on the correct dashboard; wrong-role access to another role's route redirects correctly; invalid login shows a toast error.

### Phase 3 — Dashboard Shell (shared by all 3 roles)
- [ ] Sidebar (§8): 220px fixed, logo, role badge, grouped nav items with icons, active/hover states, notification badges, user avatar + logout pinned to bottom, collapsible on tablet breakpoint (768px)
- [ ] Topbar (§8): sticky 56px, page title left, notification bell + context-aware primary action + user dropdown right
- [ ] Sidebar nav items are role-specific — pull the correct list from §9/§10/§11 route tables per logged-in role

**Acceptance:** sidebar/topbar render identically in structure across all 3 roles but with role-appropriate nav items; collapses correctly at tablet width; logout clears the Zustand store and redirects to `/login`.

### Phase 4 — Public Website (§6)
Build sections top to bottom, each as its own component, assembled into the `/` page:
- [ ] Navbar — logo + name, center nav links, Login modal with role selector, "Apply Now" button, gold admission alert strip above/below navbar, mobile hamburger
- [ ] Hero — full-bleed banner, gradient overlay, heading + 2 CTAs, animated legacy stats grid, 3 quick-access cards
- [ ] About — legacy copy, achievements list, building photo, animated stat counters (use `react-hot-toast`'s pattern of libraries already installed, or a small custom hook — no new dependency)
- [ ] Key Features — 6-card grid: Smart Classrooms, Fee Management, Digital Attendance, Exam Portal, Assignment Tracking, Notice Board
- [ ] Admission Zone — 3 action cards (Apply / Procedure / Check Status) + horizontal admission-steps timeline
- [ ] News & Events — 3-col card grid + Upcoming Events sidebar list
- [ ] Contact — address/phone/email + embedded map, contact form (name, email, phone, class dropdown, message) with client-side validation + toast on submit
- [ ] Footer — dark navy `#0F2744` (note: distinct from primary-blue, add as a one-off class here), 4 columns (School Info, Quick Links, Important Links, Contact), copyright strip

Then wire `/about`, `/admission`, `/news`, `/contact` as either anchor-scroll sections on one page or standalone routed pages reusing the same section components — pick standalone routed pages if content per section grows beyond a single scroll (recommended for real content).

**Acceptance:** public site is fully responsive at 1280/768/375 (§4), max-width 1280px container respected, Login modal opens from navbar and matches §7 styling, contact form shows a success toast on submit.

### Phase 5 — Admin Panel (§9)
Build in this order (top of table = highest priority, each depends on shared components from Phase 1, not on each other):
1. **Dashboard** — 4 summary cards, daily collection bar chart (Recharts), top-due list, recent payments table
2. **All Students** — search + filters (grade/batch/status/due), export CSV, paginated table using shared `<Table>`
3. **Student Profile** — header card + 3 tabs: Personal Details/Docs, Fee & Transactions, Attendance
4. **Teachers** — same pattern as Students, plus a "First Login" badge (use `<Badge status="pending">` styling)
5. **Grades & Courses** — 3-panel: Grades → Courses → Batches (master-detail layout)
6. **Timetable** — grid (time × day), "Add Slot" modal, PDF export button
7. **Fee Structure** — fee-types table with inline edit + toggles, audit history modal, caution/discount settings box
8. **Payments** — 3 summary cards, "Pending Approval" / "All Payments" tabs, approve/reject flow with confirm-then-toast
9. **Due Students** — total due summary, bulk + individual reminder buttons
10. **Analytics** — date range picker, 4 chart sections (expected vs collected, payment mode donut, with/without caution money, daily cash table) — all via Recharts
11. **Settings** — School Config form + School Profile form

**Acceptance per page:** matches its row in §9's key-elements list exactly; every status shown uses `<Badge>` mapped to §5; every list/table uses the shared `<Table>` component; every destructive or approval action confirms before firing a toast.

### Phase 6 — Teacher Panel (§10)
- [ ] Dashboard (student/leave/assignment counts + today's timetable)
- [ ] Exams (table + upload modal)
- [ ] Assignments (table + grading sub-view)
- [ ] Notices (card list + publish modal)
- [ ] Attendance (clock in/out, own attendance table, student leave approval, regularization tab)

### Phase 7 — Student Panel (§11)
- [ ] Dashboard (due/attendance%/pending-assignments cards + today's classes)
- [ ] Fees (frequency selector, current invoice, Razorpay pay button, history table)
- [ ] Exams (Upcoming/Past tabs, countdown, PDF view)
- [ ] Assignments (cards, submit modal, grade badge)
- [ ] Attendance (clock in/out, monthly stat chips + table, apply-leave modal)
- [ ] Profile (photo, personal/address/emergency-contact form, documents section)

**Acceptance for Phases 6–7:** every page matches its bullet list in §10/§11; Razorpay integration uses the SDK loaded per §14 (script tag, not npm package); all forms use React Hook Form with inline validation errors, not alert popups.

---

## 3. Cross-Cutting Rules (apply on every phase, not just once)

- **No native `alert()`/`confirm()`** anywhere — use `react-hot-toast` for feedback and the shared `<Modal>` for confirmations (§12).
- **Every status value** (paid/due/pending/present/absent/etc.) must render through the single `<Badge>` component mapped to §5 — never inline a badge color.
- **Every data list** must use the shared `<Table>` component (§12) for consistency — sticky header, pagination, empty state.
- **Loading states**: use React Query's `isLoading`/`isFetching` to show skeletons on tables and spinners on buttons — no blank screens.
- **Responsive**: check every page at all 3 breakpoints from §4 before marking a phase complete.
- **Route names**: must match §13 exactly, including nesting (`/admin/students/:id`, not `/admin/student-detail`).

---

## 4. Definition of Done (whole project)

- [ ] All routes in §13 implemented and reachable per role
- [ ] All shared components (§12) built once and reused, not duplicated per page
- [ ] Color/typography/spacing tokens match §2–§4 with zero hardcoded hex values outside `tailwind.config.js`
- [ ] All 3 dashboards (admin/teacher/student) share the same sidebar/topbar shell (§8) with role-specific nav content only
- [ ] Public site fully responsive, matches §6 section order
- [ ] No native browser alerts/confirms anywhere in the codebase
- [ ] Design system file (`06_DESIGN_SYSTEM.md`) remains the single source of truth — if a page needs something not in it, stop and flag it rather than improvising a new pattern
