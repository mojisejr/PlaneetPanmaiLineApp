'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLiff } from '@/hooks/use-liff'
import { useLineProfile } from '@/hooks/use-line-profile'
import { PremiumProfileCard, type MemberProfile } from '@/components/profile/premium-profile-card'
import { SimplifiedMenu } from '@/components/navigation/simplified-menu'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorDisplay } from '@/components/ui/error-display'
import { BRANDING } from '@/lib/config/branding'
import type { Member } from '@/types/database'

// Force dynamic rendering (no static prerendering)
export const dynamic = 'force-dynamic'

// Constants for fallback values
const FALLBACK_CONTACT_PLACEHOLDER = 'ยังไม่มี'
const MIN_USERID_LENGTH_FOR_MEMBER_ID = 6

/**
 * Profile Dashboard Page
 * 
 * New main dashboard with credit card-style profile and simplified menu.
 * Replaces the old /calculator landing with age-appropriate design for 35+ users.
 * 
 * Features:
 * - Premium profile card (credit card style)
 * - Simplified menu navigation (8 core features)
 * - Age-appropriate accessibility (48px touch targets, 16px+ fonts)
 * - Mobile-first design for LINE WebView
 */
export default function ProfilePage() {
  const router = useRouter()
  const { isReady, isLoggedIn, loading: liffLoading, error: liffError } = useLiff()
  const { profile, isLoading: profileLoading, error: profileError } = useLineProfile()
  const [mounted, setMounted] = useState(false)
  const [currentPath, setCurrentPath] = useState('/profile')
  const [dbMember, setDbMember] = useState<Member | null>(null)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && isReady && !liffLoading && !isLoggedIn) {
      router.push('/liff')
    }
  }, [mounted, isReady, liffLoading, isLoggedIn, router])

  // Fetch member data from database if profile is available
  useEffect(() => {
    let isCancelled = false
    
    const fetchMemberData = async () => {
      if (!profile?.userId) return
      
      try {
        const response = await fetch(`/api/auth/profile?lineUserId=${profile.userId}`)
        const data = await response.json()
        
        if (isCancelled) return
        
        if (data.exists && data.member) {
          setDbMember(data.member)
        } else {
          setDbMember(null)
        }
      } catch (error) {
        if (isCancelled) return
        console.error('Failed to fetch member data:', error)
        setDbMember(null)
      }
    }

    if (profile?.userId) {
      fetchMemberData()
    }
    
    return () => {
      isCancelled = true
    }
  }, [profile?.userId])

  // Handle menu item clicks
  const handleMenuClick = (href: string) => {
    setCurrentPath(href)
    router.push(href)
  }

  // Show loading state during authentication check
  if (!mounted || liffLoading || !isReady) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="space-y-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <h2 className="text-xl font-semibold text-foreground">
              กำลังโหลด...
            </h2>
            <p className="text-sm text-muted-foreground">กรุณารอสักครู่</p>
          </div>
        </div>
      </main>
    )
  }

  // Show error state if LIFF initialization fails
  if (liffError) {
    return (
      <ErrorDisplay
        title="เกิดข้อผิดพลาด"
        message="ไม่สามารถเชื่อมต่อกับระบบได้"
        error={liffError}
        onRetry={() => router.push('/liff')}
      />
    )
  }

  // Show profile loading state
  if (profileLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <LoadingSpinner size="lg" text="กำลังโหลดโปรไฟล์..." />
      </main>
    )
  }

  // Show profile error state
  if (profileError) {
    return (
      <ErrorDisplay
        title="ไม่สามารถโหลดโปรไฟล์ได้"
        message={profileError.message || 'กรุณาลองใหม่อีกครั้ง'}
        error={profileError}
        onRetry={() => router.push('/profile')}
      />
    )
  }

  // Build member profile data with fallbacks
  const memberProfile: MemberProfile | null = profile
    ? {
        lineUserId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        // tier: default to 'regular' unless DB says otherwise
        tier: 'regular',
        // memberId: generate from LINE userId (first 3 + last 3 chars)
        memberId: profile.userId.length >= MIN_USERID_LENGTH_FOR_MEMBER_ID
          ? `${profile.userId.slice(0, 3)}${profile.userId.slice(-3)}`
          : profile.userId,
        // registrationDate: use DB data or current date as fallback
        registrationDate: dbMember?.registration_date 
          ? new Date(dbMember.registration_date)
          : new Date(),
        // contactPhone: use placeholder if missing
        contactPhone: FALLBACK_CONTACT_PLACEHOLDER,
        // contactEmail: use placeholder if missing
        contactEmail: FALLBACK_CONTACT_PLACEHOLDER,
      }
    : null

  // Show authenticated profile dashboard
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl" role="img" aria-label="Plant">
              🌱
            </span>
            <h1 className="text-xl font-bold text-primary">
              {BRANDING.THAI_SHORT_NAME}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {/* Profile Card */}
          {memberProfile && (
            <section aria-label="Member Profile">
              <PremiumProfileCard profile={memberProfile} variant="full" />
            </section>
          )}

          {/* Navigation Menu */}
          <section aria-label="Main Menu">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                เครื่องมือสมาชิก
              </h2>
              <SimplifiedMenu
                currentPath={currentPath}
                showDescriptions={false}
                onItemClick={handleMenuClick}
              />
            </div>
          </section>

          {/* Footer Info */}
          <footer className="text-center text-sm text-muted-foreground py-4">
            <p>{BRANDING.THAI_DESCRIPTION}</p>
            <p className="mt-2">{BRANDING.BUSINESS_LOCATION}</p>
          </footer>
        </div>
      </div>
    </main>
  )
}
