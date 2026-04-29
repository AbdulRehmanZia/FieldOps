export function Badge({ status }) {
  const statusColors = {
    PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
    ASSIGNED: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
    IN_PROGRESS: 'bg-purple-500/20 text-purple-400 border-purple-400/30',
    COMPLETED: 'bg-green-500/20 text-green-400 border-green-400/30',
    CANCELLED: 'bg-red-500/20 text-red-400 border-red-400/30',
  }

  const color = statusColors[status] || 'bg-gray-500/20 text-gray-400 border-gray-400/30'

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${color}`}>
      {status}
    </span>
  )
}
