'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { liff } from '@line/liff'
import { useLoading } from '@/hooks/use-loading'
import { lineAuthService } from '@/lib/auth/line-auth'
import { liffFeatures } from '@/lib/liff/config'
import type { LiffProfile } from '@/types/liff'
import type { Member } from '@/types/database'

interface QRRegistrationResponse {
  success: boolean
  member?: Member
  action: 'created' | 'already_exists'
  message: string
}

interface QRStatusResponse {
  exists: boolean
  member?: Member
  needsRegistration: boolean
}

export default function QRScanMemberPage() {
  const router = useRouter()
  const { showLoading, hideLoading } = useLoading()
  const [status, setStatus] = useState<'loading' | 'authenticating' | 'registering' | 'registered' | 'already-member' | 'error'>('loading')
  const [profile, setProfile] = useState<LiffProfile | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<string>('กำลังโหลด...')

  useEffect(() => {
    initializeQRRegistration()
  }, [])

  const initializeQRRegistration = async () => {
    try {
      setProgress('กำลังเริ่มต้นระบบ...')
      showLoading('กำลังเริ่มต้นระบบ...')

      // Initialize LIFF
      await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
      setProgress('กำลังตรวจสอบการเข้าสู่ระบบ...')

      if (!liff.isLoggedIn()) {
        setProgress('กำลังนำทางไปยังหน้าเข้าสู่ระบบ...')
        hideLoading()
        router.push('/login')
        return
      }

      setStatus('authenticating')
      setProgress('กำลังดึงข้อมูลโปรไฟล์...')

      // Get LINE profile
      const liffProfile = await liff.getProfile()
      setProfile(liffProfile)

      // Check if member already exists
      setProgress('กำลังตรวจสอบสถานะสมาชิก...')
      const statusResponse = await fetch(`/api/qr/qr-scan-member?lineUserId=${liffProfile.userId}`)
      const statusData: QRStatusResponse = await statusResponse.json()

      if (statusData.exists && statusData.member) {
        setMember(statusData.member)
        setStatus('already-member')
        setProgress('คุณเป็นสมาชิกอยู่แล้ว')
        hideLoading()
        return
      }

      // Proceed with registration
      setStatus('registering')
      setProgress('กำลังลงทะเบียนสมาชิกใหม่...')
      await performRegistration(liffProfile)

    } catch (error) {
      console.error('[QR Registration] Initialization failed:', error)
      setStatus('error')
      setError('การเริ่มต้นระบบล้มเหลว กรุณาลองใหม่')
      hideLoading()
    }
  }

  const performRegistration = async (liffProfile: LiffProfile) => {
    try {
      setProgress('กำลังบันทึกข้อมูลสมาชิก...')

      const registrationData = {
        lineUserId: liffProfile.userId,
        displayName: liffProfile.displayName,
        pictureUrl: liffProfile.pictureUrl || undefined,
      }

      const response = await fetch('/api/qr/qr-scan-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })

      const data: QRRegistrationResponse = await response.json()

      if (data.success && data.member) {
        setMember(data.member)

        if (data.action === 'created') {
          setStatus('registered')
          setProgress('การลงทะเบียนสำเร็จแล้ว!')
        } else {
          setStatus('already-member')
          setProgress('คุณเป็นสมาชิกอยู่แล้ว')
        }
      } else {
        throw new Error(data.message || 'Registration failed')
      }

    } catch (error: any) {
      console.error('[QR Registration] Registration failed:', error)
      setStatus('error')
      setError(error?.message || 'การลงทะเบียนล้มเหลว กรุณาลองใหม่')
    } finally {
      hideLoading()
    }
  }

  const handleNavigateToCalculator = () => {
    router.push('/calculator')
  }

  const handleNavigateToProfile = () => {
    router.push('/profile')
  }

  const handleRetry = () => {
    setError(null)
    setStatus('loading')
    setProgress('กำลังลองใหม่...')
    initializeQRRegistration()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Logo/Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              {status === 'registered' && (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {status === 'already-member' && (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              {(status === 'loading' || status === 'authenticating' || status === 'registering') && (
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
              )}
              {status === 'error' && (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          </div>

          {/* Content based on status */}
          {status === 'loading' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">กำลังโหลดระบบ</h1>
              <p className="text-gray-600">{progress}</p>
            </div>
          )}

          {status === 'authenticating' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">กำลังตรวจสอบสิทธิ์</h1>
              <p className="text-gray-600">{progress}</p>
            </div>
          )}

          {status === 'registering' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">กำลังลงทะเบียน</h1>
              <p className="text-gray-600">{progress}</p>
            </div>
          )}

          {status === 'registered' && (
            <div>
              <h1 className="text-2xl font-bold text-green-600 mb-4">ยินดีต้อนรับ!</h1>
              <p className="text-gray-700 mb-6">การลงทะเบียนสมาชิกเสร็จสมบูรณ์</p>
              {member && (
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-700">สมาชิก: {member.display_name}</p>
                  <p className="text-xs text-green-600 mt-1">รหัสสมาชิก: {member.id}</p>
                </div>
              )}
              <div className="space-y-3">
                <button
                  onClick={handleNavigateToCalculator}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  ไปที่เครื่องคำนวณราคา
                </button>
                <button
                  onClick={handleNavigateToProfile}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
                >
                  ดูโปรไฟล์
                </button>
              </div>
            </div>
          )}

          {status === 'already-member' && (
            <div>
              <h1 className="text-2xl font-bold text-emerald-600 mb-4">ยินดีต้อนรับกลับ!</h1>
              <p className="text-gray-700 mb-6">คุณเป็นสมาชิกอยู่แล้ว</p>
              {member && (
                <div className="bg-emerald-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-emerald-700">สมาชิก: {member.display_name}</p>
                  <p className="text-xs text-emerald-600 mt-1">รหัสสมาชิก: {member.id}</p>
                </div>
              )}
              <div className="space-y-3">
                <button
                  onClick={handleNavigateToCalculator}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  ไปที่เครื่องคำนวณราคา
                </button>
                <button
                  onClick={handleNavigateToProfile}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
                >
                  ดูโปรไฟล์
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div>
              <h1 className="text-2xl font-bold text-red-600 mb-4">เกิดข้อผิดพลาด</h1>
              <p className="text-gray-700 mb-6">{error}</p>
              <button
                onClick={handleRetry}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-colors"
              >
                ลองใหม่
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}