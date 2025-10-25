'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useMemo, useCallback } from 'react'
import type { Product } from '@/types/database'
import type { CartState, CartAction, CartContextType, CartItem } from '@/lib/types/cart'
import { createCartItem, recalculateCartItem, calculateCartTotals, validateQuantity } from '@/lib/utils/calculator'

/**
 * Cart Context
 * Provides cart state and operations throughout the application
 */
const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * Local Storage Key for Cart Persistence
 */
const CART_STORAGE_KEY = 'praneet-panmai-cart'

/**
 * Initial Cart State
 */
const initialCartState: CartState = {
  items: [],
  total: 0,
  totalQuantity: 0,
  totalSavings: 0
}

/**
 * Cart Reducer
 * Handles all cart state updates with immutable patterns
 */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload
      
      // Validate quantity
      try {
        validateQuantity(quantity)
      } catch (error) {
        console.error('Invalid quantity:', error)
        return state
      }

      // Check if item already exists
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      )

      let updatedItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const existingItem = state.items[existingItemIndex]
        const newQuantity = existingItem.quantity + quantity
        const updatedItem = recalculateCartItem(existingItem, newQuantity)
        
        updatedItems = [
          ...state.items.slice(0, existingItemIndex),
          updatedItem,
          ...state.items.slice(existingItemIndex + 1)
        ]
      } else {
        // Add new item
        const newItem = createCartItem(product, quantity)
        updatedItems = [...state.items, newItem]
      }

      // Recalculate totals
      const totals = calculateCartTotals(updatedItems)

      return {
        items: updatedItems,
        ...totals
      }
    }

    case 'REMOVE_ITEM': {
      const { productId } = action.payload
      const updatedItems = state.items.filter(
        (item) => item.product.id !== productId
      )

      // Recalculate totals
      const totals = calculateCartTotals(updatedItems)

      return {
        items: updatedItems,
        ...totals
      }
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload

      // Validate quantity
      try {
        validateQuantity(quantity)
      } catch (error) {
        console.error('Invalid quantity:', error)
        return state
      }

      const itemIndex = state.items.findIndex(
        (item) => item.product.id === productId
      )

      if (itemIndex === -1) {
        console.error('Item not found in cart')
        return state
      }

      const existingItem = state.items[itemIndex]
      const updatedItem = recalculateCartItem(existingItem, quantity)

      const updatedItems = [
        ...state.items.slice(0, itemIndex),
        updatedItem,
        ...state.items.slice(itemIndex + 1)
      ]

      // Recalculate totals
      const totals = calculateCartTotals(updatedItems)

      return {
        items: updatedItems,
        ...totals
      }
    }

    case 'CLEAR_CART': {
      return initialCartState
    }

    case 'LOAD_CART': {
      return action.payload
    }

    default:
      return state
  }
}

/**
 * Load cart state from localStorage
 */
function loadCartFromStorage(): CartState {
  if (typeof window === 'undefined') {
    return initialCartState
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Validate the loaded data has required properties
      if (parsed.items && Array.isArray(parsed.items)) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error)
  }

  return initialCartState
}

/**
 * Save cart state to localStorage
 */
function saveCartToStorage(state: CartState): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save cart to storage:', error)
  }
}

/**
 * Cart Provider Props
 */
interface CartProviderProps {
  children: ReactNode
}

/**
 * Cart Provider Component
 * Manages cart state and provides context to child components
 */
export const CartProvider: React.FC<CartProviderProps> = React.memo(({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState, loadCartFromStorage)

  /**
   * Persist cart state to localStorage whenever it changes
   */
  useEffect(() => {
    saveCartToStorage(state)
  }, [state])

  /**
   * Add item to cart or update quantity if exists
   */
  const addItem = useCallback((product: Product, quantity: number): void => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  }, [])

  /**
   * Remove item from cart
   */
  const removeItem = useCallback((productId: string): void => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
  }, [])

  /**
   * Update item quantity
   */
  const updateQuantity = useCallback((productId: string, quantity: number): void => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }, [])

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback((): void => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  /**
   * Check if product is in cart
   */
  const isInCart = useCallback((productId: string): boolean => {
    return state.items.some((item) => item.product.id === productId)
  }, [state.items])

  /**
   * Get cart item by product ID
   */
  const getCartItem = useCallback((productId: string): CartItem | undefined => {
    return state.items.find((item) => item.product.id === productId)
  }, [state.items])

  /**
   * Memoize context value to prevent unnecessary re-renders
   */
  const contextValue = useMemo<CartContextType>(
    () => ({
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart,
      getCartItem
    }),
    [state, addItem, removeItem, updateQuantity, clearCart, isInCart, getCartItem]
  )

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
})

CartProvider.displayName = 'CartProvider'

/**
 * Hook to access cart context
 * @throws Error if used outside CartProvider
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}

/**
 * Hook to get cart items
 */
export const useCartItems = (): CartItem[] => {
  const { items } = useCart()
  return items
}

/**
 * Hook to get cart total
 */
export const useCartTotal = (): number => {
  const { total } = useCart()
  return total
}

/**
 * Hook to get cart quantity
 */
export const useCartQuantity = (): number => {
  const { totalQuantity } = useCart()
  return totalQuantity
}

/**
 * Hook to get cart savings
 */
export const useCartSavings = (): number => {
  const { totalSavings } = useCart()
  return totalSavings
}

/**
 * Hook to get cart actions
 */
export const useCartActions = () => {
  const { addItem, removeItem, updateQuantity, clearCart } = useCart()

  return {
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
}

/**
 * Hook to check if product is in cart
 */
export const useIsInCart = (productId: string): boolean => {
  const { isInCart } = useCart()
  return isInCart(productId)
}

/**
 * Hook to get specific cart item
 */
export const useCartItem = (productId: string): CartItem | undefined => {
  const { getCartItem } = useCart()
  return getCartItem(productId)
}

export default CartProvider
