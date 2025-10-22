// Auto-generated types from Supabase database schema
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
      members: {
        Row: {
          id: string
          line_user_id: string
          display_name: string
          registration_date: string | null
          contact_info: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never
          line_user_id: string
          display_name: string
          registration_date?: string | null
          contact_info?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          line_user_id?: string
          display_name?: string
          registration_date?: string | null
          contact_info?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          variety_name: string
          size: string
          plant_shape: 'กระโดง' | 'ข้าง'
          base_price: number
          is_available_in_store: boolean
          image_url: string | null
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never
          variety_name: string
          size: string
          plant_shape: 'กระโดง' | 'ข้าง'
          base_price: number
          is_available_in_store?: boolean
          image_url?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          variety_name?: string
          size?: string
          plant_shape?: 'กระโดง' | 'ข้าง'
          base_price?: number
          is_available_in_store?: boolean
          image_url?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      price_tiers: {
        Row: {
          id: string
          product_id: string
          min_quantity: number
          max_quantity: number | null
          special_price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never
          product_id: string
          min_quantity: number
          max_quantity?: number | null
          special_price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          product_id?: string
          min_quantity?: number
          max_quantity?: number | null
          special_price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Extended types for application use
export type Member = Database['public']['Tables']['members']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type PriceTier = Database['public']['Tables']['price_tiers']['Row']

export type NewMember = Database['public']['Tables']['members']['Insert']
export type NewProduct = Database['public']['Tables']['products']['Insert']
export type NewPriceTier = Database['public']['Tables']['price_tiers']['Insert']

export type MemberUpdate = Database['public']['Tables']['members']['Update']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
export type PriceTierUpdate = Database['public']['Tables']['price_tiers']['Update']

// Product with related price tiers
export type ProductWithTiers = Product & {
  price_tiers: PriceTier[]
}

// Calculator cart item
export type CartItem = {
  product: Product
  quantity: number
  tier_applied?: PriceTier
  subtotal: number
}

// Calculator state
export type CalculatorState = {
  items: CartItem[]
  total: number
  total_savings: number
}

// LINE LIFF profile
export type LineProfile = {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}
