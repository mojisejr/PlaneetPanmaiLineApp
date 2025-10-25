'use client'

/**
 * Product-specific React hooks
 * Provides state management for product data fetching and operations
 */

import { useState, useEffect, useCallback } from 'react'
import { productService } from '@/lib/services/product-service'
import type {
  ProductWithTiers,
  ProductQueryOptions,
  PriceCalculation,
} from '@/lib/types/products'
import type { PriceTier } from '@/types/database'

/**
 * Hook state interface
 */
interface UseProductsState {
  data: ProductWithTiers[] | null
  loading: boolean
  error: Error | null
}

/**
 * Hook for fetching products with optional filters
 */
export function useProducts(options?: ProductQueryOptions) {
  const [state, setState] = useState<UseProductsState>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchProducts = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const products = await productService.getProducts(options)
      setState({ data: products, loading: false, error: null })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setState({ data: null, loading: false, error: err })
    }
  }, [options])

  useEffect(() => {
    let isMounted = true

    async function load() {
      if (!isMounted) return
      await fetchProducts()
    }

    load()

    return () => {
      isMounted = false
    }
  }, [fetchProducts])

  return {
    products: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchProducts,
  }
}

/**
 * Hook for fetching active products only
 */
export function useActiveProducts() {
  const [state, setState] = useState<UseProductsState>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchProducts = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const products = await productService.getActiveProducts()
      setState({ data: products, loading: false, error: null })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setState({ data: null, loading: false, error: err })
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function load() {
      if (!isMounted) return
      await fetchProducts()
    }

    load()

    return () => {
      isMounted = false
    }
  }, [fetchProducts])

  return {
    products: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchProducts,
  }
}

/**
 * Hook for fetching a specific product by ID
 */
export function useProduct(productId: string | undefined) {
  const [state, setState] = useState<{
    data: ProductWithTiers | null
    loading: boolean
    error: Error | null
  }>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setState({ data: null, loading: false, error: null })
      return
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const product = await productService.getProductById(productId)
      setState({ data: product, loading: false, error: null })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setState({ data: null, loading: false, error: err })
    }
  }, [productId])

  useEffect(() => {
    let isMounted = true

    async function load() {
      if (!isMounted) return
      await fetchProduct()
    }

    load()

    return () => {
      isMounted = false
    }
  }, [fetchProduct])

  return {
    product: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchProduct,
  }
}

/**
 * Hook for fetching store products only
 */
export function useStoreProducts() {
  const [state, setState] = useState<UseProductsState>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchProducts = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const products = await productService.getStoreProducts()
      setState({ data: products, loading: false, error: null })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setState({ data: null, loading: false, error: err })
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function load() {
      if (!isMounted) return
      await fetchProducts()
    }

    load()

    return () => {
      isMounted = false
    }
  }, [fetchProducts])

  return {
    products: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchProducts,
  }
}

/**
 * Hook for fetching market comparison products
 */
export function useMarketProducts() {
  const [state, setState] = useState<UseProductsState>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchProducts = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const products = await productService.getMarketProducts()
      setState({ data: products, loading: false, error: null })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setState({ data: null, loading: false, error: err })
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function load() {
      if (!isMounted) return
      await fetchProducts()
    }

    load()

    return () => {
      isMounted = false
    }
  }, [fetchProducts])

  return {
    products: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchProducts,
  }
}

/**
 * Hook for fetching price tiers for a product
 */
export function usePriceTiers(productId: string | undefined) {
  const [state, setState] = useState<{
    data: PriceTier[] | null
    loading: boolean
    error: Error | null
  }>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchTiers = useCallback(async () => {
    if (!productId) {
      setState({ data: null, loading: false, error: null })
      return
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const tiers = await productService.getPriceTiers(productId)
      setState({ data: tiers, loading: false, error: null })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setState({ data: null, loading: false, error: err })
    }
  }, [productId])

  useEffect(() => {
    let isMounted = true

    async function load() {
      if (!isMounted) return
      await fetchTiers()
    }

    load()

    return () => {
      isMounted = false
    }
  }, [fetchTiers])

  return {
    tiers: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchTiers,
  }
}

/**
 * Hook for calculating price with quantity-based tiering
 */
export function usePriceCalculation(productId: string | undefined, quantity: number) {
  const [state, setState] = useState<{
    data: PriceCalculation | null
    loading: boolean
    error: Error | null
  }>({
    data: null,
    loading: true,
    error: null,
  })

  const calculatePrice = useCallback(async () => {
    if (!productId || quantity <= 0) {
      setState({ data: null, loading: false, error: null })
      return
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const calculation = await productService.calculatePrice(productId, quantity)
      setState({ data: calculation, loading: false, error: null })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setState({ data: null, loading: false, error: err })
    }
  }, [productId, quantity])

  useEffect(() => {
    let isMounted = true

    async function load() {
      if (!isMounted) return
      await calculatePrice()
    }

    load()

    return () => {
      isMounted = false
    }
  }, [calculatePrice])

  return {
    calculation: state.data,
    loading: state.loading,
    error: state.error,
    recalculate: calculatePrice,
  }
}
