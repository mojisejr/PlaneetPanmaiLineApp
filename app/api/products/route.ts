import { NextResponse } from 'next/server'
import { productService } from '@/lib/services/product-service'
import type { ProductsResponse, ProductErrorResponse } from '@/lib/types/products'

/**
 * GET /api/products
 * Fetch products with optional filtering and tier pricing
 * 
 * Query Parameters:
 * - active: Filter by active status (true/false)
 * - store: Filter by store availability (true/false)
 * - variety: Filter by variety name (partial match)
 * - size: Filter by size (exact match)
 * - shape: Filter by plant shape (กระโดง/ข้าง)
 * - tiers: Include price tiers (true/false, default: true)
 * - orderBy: Sort field (variety_name/size/base_price/created_at)
 * - orderDir: Sort direction (asc/desc, default: asc)
 * - limit: Maximum number of results
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const activeParam = searchParams.get('active')
    const storeParam = searchParams.get('store')
    const varietyParam = searchParams.get('variety')
    const sizeParam = searchParams.get('size')
    const shapeParam = searchParams.get('shape')
    const tiersParam = searchParams.get('tiers')
    const orderByParam = searchParams.get('orderBy')
    const orderDirParam = searchParams.get('orderDir')
    const limitParam = searchParams.get('limit')

    // Build query options
    const options = {
      filters: {
        isActive: activeParam !== null ? activeParam === 'true' : undefined,
        isAvailableInStore: storeParam !== null ? storeParam === 'true' : undefined,
        varietyName: varietyParam || undefined,
        size: sizeParam || undefined,
        plantShape: 
          (shapeParam === 'กระโดง' || shapeParam === 'ข้าง')
            ? (shapeParam as 'กระโดง' | 'ข้าง')
            : undefined,
      },
      includeTiers: tiersParam !== null ? tiersParam === 'true' : true,
      orderBy:
        (orderByParam === 'variety_name' ||
        orderByParam === 'size' ||
        orderByParam === 'base_price' ||
        orderByParam === 'created_at')
          ? (orderByParam as 'variety_name' | 'size' | 'base_price' | 'created_at')
          : undefined,
      orderDirection:
        (orderDirParam === 'asc' || orderDirParam === 'desc')
          ? (orderDirParam as 'asc' | 'desc')
          : undefined,
      limit: limitParam ? parseInt(limitParam, 10) : undefined,
    }

    // Fetch products
    const products = await productService.getProducts(options)

    // Build response
    const response: ProductsResponse = {
      products,
      count: products.length,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error fetching products:', error)

    const errorResponse: ProductErrorResponse = {
      error: 'FETCH_PRODUCTS_ERROR',
      message:
        error instanceof Error
          ? error.message
          : 'ไม่สามารถโหลดข้อมูลสินค้าได้',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.stack : undefined,
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}

/**
 * OPTIONS /api/products
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  )
}
