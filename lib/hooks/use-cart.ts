'use client'

/**
 * Cart Hook
 * Re-exports cart hooks from cart-context for convenience
 * Provides a cleaner import path for cart operations
 */

export {
  useCart,
  useCartItems,
  useCartTotal,
  useCartQuantity,
  useCartSavings,
  useCartActions,
  useIsInCart,
  useCartItem
} from '@/lib/context/cart-context'
