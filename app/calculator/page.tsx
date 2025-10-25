'use client'

import React from 'react'
import { AuthGuard } from '@/components/calculator/auth-guard'
import { CalculatorLayout } from '@/components/calculator/calculator-layout'
import { useLiff } from '@/hooks/use-liff'

// Force dynamic rendering (no static prerendering)
export const dynamic = 'force-dynamic'

/**
 * Calculator Page
 * Main entry point for calculator feature
 * Protected by authentication guard for members-only access
 * Uses LIFF SDK authentication for hybrid approach
 */
export default function CalculatorPage() {
  const { profile } = useLiff()

  return (
    <AuthGuard fallbackPath="/">
      <CalculatorLayout memberDisplayName={profile?.displayName || 'สมาชิก'} />
    </AuthGuard>
  )
}
