import { useState, useEffect } from 'react'
import { getAllJobs } from '../../api/jobs.api'
import { Layout } from '../../components/layout/Layout'
import { Loader } from '../../components/ui/Loader'
import { Table } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'

export function ClientJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getAllJobs()
      setJobs(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Layout><div className="p-6"><Loader /></div></Layout>

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">My Jobs</h1>
          <p className="text-gray-400 mt-1">View your service requests</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 overflow-x-auto">
          {jobs.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No jobs yet</p>
          ) : (
            <Table
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'description', label: 'Description', render: (row) => row.description.substring(0, 50) + '...' },
                { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} /> },
                { key: 'technician', label: 'Assigned To', render: (row) => row.technician?.name || 'Pending' },
                { key: 'scheduledAt', label: 'Scheduled', render: (row) => row.scheduledAt ? new Date(row.scheduledAt).toLocaleDateString() : 'N/A' },
                { key: 'createdAt', label: 'Created', render: (row) => new Date(row.createdAt).toLocaleDateString() },
              ]}
              data={jobs}
            />
          )}
        </div>
      </div>
    </Layout>
  )
}
