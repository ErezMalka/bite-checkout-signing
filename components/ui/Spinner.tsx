interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray'
  className?: string
}

/**
 * Loading spinner component
 */
export default function Spinner({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }
  
  const colorClasses = {
    primary: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600',
  }
  
  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`
          animate-spin rounded-full
          border-2 border-solid border-current border-r-transparent
          ${sizeClasses[size]}
          ${colorClasses[color]}
        `}
        role="status"
      >
        <span className="sr-only">טוען...</span>
      </div>
    </div>
  )
}

/**
 * Full page loading overlay
 */
export function LoadingOverlay({ message = 'טוען...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  )
}

/**
 * Skeleton loader for content placeholders
 */
export function Skeleton({ 
  className = '',
  variant = 'text'
}: { 
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  }
  
  return (
    <div 
      className={`
        animate-pulse bg-gray-200
        ${variantClasses[variant]}
        ${className}
      `}
    />
  )
}
