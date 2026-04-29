import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllUsers } from '../../api/users.api'
import { createJob } from '../../api/jobs.api'
import { Layout } from '../../components/layout/Layout'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Toast } from '../../components/ui/Toast'
import { Loader } from '../../components/ui/Loader'

export function CreateJob() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    clientId: '',
    technicianId: '',
    scheduledAt: '',
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [clientsRes, techniciansRes] = await Promise.all([
          getAllUsers({ role: 'CLIENT' }),
          getAllUsers({ role: 'TECHNICIAN' }),
        ])
        setClients(clientsRes.data.data)
        setTechnicians(techniciansRes.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const data = {
        title: form.title,
        description: form.description,
        clientId: form.clientId,
        ...(form.technicianId && { technicianId: form.technicianId }),
        ...(form.scheduledAt && { scheduledAt: form.scheduledAt }),
      }
      await createJob(data)
      setSuccess('Job created successfully!')
      setTimeout(() => navigate('/admin/jobs'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Layout><div className="p-6"><Loader /></div></Layout>

  return (
    <Layout>
      <div className="p-6 max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-4">Create New Job</h1>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Job Title"
              placeholder="e.g., Fix HVAC System"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the job details..."
                rows="4"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Client *
              </label>
              <select
                name="clientId"
                value={form.clientId}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500"
                required
              >
                <option value="">Select a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Technician (Optional)
              </label>
              <select
                name="technicianId"
                value={form.technicianId}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500"
              >
                <option value="">Assign later...</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name} ({tech.email})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Scheduled Date (Optional)"
              type="datetime-local"
              name="scheduledAt"
              value={form.scheduledAt}
              onChange={handleChange}
            />

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/admin/jobs')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={submitting}
              >
                Create Job
              </Button>
            </div>
          </form>
        </div>
      </div>

      {success && <Toast message={success} type="success" />}
    </Layout>
  )
}
