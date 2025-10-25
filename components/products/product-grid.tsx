/**
 * Product Grid Component
 * 
 * Responsive grid layout for displaying product cards.
 * Optimized for mobile-first design with LINE WebView support.
 * 
 * Features:
 * - Responsive grid (1 column on mobile, 2 on tablet, 3+ on desktop)
 * - Mobile-first design (320px minimum width)
 * - Loading skeleton states
 * - Error state handling
 * - Accessibility support
 * - Large touch targets for elderly users
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { BRANDING } from '@/lib/config/branding'
import { ProductCard, ProductCardSkeleton } from './product-card'
import type { ProductGridProps } from '@/lib/types/product-ui'

/**
 * Product Grid Component
 * 
 * @example
 * ```tsx
 * <ProductGrid
 *   products={products}
 *   isLoading={isLoading}
 *   error={error}
 *   onProductClick={(product) => handleProductSelect(product)}
 * />
 * ```
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  loadingCount = 6,
  error = null,
  onProductClick,
  className,
}) => {
  // Show loading skeletons
  if (isLoading && products.length === 0) {
    return (
      <div
        className={cn(
          'grid gap-4',
          // Responsive grid columns
          'grid-cols-1', // Mobile (320px+)
          'sm:grid-cols-2', // Tablet (375px+)
          'md:grid-cols-2', // Tablet landscape (768px+)
          'lg:grid-cols-3', // Desktop (1024px+)
          'xl:grid-cols-3', // Large desktop (1280px+)
          className
        )}
        role="status"
        aria-label="กำลังโหลดสินค้า"
      >
        {Array.from({ length: loadingCount }).map((_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div
        className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg border border-destructive bg-destructive/10 p-8 text-center"
        role="alert"
        aria-live="polite"
      >
        <div className="text-destructive">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <h3
            className="text-lg font-semibold text-destructive mb-2"
            style={{ fontSize: `${BRANDING.ACCESSIBILITY.MIN_HEADER_FONT}px` }}
          >
            เกิดข้อผิดพลาด
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        </div>
      </div>
    )
  }

  // Show empty state
  if (!isLoading && products.length === 0) {
    return (
      <div
        className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center"
        role="status"
        aria-label="ไม่พบสินค้า"
      >
        <div className="text-muted-foreground">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ fontSize: `${BRANDING.ACCESSIBILITY.MIN_HEADER_FONT}px` }}
          >
            ไม่พบสินค้า
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            ขณะนี้ยังไม่มีสินค้าในระบบ กรุณาลองใหม่อีกครั้งภายหลัง
          </p>
        </div>
      </div>
    )
  }

  // Show products grid
  return (
    <div
      className={cn(
        'grid gap-4',
        // Responsive grid columns matching requirements
        'grid-cols-1', // Mobile: 1 column (320px minimum)
        'sm:grid-cols-2', // Small tablet: 2 columns (375px+)
        'md:grid-cols-2', // Tablet: 2 columns (768px+)
        'lg:grid-cols-3', // Desktop: 3+ columns (1024px+)
        'xl:grid-cols-3', // Large desktop: 3 columns (1280px+)
        '2xl:grid-cols-4', // Extra large: 4 columns (1536px+)
        className
      )}
      role="list"
      aria-label="รายการสินค้า"
    >
      {products.map((product) => (
        <div key={product.id} role="listitem">
          <ProductCard
            product={product}
            onClick={onProductClick}
            className="h-full"
          />
        </div>
      ))}
    </div>
  )
}

ProductGrid.displayName = 'ProductGrid'

/**
 * Product Grid Container
 * 
 * Wrapper component with consistent padding and spacing
 * 
 * @example
 * ```tsx
 * <ProductGridContainer>
 *   <ProductGrid products={products} />
 * </ProductGridContainer>
 * ```
 */
export const ProductGridContainer: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'w-full',
        // Consistent padding
        'px-4 py-6',
        'sm:px-6 sm:py-8',
        'lg:px-8',
        className
      )}
    >
      {children}
    </div>
  )
}

ProductGridContainer.displayName = 'ProductGridContainer'
