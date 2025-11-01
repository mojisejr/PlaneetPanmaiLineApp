/**
 * Premium Profile Card Component
 * 
 * Credit card-style profile component with premium member experience.
 * Features age-appropriate design with large text and high contrast.
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { BRANDING, MEMBER_TIERS } from '@/lib/config/branding'
import { Avatar } from '@/components/ui/avatar'

export interface MemberProfile {
  /** LINE user ID */
  lineUserId: string
  /** Display name */
  displayName: string
  /** Profile picture URL */
  pictureUrl?: string
  /** Member tier (premium or regular) */
  tier: 'premium' | 'regular'
  /** Member ID for display */
  memberId?: string
  /** Registration date */
  registrationDate?: Date
  /** Contact phone number */
  contactPhone?: string
  /** Contact email */
  contactEmail?: string
}

interface PremiumProfileCardProps {
  /** Member profile data */
  profile: MemberProfile
  /** Additional CSS classes */
  className?: string
  /** Show full details or compact view */
  variant?: 'full' | 'compact'
}

/**
 * Premium profile card with credit card-style design
 * 
 * Features:
 * - Gradient background (gold for premium, silver for regular)
 * - Large, readable typography (18px+ headers, 16px body)
 * - High contrast text on gradient background
 * - Member status badge
 * - Touch-friendly layout
 * 
 * @example
 * ```tsx
 * <PremiumProfileCard 
 *   profile={{
 *     lineUserId: 'U1234567890',
 *     displayName: 'สมชาย เกษตรกร',
 *     tier: 'premium',
 *     memberId: 'PM-2024-001',
 *     registrationDate: new Date('2024-01-15')
 *   }}
 * />
 * ```
 */
export function PremiumProfileCard({
  profile,
  className,
  variant = 'full',
}: PremiumProfileCardProps) {
  const tierInfo = profile.tier === 'premium' 
    ? MEMBER_TIERS.PREMIUM 
    : MEMBER_TIERS.REGULAR

  // Gradient colors based on tier
  const gradientClass = profile.tier === 'premium'
    ? 'bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600'
    : 'bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400'

  const formatDate = (date?: Date) => {
    if (!date) return '-'
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl shadow-2xl',
        'p-6 md:p-8 text-white',
        gradientClass,
        className
      )}
      style={{ minHeight: `${BRANDING.ACCESSIBILITY.MIN_TOUCH_TARGET * 4}px` }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      {/* Card content */}
      <div className="relative z-10 space-y-4">
        {/* Header with avatar and tier badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {profile.pictureUrl && (
              <Avatar className="h-16 w-16 md:h-20 md:w-20 ring-2 ring-white/30 border border-white/10">
                <img 
                  src={profile.pictureUrl} 
                  alt={profile.displayName}
                  className="object-cover rounded-full"
                />
              </Avatar>
            )}
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold leading-tight drop-shadow-md">
                {profile.displayName}
              </h2>
              <p className="text-base font-medium text-white/90">
                {BRANDING.THAI_NAME}
              </p>
            </div>
          </div>

          {/* Tier badge */}
          <div 
            className={cn(
              'inline-flex items-center justify-center',
              'min-h-[36px] md:min-h-[40px] px-3 md:px-4 rounded-full',
              'text-sm md:text-base font-semibold text-white',
              'bg-white/20 backdrop-blur-sm border border-white/30',
            )}
            role="status"
            aria-label={`Member tier: ${tierInfo.label}`}
          >
            <span className="sr-only">Member tier: </span>
            {tierInfo.label}
          </div>
        </div>

        {variant === 'full' && (
          <>
            {/* Member ID */}
            {profile.memberId && (
              <div className="space-y-1">
                <p className="text-base font-medium text-white/80">
                  รหัสสมาชิก (Member ID)
                </p>
                <p className="text-lg font-mono tracking-wider">
                  {profile.memberId}
                </p>
              </div>
            )}

            {/* Registration date */}
            {profile.registrationDate && (
              <div className="space-y-1">
                <p className="text-base font-medium text-white/80">
                  สมัครสมาชิกเมื่อ
                </p>
                <p className="text-base font-medium">
                  {formatDate(profile.registrationDate)}
                </p>
              </div>
            )}

            {/* Contact information */}
            {(profile.contactPhone || profile.contactEmail) && (
              <div className="pt-2 border-t border-white/20">
                <p className="text-base font-medium text-white/80 mb-2">
                  ข้อมูลติดต่อ
                </p>
                <div className="space-y-1 text-base">
                  {profile.contactPhone && (
                    <p className="flex items-center gap-2">
                      <span>📱</span>
                      <span>{profile.contactPhone}</span>
                    </p>
                  )}
                  {profile.contactEmail && (
                    <p className="flex items-center gap-2">
                      <span>📧</span>
                      <span>{profile.contactEmail}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Member benefits preview */}
            <div className="pt-3 border-t border-white/20">
              <p className="text-base font-medium text-white/80 mb-2">
                สิทธิประโยชน์
              </p>
              <div className="flex flex-wrap gap-2">
                {tierInfo.benefits.slice(0, 3).map((benefit, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm font-medium rounded-full bg-white/20 backdrop-blur-sm"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Compact view - just name and tier */}
        {variant === 'compact' && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-base text-white/80">
              สมาชิกตั้งแต่ {formatDate(profile.registrationDate)}
            </p>
          </div>
        )}
      </div>

      {/* Bottom logo watermark */}
      <div className="absolute bottom-3 right-3 opacity-20">
        <span className="text-4xl">🌱</span>
      </div>
    </div>
  )
}

/**
 * Compact profile card for headers/navigation
 */
export function CompactProfileCard({ profile, className }: {
  profile: Pick<MemberProfile, 'displayName' | 'pictureUrl' | 'tier'>
  className?: string
}) {
  const tierInfo = profile.tier === 'premium' 
    ? MEMBER_TIERS.PREMIUM 
    : MEMBER_TIERS.REGULAR

  return (
    <div className={cn('flex items-center gap-3 p-3 rounded-lg bg-card border', className)}>
      {profile.pictureUrl && (
        <Avatar className="h-12 w-12">
          <img 
            src={profile.pictureUrl} 
            alt={profile.displayName}
            className="object-cover rounded-full"
          />
        </Avatar>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-base truncate">
          {profile.displayName}
        </p>
        <p className="text-base text-muted-foreground">
          {tierInfo.label}
        </p>
      </div>
    </div>
  )
}
