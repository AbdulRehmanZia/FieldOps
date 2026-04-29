import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ProtectedRoute } from './ProtectedRoute'

// Auth
import { Login } from '../pages/auth/Login'
import { Register } from '../pages/auth/Register'

// Admin
import { AdminDashboard } from '../pages/admin/Dashboard'
import { AdminJobs } from '../pages/admin/Jobs'
import { CreateJob } from '../pages/admin/CreateJob'
import { AdminUsers } from '../pages/admin/Users'
import { CreateUser } from '../pages/admin/CreateUser'

// Technician
import { TechnicianJobs } from '../pages/technician/MyJobs'
import { TechnicianJobDetail } from '../pages/technician/JobDetail'

// Client
import { ClientJobs } from '../pages/client/MyJobs'

export function AppRouter() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Root redirect */}
        <Route
          path="/"
          element={
            user ? (
              user.role === 'ADMIN' ? <Navigate to="/admin/dashboard" replace /> :
              user.role === 'TECHNICIAN' ? <Navigate to="/technician/jobs" replace /> :
              <Navigate to="/client/jobs" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/create"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/create"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <CreateUser />
            </ProtectedRoute>
          }
        />

        {/* Technician Routes */}
        <Route
          path="/technician/jobs"
          element={
            <ProtectedRoute requiredRole="TECHNICIAN">
              <TechnicianJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/jobs/:id"
          element={
            <ProtectedRoute requiredRole="TECHNICIAN">
              <TechnicianJobDetail />
            </ProtectedRoute>
          }
        />

        {/* Client Routes */}
        <Route
          path="/client/jobs"
          element={
            <ProtectedRoute requiredRole="CLIENT">
              <ClientJobs />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
