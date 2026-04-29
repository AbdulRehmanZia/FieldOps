import { useState, useEffect } from 'react'
import { getJobSummary, getAllJobs } from '../../api/jobs.api'
import { Layout } from '../../components/layout/Layout'
import { Loader } from '../../components/ui/Loader'
import { Table } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'

export function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const [summaryRes, jobsRes] = await Promise.all([
          getJobSummary(),
          getAllJobs(),
        ])
        setSummary(summaryRes.data.data)
        setRecentJobs(jobsRes.data.data.slice(0, 5))
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <Layout><div className="p-6"><Loader /></div></Layout>

  const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome to FieldOps Admin Dashboard</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              label="Total Jobs"
              value={summary.totalJobs}
              color="bg-blue-500/20"
            />
            <StatCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Pending"
              value={summary.pendingJobs}
              color="bg-yellow-500/20"
            />
            <StatCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              label="Assigned"
              value={summary.assignedJobs}
              color="bg-blue-500/20"
            />
            <StatCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              label="In Progress"
              value={summary.inProgressJobs}
              color="bg-purple-500/20"
            />
            <StatCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Completed"
              value={summary.completedJobs}
              color="bg-green-500/20"
            />
            <StatCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
              label="Cancelled"
              value={summary.cancelledJobs}
              color="bg-red-500/20"
            />
          </div>
        )}

        {/* User Stats */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              label="Total Technicians"
              value={summary.totalTechnicians}
              color="bg-cyan-500/20"
            />
            <StatCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 6a3 3 0 11-6 0 3 3 0 016 0zM6 20a6 6 0 0112 0v2H0v-2a6 6 0 016-6z" /></svg>}
              label="Total Clients"
              value={summary.totalClients}
              color="bg-indigo-500/20"
            />
          </div>
        )}

        {/* Recent Jobs */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Jobs</h2>
          {recentJobs.length === 0 ? (
            <p className="text-gray-400">No jobs yet</p>
          ) : (
            <Table
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'client', label: 'Client', render: (row) => row.client?.name || 'N/A' },
                { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} /> },
                { key: 'createdAt', label: 'Created', render: (row) => new Date(row.createdAt).toLocaleDateString() },
              ]}
              data={recentJobs}
            />
          )}
        </div>
      </div>
    </Layout>
  )
}
