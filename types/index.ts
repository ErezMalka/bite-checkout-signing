/**
 * Main types export file
 * Re-exports all types for easy importing
 */

// Database types
export type { 
  Database, 
  Json 
} from './database'

// Model types
export type {
  Product,
  ProductInsert,
  ProductUpdate,
  ProductImage,
  ProductImageInsert,
  ProductImageUpdate,
  ProductPaymentPlan,
  ProductPaymentPlanInsert,
  ProductPaymentPlanUpdate,
  OrderDraft,
  OrderDraftInsert,
  OrderDraftUpdate,
  ProductWithImages,
  ProductWithPlans,
  ProductFull,
  CartItem,
  CartItemWithTotals,
  CustomerInfo,
  OrderLine,
  OrderTotals,
  OrderPayload,
  CreateOrderRequest,
  CreateOrderResponse,
} from './models'

// Enum types
export type {
  PaymentMethod,
  InstallmentOption,
  OrderStatus,
  Currency,
  ImageMode,
  SortDirection,
  ProductSortBy,
  PaymentPlansMap,
} from './enums'

export {
  PaymentMethods,
  InstallmentOptions,
  OrderStatuses,
  Currencies,
  ImageModes,
  SortDirections,
  ProductSortOptions,
  DefaultPaymentPlans,
  StatusDisplay,
  CurrencySymbols,
} from './enums'

// API types
export type {
  ApiResponse,
  ApiError,
  PaginationParams,
  PaginationMeta,
  PaginatedResponse,
  ProductFilters,
  OrderFilters,
  GetProductsParams,
  GetProductByIdParams,
  CreateProductRequest,
  UpdateProductRequest,
  UploadImageRequest,
  UpdateImageRequest,
  CreatePaymentPlanRequest,
  UpdatePaymentPlanRequest,
  CreateOrderDraftRequest,
  CreateOrderDraftResponse,
  UpdateOrderStatusRequest,
  SigningWebhookPayload,
  StorageUploadResponse,
  StorageDeleteRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './api'

// Utility types
export type {
  FormErrors,
  ValidationResult,
  FileUploadConfig,
  RouteParams,
  SearchParams,
} from './utils'

// Component prop types
export type {
  ButtonProps,
  CardProps,
  InputProps,
  SelectProps,
  SpinnerProps,
  ProductCardProps,
  ImageUploaderProps,
  CheckoutProps,
} from './components'
