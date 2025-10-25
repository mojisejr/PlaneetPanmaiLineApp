'use client'

import React, { useEffect } from 'react'
import { useLineProfile } from '@/hooks/use-line-profile'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorDisplay } from '@/components/ui/error-display'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldAlert, UserX } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  fallbackPath?: string
}

/**
 * Authentication Guard Component
 * Blocks non-members from accessing protected calculator features
 * Provides Thai-language feedback for authentication states
 */
export function AuthGuard({ children, fallbackPath = '/' }: AuthGuardProps) {
  const { isAuthenticated, member, isLoading, error, registrationError } = useLineProfile()

  // Redirect to fallback if not authenticated after loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated && fallbackPath) {
      // In LIFF environment, we typically don't redirect
      // Just show the not authenticated message
      console.warn('[AuthGuard] User not authenticated')
    }
  }, [isLoading, isAuthenticated, fallbackPath])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="py-12">
            <LoadingSpinner size="lg" text="กำลังตรวจสอบสิทธิ์..." />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              กรุณารอสักครู่
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error || registrationError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-red-50 to-white p-4">
        <ErrorDisplay
          title="เกิดข้อผิดพลาด"
          message={error?.message || registrationError || 'เกิดข้อผิดพลาดที่ไม่คาดคิด'}
          error={error || new Error(registrationError || 'Unknown error')}
          onRetry={() => window.location.reload()}
          className="w-full max-w-md shadow-lg"
        />
      </div>
    )
  }

  // Not authenticated state - Thai branding
  if (!isAuthenticated || !member) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-amber-50 to-white p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <UserX className="h-10 w-10 text-amber-600" />
            </div>
            <CardTitle className="text-xl font-bold text-amber-900">
              สำหรับสมาชิกเท่านั้น
            </CardTitle>
            <CardDescription className="text-base">
              คุณต้องเป็นสมาชิกของ ปราณีต พันธุ์ไม้ จันทบุรี เพื่อใช้เครื่องคำนวณราคา
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-amber-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-900">
                <ShieldAlert className="h-5 w-5" />
                สิทธิพิเศษสำหรับสมาชิก
              </h4>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-amber-600">•</span>
                  <span>คำนวณราคาต้นทุเรียนแบบเรียลไทม์</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-amber-600">•</span>
                  <span>ดูราคาพิเศษตามปริมาณ (Tiered Pricing)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-amber-600">•</span>
                  <span>เข้าถึงข้อมูลราคาตลาดล่าสุด</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-amber-600">•</span>
                  <span>บริการฟรีสำหรับสมาชิก LINE OA</span>
                </li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <p className="mb-3 text-sm text-muted-foreground">
                กรุณาเข้าสู่ระบบด้วย LINE เพื่อเข้าถึงเครื่องคำนวณ
              </p>
              <Button
                onClick={() => {
                  // In LIFF, typically handled by parent layout
                  window.location.href = fallbackPath
                }}
                className="w-full"
                size="lg"
              >
                กลับหน้าหลัก
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Authenticated and registered - show children
  return <>{children}</>
}
