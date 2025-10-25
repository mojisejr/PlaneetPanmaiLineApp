import type { Product, PriceTier } from '@/types/database'

/**
 * Cart Item Interface
 * Represents a product in the shopping cart with quantity and pricing information
 */
export interface CartItem {
  /** Product information from database */
  product: Product
  /** Quantity of items in cart */
  quantity: number
  /** Applied price tier based on quantity */
  tierApplied?: PriceTier
  /** Calculated subtotal for this item (quantity × effective price) */
  subtotal: number
  /** Effective price per unit after tier discount */
  effectivePrice: number
}

/**
 * Cart State Interface
 * Represents the complete state of the shopping cart
 */
export interface CartState {
  /** Array of items in the cart */
  items: CartItem[]
  /** Total price of all items */
  total: number
  /** Total quantity of all items */
  totalQuantity: number
  /** Total savings from tier pricing */
  totalSavings: number
}

/**
 * Cart Action Types
 * Defines all possible actions for the cart reducer
 */
export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }

/**
 * Cart Context Type
 * Defines the interface for the cart context
 */
export interface CartContextType extends CartState {
  /** Add item to cart or update quantity if exists */
  addItem: (product: Product, quantity: number) => void
  /** Remove item from cart */
  removeItem: (productId: string) => void
  /** Update item quantity */
  updateQuantity: (productId: string, quantity: number) => void
  /** Clear all items from cart */
  clearCart: () => void
  /** Check if product is in cart */
  isInCart: (productId: string) => boolean
  /** Get cart item by product ID */
  getCartItem: (productId: string) => CartItem | undefined
}

/**
 * Tier Pricing Configuration
 * Defines the tier pricing rules for bulk purchases
 */
export interface TierPricingConfig {
  /** Minimum quantity for this tier */
  minQuantity: number
  /** Maximum quantity for this tier (null = unlimited) */
  maxQuantity: number | null
  /** Discount percentage (0-100) */
  discountPercent: number
}

/**
 * Default tier pricing configuration
 * 1-4 plants: 100% (no discount)
 * 5-9 plants: 90% (10% discount)
 * 10+ plants: 80% (20% discount)
 */
export const DEFAULT_TIER_CONFIG: TierPricingConfig[] = [
  { minQuantity: 1, maxQuantity: 4, discountPercent: 0 },
  { minQuantity: 5, maxQuantity: 9, discountPercent: 10 },
  { minQuantity: 10, maxQuantity: null, discountPercent: 20 }
]

/**
 * Pricing Calculation Result
 * Contains detailed pricing breakdown for a cart item
 */
export interface PricingCalculation {
  /** Original base price per unit */
  basePrice: number
  /** Effective price per unit after discount */
  effectivePrice: number
  /** Discount amount per unit */
  discountPerUnit: number
  /** Applied tier configuration */
  tierApplied?: TierPricingConfig
  /** Total subtotal (quantity × effective price) */
  subtotal: number
  /** Total savings (quantity × discount per unit) */
  totalSavings: number
}
