'use client'

import { ProfileDisplay } from '@/components/auth/profile-display'
import { AuthProvider } from '@/lib/auth/auth-store'
import type { LiffProfile } from '@/types/liff'

// Force dynamic rendering (no static prerendering)
export const dynamic = 'force-dynamic'

/**
 * Test Page for Profile Display Component
 * This page demonstrates the ProfileDisplay component with authentication
 */
export default function TestProfilePage() {
  const handleProfileChange = (profile: LiffProfile | null) => {
    if (profile) {
      console.log('[TestProfile] Profile changed:', {
        userId: profile.userId,
        displayName: profile.displayName,
      })
    } else {
      console.log('[TestProfile] Profile cleared')
    }
  }

  return (
    <AuthProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              🧪 ทดสอบ Profile Display
            </h1>
            <p className="text-muted-foreground">
              หน้านี้ใช้สำหรับทดสอบคอมโพเนนต์แสดงโปรไฟล์ LINE
            </p>
          </div>

          {/* Profile Display Component */}
          <ProfileDisplay
            showActions={true}
            onProfileChange={handleProfileChange}
          />

          {/* Additional Info */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium">คุณสมบัติที่ทดสอบ:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>
                  <strong>การดึงข้อมูลโปรไฟล์ LINE:</strong> แสดงชื่อ, รูปภาพ, User ID, และสถานะ
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>
                  <strong>Authentication State Management:</strong> จัดการสถานะการเข้าสู่ระบบ
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>
                  <strong>Profile Caching:</strong> บันทึกโปรไฟล์ใน localStorage (24 ชั่วโมง)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>
                  <strong>Loading States:</strong> แสดงสถานะกำลังโหลด
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>
                  <strong>Error Handling:</strong> แสดงข้อความผิดพลาดและปุ่มลองใหม่
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>
                  <strong>Action Buttons:</strong> รีเฟรชโปรไฟล์และออกจากระบบ
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>
                  <strong>Thai Language:</strong> ใช้ภาษาไทยทั้งหมด
                </span>
              </li>
            </ul>
          </div>

          {/* Development Notes */}
          {process.env.NODE_ENV === 'development' && (
            <div className="rounded-lg border border-warning/20 bg-warning/5 p-4">
              <div className="text-xs text-muted-foreground">
                <div className="mb-2 font-medium text-warning">
                  📝 Development Notes
                </div>
                <div className="space-y-1">
                  <p>
                    • หน้านี้จะทำงานได้เต็มที่เมื่อเปิดผ่าน LINE LIFF
                  </p>
                  <p>
                    • ถ้าเปิดในเว็บเบราว์เซอร์ จะขอให้เข้าสู่ระบบด้วย LINE
                  </p>
                  <p>
                    • ตรวจสอบ Console สำหรับ logs ของการเปลี่ยนแปลงโปรไฟล์
                  </p>
                  <p>
                    • Profile จะถูกบันทึกใน localStorage ระยะเวลา 24 ชั่วโมง
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </AuthProvider>
  )
}
