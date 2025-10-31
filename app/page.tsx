'use client'

import { useLiff } from '@/hooks/use-liff'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const { isReady, isLoggedIn, loading, error } = useLiff()
  const [mounted, setMounted] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect based on authentication status
  useEffect(() => {
    if (mounted && isReady && !loading) {
      if (!isLoggedIn) {
        // Not authenticated → redirect to login page
        router.push('/liff')
      } else {
        // Authenticated → redirect to profile dashboard
        router.push('/profile')
      }
    }
  }, [mounted, isReady, loading, isLoggedIn, router])

  // Show loading state during authentication check
  if (!mounted || loading || !isReady) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="space-y-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <h2 className="text-xl font-semibold text-foreground">
              กำลังตรวจสอบสิทธิ์...
            </h2>
            <p className="text-sm text-muted-foreground">กรุณารอสักครู่</p>
          </div>
        </div>
      </main>
    )
  }

  // Show error state if LIFF initialization fails
  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-4 text-center">
            <div className="text-6xl">⚠️</div>
            <h2 className="text-xl font-semibold text-destructive">
              เกิดข้อผิดพลาด
            </h2>
            <p className="text-sm text-muted-foreground">
              ไม่สามารถเชื่อมต่อกับระบบได้
            </p>
          </div>

          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="space-y-2 text-sm">
              <div className="font-medium text-destructive">
                Error: {error.code}
              </div>
              <div className="text-muted-foreground">{error.message}</div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push('/liff')}
              className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-primary/90 active:scale-95"
            >
              กลับไปหน้าเข้าสู่ระบบ
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Show authenticated content
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            🌱 ปราณีต พันธุ์ไม้ จันทบุรี
          </h1>
          <h2 className="text-2xl font-semibold text-foreground">
            แพลตฟอร์มสมาชิกเกษตรกร
          </h2>
          <p className="text-muted-foreground">
            เครื่องมือคำนวณราคาต้นไม้สำหรับสมาชิกเท่านั้น
          </p>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Welcome to LINE LIFF App</h3>
            <p className="text-sm text-muted-foreground">
              Next.js 14 foundation is ready for development
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-md bg-primary/10 p-3">
              <div className="font-medium text-primary">Framework</div>
              <div className="text-muted-foreground">Next.js 14</div>
            </div>
            <div className="rounded-md bg-primary/10 p-3">
              <div className="font-medium text-primary">Language</div>
              <div className="text-muted-foreground">TypeScript</div>
            </div>
            <div className="rounded-md bg-primary/10 p-3">
              <div className="font-medium text-primary">Styling</div>
              <div className="text-muted-foreground">Tailwind CSS</div>
            </div>
            <div className="rounded-md bg-primary/10 p-3">
              <div className="font-medium text-primary">Components</div>
              <div className="text-muted-foreground">shadcn/ui</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Mobile-first design optimized for LINE WebView</p>
          <p className="mt-1">Minimum width: 320px | Touch targets: 48px</p>
        </div>
      </div>
    </main>
  )
}
