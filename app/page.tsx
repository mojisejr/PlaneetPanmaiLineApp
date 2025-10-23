'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLiff } from '@/lib/liff/provider'

export default function HomePage() {
  const { isInitialized, isLoggedIn, isLoading } = useLiff()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isInitialized) {
      if (isLoggedIn) {
        router.push('/calculator')
      } else {
        router.push('/login')
      }
    }
  }, [isInitialized, isLoggedIn, isLoading, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <h1 className="mt-4 text-xl font-semibold text-green-900">
          Praneet Panmai
        </h1>
        <p className="mt-2 text-sm text-green-700">กำลังโหลด...</p>
      </div>
    </div>
  )
}
