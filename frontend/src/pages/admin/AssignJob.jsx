import { useState, useEffect } from 'react'
import { getAllUsers } from '../../api/users.api'
import { assignJob } from '../../api/jobs.api'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Loader } from '../../components/ui/Loader'

export function AssignJobModal({ jobId, jobTitle, onClose, onSuccess, onError }) {
  const [technicians, setTechnicians] = useState([])
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await getAllUsers({ role: 'TECHNICIAN' })
        setTechnicians(response.data.data)
      } catch (err) {
        onError(err.response?.data?.message || 'Failed to fetch technicians')
      } finally {
        setLoading(false)
      }
    }

    fetchTechnicians()
  }, [onError])

  const handleAssign = async (e) => {
    e.preventDefault()
    if (!selectedTechnicianId) {
      onError('Please select a technician')
      return
    }

    setSubmitting(true)
    try {
      await assignJob(jobId, { technicianId: selectedTechnicianId })
      onSuccess()
    } catch (err) {
      onError(err.response?.data?.message || 'Failed to assign job')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={`Assign Job: ${jobTitle}`} onClose={onClose}>
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Technician
            </label>
            <select
              value={selectedTechnicianId}
              onChange={(e) => setSelectedTechnicianId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500"
              required
            >
              <option value="">Choose a technician...</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} ({tech.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitting}
            >
              Assign
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
