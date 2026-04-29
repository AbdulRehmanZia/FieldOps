import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllJobs } from '../../api/jobs.api'
import { Layout } from '../../components/layout/Layout'
import { Loader } from '../../components/ui/Loader'
import { Table } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'

export function TechnicianJobs() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [user])

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
          <p className="text-gray-400 mt-1">Manage your assigned jobs</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 overflow-x-auto">
          {jobs.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No jobs assigned</p>
          ) : (
            <Table
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'client', label: 'Client', render: (row) => row.client?.name || 'N/A' },
                { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} /> },
                { key: 'scheduledAt', label: 'Scheduled', render: (row) => row.scheduledAt ? new Date(row.scheduledAt).toLocaleDateString() : 'N/A' },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (row) => (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate(`/technician/jobs/${row.id}`)}
                    >
                      View Details
                    </Button>
                  ),
                },
              ]}
              data={jobs}
            />
          )}
        </div>
      </div>
    </Layout>
  )
}
