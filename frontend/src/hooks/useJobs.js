import { useState, useEffect } from 'react'
import * as jobsApi from '../api/jobs.api'

export function useJobs(params = {}) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await jobsApi.getAllJobs(params)
        setJobs(response.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch jobs')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [params])

  return { jobs, loading, error }
}
