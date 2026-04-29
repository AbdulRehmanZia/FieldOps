# FieldOps Frontend

A complete React + Vite frontend for the Field Service Management Platform with Tailwind CSS, React Router, and Context API.

## Tech Stack

- **Vite 5** - Build tool and dev server
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS v3** - Styling (dark theme only)
- **React Context** - State management (no Redux)

## Features

- **Dark theme** design with consistent styling
- **Role-based routing** (Admin, Technician, Client)
- **Real-time notifications** with 30-second polling
- **Job management** with status tracking
- **User management** (Admin only)
- **Authentication** with httpOnly cookie support
- **Responsive design** - works on desktop and tablet

## Setup

### Prerequisites

- Node.js 16+
- Backend running on `http://localhost:5000`

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

Default .env:
```
VITE_API_URL=http://localhost:5000/api
```

### Running the App

**Development mode:**
```bash
npm run dev
```
Opens at `http://localhost:5000` (configured in vite.config.js)

**Production build:**
```bash
npm run build
npm run preview
```

## File Structure

```
frontend/
  src/
    api/                      # API call functions
      axios.js                # Base axios instance with interceptors
      auth.api.js
      jobs.api.js
      users.api.js
      notifications.api.js
    
    context/
      AuthContext.jsx         # Authentication state & methods
    
    hooks/
      useAuth.js              # Auth hook
      useJobs.js              # Jobs data hook
    
    components/
      ui/
        Button.jsx            # Primary, danger, ghost variants
        Input.jsx             # Form input with validation
        Badge.jsx             # Job status badge (colored)
        Modal.jsx             # Reusable modal component
        Loader.jsx            # Loading spinner
        Table.jsx             # Data table with pagination
        Toast.jsx             # Success/error notifications
      
      layout/
        Navbar.jsx            # Top navigation with notifications
        Sidebar.jsx           # Role-based navigation menu
        Layout.jsx            # Wrapper with Navbar + Sidebar
    
    pages/
      auth/
        Login.jsx             # Login with email & password
      
      admin/
        Dashboard.jsx         # Stats cards & recent jobs
        Jobs.jsx              # Job listing with filters
        CreateJob.jsx         # Job creation form
        AssignJob.jsx         # Assign technician modal
        Users.jsx             # User management
      
      technician/
        MyJobs.jsx            # Assigned jobs table
        JobDetail.jsx         # Job detail with status/notes
      
      client/
        MyJobs.jsx            # Client view (read-only)
    
    routes/
      AppRouter.jsx           # All routes with role checks
      ProtectedRoute.jsx      # Auth guard component
    
    App.jsx                   # Root component with providers
    main.jsx                  # Vite entry point
    index.css                 # Tailwind imports & globals
  
  vite.config.js
  tailwind.config.js
  postcss.config.js
  index.html
```

## Authentication Flow

1. **Login** → POST /api/auth/login
2. **Cookie stored** → httpOnly cookie (automatic)
3. **AuthContext updated** → User stored in localStorage
4. **Auto-redirect** → Based on role
5. **Protected routes** → ProtectedRoute checks auth + role
6. **Logout** → Clear cookie + context

## API Integration

All API calls use a configured axios instance with:
- ✅ `withCredentials: true` (for httpOnly cookies)
- ✅ 401 interceptor (redirects to /login)
- ✅ Base URL from environment variables

Example:
```javascript
const response = await getAllJobs({ status: 'PENDING' })
const jobs = response.data.data
```

## Styling

- **Colors**: Dark theme (gray-950 background, gray-800 cards)
- **Buttons**: Primary (blue), Danger (red), Ghost (border)
- **Jobs Badge**: Colored by status (yellow, blue, purple, green, red)
- **Tables**: Striped rows with hover effect
- **Modals**: Centered with backdrop blur

## Components API

### Button
```jsx
<Button 
  variant="primary|danger|ghost"
  size="sm|md|lg"
  loading={true}
  disabled={false}
  onClick={() => {}}
>
  Click me
</Button>
```

### Input
```jsx
<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  error="Error message"
  value={state}
  onChange={handler}
/>
```

### Badge
```jsx
<Badge status="PENDING|ASSIGNED|IN_PROGRESS|COMPLETED|CANCELLED" />
```

### Modal
```jsx
<Modal title="My Modal" onClose={handleClose}>
  <p>Modal content</p>
</Modal>
```

### Table
```jsx
<Table
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', render: (row) => <strong>{row.email}</strong> },
  ]}
  data={items}
/>
```

## Hooks

### useAuth
```javascript
const { user, loading, login, logout } = useAuth()
```

### useJobs
```javascript
const { jobs, loading, error } = useJobs({ status: 'PENDING' })
```

## Form Handling

All forms use `useState` (no react-hook-form):
```javascript
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)

const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    await loginUser({ email, password })
  } catch (err) {
    setError(err.response?.data?.message)
  } finally {
    setLoading(false)
  }
}
```

## Role-Based Pages

### Admin (`/admin/*`)
- Dashboard with stats
- Jobs management (create, assign, delete)
- User management
- Job summary reports

### Technician (`/technician/*`)
- View assigned jobs
- Update job status (IN_PROGRESS, COMPLETED)
- Add job notes
- View job details

### Client (`/client/*`)
- View own jobs (read-only)
- Track job status
- See technician info when assigned

## Error Handling

All pages show:
- ❌ Error messages in red boxes
- ✅ Success toasts (bottom-right, auto-dismiss 3s)
- ⏳ Loaders for async operations
- 📝 Validation errors on form fields

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance

- Light bundle: ~150KB (gzipped)
- Code splitting by routes
- Lazy component loading
- Optimized re-renders with proper dependencies
- Notifications poll every 30 seconds

## Development Notes

- No TypeScript - plain JSX only
- No UI component libraries - custom components only
- Inline SVG icons - no icon library
- Tailwind utility classes - no CSS files
- All components are functional with hooks
- Single context for auth state
