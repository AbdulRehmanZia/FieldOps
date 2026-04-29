import api from './axios'

export const getAllJobs = (params) => api.get('/jobs', { params })

export const getJobSummary = () => api.get('/jobs/summary')

export const createJob = (data) => api.post('/jobs', data)

export const assignJob = (id, data) => api.put(`/jobs/${id}/assign`, data)

export const updateJobStatus = (id, data) => api.put(`/jobs/${id}/status`, data)

export const addJobNote = (id, data) => api.put(`/jobs/${id}/notes`, data)

export const deleteJob = (id) => api.delete(`/jobs/${id}`)
