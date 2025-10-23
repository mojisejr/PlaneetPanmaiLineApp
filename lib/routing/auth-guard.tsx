'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useLiff } from '@/lib/liff/liff-provider'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const { isInitialized, isLoggedIn, isLoading } = useLiff()

  useEffect(() => {
    // Wait for LIFF to initialize
    if (!isLoading && isInitialized) {
      // Redirect to login if not logged in
      if (!isLoggedIn) {
        router.push('/login')
      }
    }
  }, [isInitialized, isLoggedIn, isLoading, router])

  // Show loading state while initializing
  if (isLoading || !isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-nature-50 to-nature-100">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-nature-500 border-r-transparent"></div>
          <p className="text-lg text-nature-700">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  // Show loading state while redirecting
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-nature-50 to-nature-100">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-nature-500 border-r-transparent"></div>
          <p className="text-lg text-nature-700">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    )
  }

  // Render children if authenticated
  return <>{children}</>
}
