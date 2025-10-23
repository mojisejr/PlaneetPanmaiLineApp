'use client'

import { useLiff } from '@/hooks/use-liff'
import { useEffect, useState } from 'react'

// Force dynamic rendering (no static prerendering)
export const dynamic = 'force-dynamic'

/**
 * LIFF App Entry Point
 * Main page for LINE LIFF application
 */
export default function LiffPage() {
  const {
    isReady,
    isLoggedIn,
    isInClient,
    profile,
    context,
    os,
    language,
    version,
    lineVersion,
    error,
    loading,
    login,
    logout,
    closeWindow,
  } = useLiff()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Loading state
  if (!mounted || loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="space-y-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <h2 className="text-xl font-semibold text-foreground">
              กำลังโหลด LIFF...
            </h2>
            <p className="text-sm text-muted-foreground">
              กรุณารอสักครู่
            </p>
          </div>
        </div>
      </main>
    )
  }

  // Error state
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
              ไม่สามารถเชื่อมต่อกับ LINE ได้
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

          <div className="space-y-2 text-center text-xs text-muted-foreground">
            <p>กรุณาตรวจสอบ:</p>
            <ul className="space-y-1">
              <li>• เปิดแอพผ่าน LINE เท่านั้น</li>
              <li>• ตรวจสอบการตั้งค่า LIFF ID</li>
              <li>• ลองปิดและเปิดใหม่อีกครั้ง</li>
            </ul>
          </div>
        </div>
      </main>
    )
  }

  // Not logged in state
  if (isReady && !isLoggedIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-4 text-center">
            <div className="text-6xl">🌱</div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              ป๋าหนีด ปั่นหมี่
            </h1>
            <h2 className="text-xl font-semibold text-foreground">
              Premium Member Calculator
            </h2>
            <p className="text-muted-foreground">
              ระบบคำนวณราคาต้นทุเรียนสำหรับสมาชิกเท่านั้น
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => login()}
              className="w-full rounded-lg bg-[#00B900] px-6 py-4 text-lg font-medium text-white shadow-lg transition-all hover:bg-[#00A000] active:scale-95"
            >
              เข้าสู่ระบบด้วย LINE
            </button>

            <div className="text-center text-xs text-muted-foreground">
              <p>สำหรับสมาชิก LINE Official Account เท่านั้น</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Logged in state
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="text-5xl">🌱</div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            ป๋าหนีด ปั่นหมี่
          </h1>
        </div>

        {/* User Profile Card */}
        {profile && (
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              {profile.pictureUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.pictureUrl}
                  alt={profile.displayName}
                  className="h-16 w-16 rounded-full"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {profile.displayName}
                </h3>
                {profile.statusMessage && (
                  <p className="text-sm text-muted-foreground">
                    {profile.statusMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LIFF Information */}
        <div className="space-y-3 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-medium text-foreground">
            ข้อมูลการเชื่อมต่อ
          </h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md bg-primary/10 p-3">
              <div className="font-medium text-primary">สถานะ</div>
              <div className="text-foreground">
                {isLoggedIn ? '✅ เข้าสู่ระบบแล้ว' : '❌ ยังไม่ได้เข้าสู่ระบบ'}
              </div>
            </div>

            <div className="rounded-md bg-primary/10 p-3">
              <div className="font-medium text-primary">แพลตฟอร์ม</div>
              <div className="text-foreground capitalize">{os || 'N/A'}</div>
            </div>

            <div className="rounded-md bg-primary/10 p-3">
              <div className="font-medium text-primary">ภาษา</div>
              <div className="text-foreground uppercase">
                {language || 'N/A'}
              </div>
            </div>

            <div className="rounded-md bg-primary/10 p-3">
              <div className="font-medium text-primary">LIFF Version</div>
              <div className="text-foreground">{version || 'N/A'}</div>
            </div>

            {isInClient && (
              <>
                <div className="rounded-md bg-primary/10 p-3">
                  <div className="font-medium text-primary">LINE Version</div>
                  <div className="text-foreground">{lineVersion || 'N/A'}</div>
                </div>

                <div className="rounded-md bg-primary/10 p-3">
                  <div className="font-medium text-primary">Context</div>
                  <div className="text-foreground">
                    {context?.type || 'N/A'}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => logout()}
            className="w-full rounded-lg border border-destructive bg-destructive/10 px-6 py-3 font-medium text-destructive transition-all hover:bg-destructive/20 active:scale-95"
          >
            ออกจากระบบ
          </button>

          {isInClient && (
            <button
              onClick={() => closeWindow()}
              className="w-full rounded-lg border border-border bg-card px-6 py-3 font-medium text-foreground transition-all hover:bg-accent active:scale-95"
            >
              ปิดหน้าต่าง
            </button>
          )}
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="rounded-lg border border-warning/20 bg-warning/5 p-4">
            <div className="text-xs text-muted-foreground">
              <div className="mb-2 font-medium text-warning">
                Development Mode
              </div>
              <div className="space-y-1 font-mono">
                <div>isReady: {String(isReady)}</div>
                <div>isLoggedIn: {String(isLoggedIn)}</div>
                <div>isInClient: {String(isInClient)}</div>
                {profile && <div>userId: {profile.userId}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
