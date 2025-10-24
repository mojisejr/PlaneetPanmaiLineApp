import { createClient } from './client'
import { createClient as createServerClient } from './server'
import type { Member, Product, PriceTier, ProductWithTiers } from '@/types/database'
import type { QueryOptions } from '@/types/supabase'
import { handleSupabaseError } from '@/lib/errors/supabase-error'
import type { SupabaseClient } from '@supabase/supabase-js'

// Type-safe database operations class
export class SupabaseOperations {
  private getClient() {
    return createClient()
  }

  private async getServerClient() {
    return await createServerClient()
  }

  // Generic query builder
  private async query<T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    operation: (client: SupabaseClient) => any,
    context: string,
    fallbackMessage?: string
  ): Promise<T> {
    const client = this.getClient()
    const result = operation(client)
    const { data, error } = await result

    if (error) {
      handleSupabaseError(error, context, fallbackMessage)
    }

    return data as T
  }

  // Server-side operations
  private async serverQuery<T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    operation: (client: SupabaseClient) => any,
    context: string,
    fallbackMessage?: string
  ): Promise<T> {
    const client = await this.getServerClient()
    const result = operation(client)
    const { data, error } = await result

    if (error) {
      handleSupabaseError(error, context, fallbackMessage)
    }

    return data as T
  }

  // Member operations
  async getMember(lineUserId: string): Promise<Member | null> {
    return this.query(
      client => client
        .from('members')
        .select('*')
        .eq('line_user_id', lineUserId)
        .single(),
      'getMember',
      'Failed to fetch member'
    )
  }

  async createMember(member: Omit<Member, 'id' | 'created_at' | 'updated_at' | 'registration_date'>): Promise<Member> {
    return this.serverQuery(
      client => client
        .from('members')
        .insert(member)
        .select()
        .single(),
      'createMember',
      'Failed to create member'
    )
  }

  async updateMember(lineUserId: string, updates: Partial<Member>): Promise<Member> {
    return this.query(
      client => client
        .from('members')
        .update(updates)
        .eq('line_user_id', lineUserId)
        .select()
        .single(),
      'updateMember',
      'Failed to update member'
    )
  }

  // Product operations
  async getProducts(options: QueryOptions = {}): Promise<Product[]> {
    const client = this.getClient()
    let query = client.from('products').select(options.select || '*')

    if (options.eq) {
      Object.entries(options.eq).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    if (options.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending ?? true })
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.single) {
      return this.query(
        () => query.single(),
        'getProduct',
        'Failed to fetch product'
      )
    }

    return this.query(
      () => query,
      'getProducts',
      'Failed to fetch products'
    )
  }

  async getProductsWithTiers(): Promise<ProductWithTiers[]> {
    return this.query(
      client => client
        .from('products')
        .select(`
          *,
          price_tiers (
            id,
            product_id,
            min_quantity,
            max_quantity,
            special_price,
            is_active,
            created_at,
            updated_at
          )
        `)
        .eq('is_active', true)
        .order('variety_name')
        .order('size'),
      'getProductsWithTiers',
      'Failed to fetch products with pricing'
    )
  }

  // Price tier operations
  async getPriceTiers(productId: string): Promise<PriceTier[]> {
    return this.query(
      client => client
        .from('price_tiers')
        .select('*')
        .eq('product_id', productId)
        .eq('is_active', true)
        .order('min_quantity'),
      'getPriceTiers',
      'Failed to fetch price tiers'
    )
  }

  // Calculator operations
  async calculateTierPrice(productId: string, quantity: number): Promise<PriceTier | null> {
    return this.query(
      client => client
        .from('price_tiers')
        .select('*')
        .eq('product_id', productId)
        .eq('is_active', true)
        .lte('min_quantity', quantity)
        .or(`max_quantity.is.null,max_quantity.gte.${quantity}`)
        .order('min_quantity', { ascending: false })
        .limit(1)
        .single(),
      'calculateTierPrice',
      'Failed to calculate tier price'
    )
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      await this.query(
        client => client.from('products').select('count').limit(1),
        'healthCheck'
      )

      return {
        status: 'healthy',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Singleton instance
export const supabaseOps = new SupabaseOperations()

// React hook for using Supabase operations
export function useSupabaseOperations() {
  return supabaseOps
}
