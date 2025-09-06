/**
 * Database types generated from Supabase schema
 * These types match the database structure exactly
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          sku: string | null
          name: string
          description: string | null
          base_price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sku?: string | null
          name: string
          description?: string | null
          base_price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sku?: string | null
          name?: string
          description?: string | null
          base_price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          path: string
          url: string | null
          is_primary: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          path: string
          url?: string | null
          is_primary?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          path?: string
          url?: string | null
          is_primary?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      product_payment_plans: {
        Row: {
          id: string
          product_id: string
          installments: number
          surcharge_pct: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          installments: number
          surcharge_pct?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          installments?: number
          surcharge_pct?: number
          created_at?: string
        }
      }
      order_drafts: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string | null
          customer_email: string | null
          currency: string
          payload: Json
          status: string
          sign_url: string | null
          signed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_phone?: string | null
          customer_email?: string | null
          currency?: string
          payload: Json
          status?: string
          sign_url?: string | null
          signed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_phone?: string | null
          customer_email?: string | null
          currency?: string
          payload?: Json
          status?: string
          sign_url?: string | null
          signed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      products_with_images: {
        Row: {
          id: string
          sku: string | null
          name: string
          description: string | null
          base_price: number
          is_active: boolean
          created_at: string
          updated_at: string
          primary_image_url: string | null
          primary_image_path: string | null
          total_images: number
        }
      }
    }
    Functions: {
      get_storage_public_url: {
        Args: {
          bucket: string
          path: string
        }
        Returns: string
      }
    }
    Enums: {
      order_status: 'pending' | 'sent' | 'signed' | 'failed' | 'cancelled'
      currency: 'ILS' | 'USD' | 'EUR'
      installment_options: 1 | 3 | 6 | 12
    }
  }
}
