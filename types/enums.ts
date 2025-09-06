/**
 * Enums and constant types used throughout the application
 */

// Payment method types
export type PaymentMethod = 'full' | 'installments'

export const PaymentMethods = {
  FULL: 'full' as PaymentMethod,
  INSTALLMENTS: 'installments' as PaymentMethod,
} as const

// Installment options
export type InstallmentOption = 1 | 3 | 6 | 12

export const InstallmentOptions = [1, 3, 6, 12] as const

// Order status
export type OrderStatus = 'pending' | 'sent' | 'signed' | 'failed' | 'cancelled'

export const OrderStatuses = {
  PENDING: 'pending' as OrderStatus,
  SENT: 'sent' as OrderStatus,
  SIGNED: 'signed' as OrderStatus,
  FAILED: 'failed' as OrderStatus,
  CANCELLED: 'cancelled' as OrderStatus,
} as const

// Currency types
export type Currency = 'ILS' | 'USD' | 'EUR'

export const Currencies = {
  ILS: 'ILS' as Currency,
  USD: 'USD' as Currency,
  EUR: 'EUR' as Currency,
} as const

// Image types
export type ImageMode = 'main' | 'gallery'

export const ImageModes = {
  MAIN: 'main' as ImageMode,
  GALLERY: 'gallery' as ImageMode,
} as const

// Sort directions
export type SortDirection = 'asc' | 'desc'

export const SortDirections = {
  ASC: 'asc' as SortDirection,
  DESC: 'desc' as SortDirection,
} as const

// Product sort options
export type ProductSortBy = 'name' | 'price' | 'created_at' | 'updated_at'

export const ProductSortOptions = {
  NAME: 'name' as ProductSortBy,
  PRICE: 'price' as ProductSortBy,
  CREATED: 'created_at' as ProductSortBy,
  UPDATED: 'updated_at' as ProductSortBy,
} as const

// Payment plans map type
export type PaymentPlansMap = Record<InstallmentOption, number>

// Default payment plans
export const DefaultPaymentPlans: PaymentPlansMap = {
  1: 0.000,   // No surcharge for full payment
  3: 0.020,   // 2% surcharge for 3 installments
  6: 0.040,   // 4% surcharge for 6 installments
  12: 0.080,  // 8% surcharge for 12 installments
}

// Status display mapping
export const StatusDisplay: Record<OrderStatus, string> = {
  pending: 'ממתין',
  sent: 'נשלח לחתימה',
  signed: 'נחתם',
  failed: 'נכשל',
  cancelled: 'בוטל',
}

// Currency symbols
export const CurrencySymbols: Record<Currency, string> = {
  ILS: '₪',
  USD: '$',
  EUR: '€',
}
