import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAllJobs, updateJobStatus, addJobNote } from '../../api/jobs.api'
import { Layout } from '../../components/layout/Layout'
import { Loader } from '../../components/ui/Loader'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Toast } from '../../components/ui/Toast'

export function TechnicianJobDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getAllJobs()
      const foundJob = response.data.data.find(j => j.id === id)
      if (!foundJob) {
        setError('Job not found')
        return
      }
      setJob(foundJob)
      setNewStatus(foundJob.status)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (e) => {
    e.preventDefault()
    if (!newStatus) return
    setSubmitting(true)
    try {
      await updateJobStatus(id, { status: newStatus })
      setSuccess('Job status updated successfully')
      fetchJob()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!noteContent.trim()) return
    setSubmitting(true)
    try {
      await addJobNote(id, { content: noteContent })
      setSuccess('Note added successfully')
      setNoteContent('')
      fetchJob()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add note')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Layout><div className="p-6"><Loader /></div></Layout>
  if (error) return <Layout><div className="p-6 text-red-400">{error}</div></Layout>
  if (!job) return <Layout><div className="p-6 text-gray-400">Job not found</div></Layout>

  return (
    <Layout>
      <div className="p-6 max-w-4xl space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          ← Back
        </button>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Job Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{job.title}</h1>
              <p className="text-gray-400 mt-2">{job.description}</p>
            </div>
            <Badge status={job.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-gray-400 text-sm">Client</p>
              <p className="text-white font-medium">{job.client?.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Scheduled At</p>
              <p className="text-white font-medium">
                {job.scheduledAt ? new Date(job.scheduledAt).toLocaleString() : 'Not scheduled'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Created By</p>
              <p className="text-white font-medium">{job.createdBy?.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Created At</p>
              <p className="text-white font-medium">{new Date(job.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Update Status</h2>
          <form onSubmit={handleStatusUpdate} className="flex gap-4">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500"
            >
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <Button
              type="submit"
              loading={submitting}
            >
              Update
            </Button>
          </form>
        </div>

        {/* Notes Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Job Notes</h2>

          {/* Existing Notes */}
          <div className="space-y-3 mb-6">
            {job.notes && job.notes.length > 0 ? (
              job.notes.map((note) => (
                <div key={note.id} className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-white">{note.author?.name}</p>
                    <p className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="text-gray-300">{note.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No notes yet</p>
            )}
          </div>

          {/* Add Note */}
          <form onSubmit={handleAddNote} className="space-y-3 border-t border-gray-700 pt-4">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Add a note..."
              rows="3"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
            <Button
              type="submit"
              loading={submitting}
            >
              Add Note
            </Button>
          </form>
        </div>
      </div>

      {success && <Toast message={success} type="success" />}
    </Layout>
  )
}
