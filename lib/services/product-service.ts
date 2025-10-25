/**
 * Product Service Layer
 * Business logic for product operations with Supabase integration
 */

import { supabaseOps } from '@/lib/supabase/operations'
import type {
  ProductWithTiers,
  ProductFilters,
  ProductQueryOptions,
  PriceCalculation,
} from '@/lib/types/products'
import type { PriceTier } from '@/types/database'

/**
 * Product Service Class
 * Provides business logic layer on top of Supabase operations
 */
export class ProductService {
  /**
   * Get all active products with their pricing tiers
   */
  async getActiveProducts(): Promise<ProductWithTiers[]> {
    try {
      const products = await supabaseOps.getProductsWithTiers()
      return products.filter((p) => p.is_active)
    } catch (error) {
      throw new Error(
        `ไม่สามารถโหลดข้อมูลสินค้าได้: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Get products with optional filtering
   */
  async getProducts(options: ProductQueryOptions = {}): Promise<ProductWithTiers[]> {
    try {
      const { filters, includeTiers = true } = options

      let products: ProductWithTiers[]

      if (includeTiers) {
        products = await supabaseOps.getProductsWithTiers()
      } else {
        const rawProducts = await supabaseOps.getProducts({ eq: { is_active: true } })
        products = rawProducts.map((p) => ({ ...p, price_tiers: [] }))
      }

      // Apply filters
      if (filters) {
        products = this.applyFilters(products, filters)
      }

      // Apply sorting
      if (options.orderBy) {
        products = this.sortProducts(products, options.orderBy, options.orderDirection)
      }

      // Apply limit
      if (options.limit && options.limit > 0) {
        products = products.slice(0, options.limit)
      }

      return products
    } catch (error) {
      throw new Error(
        `ไม่สามารถค้นหาสินค้าได้: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Get a specific product by ID with pricing tiers
   */
  async getProductById(productId: string): Promise<ProductWithTiers | null> {
    try {
      const products = await supabaseOps.getProductsWithTiers()
      return products.find((p) => p.id === productId) || null
    } catch (error) {
      throw new Error(
        `ไม่สามารถโหลดข้อมูลสินค้าได้: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Calculate price for a product with quantity-based tiering
   */
  async calculatePrice(productId: string, quantity: number): Promise<PriceCalculation> {
    try {
      const product = await this.getProductById(productId)
      
      if (!product) {
        throw new Error('ไม่พบสินค้า')
      }

      if (quantity <= 0) {
        throw new Error('จำนวนต้องมากกว่า 0')
      }

      // Find applicable tier
      const tierApplied = await supabaseOps.calculateTierPrice(productId, quantity)
      
      const basePrice = product.base_price
      const tierPrice = tierApplied?.special_price
      const finalPrice = tierPrice || basePrice
      const savings = tierPrice ? (basePrice - tierPrice) * quantity : 0

      return {
        productId,
        quantity,
        basePrice,
        tierPrice,
        tierApplied: tierApplied || undefined,
        finalPrice: finalPrice * quantity,
        savings,
      }
    } catch (error) {
      throw new Error(
        `ไม่สามารถคำนวณราคาได้: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Get products available in store only
   */
  async getStoreProducts(): Promise<ProductWithTiers[]> {
    return this.getProducts({
      filters: { isActive: true, isAvailableInStore: true },
    })
  }

  /**
   * Get products for market comparison (reference only)
   */
  async getMarketProducts(): Promise<ProductWithTiers[]> {
    return this.getProducts({
      filters: { isActive: true, isAvailableInStore: false },
    })
  }

  /**
   * Get price tiers for a specific product
   */
  async getPriceTiers(productId: string): Promise<PriceTier[]> {
    try {
      return await supabaseOps.getPriceTiers(productId)
    } catch (error) {
      throw new Error(
        `ไม่สามารถโหลดข้อมูลราคาได้: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Apply filters to product list
   */
  private applyFilters(
    products: ProductWithTiers[],
    filters: ProductFilters
  ): ProductWithTiers[] {
    let filtered = [...products]

    if (filters.isActive !== undefined) {
      filtered = filtered.filter((p) => p.is_active === filters.isActive)
    }

    if (filters.isAvailableInStore !== undefined) {
      filtered = filtered.filter(
        (p) => p.is_available_in_store === filters.isAvailableInStore
      )
    }

    if (filters.varietyName) {
      filtered = filtered.filter((p) =>
        p.variety_name.toLowerCase().includes(filters.varietyName!.toLowerCase())
      )
    }

    if (filters.size) {
      filtered = filtered.filter((p) => p.size === filters.size)
    }

    if (filters.plantShape) {
      filtered = filtered.filter((p) => p.plant_shape === filters.plantShape)
    }

    return filtered
  }

  /**
   * Sort products by specified field
   */
  private sortProducts(
    products: ProductWithTiers[],
    orderBy: string,
    direction: 'asc' | 'desc' = 'asc'
  ): ProductWithTiers[] {
    const sorted = [...products]
    const multiplier = direction === 'asc' ? 1 : -1

    sorted.sort((a, b) => {
      let aVal: string | number
      let bVal: string | number

      switch (orderBy) {
        case 'variety_name':
          aVal = a.variety_name
          bVal = b.variety_name
          break
        case 'size':
          aVal = a.size
          bVal = b.size
          break
        case 'base_price':
          aVal = a.base_price
          bVal = b.base_price
          break
        case 'created_at':
          aVal = a.created_at
          bVal = b.created_at
          break
        default:
          return 0
      }

      if (aVal < bVal) return -1 * multiplier
      if (aVal > bVal) return 1 * multiplier
      return 0
    })

    return sorted
  }
}

// Singleton instance
export const productService = new ProductService()
