import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

/**
 * Card container component for content sections
 */
export default function Card({ 
  className = '', 
  hover = false, 
  padding = 'md',
  children, 
  ...props 
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }
  
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        ${hover ? 'transition-shadow hover:shadow-lg' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card header component
 */
export function CardHeader({ 
  className = '', 
  children, 
  ...props 
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={`border-b border-gray-200 pb-3 mb-4 ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card title component
 */
export function CardTitle({ 
  className = '', 
  children, 
  ...props 
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 
      className={`text-lg font-semibold text-gray-900 ${className}`} 
      {...props}
    >
      {children}
    </h3>
  )
}

/**
 * Card content component
 */
export function CardContent({ 
  className = '', 
  children, 
  ...props 
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-gray-600 ${className}`} {...props}>
      {children}
    </div>
  )
}
