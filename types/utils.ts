/**
 * Utility types used throughout the application
 */

// Form validation types
export type FormErrors<T = any> = Partial<Record<keyof T, string>>

export interface ValidationResult {
  isValid: boolean
  errors: FormErrors
  warnings?: string[]
}

export interface ValidationRule<T = any> {
  field: keyof T
  validate: (value: any, data?: T) => boolean | string
  message?: string
}

// File upload types
export interface FileUploadConfig {
  maxSize: number
  acceptedFormats: string[]
  maxFiles?: number
  minFiles?: number
}

export interface FileUploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
  file?: File
}

// Route types
export interface RouteParams {
  [key: string]: string | string[] | undefined
}

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

// Async state types
export interface AsyncState<T = any> {
  data: T | null
  loading: boolean
  error: Error | null
}

export interface MutationState<T = any> {
  data: T | null
  loading: boolean
  error: Error | null
  mutate: (...args: any[]) => Promise<T>
  reset: () => void
}

// Table types
export interface TableColumn<T = any> {
  key: keyof T | string
  label: string
  sortable?: boolean
  width?: string | number
  render?: (value: any, row: T) => React.ReactNode
}

export interface TableAction<T = any> {
  label: string
  icon?: React.ReactNode
  onClick: (row: T) => void
  show?: (row: T) => boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

// Filter types
export interface FilterOption {
  value: string | number
  label: string
  count?: number
}

export interface FilterConfig {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'date' | 'range' | 'checkbox'
  options?: FilterOption[]
  placeholder?: string
  min?: number
  max?: number
}

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Modal types
export interface ModalConfig {
  isOpen: boolean
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
}

// Theme types
export interface ThemeColors {
  primary: string
  secondary: string
  success: string
  danger: string
  warning: string
  info: string
  light: string
  dark: string
}

export interface ThemeConfig {
  colors: ThemeColors
  fonts: {
    body: string
    heading: string
    mono: string
  }
  breakpoints: {
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
  }
}

// Date types
export type DateRange = {
  from: Date | null
  to: Date | null
}

export type DateFormat = 'short' | 'medium' | 'long' | 'full'

// Utility helper types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

export type ValueOf<T> = T[keyof T]

export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

// Function types
export type AsyncFunction<T = any, R = any> = (...args: T[]) => Promise<R>
export type VoidFunction = () => void
export type Callback<T = any> = (value: T) => void

// React specific types
export type PropsWithClassName<P = {}> = P & {
  className?: string
}

export type PropsWithChildren<P = {}> = P & {
  children?: React.ReactNode
}
