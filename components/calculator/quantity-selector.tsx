/**
 * Quantity Selector Component
 * 
 * Age-appropriate quantity controls for elderly users (35+)
 * with large 48px touch targets for easy interaction.
 */

import * as React from 'react'
import { AgeAppropriateButton } from '@/components/ui/age-appropriate-button'
import { cn } from '@/lib/utils'

export interface QuantitySelectorProps {
  /** Current quantity value */
  quantity: number
  /** Callback when quantity changes */
  onQuantityChange: (newQuantity: number) => void
  /** Minimum allowed quantity (default: 1) */
  min?: number
  /** Maximum allowed quantity (optional) */
  max?: number
  /** Whether the selector is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Aria label for accessibility */
  ariaLabel?: string
}

/**
 * Age-appropriate quantity selector with large touch targets
 * 
 * Features:
 * - 48px minimum touch targets for + and - buttons
 * - Large, readable text for quantity display
 * - High contrast colors (4.5:1 ratio)
 * - Clear visual feedback on interaction
 * - Keyboard navigation support
 * - Thai language labels
 * 
 * @example
 * ```tsx
 * <QuantitySelector
 *   quantity={5}
 *   onQuantityChange={(qty) => updateCart(productId, qty)}
 *   min={1}
 *   max={100}
 * />
 * ```
 */
export const QuantitySelector = React.forwardRef<
  HTMLDivElement,
  QuantitySelectorProps
>(
  (
    {
      quantity,
      onQuantityChange,
      min = 1,
      max,
      disabled = false,
      className,
      ariaLabel = 'จำนวน',
    },
    ref
  ) => {
    // Ensure quantity is within bounds
    const clampedQuantity = React.useMemo(() => {
      let value = quantity
      if (value < min) value = min
      if (max !== undefined && value > max) value = max
      return value
    }, [quantity, min, max])

    // Check if we can decrease/increase
    const canDecrease = clampedQuantity > min && !disabled
    const canIncrease = (max === undefined || clampedQuantity < max) && !disabled

    // Handle decrease
    const handleDecrease = React.useCallback(() => {
      if (canDecrease) {
        onQuantityChange(clampedQuantity - 1)
      }
    }, [canDecrease, clampedQuantity, onQuantityChange])

    // Handle increase
    const handleIncrease = React.useCallback(() => {
      if (canIncrease) {
        onQuantityChange(clampedQuantity + 1)
      }
    }, [canIncrease, clampedQuantity, onQuantityChange])

    // Handle keyboard navigation
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return

        switch (e.key) {
          case 'ArrowUp':
          case 'ArrowRight':
            e.preventDefault()
            handleIncrease()
            break
          case 'ArrowDown':
          case 'ArrowLeft':
            e.preventDefault()
            handleDecrease()
            break
        }
      },
      [disabled, handleDecrease, handleIncrease]
    )

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 rounded-lg border-2 border-input bg-background p-1',
          className
        )}
        role="group"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
      >
        {/* Decrease button */}
        <AgeAppropriateButton
          size="icon"
          variant="outline"
          onClick={handleDecrease}
          disabled={!canDecrease}
          aria-label="ลดจำนวน"
          className="shrink-0"
        >
          <span className="text-xl font-bold" aria-hidden="true">
            −
          </span>
        </AgeAppropriateButton>

        {/* Quantity display */}
        <div
          className="flex min-w-[3rem] flex-1 items-center justify-center px-2"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-xl font-semibold tabular-nums">
            {clampedQuantity}
          </span>
        </div>

        {/* Increase button */}
        <AgeAppropriateButton
          size="icon"
          variant="outline"
          onClick={handleIncrease}
          disabled={!canIncrease}
          aria-label="เพิ่มจำนวน"
          className="shrink-0"
        >
          <span className="text-xl font-bold" aria-hidden="true">
            +
          </span>
        </AgeAppropriateButton>
      </div>
    )
  }
)

QuantitySelector.displayName = 'QuantitySelector'
