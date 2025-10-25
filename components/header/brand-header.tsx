/**
 * Brand Header Component
 * 
 * Consistent branding header for all pages with Praneet Panmai identity.
 * Features age-appropriate typography and high contrast design.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { BRANDING } from '@/lib/config/branding'

interface BrandHeaderProps {
  /** Show full name or short name */
  variant?: 'full' | 'short'
  /** Show tagline below name */
  showTagline?: boolean
  /** Additional CSS classes */
  className?: string
  /** Size variant for different contexts */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Brand header with Praneet Panmai branding
 * 
 * Displays the business name with consistent styling and accessibility features.
 * 
 * @example
 * ```tsx
 * <BrandHeader variant="full" showTagline size="lg" />
 * ```
 */
export function BrandHeader({
  variant = 'full',
  showTagline = false,
  className,
  size = 'md',
}: BrandHeaderProps) {
  const sizeClasses = {
    sm: {
      title: 'text-xl font-bold', // 20px
      subtitle: 'text-sm', // 14px
    },
    md: {
      title: 'text-2xl font-bold', // 24px
      subtitle: 'text-base', // 16px
    },
    lg: {
      title: 'text-4xl font-bold', // 36px
      subtitle: 'text-lg', // 18px
    },
  }

  const displayName = variant === 'full' 
    ? BRANDING.THAI_NAME 
    : BRANDING.THAI_SHORT_NAME

  return (
    <header className={cn('space-y-2 text-center', className)}>
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl" role="img" aria-label="Plant">🌱</span>
        <h1 className={cn(
          sizeClasses[size].title,
          'tracking-tight text-primary'
        )}>
          {displayName}
        </h1>
      </div>
      
      {showTagline && (
        <p className={cn(
          sizeClasses[size].subtitle,
          'text-muted-foreground'
        )}>
          {BRANDING.THAI_DESCRIPTION}
        </p>
      )}
    </header>
  )
}

/**
 * Compact brand header for navigation bars
 */
export function CompactBrandHeader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-xl" role="img" aria-label="Plant">🌱</span>
      <span className="text-lg font-bold text-primary">
        {BRANDING.THAI_SHORT_NAME}
      </span>
    </div>
  )
}
