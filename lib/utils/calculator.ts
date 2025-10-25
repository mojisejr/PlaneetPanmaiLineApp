import type { Product } from '@/types/database'
import type { CartItem, PricingCalculation, TierPricingConfig } from '@/lib/types/cart'
import { DEFAULT_TIER_CONFIG } from '@/lib/types/cart'

/**
 * Format number as Thai currency (฿)
 * @param amount - Amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string (e.g., "฿1,234.56")
 */
export function formatThaiCurrency(amount: number, decimals: number = 2): string {
  return `฿${amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

/**
 * Get applicable tier configuration based on quantity
 * @param quantity - Number of items
 * @param tiers - Tier configuration array
 * @returns Applicable tier configuration or undefined
 */
export function getApplicableTier(
  quantity: number,
  tiers: TierPricingConfig[] = DEFAULT_TIER_CONFIG
): TierPricingConfig | undefined {
  return tiers.find(
    (tier) =>
      quantity >= tier.minQuantity &&
      (tier.maxQuantity === null || quantity <= tier.maxQuantity)
  )
}

/**
 * Calculate pricing for a product with tier discounts
 * @param product - Product to calculate pricing for
 * @param quantity - Quantity of product
 * @param tiers - Optional tier configuration (uses default if not provided)
 * @returns Detailed pricing calculation
 */
export function calculatePricing(
  product: Product,
  quantity: number,
  tiers?: TierPricingConfig[]
): PricingCalculation {
  const basePrice = product.base_price
  const applicableTier = getApplicableTier(quantity, tiers)

  // Calculate discount
  const discountPercent = applicableTier?.discountPercent ?? 0
  const discountPerUnit = basePrice * (discountPercent / 100)
  const effectivePrice = basePrice - discountPerUnit

  // Calculate totals
  const subtotal = effectivePrice * quantity
  const totalSavings = discountPerUnit * quantity

  return {
    basePrice,
    effectivePrice,
    discountPerUnit,
    tierApplied: applicableTier,
    subtotal,
    totalSavings
  }
}

/**
 * Create cart item from product and quantity
 * @param product - Product to add to cart
 * @param quantity - Quantity of product
 * @param tiers - Optional tier configuration
 * @returns Complete cart item with pricing
 */
export function createCartItem(
  product: Product,
  quantity: number,
  tiers?: TierPricingConfig[]
): CartItem {
  const pricing = calculatePricing(product, quantity, tiers)

  return {
    product,
    quantity,
    tierApplied: undefined, // Will be populated from database price_tiers if available
    subtotal: pricing.subtotal,
    effectivePrice: pricing.effectivePrice
  }
}

/**
 * Calculate cart totals from items array
 * @param items - Array of cart items
 * @returns Total price, quantity, and savings
 */
export function calculateCartTotals(items: CartItem[]): {
  total: number
  totalQuantity: number
  totalSavings: number
} {
  const total = items.reduce((sum, item) => sum + item.subtotal, 0)
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  
  // Calculate savings based on base price vs effective price
  const totalSavings = items.reduce((sum, item) => {
    const baseTotal = item.product.base_price * item.quantity
    const effectiveTotal = item.subtotal
    return sum + (baseTotal - effectiveTotal)
  }, 0)

  return { total, totalQuantity, totalSavings }
}

/**
 * Recalculate cart item with updated quantity
 * @param item - Existing cart item
 * @param newQuantity - New quantity
 * @param tiers - Optional tier configuration
 * @returns Updated cart item
 */
export function recalculateCartItem(
  item: CartItem,
  newQuantity: number,
  tiers?: TierPricingConfig[]
): CartItem {
  return createCartItem(item.product, newQuantity, tiers)
}

/**
 * Get discount percentage for a quantity
 * @param quantity - Number of items
 * @param tiers - Optional tier configuration
 * @returns Discount percentage (0-100)
 */
export function getDiscountPercent(
  quantity: number,
  tiers?: TierPricingConfig[]
): number {
  const tier = getApplicableTier(quantity, tiers)
  return tier?.discountPercent ?? 0
}

/**
 * Format discount percentage for display
 * @param percent - Discount percentage
 * @returns Formatted string (e.g., "10% OFF")
 */
export function formatDiscountPercent(percent: number): string {
  return percent > 0 ? `${percent}% OFF` : 'ราคาปกติ'
}

/**
 * Check if quantity qualifies for next tier
 * @param currentQuantity - Current quantity
 * @param tiers - Optional tier configuration
 * @returns Object with next tier info and items needed
 */
export function getNextTierInfo(
  currentQuantity: number,
  tiers: TierPricingConfig[] = DEFAULT_TIER_CONFIG
): {
  hasNextTier: boolean
  nextTierMinQuantity?: number
  itemsToNextTier?: number
  nextTierDiscount?: number
} {
  const currentTier = getApplicableTier(currentQuantity, tiers)
  const currentTierIndex = currentTier ? tiers.indexOf(currentTier) : -1
  
  if (currentTierIndex === -1 || currentTierIndex === tiers.length - 1) {
    return { hasNextTier: false }
  }

  const nextTier = tiers[currentTierIndex + 1]
  const itemsToNextTier = nextTier.minQuantity - currentQuantity

  return {
    hasNextTier: true,
    nextTierMinQuantity: nextTier.minQuantity,
    itemsToNextTier: itemsToNextTier > 0 ? itemsToNextTier : 0,
    nextTierDiscount: nextTier.discountPercent
  }
}

/**
 * Validate quantity is positive integer
 * @param quantity - Quantity to validate
 * @throws Error if quantity is invalid
 */
export function validateQuantity(quantity: number): void {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('Quantity must be a positive integer')
  }
}
