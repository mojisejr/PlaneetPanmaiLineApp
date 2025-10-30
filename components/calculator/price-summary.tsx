/**
 * Price Summary Component
 * 
 * Displays tiered pricing breakdown with savings calculations
 * and Thai currency formatting (฿)
 */

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { PriceTier } from '@/types/database'

export interface PriceSummaryItem {
  /** Product name */
  name: string
  /** Quantity */
  quantity: number
  /** Base price per unit */
  basePrice: number
  /** Applied tier (if any) */
  appliedTier?: PriceTier
  /** Calculated subtotal */
  subtotal: number
}

export interface PriceSummaryProps {
  /** List of items in cart */
  items: PriceSummaryItem[]
  /** Total amount before savings */
  totalBeforeSavings?: number
  /** Total savings from tier pricing */
  totalSavings?: number
  /** Final total amount */
  total: number
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
    return `${tier.min_quantity}+ ต้น`
  }
  return `${tier.min_quantity}-${tier.max_quantity} ต้น`
}

/**
 * Price summary component with tier pricing breakdown
 * 
 * Features:
 * - Thai currency formatting (฿)
 * - Tier pricing display with savings
 * - Large, readable text for elderly users
 * - High contrast colors
 * - Mobile-first responsive design
 * 
 * @example
 * ```tsx
 * <PriceSummary
 *   items={cartItems}
 *   total={5000}
 *   totalSavings={500}
 *   totalBeforeSavings={5500}
 * />
 * ```
 */
export const PriceSummary = React.forwardRef<
  HTMLDivElement,
  PriceSummaryProps
>(
  (
    {
      items,
      totalBeforeSavings,
      totalSavings = 0,
      total,
      className,
    },
    ref
  ) => {
    // Calculate total before savings if not provided
    const calculatedTotalBeforeSavings = React.useMemo(() => {
      if (totalBeforeSavings !== undefined) {
        return totalBeforeSavings
      }
      return items.reduce((sum, item) => {
        return sum + item.basePrice * item.quantity
      }, 0)
    }, [items, totalBeforeSavings])

    return (
      <Card ref={ref} className={cn('w-full', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            สรุปราคา
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Item list */}
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-1 border-b border-border pb-2 last:border-b-0"
                >
                  {/* Item name and quantity */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-base font-medium leading-tight">
                        {item.name}
                      </p>
                      {item.appliedTier && (
                        <p className="text-sm text-muted-foreground">
                          ราคาพิเศษ: {getTierDescription(item.appliedTier)}
                        </p>
                      )}
                    </div>
                    <p className="text-base font-medium tabular-nums">
                      ×{item.quantity}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between gap-2 text-sm">
                    {item.appliedTier ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground line-through">
                            {formatCurrency(item.basePrice)}
                          </span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(item.appliedTier.special_price)}
                          </span>
                        </div>
                        <span className="font-semibold tabular-nums">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-muted-foreground">
                          {formatCurrency(item.basePrice)}
                        </span>
                        <span className="font-semibold tabular-nums">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-muted-foreground">
              ยังไม่มีสินค้าในตะกร้า
            </p>
          )}

          {/* Pricing summary */}
          {items.length > 0 && (
            <div className="space-y-2 border-t border-border pt-3">
              {/* Subtotal before savings */}
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ราคาปกติ</span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatCurrency(calculatedTotalBeforeSavings)}
                  </span>
                </div>
              )}

              {/* Savings */}
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-green-600">
                    ส่วนลดจากราคาพิเศษ
                  </span>
                  <span className="font-medium tabular-nums text-green-600">
                    −{formatCurrency(totalSavings)}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="text-lg font-semibold">รวมทั้งหมด</span>
                <span className="text-xl font-bold tabular-nums text-primary">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)

PriceSummary.displayName = 'PriceSummary'
