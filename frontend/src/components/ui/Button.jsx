export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  const baseClass = 'rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeClass = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size]

  const variantClass = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'border border-gray-600 hover:bg-gray-800 text-white',
  }[variant]

  return (
    <button
      className={`${baseClass} ${sizeClass} ${variantClass} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
