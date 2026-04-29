export function Toast({ message, type = 'success', onClose }) {
  return (
    <div
      className={`
        fixed bottom-6 right-6 px-6 py-3 rounded-lg text-white font-medium
        shadow-lg z-50 animate-pulse
        ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}
      `}
    >
      {message}
    </div>
  )
}
