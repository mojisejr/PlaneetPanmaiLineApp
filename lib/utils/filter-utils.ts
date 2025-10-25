/**
 * Utility functions for filtering and searching products
 * Includes Thai language text processing support
 */

import type { Product } from '@/types/database'

/**
 * Normalize Thai text for better search matching
 * Removes extra whitespace and normalizes characters
 */
export function normalizeThaiText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .normalize('NFC') // Normalize Unicode characters
}

/**
 * Check if text contains search query (Thai-compatible)
 * @param text - The text to search in
 * @param query - The search query
 * @returns true if text contains query
 */
export function textContains(text: string, query: string): boolean {
  if (!query) return true
  const normalizedText = normalizeThaiText(text)
  const normalizedQuery = normalizeThaiText(query)
  return normalizedText.includes(normalizedQuery)
}

/**
 * Filter products by search query (variety name)
 */
export function filterBySearch(products: Product[], searchQuery: string): Product[] {
  if (!searchQuery) return products
  return products.filter((product) => textContains(product.variety_name, searchQuery))
}

/**
 * Filter products by size
 */
export function filterBySize(products: Product[], size: string | null): Product[] {
  if (!size) return products
  return products.filter((product) => product.size === size)
}

/**
 * Filter products by plant shape
 */
export function filterByPlantShape(
  products: Product[],
  plantShape: 'กระโดง' | 'ข้าง' | null
): Product[] {
  if (!plantShape) return products
  return products.filter((product) => product.plant_shape === plantShape)
}

/**
 * Filter products by availability in store
 */
export function filterByAvailability(products: Product[], availableOnly: boolean): Product[] {
  if (!availableOnly) return products
  return products.filter((product) => product.is_available_in_store)
}

/**
 * Apply all filters to products
 */
export interface FilterOptions {
  searchQuery?: string
  size?: string | null
  plantShape?: 'กระโดง' | 'ข้าง' | null
  availableOnly?: boolean
}

export function applyFilters(products: Product[], filters: FilterOptions): Product[] {
  let filtered = products

  // Only include active products
  filtered = filtered.filter((product) => product.is_active)

  // Apply search filter
  if (filters.searchQuery) {
    filtered = filterBySearch(filtered, filters.searchQuery)
  }

  // Apply size filter
  if (filters.size) {
    filtered = filterBySize(filtered, filters.size)
  }

  // Apply plant shape filter
  if (filters.plantShape) {
    filtered = filterByPlantShape(filtered, filters.plantShape)
  }

  // Apply availability filter
  if (filters.availableOnly) {
    filtered = filterByAvailability(filtered, filters.availableOnly)
  }

  return filtered
}

/**
 * Get unique sizes from products
 */
export function getUniqueSizes(products: Product[]): string[] {
  const sizes = new Set(products.map((p) => p.size))
  return Array.from(sizes).sort()
}

/**
 * Get unique plant shapes from products
 */
export function getUniquePlantShapes(products: Product[]): Array<'กระโดง' | 'ข้าง'> {
  const shapes = new Set(products.map((p) => p.plant_shape))
  return Array.from(shapes)
}
