/**
 * Application constants and configuration
 */

// Payment related constants
export const PAYMENT_METHODS = {
  FULL: 'full',
  INSTALLMENTS: 'installments',
} as const

export const INSTALLMENT_OPTIONS = [1, 3, 6, 12] as const

export const DEFAULT_SURCHARGE_RATES = {
  1: 0.000,
  3: 0.020,
  6: 0.040,
  12: 0.080,
} as const

// Order status constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  SIGNED: 'signed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const

// Currency constants
export const CURRENCIES = {
  ILS: 'ILS',
  USD: 'USD',
  EUR: 'EUR',
} as const

export const DEFAULT_CURRENCY = 'ILS'

// Image upload constants
export const IMAGE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  MAX_IMAGES_PER_PRODUCT: 10,
  THUMBNAIL_SIZE: 150,
  PREVIEW_SIZE: 500,
} as const

// Storage bucket names
export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  DOCUMENTS: 'documents',
} as const

// API endpoints
export const API_ENDPOINTS = {
  SIGNING_CREATE: '/api/signing/create',
  PRODUCTS: '/api/products',
  UPLOAD: '/api/upload',
} as const

// Navigation routes
export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  CHECKOUT: '/checkout',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_NEW: '/admin/products/new',
  ADMIN_PRODUCT_EDIT: (id: string) => `/admin/products/${id}`,
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
} as const

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'אירעה שגיאה. אנא נסה שוב.',
  NETWORK: 'בעיית תקשורת. אנא בדוק את החיבור לאינטרנט.',
  VALIDATION: 'אנא מלא את כל השדות הנדרשים.',
  UPLOAD: 'שגיאה בהעלאת הקובץ.',
  AUTH: 'נדרשת הרשאה לביצוע פעולה זו.',
  NOT_FOUND: 'הפריט המבוקש לא נמצא.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  PRODUCT_CREATED: 'המוצר נוצר בהצלחה!',
  PRODUCT_UPDATED: 'המוצר עודכן בהצלחה!',
  PRODUCT_DELETED: 'המוצר נמחק בהצלחה!',
  ORDER_CREATED: 'ההזמנה נוצרה בהצלחה!',
  IMAGE_UPLOADED: 'התמונה הועלתה בהצלחה!',
} as const

// Validation rules
export const VALIDATION_RULES = {
  MIN_PRODUCT_NAME_LENGTH: 2,
  MAX_PRODUCT_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_PRICE: 0,
  MAX_PRICE: 1000000,
  SKU_PATTERN: /^[A-Za-z0-9-]+$/,
} as const
