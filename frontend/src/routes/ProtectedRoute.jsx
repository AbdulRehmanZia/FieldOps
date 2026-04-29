import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loader } from '../components/ui/Loader'

export function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader /></div>

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Unauthorized</h1>
          <p className="text-gray-400">You do not have permission to access this page</p>
        </div>
      </div>
    )
  }

  return children
}
