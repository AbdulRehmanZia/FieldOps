import { useState, useEffect } from 'react'
import { getAllJobs, deleteJob } from '../../api/jobs.api'
import { Layout } from '../../components/layout/Layout'
import { Loader } from '../../components/ui/Loader'
import { Table } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Toast } from '../../components/ui/Toast'
import { useNavigate } from 'react-router-dom'
import { AssignJobModal } from './AssignJob'

export function AdminJobs() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [assigningJob, setAssigningJob] = useState(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetchJobs()
  }, [statusFilter])

  const fetchJobs = async () => {
    setLoading(true)
    setError('')
    try {
      const params = statusFilter ? { status: statusFilter } : {}
      const response = await getAllJobs(params)
      setJobs(response.data.data)
      setPage(1)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    try {
      await deleteJob(id)
      setJobs(jobs.filter(j => j.id !== id))
      setSuccess('Job deleted successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job')
    }
  }

  const paginatedJobs = jobs.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  const totalPages = Math.ceil(jobs.length / itemsPerPage)

  if (loading) return <Layout><div className="p-6"><Loader /></div></Layout>

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Jobs</h1>
            <p className="text-gray-400 mt-1">Manage all service jobs</p>
          </div>
          <Button onClick={() => navigate('/admin/jobs/create')}>
            + Create Job
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 overflow-x-auto">
          {paginatedJobs.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No jobs found</p>
          ) : (
            <Table
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'client', label: 'Client', render: (row) => row.client?.name || 'N/A' },
                { key: 'technician', label: 'Technician', render: (row) => row.technician?.name || 'Unassigned' },
                { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} /> },
                { key: 'scheduledAt', label: 'Scheduled', render: (row) => row.scheduledAt ? new Date(row.scheduledAt).toLocaleDateString() : 'N/A' },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (row) => (
                    <div className="flex gap-2">
                      {!row.technicianId && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => setAssigningJob(row)}
                        >
                          Assign
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(row.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ),
                },
              ]}
              data={paginatedJobs}
            />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {assigningJob && (
        <AssignJobModal
          jobId={assigningJob.id}
          jobTitle={assigningJob.title}
          onClose={() => setAssigningJob(null)}
          onSuccess={() => {
            setSuccess('Job assigned successfully')
            setAssigningJob(null)
            fetchJobs()
            setTimeout(() => setSuccess(''), 3000)
          }}
          onError={(msg) => setError(msg)}
        />
      )}

      {success && <Toast message={success} type="success" />}
    </Layout>
  )
}
