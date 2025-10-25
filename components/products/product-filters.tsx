/**
 * Product Filters Component
 * Provides filtering options for durian plants: size, plant shape, and availability
 * Mobile-first design optimized for LINE WebView
 */

import * as React from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ProductFiltersProps {
  // Size filter
  selectedSize: string | null
  onSizeChange: (size: string | null) => void
  availableSizes: string[]
  
  // Plant shape filter
  selectedPlantShape: 'กระโดง' | 'ข้าง' | null
  onPlantShapeChange: (shape: 'กระโดง' | 'ข้าง' | null) => void
  
  // Availability filter
  availableOnly: boolean
  onAvailabilityChange: (available: boolean) => void
  
  // Clear filters
  onClearFilters: () => void
  hasActiveFilters: boolean
  
  // Results count
  filteredCount: number
  totalCount: number
  
  className?: string
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedSize,
  onSizeChange,
  availableSizes,
  selectedPlantShape,
  onPlantShapeChange,
  availableOnly,
  onAvailabilityChange,
  onClearFilters,
  hasActiveFilters,
  filteredCount,
  totalCount,
  className,
}) => {
  const plantShapes: Array<'กระโดง' | 'ข้าง'> = ['กระโดง', 'ข้าง']
  
  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" aria-hidden="true" />
          <h3 className="text-base font-semibold text-gray-900">
            ตัวกรอง
          </h3>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 gap-1 text-sm"
            aria-label="ล้างตัวกรองทั้งหมด"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            ล้างทั้งหมด
          </Button>
        )}
      </div>
      
      {/* Results Count */}
      <div className="text-sm text-gray-600" role="status" aria-live="polite">
        แสดง {filteredCount} จาก {totalCount} รายการ
      </div>
      
      {/* Size Filter */}
      {availableSizes.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            ขนาด
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="เลือกขนาด">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSizeChange(selectedSize === size ? null : size)}
                className={cn(
                  'min-h-[44px] rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                  selectedSize === size
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                )}
                aria-pressed={selectedSize === size}
                aria-label={`เลือกขนาด ${size}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Plant Shape Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          รูปแบบต้น
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="เลือกรูปแบบต้น">
          {plantShapes.map((shape) => (
            <button
              key={shape}
              type="button"
              onClick={() => onPlantShapeChange(selectedPlantShape === shape ? null : shape)}
              className={cn(
                'min-h-[44px] rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary/20',
                selectedPlantShape === shape
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              )}
              aria-pressed={selectedPlantShape === shape}
              aria-label={`เลือกรูปแบบต้น ${shape}`}
            >
              {shape}
            </button>
          ))}
        </div>
      </div>
      
      {/* Availability Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => onAvailabilityChange(e.target.checked)}
            className={cn(
              'h-5 w-5 rounded border-gray-300 text-primary',
              'focus:ring-2 focus:ring-primary/20 focus:ring-offset-0',
              'transition-colors duration-200'
            )}
            aria-label="แสดงเฉพาะสินค้าที่มีในร้าน"
          />
          <span className="text-sm font-medium text-gray-700">
            แสดงเฉพาะสินค้าที่มีในร้าน
          </span>
        </label>
      </div>
    </div>
  )
}

ProductFilters.displayName = 'ProductFilters'
