import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (path) => location.pathname === path

  const navItems = {
    ADMIN: [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'Jobs', path: '/admin/jobs' },
      { label: 'Users', path: '/admin/users' },
    ],
    TECHNICIAN: [
      { label: 'My Jobs', path: '/technician/jobs' },
    ],
    CLIENT: [
      { label: 'My Jobs', path: '/client/jobs' },
    ],
  }

  const items = navItems[user?.role] || []

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
      <nav className="p-6">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              block px-4 py-3 rounded-lg mb-2 transition-colors
              ${isActive(item.path)
                ? 'bg-blue-600 text-white font-medium'
                : 'text-gray-400 hover:bg-gray-700'
              }
            `}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
