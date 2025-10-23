'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useLiff } from '@/lib/liff/provider'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/login',
}: AuthGuardProps) {
  const { isInitialized, isLoggedIn, isLoading } = useLiff()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isInitialized) {
      if (requireAuth && !isLoggedIn) {
        router.push(redirectTo)
      }
    }
  }, [isInitialized, isLoggedIn, isLoading, requireAuth, redirectTo, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !isLoggedIn) {
    return null
  }

  return <>{children}</>
}
