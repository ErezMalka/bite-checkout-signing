/**
 * Component prop types
 * Define all component interfaces in one place
 */

import { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, HTMLAttributes } from 'react'
import { Product, ProductImage, CartItem, CustomerInfo } from './models'
import { ImageMode, PaymentMethod, InstallmentOption } from './enums'

// UI Component Props
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export interface TextareaProps extends HTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  rows?: number
}

export interface SelectOption {
  value: string | number
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray'
  className?: string
}

// Feature Component Props
export interface ProductCardProps {
  product: Product & {
    images?: ProductImage[]
  }
  onAddToCart?: (productId: string, quantity: number) => void
  showActions?: boolean
}

export interface ImageUploaderProps {
  productId: string
  mode: ImageMode
  existingImages?: ProductImage[]
  onUploadComplete?: () => void
  maxFiles?: number
  maxSize?: number
}

export interface CheckoutProps {
  cartItems: CartItem[]
  onCartUpdate?: (items: CartItem[]) => void
  onSubmit?: (customer: CustomerInfo, order: any) => Promise<void>
}

// Layout Component Props
export interface NavbarProps {
  user?: {
    email: string
    role?: string
  }
  onLogout?: () => void
}

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  items: SidebarItem[]
}

export interface SidebarItem {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
  children?: SidebarItem[]
}

export interface FooterProps {
  showLinks?: boolean
  showSocial?: boolean
}

// Modal Component Props
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  children: React.ReactNode
}

export interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  variant?: 'danger' | 'warning' | 'info'
}

// Form Component Props
export interface FormFieldProps {
  name: string
  label?: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactElement
}

export interface FormProps extends HTMLAttributes<HTMLFormElement> {
  onSubmit: (data: any) => void | Promise<void>
  loading?: boolean
  errors?: Record<string, string>
}

// Table Component Props
export interface TableColumn<T = any> {
  key: string
  label: string
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T, index: number) => React.ReactNode
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  actions?: TableAction<T>[]
  pagination?: {
    page: number
    limit: number
    total: number
    onChange: (page: number) => void
  }
}

export interface TableAction<T = any> {
  label: string
  icon?: React.ReactNode
  onClick: (row: T) => void
  show?: (row: T) => boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

// Alert Component Props
export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  closable?: boolean
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

// Badge Component Props
export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

// Avatar Component Props
export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
}

// Breadcrumb Component Props
export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
}

// Tabs Component Props
export interface TabItem {
  key: string
  label: string
  content: React.ReactNode
  disabled?: boolean
  badge?: string | number
}

export interface TabsProps {
  items: TabItem[]
  defaultActiveKey?: string
  onChange?: (key: string) => void
}

// Tooltip Component Props
export interface TooltipProps {
  content: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click'
  children: React.ReactElement
}

// Dropdown Component Props
export interface DropdownItem {
  key: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  danger?: boolean
}

export interface DropdownProps {
  items: DropdownItem[]
  trigger: React.ReactElement
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
}

// Progress Component Props
export interface ProgressProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

// Empty State Component Props
export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}
