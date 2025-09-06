import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

/**
 * Select dropdown component
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className = '', 
    label, 
    error, 
    hint, 
    options, 
    placeholder = 'בחר אפשרות',
    required,
    ...props 
  }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 mr-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
            block w-full rounded-md shadow-sm
            px-3 py-2
            border ${error ? 'border-red-500' : 'border-gray-300'}
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            disabled:bg-gray-50 disabled:text-gray-500
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hint && !error && (
          <p className="text-sm text-gray-500">{hint}</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
export default Select
