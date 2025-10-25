/**
 * Product-specific types and interfaces
 * Application-level types for product data layer
 */

import type { Product, PriceTier, ProductWithTiers } from '@/types/database'

// Re-export database types for convenience
export type { Product, PriceTier, ProductWithTiers }

/**
 * Product query filters
 */
export interface ProductFilters {
  isActive?: boolean
  isAvailableInStore?: boolean
  varietyName?: string
  size?: string
  plantShape?: 'กระโดง' | 'ข้าง'
}

/**
 * Product query options
 */
export interface ProductQueryOptions {
  filters?: ProductFilters
  includeTiers?: boolean
  orderBy?: 'variety_name' | 'size' | 'base_price' | 'created_at'
  orderDirection?: 'asc' | 'desc'
  limit?: number
}

/**
 * Product API response
 */
export interface ProductsResponse {
  products: ProductWithTiers[]
  count: number
  timestamp: string
}

/**
 * Product API error response
 */
export interface ProductErrorResponse {
  error: string
  message: string
  timestamp: string
  details?: string
}

/**
 * Price calculation result
 */
export interface PriceCalculation {
  productId: string
  quantity: number
  basePrice: number
  tierPrice?: number
  tierApplied?: PriceTier
  finalPrice: number
  savings: number
}

/**
 * Product availability status
 */
export interface ProductAvailability {
  productId: string
  isActive: boolean
  isAvailableInStore: boolean
  stockStatus: 'available' | 'limited' | 'unavailable'
}

/**
 * Product with calculated pricing
 */
export interface ProductWithPrice extends Product {
  price_tiers: PriceTier[]
  lowestPrice?: number
  highestPrice?: number
  tierCount: number
}
