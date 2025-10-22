'use client'

import { useState, useEffect } from 'react'
import { supabaseOps } from '@/lib/supabase/operations'
import { logError } from '@/lib/errors/supabase-error'
import type { Member, Product, ProductWithTiers, CartItem } from '@/types/database'

// Generic hook for Supabase operations
export function useSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await queryFn()
      setData(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      logError(error, 'useSupabaseQuery')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function fetch() {
      if (!isMounted) return
      await fetchData()
    }

    fetch()

    return () => {
      isMounted = false
    }
  }, dependencies)

  return { data, loading, error, refetch: fetchData }
}

// Specific hooks for common operations
export function useMember(lineUserId?: string) {
  return useSupabaseQuery(
    () => {
      if (!lineUserId) throw new Error('Line User ID is required')
      return supabaseOps.getMember(lineUserId)
    },
    [lineUserId]
  )
}

export function useProducts() {
  return useSupabaseQuery(
    () => supabaseOps.getProducts({ eq: { is_active: true } }),
    []
  )
}

export function useProductsWithTiers() {
  return useSupabaseQuery(
    () => supabaseOps.getProductsWithTiers(),
    []
  )
}

// Calculator hook
export function useCalculator() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  const addToCart = async (product: Product, quantity: number) => {
    try {
      setLoading(true)

      const tierApplied = await supabaseOps.calculateTierPrice(product.id, quantity)
      const subtotal = tierApplied ? tierApplied.special_price * quantity : product.base_price * quantity

      const cartItem: CartItem = {
        product,
        quantity,
        tier_applied: tierApplied || undefined,
        subtotal
      }

      setCart(prev => {
        const existing = prev.findIndex(item => item.product.id === product.id)
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = cartItem
          return updated
        }
        return [...prev, cartItem]
      })
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to add to cart'), 'addToCart')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const totalSavings = cart.reduce((sum, item) => {
    if (!item.tier_applied) return sum
    const regularTotal = item.product.base_price * item.quantity
    return sum + (regularTotal - item.subtotal)
  }, 0)

  return {
    cart,
    total,
    totalSavings,
    loading,
    addToCart,
    removeFromCart,
    clearCart
  }
}
