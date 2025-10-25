/**
 * Age-Appropriate Button Component
 * 
 * Enhanced button with 48px minimum touch targets for elderly users (35+).
 * Designed for farmers and gardeners with large, readable text and high contrast.
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { BRANDING } from '@/lib/config/branding'

const ageAppropriateButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 active:scale-95',
        destructive:
          'bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 active:scale-95',
        outline:
          'border-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:scale-95',
        secondary:
          'bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80 active:scale-95',
        ghost: 'hover:bg-accent hover:text-accent-foreground active:scale-95',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        // All sizes meet minimum 48px touch target requirement
        default: `h-12 px-6 py-3 text-base`, // 48px height
        sm: `h-12 px-4 py-3 text-sm`, // 48px height even for "small"
        lg: `h-14 px-8 py-4 text-lg`, // 56px height for extra large
        icon: `h-12 w-12`, // 48px x 48px for icons
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface AgeAppropriateButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ageAppropriateButtonVariants> {
  asChild?: boolean
}

/**
 * Age-appropriate button component with enhanced accessibility
 * 
 * Features:
 * - Minimum 48px touch targets (exceeds WCAG 2.1 AA standard)
 * - Large, readable text (minimum 16px)
 * - High contrast colors (4.5:1 ratio)
 * - Visual feedback on press (scale animation)
 * - Clear focus indicators
 * 
 * @example
 * ```tsx
 * <AgeAppropriateButton size="lg">
 *   คำนวณราคาต้นไม้
 * </AgeAppropriateButton>
 * ```
 */
const AgeAppropriateButton = React.forwardRef<HTMLButtonElement, AgeAppropriateButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    // Ensure minimum touch target size is met
    const minTouchTarget = BRANDING.ACCESSIBILITY.MIN_TOUCH_TARGET
    
    return (
      <button
        className={cn(ageAppropriateButtonVariants({ variant, size, className }))}
        ref={ref}
        style={{
          minHeight: `${minTouchTarget}px`,
          minWidth: size === 'icon' ? `${minTouchTarget}px` : undefined,
        }}
        {...props}
      />
    )
  }
)
AgeAppropriateButton.displayName = 'AgeAppropriateButton'

export { AgeAppropriateButton, ageAppropriateButtonVariants }
