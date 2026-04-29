# FieldOps - Complete Field Service Management Platform

A full-stack field service management platform built with Node.js + Express backend and React + Vite frontend.

## Project Structure

```
FieldOps/
├── backend/              # Express.js REST API
│   ├── controllers/      # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation, error handling
│   ├── utils/           # JWT, Prisma, response helpers
│   ├── prisma/          # Database schema
│   ├── index.js         # Server entry point
│   └── package.json
│
└── frontend/            # React + Vite SPA
    ├── src/
    │   ├── api/         # API call functions
    │   ├── context/     # React Context (Auth)
    │   ├── hooks/       # Custom hooks
    │   ├── components/  # UI & layout components
    │   ├── pages/       # Page views
    │   ├── routes/      # Routing setup
    │   ├── App.jsx      # Root component
    │   └── main.jsx     # Entry point
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## Prerequisites

- **Node.js** 16+
- **PostgreSQL** 12+
- **npm** or **yarn**

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update DATABASE_URL in .env with your PostgreSQL connection
# Example: DATABASE_URL=postgresql://user:password@localhost:5432/fieldops

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start server (development)
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5000` (configured in vite.config.js, or any available port)

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes
- `POST /auth/register` - Register new client
- `POST /auth/login` - Login with email/password
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user
- `POST /auth/create-technician-admin` - Create technician/admin (admin only)

### Jobs Routes
- `GET /jobs` - List jobs (role-based filtering)
- `GET /jobs/summary` - Dashboard stats (admin only)
- `POST /jobs` - Create job (admin only)
- `PUT /jobs/:id/assign` - Assign to technician (admin only)
- `PUT /jobs/:id/status` - Update status
- `PUT /jobs/:id/notes` - Add note
- `DELETE /jobs/:id` - Delete job (soft delete, admin only)

### Users Routes
- `GET /users` - List users (admin only)
- `GET /users/:id` - Get user profile
- `POST /users` - Create user (admin only)
- `PUT /users/:id` - Update user

### Notifications Routes
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark as read

### Health Check
- `GET /health` - Server status (no auth required)

## Database Schema

### User
- id, email (unique), password (hashed), name, role (ADMIN/TECHNICIAN/CLIENT)
- isActive, createdAt, updatedAt

### Job
- id, title, description, status (PENDING/ASSIGNED/IN_PROGRESS/COMPLETED/CANCELLED)
- isActive, scheduledAt
- clientId, technicianId, createdById
- createdAt, updatedAt

### JobNote
- id, content, jobId, authorId, createdAt

### Notification
- id, message, isRead (default false)
- userId, jobId (optional), createdAt

## Role-Based Features

### Admin
- ✅ View all jobs
- ✅ Create jobs
- ✅ Assign jobs to technicians
- ✅ Cancel jobs
- ✅ Manage users
- ✅ View dashboard with statistics

### Technician
- ✅ View assigned jobs
- ✅ Update job status (IN_PROGRESS, COMPLETED)
- ✅ Add job notes
- ✅ View own profile

### Client
- ✅ View own jobs (read-only)
- ✅ Track job status
- ✅ Receive notifications

## Authentication

- Uses JWT tokens stored in **httpOnly cookies**
- 7-day expiration
- Automatic refresh handling
- 401 responses redirect to login
- All API calls require valid token (except /health and /auth/register, /auth/login)

## Frontend Pages

### Public
- `/login` - Login page

### Admin Routes (`/admin/*`)
- `/admin/dashboard` - Stats and recent jobs
- `/admin/jobs` - Job management
- `/admin/jobs/create` - Create new job
- `/admin/users` - User management

### Technician Routes (`/technician/*`)
- `/technician/jobs` - Assigned jobs list
- `/technician/jobs/:id` - Job detail with status update & notes

### Client Routes (`/client/*`)
- `/client/jobs` - Own jobs (read-only)

## Testing with Thunder Client

### 1. Register & Login
```
POST /api/auth/register
{
  "email": "client@example.com",
  "password": "password123",
  "name": "John Client"
}

POST /api/auth/login
{
  "email": "client@example.com",
  "password": "password123"
}
```

### 2. Create Admin (as Admin)
```
POST /api/auth/create-technician-admin
{
  "email": "admin@example.com",
  "password": "password123",
  "name": "Admin User",
  "role": "ADMIN"
}
```

### 3. Create Job (as Admin)
```
POST /api/jobs
{
  "title": "Fix HVAC",
  "description": "Air conditioning repair",
  "clientId": "<client-id>",
  "technicianId": "<tech-id>"
}
```

See **frontend/THUNDER_CLIENT_ROUTES.md** for complete testing guide.

## Tech Stack Details

### Backend
- **Node.js** with ES Modules
- **Express 5** - Web framework
- **Prisma** - ORM with PostgreSQL
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Joi** - Request validation
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Morgan** - HTTP logging
- **Express Rate Limiting** - API throttling

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool
- **React Router v6** - Client routing
- **Axios** - HTTP client
- **Tailwind CSS v3** - Styling (dark theme)
- **React Context** - State management

## Development

### Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/fieldops
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
```

### Useful Commands

**Backend**
```bash
npm run dev              # Start development server
npm run prisma:migrate  # Run database migrations
npm run prisma:generate # Generate Prisma client
npm start               # Production server
```

**Frontend**
```bash
npm run dev             # Start dev server with auto-reload
npm run build           # Build for production
npm run preview         # Preview production build
```

## Security Features

✅ httpOnly cookies for token storage
✅ Password hashing with bcrypt
✅ JWT with 7-day expiration
✅ Helmet for security headers
✅ CORS with credentials
✅ Rate limiting on auth endpoints
✅ Input validation with Joi
✅ SQL injection prevention (Prisma)
✅ Soft deletes for data safety
✅ Role-based access control

## Performance

- **Backend**: Express middleware optimization, query pagination
- **Frontend**: Code splitting, lazy loading, optimized re-renders
- **Database**: Indexed queries, efficient relationships

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Configure PostgreSQL for production
4. Enable HTTPS
5. Set secure CORS origin
6. Use environment-specific .env

### Frontend
1. Run `npm run build`
2. Deploy `dist/` folder to static hosting
3. Configure API URL for production
4. Enable gzip compression
5. Cache static assets

## Troubleshooting

### Backend Issues
- **401 Unauthorized**: Invalid or expired token
- **Database connection failed**: Check DATABASE_URL
- **Port already in use**: Change PORT in .env
- **Migration errors**: Run `npm run prisma:generate` first

### Frontend Issues
- **Blank page**: Check browser console for errors
- **API calls failing**: Verify backend is running at VITE_API_URL
- **Styling issues**: Clear browser cache
- **Login redirects to /login**: Check JWT_SECRET matches both apps

## Contributing

When adding features:
1. Add API endpoint in backend
2. Create API function in frontend
3. Add page or component
4. Update routes
5. Test thoroughly

## License

ISC

## Support

For issues or questions, check the logs:
- Backend: Server console output
- Frontend: Browser DevTools
- Database: PostgreSQL logs

---

**Next Steps:**
1. Set up PostgreSQL database
2. Run backend migrations
3. Start both servers
4. Visit `http://localhost:5000` (or frontend port)
5. Login with test credentials
