'use client'

import React from 'react'
import { AuthGuard } from '@/components/calculator/auth-guard'
import { CalculatorLayout } from '@/components/calculator/calculator-layout'
import { useLineProfile } from '@/hooks/use-line-profile'

/**
 * Calculator Page
 * Main entry point for calculator feature
 * Protected by authentication guard for members-only access
 */
export default function CalculatorPage() {
  const { member } = useLineProfile()

  return (
    <AuthGuard fallbackPath="/">
      <CalculatorLayout memberDisplayName={member?.display_name || 'สมาชิก'} />
    </AuthGuard>
  )
}
