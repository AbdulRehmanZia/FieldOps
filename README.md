# FieldOps — Field Service Management Platform

## Overview
FieldOps is an internal field service management platform for a company managing
field technicians who visit client sites for repairs, inspections, and installations.
It provides job lifecycle management, role-based access, and in-app notifications.

## Tech Stack
| Layer | Technology | Justification |
|-------|-----------|---------------|
| Runtime | Node.js (ESM) | Team familiarity + async I/O fits API workloads |
| Framework | Express 5 | Minimal, unopinionated, production-proven |
| ORM | Prisma + PostgreSQL | Type-safe queries, clean migrations, relational data fits domain |
| Database | PostgreSQL | Relational data fits the domain; works locally or hosted |
| Auth | JWT in httpOnly cookie | XSS-safe, stateless, no extra infra |
| Frontend | React 18 + Vite | Fast DX, component model fits dashboard UIs |
| Styling | Tailwind CSS v3 | Utility-first, no design system overhead |
| HTTP | Axios | Interceptors for auth errors, consistent API layer |
| Routing | React Router v6 | Industry standard, nested route support |

## Prerequisites
- Node.js v18+
- npm
- PostgreSQL instance (local or hosted)

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repo-url>
cd FieldOps
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET
npx prisma generate
npx prisma db push
npm run dev
# Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm run dev
# Runs on http://localhost:5173
```

## Environment Variables

### Backend — .env.example
```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=change_this_to_a_long_random_string
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend — .env.example
```
VITE_API_URL=http://localhost:5000/api
```

## API Reference

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | /health | No | Any | Health check |
| POST | /api/auth/register | No | — | Register as CLIENT |
| POST | /api/auth/login | No | — | Login, sets cookie |
| POST | /api/auth/logout | Yes | Any | Clear cookie |
| GET | /api/auth/me | Yes | Any | Current user |
| POST | /api/auth/create-technician-admin | Yes | Admin | Create staff accounts |
| GET | /api/jobs | Yes | All | Role-filtered job list |
| GET | /api/jobs/summary | Yes | Admin | Dashboard stats |
| POST | /api/jobs | Yes | Admin | Create job |
| PUT | /api/jobs/:id/assign | Yes | Admin | Assign technician |
| PUT | /api/jobs/:id/status | Yes | Admin/Tech | Update status |
| PUT | /api/jobs/:id/notes | Yes | Admin/Tech | Add note |
| DELETE | /api/jobs/:id | Yes | Admin | Soft delete |
| GET | /api/users | Yes | Admin | List users |
| GET | /api/users/:id | Yes | Admin/Own | Get profile |
| POST | /api/users | Yes | Admin | Create user |
| PUT | /api/users/:id | Yes | Admin/Own | Update user |
| GET | /api/notifications | Yes | Any | Own notifications |
| PUT | /api/notifications/:id/read | Yes | Any | Mark read |

## Role Permissions

| Action | Admin | Technician | Client |
|--------|-------|-----------|--------|
| Create job | ✅ | ❌ | ❌ |
| View all jobs | ✅ | ❌ | ❌ |
| View assigned jobs | ✅ | ✅ | ❌ |
| View own jobs | ✅ | ✅ | ✅ |
| Assign technician | ✅ | ❌ | ❌ |
| Update status (any) | ✅ | ❌ | ❌ |
| Update status (IN_PROGRESS/COMPLETED) | ✅ | ✅ own only | ❌ |
| Add notes | ✅ | ✅ own jobs | ❌ |
| Delete job (soft) | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| View dashboard | ✅ | ❌ | ❌ |

## Assumptions & Decisions

1. **Registration is open but role-locked** — anyone can register and defaults to CLIENT. Only an ADMIN can create TECHNICIAN or ADMIN accounts via a protected endpoint. This mirrors real-world invite patterns without requiring a full invite system.

2. **Notifications are in-app (database-stored)** — Email was considered but skipped. An in-app notification record achieves the core requirement (relevant parties are informed) without external service dependencies, SMTP config, or async queue complexity. With more time, a BullMQ queue + nodemailer would be added.

3. **Soft deletes on jobs** — Jobs are never hard-deleted. isActive = false hides them from normal queries. This preserves history and prevents orphaned references in JobNote and Notification tables.

4. **JWT in httpOnly cookie, no refresh token** — Reduces XSS risk vs localStorage. 7-day expiry is acceptable for an internal business tool. Refresh token rotation was omitted as a deliberate trade-off for scope.

5. **Job reassignment is always allowed by Admin** — Unless status is COMPLETED or CANCELLED. No reassignment history is tracked (trade-off — documented in What's Missing).

6. **Technicians can only move status forward** — They can set IN_PROGRESS or COMPLETED on their own assigned jobs. They cannot cancel, reassign, or revert.

7. **Single-company system** — No multi-tenancy. All data is scoped within one organization. A future version would add a Company/Organization model.

## Trade-offs Accepted

| Decision | What was traded off |
|----------|-------------------|
| In-app notifications only | No email alerts; acceptable for internal tool |
| No refresh tokens | Slightly worse security UX vs longer sessions |
| useState for forms | Less validation power vs react-hook-form + Zod |
| No Docker | Manual setup required vs one-command startup |
| No audit log | Cannot reconstruct "who changed what" timeline |
| Polling for notifications (30s) | More server load vs WebSocket real-time push |

## What's Missing

- Docker + docker-compose for single-command startup
- Email notifications via nodemailer + job queue (BullMQ)
- Refresh token rotation
- Full audit log (who changed what, when)
- Job activity timeline (chronological history)
- Scheduling conflict detection (prevent double-booking technicians)
- Forgot password / reset flow
- Unit and integration tests
- Pagination on users and notifications endpoints
- Job photo attachments

## Testing the API

Import `/docs/thunder-collection.json` in the Thunder Client VS Code extension
to test all endpoints with pre-configured requests.

Quick test flow:
1. POST /api/auth/register — create a client
2. POST /api/auth/login — get cookie set
3. POST /api/auth/create-technician-admin — create admin (must be logged in as admin first — seed one manually via Prisma Studio: npx prisma studio)
4. POST /api/jobs — create a job
5. PUT /api/jobs/:id/assign — assign it
6. GET /api/jobs/summary — check dashboard stats

## Project Structure
```
FieldOps/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── routes/
│   ├── .env.example
│   └── package.json
├── docs/
│   └── ARCHITECTURE.md
├── README.md
└── QUESTIONS.md
```

