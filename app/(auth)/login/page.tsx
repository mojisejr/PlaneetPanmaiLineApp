'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLiff } from '@/lib/liff/liff-provider'
import { memberService } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const { isInitialized, isLoggedIn, profile, isLoading, error, login } = useLiff()

  useEffect(() => {
    const handleAuthentication = async () => {
      if (!isLoading && isInitialized) {
        if (isLoggedIn && profile) {
          // Zero-click registration: Auto register member if not exists
          try {
            await memberService.upsertMember(
              profile.userId,
              profile.displayName,
              profile.pictureUrl
            )
            // Redirect to calculator after successful registration
            router.push('/calculator')
          } catch (err) {
            console.error('Failed to register member:', err)
          }
        }
      }
    }

    handleAuthentication()
  }, [isInitialized, isLoggedIn, profile, isLoading, router])

  const handleLogin = async () => {
    try {
      await login()
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  if (isLoading || !isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-nature-500 border-r-transparent"></div>
          <p className="text-lg text-nature-700">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-4 max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="mb-2 text-xl font-bold text-red-600">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-lg bg-nature-500 px-6 py-3 text-white hover:bg-nature-600"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-6 text-6xl">🌱</div>
          <h1 className="mb-2 text-3xl font-bold text-nature-800">
            ร้านต้นทุเรียน
          </h1>
          <p className="text-lg text-nature-600">
            เครื่องคำนวณราคาต้นทุเรียน
          </p>
          <p className="mt-2 text-sm text-nature-500">
            สำหรับสมาชิกพิเศษเท่านั้น
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              เข้าสู่ระบบ
            </h2>
            <p className="text-sm text-gray-600">
              ใช้บัญชี LINE เพื่อเข้าสู่ระบบ
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#06C755] px-6 py-4 text-lg font-semibold text-white hover:bg-[#05b34a] transition-colors"
          >
            <span className="text-2xl">💬</span>
            เข้าสู่ระบบด้วย LINE
          </button>

          <div className="mt-6 rounded-lg bg-nature-50 p-4">
            <p className="text-center text-sm text-nature-700">
              <span className="font-semibold">💎 สิทธิพิเศษสำหรับสมาชิก</span>
              <br />
              คำนวณราคาต้นทุเรียนแบบเรียลไทม์
              <br />
              เปรียบเทียบราคาตลาดได้ทันที
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-nature-600">
          <p>
            เมื่อเข้าสู่ระบบ คุณยอมรับ
            <br />
            ข้อกำหนดและเงื่อนไขการใช้งาน
          </p>
        </div>
      </div>
    </div>
  )
}
