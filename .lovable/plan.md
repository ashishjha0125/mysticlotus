
# Mystic Lotus & Dragonflies — Admin Dashboard (Client-Only, Phase 1)

## Important caveats up front

- Lovable runs **TanStack Start (React 19 + Vite)**, not plain CRA/Vite-React. Everything you asked for on the frontend still applies (Tailwind, Router, Axios, React Hook Form, React Icons, Recharts, Framer Motion) — routing uses TanStack Router instead of `react-router-dom`. Functionally identical for an admin UI.
- **No backend will be built here.** You host Express + Postgres + JWT + Cloudinary yourself. This project consumes your API over HTTPS.
- **The preview inside Lovable will not show real data** until your API is deployed at a public HTTPS URL and CORS-allows the preview origin. Until then screens render loading / empty / error states — that is expected, not a bug.
- **Admin seeding, JWT issuance, RLS, refresh tokens, "remember me" persistence semantics, password reset emails** — all backend responsibilities. The client will call the endpoints; you implement them.

## API contract this client will assume

Base URL from `VITE_API_URL` (e.g. `https://api.mysticlotus.com`). All protected routes send `Authorization: Bearer <jwt>`.

```
POST   /auth/login                  { email, password, remember } -> { token, admin }
POST   /auth/forgot-password        { email }
POST   /auth/logout
GET    /auth/me                     -> { admin }

GET    /admin/stats/overview        -> { totalUsers, totalHealers, totalSeekers, pendingVerifications, activeBookings, todaysSessions, monthlyRevenue, totalEvents, totalProducts, totalReviews }
GET    /admin/stats/revenue?range=  -> [{ date, revenue }]
GET    /admin/stats/users?range=    -> [{ date, users }]
GET    /admin/stats/bookings?range= -> [{ date, count }]
GET    /admin/stats/modalities/top  -> [{ name, count }]
GET    /admin/stats/healers/top     -> [{ id, name, bookings, rating }]
GET    /admin/activities/recent     -> [{ id, type, message, at }]

GET    /admin/users?search=&status=&page=&limit=
GET    /admin/users/:id
PATCH  /admin/users/:id             (edit)
POST   /admin/users/:id/block
POST   /admin/users/:id/suspend
DELETE /admin/users/:id

GET    /admin/healers?status=&search=&page=&limit=
GET    /admin/healers/:id
POST   /admin/healers/:id/approve
POST   /admin/healers/:id/reject     { reason }
POST   /admin/healers/:id/verify-documents
POST   /admin/healers/:id/suspend
GET    /admin/healers/:id/earnings

GET    /admin/bookings?status=&from=&to=&search=&page=&limit=
GET    /admin/bookings/:id
POST   /admin/bookings/:id/cancel
POST   /admin/bookings/:id/refund
```

If your Express API differs, the axios service layer is one file per module — easy to adapt.

## What ships in this build (Phase 1)

### Foundation
- TanStack Router shell with root layout
- Design system: teal `#0F766E` primary, `#14B8A6` secondary, `#F8FAFC` accent, glassmorphism cards, soft shadows, rounded, elegant type, subtle Framer Motion transitions
- Light + dark mode toggle (persisted in localStorage, read post-hydration)
- Axios instance with `VITE_API_URL`, JWT interceptor, 401 → redirect to /login
- TanStack Query wired for all data fetching (dedupe, caching, refetch)
- `useAuth` context: stores token in localStorage ("remember me") or sessionStorage; `getMe` on boot
- Protected `_authenticated` layout that redirects to `/login`
- Toast notifications (sonner)
- Reusable components: `DataTable` (search + filter + pagination + sort), `StatCard`, `ChartCard`, `PageHeader`, `ConfirmDialog`, `EmptyState`, `LoadingState`, `ErrorState`

