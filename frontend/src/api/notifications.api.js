import api from './axios'

export const getNotifications = () => api.get('/notifications')

export const markNotificationAsRead = (id) => api.put(`/notifications/${id}/read`)
