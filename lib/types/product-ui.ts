/**
 * Product UI Types
 * 
 * Type definitions for product display components including grid and card views.
 * These types extend the base Product type from database.ts with UI-specific properties.
 */

import type { Product, PriceTier } from '@/types/database'

/**
 * Product with price tiers for display
 * Extended from database Product type with pricing information
 */
export interface ProductWithPricing extends Product {
  price_tiers: PriceTier[]
}

/**
 * Product card display props
 */
export interface ProductCardProps {
  /** Product data with pricing information */
  product: ProductWithPricing
  /** Whether the card is in loading state */
  isLoading?: boolean
  /** Whether the product is currently selected */
  isSelected?: boolean
  /** Callback when product is clicked */
  onClick?: (product: ProductWithPricing) => void
  /** Custom class name for styling */
  className?: string
}

/**
 * Product grid display props
 */
export interface ProductGridProps {
  /** Array of products to display */
  products: ProductWithPricing[]
  /** Whether products are loading */
  isLoading?: boolean
  /** Number of loading skeleton cards to show */
  loadingCount?: number
  /** Error message to display */
  error?: string | null
  /** Callback when a product is clicked */
  onProductClick?: (product: ProductWithPricing) => void
  /** Custom class name for grid container */
  className?: string
}

/**
 * Product card skeleton props for loading state
 */
export interface ProductCardSkeletonProps {
  /** Custom class name */
  className?: string
}

/**
 * Product availability status
 */
export type ProductAvailability = 'available' | 'reference' | 'unavailable'

/**
 * Helper function type to determine product availability
 */
export type GetProductAvailability = (product: Product) => ProductAvailability

/**
 * Helper function type to format price with Thai Baht currency
 */
export type FormatPrice = (price: number) => string

/**
 * Helper function type to get the best applicable price tier
 */
export type GetApplicablePriceTier = (
  priceTiers: PriceTier[],
  quantity: number
) => PriceTier | null
