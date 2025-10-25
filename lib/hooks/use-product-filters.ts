/**
 * Custom hook for managing product filtering and search state
 * Includes debounced search for performance optimization
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Product } from '@/types/database'
import { applyFilters, type FilterOptions } from '@/lib/utils/filter-utils'

export interface UseProductFiltersOptions {
  products: Product[]
  searchDebounceMs?: number
}

export interface UseProductFiltersResult {
  // Filtered results
  filteredProducts: Product[]
  
  // Search state
  searchQuery: string
  debouncedSearchQuery: string
  setSearchQuery: (query: string) => void
  
  // Filter states
  selectedSize: string | null
  setSelectedSize: (size: string | null) => void
  
  selectedPlantShape: 'กระโดง' | 'ข้าง' | null
  setSelectedPlantShape: (shape: 'กระโดง' | 'ข้าง' | null) => void
  
  availableOnly: boolean
  setAvailableOnly: (available: boolean) => void
  
  // Actions
  clearFilters: () => void
  hasActiveFilters: boolean
  
  // Metadata
  totalCount: number
  filteredCount: number
}

export function useProductFilters({
  products,
  searchDebounceMs = 300,
}: UseProductFiltersOptions): UseProductFiltersResult {
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('')
  
  // Filter states
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedPlantShape, setSelectedPlantShape] = useState<'กระโดง' | 'ข้าง' | null>(null)
  const [availableOnly, setAvailableOnly] = useState<boolean>(false)
  
  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, searchDebounceMs)
    
    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery, searchDebounceMs])
  
  // Build filter options
  const filterOptions: FilterOptions = useMemo(
    () => ({
      searchQuery: debouncedSearchQuery,
      size: selectedSize,
      plantShape: selectedPlantShape,
      availableOnly,
    }),
    [debouncedSearchQuery, selectedSize, selectedPlantShape, availableOnly]
  )
  
  // Apply filters
  const filteredProducts = useMemo(
    () => applyFilters(products, filterOptions),
    [products, filterOptions]
  )
  
  // Check if any filters are active
  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        debouncedSearchQuery ||
        selectedSize ||
        selectedPlantShape ||
        availableOnly
      ),
    [debouncedSearchQuery, selectedSize, selectedPlantShape, availableOnly]
  )
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setDebouncedSearchQuery('')
    setSelectedSize(null)
    setSelectedPlantShape(null)
    setAvailableOnly(false)
  }, [])
  
  return {
    // Filtered results
    filteredProducts,
    
    // Search state
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    
    // Filter states
    selectedSize,
    setSelectedSize,
    selectedPlantShape,
    setSelectedPlantShape,
    availableOnly,
    setAvailableOnly,
    
    // Actions
    clearFilters,
    hasActiveFilters,
    
    // Metadata
    totalCount: products.length,
    filteredCount: filteredProducts.length,
  }
}
