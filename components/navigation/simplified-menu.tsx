/**
 * Simplified Navigation Menu Component
 * 
 * Age-appropriate navigation with 6-8 essential features.
 * Uses traditional list menu layout for better elderly user experience.
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { BRANDING } from '@/lib/config/branding'

/**
 * Core features for the application
 * Limited to 6-8 essential features to reduce cognitive load for 35+ users
 */
const CORE_FEATURES = [
  { 
    icon: '🧮', 
    label: 'คำนวณราคาต้นไม้', 
    labelEn: 'Calculator',
    href: '/calculator',
    description: 'คำนวณราคาต้นทุเรียนและพันธุ์ไม้',
  },
  { 
    icon: '🌱', 
    label: 'ดูรายการพันธุ์ไม้', 
    labelEn: 'Plants',
    href: '/coming-soon',
    description: 'ดูรายการพันธุ์ไม้ทั้งหมด',
  },
  { 
    icon: '📊', 
    label: 'สรุปผลผลิต', 
    labelEn: 'Summary',
    href: '/coming-soon',
    description: 'สรุปผลการปลูกและต้นทุน',
  },
  { 
    icon: '💰', 
    label: 'บันทึกต้นทุน', 
    labelEn: 'Costs',
    href: '/coming-soon',
    description: 'บันทึกค่าใช้จ่ายและต้นทุน',
  },
  { 
    icon: '📚', 
    label: 'คู่มือการปลูก', 
    labelEn: 'Guides',
    href: '/coming-soon',
    description: 'เรียนรู้เทคนิคการปลูกต้นไม้',
  },
  { 
    icon: '🌤️', 
    label: 'พยากรณ์อากาศ', 
    labelEn: 'Weather',
    href: '/coming-soon',
    description: 'ตรวจสอบสภาพอากาศสำหรับเกษตร',
  },
  { 
    icon: '💬', 
    label: 'ติดต่อผู้ดูแล', 
    labelEn: 'Support',
    href: '/coming-soon',
    description: 'ติดต่อสอบถามและขอความช่วยเหลือ',
  },
  { 
    icon: '⚙️', 
    label: 'ตั้งค่า', 
    labelEn: 'Settings',
    href: '/coming-soon',
    description: 'จัดการโปรไฟล์และการตั้งค่า',
  },
] as const

interface SimplifiedMenuProps {
  /** Current active path for highlighting */
  currentPath?: string
  /** Additional CSS classes */
  className?: string
  /** Show descriptions under each item */
  showDescriptions?: boolean
  /** Callback when menu item is clicked */
  onItemClick?: (href: string) => void
}

/**
 * Simplified navigation menu with age-appropriate design
 * 
 * Features:
 * - Large touch targets (minimum 48px)
 * - High contrast colors
 * - Clear, readable Thai labels
 * - Traditional list layout (not app grid)
 * - Large icons with descriptive text
 * 
 * @example
 * ```tsx
 * <SimplifiedMenu currentPath="/calculator" showDescriptions />
 * ```
 */
export function SimplifiedMenu({
  currentPath,
  className,
  showDescriptions = false,
  onItemClick,
}: SimplifiedMenuProps) {
  const minTouchTarget = BRANDING.ACCESSIBILITY.MIN_TOUCH_TARGET

  return (
    <nav 
      className={cn('w-full', className)}
      aria-label="Main navigation"
    >
      <ul className="space-y-2">
        {CORE_FEATURES.map((feature) => {
          const isActive = currentPath === feature.href
          
          return (
            <li key={feature.href}>
              <Link
                href={feature.href}
                onClick={() => onItemClick?.(feature.href)}
                className={cn(
                  'flex items-center gap-4 rounded-lg p-4 transition-all',
                  'border-2 border-transparent',
                  'hover:bg-accent hover:border-primary/20',
                  'active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive && 'bg-primary/10 border-primary/30',
                )}
                style={{ minHeight: `${minTouchTarget}px` }}
              >
                {/* Icon */}
                <span 
                  className="text-3xl flex-shrink-0" 
                  role="img" 
                  aria-label={feature.labelEn}
                >
                  {feature.icon}
                </span>

                {/* Label and description */}
                <div className="flex-1 text-left">
                  <div className={cn(
                    'font-semibold leading-tight',
                    isActive ? 'text-primary' : 'text-foreground',
                    'text-base' // 16px minimum
                  )}>
                    {feature.label}
                  </div>
                  
                  {showDescriptions && (
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {feature.description}
                    </div>
                  )}
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/**
 * Compact horizontal navigation for mobile bottom bar
 */
export function CompactMenu({ currentPath, className }: {
  currentPath?: string
  className?: string
}) {
  // Show only 4 most important features in compact mode
  const compactFeatures = CORE_FEATURES.slice(0, 4)

  return (
    <nav 
      className={cn('w-full border-t bg-background', className)}
      aria-label="Bottom navigation"
    >
      <ul className="flex justify-around">
        {compactFeatures.map((feature) => {
          const isActive = currentPath === feature.href
          
          return (
            <li key={feature.href} className="flex-1">
              <Link
                href={feature.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 py-2',
                  'transition-colors',
                  'active:scale-95',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
                style={{ minHeight: `${BRANDING.ACCESSIBILITY.MIN_TOUCH_TARGET}px` }}
              >
                <span className="text-2xl" role="img" aria-label={feature.labelEn}>
                  {feature.icon}
                </span>
                <span className="text-xs font-medium">
                  {feature.label.split(' ')[0]}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export { CORE_FEATURES }
