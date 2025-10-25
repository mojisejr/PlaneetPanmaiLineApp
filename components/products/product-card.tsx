/**
 * Product Card Component
 * 
 * Displays individual product information in a card format with Thai branding.
 * Optimized for 35+ users with 48px touch targets and high contrast.
 * 
 * Features:
 * - Age-appropriate design (48px minimum touch targets)
 * - Thai typography and branding
 * - Product image, name, size, and pricing
 * - Availability status indication
 * - Accessible keyboard navigation
 * - Loading and error states
 */

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { BRANDING, BRAND_COLORS } from '@/lib/config/branding'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { ProductCardProps } from '@/lib/types/product-ui'

/**
 * Format price in Thai Baht
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Product Card Component
 * 
 * @example
 * ```tsx
 * <ProductCard
 *   product={productWithPricing}
 *   onClick={(product) => handleProductSelect(product)}
 * />
 * ```
 */
export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, isLoading = false, isSelected = false, onClick, className }, ref) => {
    const handleClick = React.useCallback(() => {
      if (onClick && !isLoading) {
        onClick(product)
      }
    }, [onClick, product, isLoading])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if ((event.key === 'Enter' || event.key === ' ') && onClick && !isLoading) {
          event.preventDefault()
          onClick(product)
        }
      },
      [onClick, product, isLoading]
    )

    // Determine if product is available in store
    const isAvailable = product.is_available_in_store && product.is_active
    const availabilityLabel = isAvailable ? 'มีในร้าน' : 'ราคาอ้างอิง'
    const availabilityColor = isAvailable ? BRAND_COLORS.SUCCESS : BRAND_COLORS.WARNING

    return (
      <Card
        ref={ref}
        className={cn(
          'relative overflow-hidden transition-all duration-200',
          'hover:shadow-lg hover:scale-[1.02]',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          isSelected && 'ring-2 ring-primary shadow-lg',
          onClick && 'cursor-pointer',
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={onClick ? `เลือกสินค้า ${product.variety_name}` : undefined}
        aria-pressed={onClick ? isSelected : undefined}
        style={{
          minHeight: `${BRANDING.ACCESSIBILITY.MIN_TOUCH_TARGET * 3}px`, // At least 3x touch target height
        }}
      >
        {/* Availability Badge */}
        <div
          className="absolute top-3 right-3 z-10 rounded-full px-3 py-1 text-xs font-semibold shadow-md"
          style={{
            backgroundColor: availabilityColor,
            color: '#ffffff',
            minHeight: '24px',
          }}
          aria-label={`สถานะ: ${availabilityLabel}`}
        >
          {availabilityLabel}
        </div>

        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={`รูปภาพ ${product.variety_name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">ไม่มีรูปภาพ</span>
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <CardTitle
            className="line-clamp-2 text-lg font-semibold"
            style={{ minHeight: `${BRANDING.ACCESSIBILITY.MIN_HEADER_FONT}px` }}
          >
            {product.variety_name}
          </CardTitle>
          <CardDescription className="flex flex-col gap-1">
            <span className="text-sm">
              ขนาด: <span className="font-medium">{product.size}</span>
            </span>
            <span className="text-sm">
              ลักษณะ: <span className="font-medium">{product.plant_shape}</span>
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-3">
          {/* Base Price */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">ราคาต้น:</span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.base_price)}
              </span>
            </div>

            {/* Price Tiers Info */}
            {product.price_tiers && product.price_tiers.length > 0 && (
              <div className="mt-2 rounded-md bg-muted/50 p-2">
                <p className="text-xs text-muted-foreground mb-1">ราคาตามปริมาณ:</p>
                {product.price_tiers
                  .filter((tier) => tier.is_active)
                  .sort((a, b) => a.min_quantity - b.min_quantity)
                  .slice(0, 2) // Show only first 2 tiers to save space
                  .map((tier, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span>
                        {tier.min_quantity}
                        {tier.max_quantity ? `-${tier.max_quantity}` : '+'} ต้น
                      </span>
                      <span className="font-semibold">{formatPrice(tier.special_price)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </CardContent>

        {product.description && (
          <CardFooter className="pt-0">
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {product.description}
            </p>
          </CardFooter>
        )}
      </Card>
    )
  }
)

ProductCard.displayName = 'ProductCard'

/**
 * Product Card Skeleton for loading state
 */
export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Image skeleton */}
      <div className="aspect-square w-full animate-pulse bg-muted" />

      <CardHeader className="pb-3">
        {/* Title skeleton */}
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        {/* Description skeleton */}
        <div className="mt-2 space-y-2">
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Price skeleton */}
        <div className="flex justify-between">
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
        </div>
        {/* Tiers skeleton */}
        <div className="mt-2 space-y-1 rounded-md bg-muted/50 p-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}

ProductCardSkeleton.displayName = 'ProductCardSkeleton'
