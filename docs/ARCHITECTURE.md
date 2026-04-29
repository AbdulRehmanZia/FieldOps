# FieldOps Architecture

## Backend (Express + Prisma)

- **Entry point**: `backend/index.js`
- **Routing**: `backend/src/routes/` composes route modules by domain (`auth`, `jobs`, `users`, `notifications`).
- **Controllers**: `backend/src/controllers/` contains resource-focused request handlers. Controllers call Prisma and emit consistent JSON responses via `utils/response.js`.
- **Middleware**: `backend/src/middleware/` includes auth, RBAC, validation, and error handling.
- **Data access**: `backend/src/utils/prisma.js` exports a singleton Prisma client.

## Auth & RBAC

- **Auth**: JWT stored in an httpOnly cookie.
- **Authorization**: Role checks enforced via RBAC middleware on protected endpoints.

## Notes on scope

This is intentionally a single-org (non multi-tenant) internal tool. Notification delivery is in-app only (database records) to avoid external service dependencies for the submission scope.

## System Design

FieldOps uses a classic SPA + API + database layout:

- The **client browser** loads the **React SPA**.
- The SPA calls the backend using **Axios** with `withCredentials: true` so the browser includes the httpOnly auth cookie on API requests.
- The **Express API** validates requests (auth, RBAC, validation) and routes them to controllers.
- Controllers use **Prisma** to query and mutate data.
- Prisma talks to **NeonDB PostgreSQL** (serverless Postgres).

ASCII flow:

```
Client Browser
   |
   v
React SPA (Vite)
   |
   v
Axios (withCredentials)
   |
   v
Express API (Node.js)
   |
   v
Prisma ORM
   |
   v
NeonDB PostgreSQL
```

## Database Design Rationale

- **Why PostgreSQL over MongoDB**: the domain is naturally relational (jobs belong to users; notes belong to jobs; notifications reference users/jobs). Modeling this with foreign keys and joins is straightforward and enforces consistency.
- **Why `cuid()` over uuid/autoincrement**: `cuid()` is URL-safe and non-sequential, avoiding easy ID enumeration that comes with autoincrement. It also keeps IDs opaque for an internal tool without coordinating sequences.
- **Key relationships**: `User` participates in `Job` in three distinct ways (creator, technician, client). This is implemented as **three named relations** so Prisma can distinguish them without ambiguity.
- **Soft deletes via `isActive` on `Job`**: jobs are never hard-deleted; `isActive = false` hides them from normal queries while preserving history and referential integrity for related `JobNote` and `Notification` records.

## What Was Deliberately Not Built

1. **Refresh token rotation** — httpOnly cookie with 7d expiry is acceptable for internal tooling. Refresh tokens add complexity (rotation, revocation list) that exceeds the scope.
2. **WebSocket notifications** — polling every 30s is sufficient for this domain. Real-time push would require Socket.io and session affinity on the server.
3. **Email delivery** — nodemailer is installed but unused. In-app DB notifications satisfy the requirement without SMTP config or async queue infrastructure.

## Security Considerations

- **httpOnly cookies** prevent XSS token theft
- **Helmet** sets secure response headers
- **Rate limiting** on `/api/auth` (15 req/15min) prevents brute force
- **Prisma parameterized queries** prevent SQL injection
- **Bcrypt** with default salt rounds for password hashing

