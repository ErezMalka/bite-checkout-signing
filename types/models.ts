/**
 * Application models and interfaces
 * These are the types used throughout the application
 */

import { Database } from './database'

// Database table types shortcuts
export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type ProductImageInsert = Database['public']['Tables']['product_images']['Insert']
export type ProductImageUpdate = Database['public']['Tables']['product_images']['Update']

export type ProductPaymentPlan = Database['public']['Tables']['product_payment_plans']['Row']
export type ProductPaymentPlanInsert = Database['public']['Tables']['product_payment_plans']['Insert']
export type ProductPaymentPlanUpdate = Database['public']['Tables']['product_payment_plans']['Update']

export type OrderDraft = Database['public']['Tables']['order_drafts']['Row']
export type OrderDraftInsert = Database['public']['Tables']['order_drafts']['Insert']
export type OrderDraftUpdate = Database['public']['Tables']['order_drafts']['Update']

// Extended types with relations
export interface ProductWithImages extends Product {
  product_images?: ProductImage[]
  primary_image?: ProductImage | null
}

export interface ProductWithPlans extends Product {
  product_payment_plans?: ProductPaymentPlan[]
}

export interface ProductFull extends Product {
  product_images?: ProductImage[]
  product_payment_plans?: ProductPaymentPlan[]
}

// Cart and checkout types
export interface CartItem {
  productId: string
  productName: string
  quantity: number
  basePrice: number
  paymentMethod: PaymentMethod
  installments: InstallmentOption
  paymentPlans?: PaymentPlansMap
}

export interface CartItemWithTotals extends CartItem {
  subtotal: number
  surcharge: number
  surchargePercent: number
  total: number
  monthlyPayment: number
}

export interface CustomerInfo {
  name: string
  phone: string
  email: string
}

export interface OrderLine {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  payment_method: PaymentMethod
  installments: number
  surcharge_pct: number
  subtotal: number
  surcharge: number
  total: number
  monthly_payment: number
}

export interface OrderTotals {
  subtotal: number
  surcharge: number
  grand_total: number
  max_monthly_payment: number
}

export interface OrderPayload {
  currency: Currency
  lines: OrderLine[]
  totals: OrderTotals
}

export interface CreateOrderRequest {
  customer: CustomerInfo
  order: OrderPayload
}

export interface CreateOrderResponse {
  success: boolean
  order_id: string
  sign_url: string
  message?: string
  error?: string
}
