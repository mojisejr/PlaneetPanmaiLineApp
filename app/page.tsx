'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLiff } from '@/lib/liff/liff-provider'

export default function HomePage() {
  const router = useRouter()
  const { isInitialized, isLoggedIn, isLoading } = useLiff()

  useEffect(() => {
    if (!isLoading && isInitialized) {
      if (isLoggedIn) {
        // Redirect to dashboard if logged in
        router.push('/calculator')
      } else {
        // Redirect to login if not logged in
        router.push('/login')
      }
    }
  }, [isInitialized, isLoggedIn, isLoading, router])

  // Show loading state
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-nature-50 to-nature-100">
      <div className="text-center">
        <div className="mb-6">
          <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-nature-500 border-r-transparent"></div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-nature-800">
          ร้านต้นทุเรียน
        </h1>
        <p className="text-lg text-nature-700">กำลังโหลดแอปพลิเคชัน...</p>
      </div>
    </div>
  )
}