### Auth
- `/login` — email, password, show/hide password, remember me, forgot password link, react-hook-form validation
- `/forgot-password` — email submit → success state
- Session expiry handling via 401 interceptor
- Logout button in sidebar

### Admin shell
- Collapsible sidebar (shadcn Sidebar) with all 15 nav items + Profile + Logout
- Topbar: search, notifications bell, dark mode toggle, admin avatar menu
- Responsive: sidebar becomes offcanvas on mobile

### Dashboard home (`/`)
- 10 real-time stat cards from `/admin/stats/overview`
- Recharts: Revenue Growth (area), User Growth (line), Booking Analytics (bar), Monthly Registrations (bar), Top Modalities (pie), Popular Healers (horizontal bar/list)
- Recent Activities feed
- All data via TanStack Query — zero hardcoded values

### Users management (`/users`)
- Table: search, status filter, pagination, sortable columns
- Row actions: View, Edit, Block, Suspend, Delete (with confirm)
- View profile drawer/page, Edit form (react-hook-form)

### Healers management (`/healers`)
- Tabs: All / Pending / Approved / Suspended
- Table with search + pagination
- Row actions: View, Approve, Reject (with reason), Verify Documents, Suspend
- Detail page: profile + documents + earnings summary

### Bookings management (`/bookings`)
- Filters: status, date range, search
- Table with pagination
- Detail drawer showing booking, payment status, refund status
- Actions: Cancel, Refund (with confirm)

### Stubbed routes (empty state pages, ready to build)
Events, Products, Categories, Modalities, Offers, Reviews, Revenue, Notifications, Reports, Settings, Profile — each is a real route with `PageHeader` + `EmptyState` saying "Coming soon" so nav works end-to-end.

## Technical notes

- **Routing**: TanStack Router file-based routing under `src/routes/`. `_authenticated/` layout gates admin pages.
- **Env var**: You set `VITE_API_URL` in Lovable project settings before it will call your API. Documented in a README.
- **CORS**: Your Express API must send `Access-Control-Allow-Origin` for the Lovable preview + published domains and `Access-Control-Allow-Headers: Authorization, Content-Type`.
- **JWT storage**: localStorage when "remember me" is checked, else sessionStorage. Read/written only client-side (post-hydration) per TanStack SSR rules.
- **No Supabase, no server functions, no secrets stored in Lovable** — this is a pure client.
- **Cloudinary uploads**: not needed in Phase 1 scope (no create-with-image screens in Users/Healers/Bookings). Added when Events/Products land.

## File structure

```
src/
  routes/
    __root.tsx
    index.tsx                     -> redirects to /login or /dashboard
    login.tsx
    forgot-password.tsx
    _authenticated.tsx            -> guard + admin shell (sidebar + topbar)
    _authenticated/
      dashboard.tsx
      users.tsx / users.$id.tsx
      healers.tsx / healers.$id.tsx
      bookings.tsx / bookings.$id.tsx
      events.tsx, products.tsx, categories.tsx, modalities.tsx,
      offers.tsx, reviews.tsx, revenue.tsx, notifications.tsx,
      reports.tsx, settings.tsx, profile.tsx        (stubs)
  components/
    admin/{AppSidebar, Topbar, StatCard, ChartCard, DataTable, PageHeader,
           ConfirmDialog, EmptyState, ThemeToggle, ...}
    ui/*                          (shadcn)
  lib/
    api.ts                        (axios instance + interceptors)
    auth-context.tsx
    query-client.ts
  services/
    auth.service.ts
    stats.service.ts
    users.service.ts
    healers.service.ts
    bookings.service.ts
  styles.css                      (teal design tokens, glass utilities)
```

## Out of scope for this plan (say the word to add later)
- Events / Products / Categories / Modalities / Offers / Reviews / Revenue / Notifications / Reports / Settings / Profile full CRUD
- Cloudinary upload widget integration
- Push notifications wiring
- Any backend, schema, or seeding SQL

Approve to build.
