import { createClient } from './server'

export async function testDatabaseConnection() {
  try {
    const supabase = await createClient()

    // Test basic connectivity
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1)

    if (productsError) {
      throw new Error(`Products query failed: ${productsError.message}`)
    }

    // Test RLS policies (this should work for authenticated users)
    const { data: members } = await supabase
      .from('members')
      .select('count')
      .limit(1)

    // Test price tiers
    const { data: priceTiers, error: priceTiersError } = await supabase
      .from('price_tiers')
      .select('count')
      .limit(1)

    if (priceTiersError) {
      throw new Error(`Price tiers query failed: ${priceTiersError.message}`)
    }

    return {
      success: true,
      message: 'Database connection and basic queries successful',
      products: products?.length || 0,
      members: members?.length || 0,
      priceTiers: priceTiers?.length || 0,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      products: 0,
      members: 0,
      priceTiers: 0,
    }
  }
}
