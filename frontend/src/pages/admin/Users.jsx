import { useState, useEffect } from 'react'
import { getAllUsers } from '../../api/users.api'
import { Layout } from '../../components/layout/Layout'
import { Loader } from '../../components/ui/Loader'
import { Table } from '../../components/ui/Table'
import { Button } from '../../components/ui/Button'
import { useNavigate } from 'react-router-dom'

export function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [roleFilter])

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const params = roleFilter ? { role: roleFilter } : {}
      const response = await getAllUsers(params)
      setUsers(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Layout><div className="p-6"><Loader /></div></Layout>

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Users</h1>
            <p className="text-gray-400 mt-1">Manage platform users</p>
          </div>
          <Button onClick={() => navigate('/admin/users/create')}>
            + Create User
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="CLIENT">Client</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 overflow-x-auto">
          {users.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No users found</p>
          ) : (
            <Table
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'role', label: 'Role', render: (row) => (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    row.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                    row.role === 'TECHNICIAN' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {row.role}
                  </span>
                )},
                { key: 'createdAt', label: 'Joined', render: (row) => new Date(row.createdAt).toLocaleDateString() },
              ]}
              data={users}
            />
          )}
        </div>
      </div>
    </Layout>
  )
}
