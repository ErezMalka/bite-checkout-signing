/**
 * API request and response types
 */

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
}

// API error structure
export interface ApiError {
  code: string
  message: string
  details?: any
  statusCode?: number
}

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Filter types
export interface ProductFilters {
  search?: string
  minPrice?: number
  maxPrice?: number
  isActive?: boolean
  sku?: string
  sortBy?: 'name' | 'price' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export interface OrderFilters {
  status?: string
  customerEmail?: string
  customerPhone?: string
  dateFrom?: string
  dateTo?: string
}

// Product API types
export interface GetProductsParams extends PaginationParams {
  filters?: ProductFilters
}

export interface GetProductByIdParams {
  id: string
  includeImages?: boolean
  includePlans?: boolean
}

export interface CreateProductRequest {
  name: string
  sku?: string
  description?: string
  base_price: number
  is_active?: boolean
}

export interface UpdateProductRequest {
  name?: string
  sku?: string
  description?: string
  base_price?: number
  is_active?: boolean
}

// Image API types
export interface UploadImageRequest {
  productId: string
  file: File
  isPrimary?: boolean
  sortOrder?: number
}

export interface UpdateImageRequest {
  isPrimary?: boolean
  sortOrder?: number
}

// Payment plan API types
export interface CreatePaymentPlanRequest {
  product_id: string
  installments: number
  surcharge_pct: number
}

export interface UpdatePaymentPlanRequest {
  surcharge_pct: number
}

// Order API types
export interface CreateOrderDraftRequest {
  customer: {
    name: string
    phone?: string
    email: string
  }
  order: {
    currency?: string
    lines: Array<{
      product_id: string
      product_name: string
      quantity: number
      unit_price: number
      payment_method: 'full' | 'installments'
      installments?: number
      surcharge_pct?: number
    }>
  }
}

export interface CreateOrderDraftResponse {
  success: boolean
  order_id: string
  sign_url: string
  message?: string
}

export interface UpdateOrderStatusRequest {
  status: 'pending' | 'sent' | 'signed' | 'failed' | 'cancelled'
  sign_url?: string
  signed_at?: string
}

// Signing service types
export interface SigningWebhookPayload {
  event: 'document.signed' | 'document.viewed' | 'document.expired'
  document_id: string
  order_id: string
  signed_at?: string
  signer?: {
    name: string
    email: string
    ip?: string
  }
}

// Storage types
export interface StorageUploadResponse {
  path: string
  url: string
  size: number
  mimetype: string
}

export interface StorageDeleteRequest {
  paths: string[]
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    email: string
    role?: string
  }
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
}
