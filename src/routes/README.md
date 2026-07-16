# Mystic Lotus & Dragonflies — Admin

Client-only admin dashboard. Talks to your external Express + Postgres backend.

## Configure the API URL

Set the env var in Lovable (Project Settings → Environment) or in a local `.env`:

```
VITE_API_URL=https://api.your-domain.com
```

Rebuild after changing. Requests are sent with `Authorization: Bearer <jwt>` when a token exists.

## Expected API contract

| Method | Path                                        | Purpose |
|--------|---------------------------------------------|---------|
| POST   | /auth/login                                 | `{ email, password, remember }` → `{ token, admin }` |
| POST   | /auth/forgot-password                       | `{ email }` |
| POST   | /auth/logout                                | invalidates server session |
| GET    | /auth/me                                    | `{ admin }` |
| GET    | /admin/stats/overview                       | homepage stat cards |
| GET    | /admin/stats/revenue?range=                 | `[{ date, revenue }]` |
| GET    | /admin/stats/users?range=&group=            | `[{ date, users\|count }]` |
| GET    | /admin/stats/bookings?range=                | `[{ date, count }]` |
| GET    | /admin/stats/modalities/top                 | `[{ name, count }]` |
| GET    | /admin/stats/healers/top                    | `[{ id, name, bookings, rating }]` |
| GET    | /admin/activities/recent                    | `[{ id, type, message, at }]` |
| GET    | /admin/users?search=&status=&role=&page=&limit= | paginated users |
| GET    | /admin/users/:id                            | single user |
| PATCH  | /admin/users/:id                            | edit |
| POST   | /admin/users/:id/block\|suspend             | actions |
| DELETE | /admin/users/:id                            | delete |
| GET    | /admin/healers?...                          | paginated healers |
| GET    | /admin/healers/:id                          | single healer |
| GET    | /admin/healers/:id/documents                | documents |
| GET    | /admin/healers/:id/earnings                 | earnings summary |
| POST   | /admin/healers/:id/approve                  | approve |
| POST   | /admin/healers/:id/reject                   | `{ reason }` |
| POST   | /admin/healers/:id/verify-documents         | mark docs verified |
| POST   | /admin/healers/:id/suspend                  | suspend |
| GET    | /admin/bookings?search=&status=&from=&to=&page=&limit= | paginated bookings |
| GET    | /admin/bookings/:id                         | single booking |
| POST   | /admin/bookings/:id/cancel                  | `{ reason? }` |
| POST   | /admin/bookings/:id/refund                  | issue refund |

Paginated responses are `{ data: T[], total, page, limit }`.

## CORS

Your Express app must send:

```
Access-Control-Allow-Origin: <preview & published origins>
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
```

## What's included (Phase 1)

- Login (email/password/remember/show-password) + forgot password + 401 auto-logout
- Collapsible sidebar with all 15 admin modules + Profile + Logout
- Dashboard home: 10 stat cards, 6 charts, recent activity feed
- Full pages: Users, Users detail/edit, Healers (tabs + approve/reject/verify/suspend), Healer detail, Bookings, Booking detail (cancel/refund)
- Stubbed modules ready to build: Seekers, Events, Products, Categories, Modalities, Offers, Reviews, Revenue, Notifications, Reports, Settings, Profile
- Light + dark mode, glassmorphism, teal palette, Framer Motion accents
