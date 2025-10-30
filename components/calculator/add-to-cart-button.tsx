/**
 * Add to Cart Button Component
 * 
 * Age-appropriate button with loading states and proper feedback
 * for adding products to the calculator cart.
 */

import * as React from 'react'
import { AgeAppropriateButton } from '@/components/ui/age-appropriate-button'
import { cn } from '@/lib/utils'

export interface AddToCartButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Callback when button is clicked */
  onAddToCart: () => void | Promise<void>
  /** Whether the button is in loading state */
  loading?: boolean
  /** Text to display on button (default: "เพิ่มลงตะกร้า") */
  text?: string
  /** Text to display while loading (default: "กำลังเพิ่ม...") */
  loadingText?: string
  /** Success message to show briefly after successful add */
  successText?: string
  /** Duration to show success message in ms (default: 2000) */
  successDuration?: number
  /** Whether the product is available in store */
  isAvailable?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Add to cart button with loading and success states
 * 
 * Features:
 * - 48px minimum touch target
 * - Loading state with feedback
 * - Success state with auto-hide
 * - High contrast colors
 * - Thai language labels
 * - Disabled state for unavailable products
 * 
 * @example
 * ```tsx
 * <AddToCartButton
 *   onAddToCart={async () => {
 *     await addProductToCart(productId, quantity)
 *   }}
 *   isAvailable={product.is_available_in_store}
 * />
 * ```
 */
export const AddToCartButton = React.forwardRef<
  HTMLButtonElement,
  AddToCartButtonProps
>(
  (
    {
      onAddToCart,
      loading: externalLoading = false,
      text = 'เพิ่มลงตะกร้า',
      loadingText = 'กำลังเพิ่ม...',
      successText = 'เพิ่มเรียบร้อย ✓',
      successDuration = 2000,
      isAvailable = true,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const [internalLoading, setInternalLoading] = React.useState(false)
    const [showSuccess, setShowSuccess] = React.useState(false)
    const successTimeoutRef = React.useRef<NodeJS.Timeout>()

    // Combined loading state
    const isLoading = externalLoading || internalLoading

    // Clean up timeout on unmount
    React.useEffect(() => {
      return () => {
        if (successTimeoutRef.current) {
          clearTimeout(successTimeoutRef.current)
        }
      }
    }, [])

    // Handle click
    const handleClick = React.useCallback(async () => {
      if (isLoading || showSuccess || !isAvailable) return

      try {
        setInternalLoading(true)
        const result = onAddToCart()

        // Handle promise if returned
        if (result instanceof Promise) {
          await result
        }

        // Show success state
        setShowSuccess(true)
        
        // Auto-hide success message
        successTimeoutRef.current = setTimeout(() => {
          setShowSuccess(false)
        }, successDuration)
      } catch (error) {
        console.error('Error adding to cart:', error)
        // Could emit error event or show error state here
      } finally {
        setInternalLoading(false)
      }
    }, [
      isLoading,
      showSuccess,
      isAvailable,
      onAddToCart,
      successDuration,
    ])

    // Determine button text
    const buttonText = React.useMemo(() => {
      if (showSuccess) return successText
      if (isLoading) return loadingText
      if (!isAvailable) return 'สินค้าไม่พร้อมจำหน่าย'
      return text
    }, [showSuccess, isLoading, isAvailable, successText, loadingText, text])

    // Determine button variant
    const buttonVariant = React.useMemo(() => {
      if (showSuccess) return 'secondary' as const
      return 'default' as const
    }, [showSuccess])

    return (
      <AgeAppropriateButton
        ref={ref}
        onClick={handleClick}
        disabled={disabled || isLoading || showSuccess || !isAvailable}
        variant={buttonVariant}
        size="lg"
        className={cn(
          'w-full transition-all',
          showSuccess && 'bg-green-600 hover:bg-green-600 text-white',
          !isAvailable && 'opacity-50',
          className
        )}
        aria-live="polite"
        aria-busy={isLoading}
        {...props}
      >
        {buttonText}
      </AgeAppropriateButton>
    )
  }
)

AddToCartButton.displayName = 'AddToCartButton'
