/**
 * Calculator Display Component
 * 
 * Main cart overview display showing all items with quantity controls,
 * tier pricing, and total calculations. Designed for elderly users (35+)
 * with large touch targets and clear Thai labels.
 */

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QuantitySelector } from './quantity-selector'
import { cn } from '@/lib/utils'
import type { Product, PriceTier } from '@/types/database'

export interface CalculatorItem {
  /** Product details */
  product: Product
  /** Current quantity */
  quantity: number
  /** Applied tier pricing (if any) */
  appliedTier?: PriceTier
  /** Calculated subtotal for this item */
  subtotal: number
}

export interface CalculatorDisplayProps {
  /** List of items in cart */
  items: CalculatorItem[]
  /** Callback when quantity changes */
  onQuantityChange: (productId: string, newQuantity: number) => void
  /** Callback when item is removed */
  onRemoveItem: (productId: string) => void
  /** Whether the calculator is in loading state */
  loading?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Format number as Thai currency (฿)
 */
const formatCurrency = (amount: number): string => {
  return `฿${amount.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Get tier description in Thai
 */
const getTierDescription = (tier: PriceTier): string => {
  if (tier.max_quantity === null) {
    return `ราคาพิเศษ ${tier.min_quantity}+ ต้น`
  }
  return `ราคาพิเศษ ${tier.min_quantity}-${tier.max_quantity} ต้น`
}

/**
 * Calculator display component for cart management
 * 
 * Features:
 * - Cart overview with all items
 * - Large 48px touch target quantity controls
 * - Tier pricing display with savings
 * - Remove item functionality
 * - Loading states
 * - Thai language labels
 * - Mobile-first responsive design
 * - High contrast for elderly users
 * 
 * @example
 * ```tsx
 * <CalculatorDisplay
 *   items={cartItems}
 *   onQuantityChange={(productId, qty) => updateQuantity(productId, qty)}
 *   onRemoveItem={(productId) => removeFromCart(productId)}
 * />
 * ```
 */
export const CalculatorDisplay = React.forwardRef<
  HTMLDivElement,
  CalculatorDisplayProps
>(
  (
    {
      items,
      onQuantityChange,
      onRemoveItem,
      loading = false,
      className,
    },
    ref
  ) => {
    // Handle quantity change with validation
    const handleQuantityChange = React.useCallback(
      (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
          // If quantity reaches 0, remove item
          onRemoveItem(productId)
        } else {
          onQuantityChange(productId, newQuantity)
        }
      },
      [onQuantityChange, onRemoveItem]
    )

    return (
      <Card ref={ref} className={cn('w-full', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            รายการสินค้า
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            // Loading state
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                  กำลังโหลด...
                </p>
              </div>
            </div>
          ) : items.length === 0 ? (
            // Empty state
            <div className="py-8 text-center">
              <p className="text-base text-muted-foreground">
                ยังไม่มีสินค้าในตะกร้า
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                เลือกสินค้าเพื่อเริ่มคำนวณราคา
              </p>
            </div>
          ) : (
            // Items list
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="rounded-lg border-2 border-border bg-card p-4 transition-shadow hover:shadow-md"
                >
                  {/* Product info */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <h3 className="text-base font-semibold leading-tight">
                        {item.product.variety_name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>ขนาด: {item.product.size}</span>
                        <span>•</span>
                        <span>แบบ: {item.product.plant_shape}</span>
                      </div>
                      {!item.product.is_available_in_store && (
                        <p className="text-xs text-amber-600">
                          (ราคาอ้างอิง - ไม่มีในร้าน)
                        </p>
                      )}
                    </div>
                    
                    {/* Remove button */}
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`ลบ ${item.product.variety_name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Pricing info */}
                  <div className="mb-3 space-y-1">
                    {item.appliedTier ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(item.product.base_price)}
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(item.appliedTier.special_price)}
                          </span>
                          <span className="text-xs text-green-600">
                            / ต้น
                          </span>
                        </div>
                        <p className="text-xs text-green-600">
                          {getTierDescription(item.appliedTier)}
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {formatCurrency(item.product.base_price)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          / ต้น
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quantity selector and subtotal */}
                  <div className="flex items-center justify-between gap-4">
                    <QuantitySelector
                      quantity={item.quantity}
                      onQuantityChange={(newQty) =>
                        handleQuantityChange(item.product.id, newQty)
                      }
                      min={0}
                      className="flex-1"
                      ariaLabel={`จำนวน ${item.product.variety_name}`}
                    />
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-muted-foreground">รวม</p>
                      <p className="text-lg font-bold tabular-nums text-primary">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)

CalculatorDisplay.displayName = 'CalculatorDisplay'
