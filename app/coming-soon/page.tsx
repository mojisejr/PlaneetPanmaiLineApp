'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BRANDING } from '@/lib/config/branding'

/**
 * Coming Soon Page
 * 
 * Static placeholder page for features under development.
 * Used by SimplifiedMenu items that link to unimplemented features.
 * 
 * Features:
 * - Clear messaging in Thai
 * - Easy navigation back to profile
 * - Age-appropriate design with large fonts
 * - Mobile-first layout
 */
export default function ComingSoonPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Icon */}
        <div className="space-y-4">
          <div className="text-6xl" role="img" aria-label="Construction">
            🚧
          </div>
          <h1 className="text-3xl font-bold text-primary">
            กำลังพัฒนา
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-lg text-foreground">
            ฟีเจอร์นี้กำลังอยู่ระหว่างการพัฒนา
          </p>
          <p className="text-base text-muted-foreground">
            เรากำลังพัฒนาเครื่องมือนี้ให้พร้อมใช้งานในเร็วๆ นี้
            <br />
            ขอบคุณสำหรับความอดทนรอ
          </p>
        </div>

        {/* Brand info */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl" role="img" aria-label="Plant">
              🌱
            </span>
            <h2 className="text-lg font-semibold text-foreground">
              {BRANDING.THAI_SHORT_NAME}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {BRANDING.THAI_DESCRIPTION}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push('/profile')}
            className="w-full min-h-[48px]"
            size="lg"
          >
            กลับไปหน้าหลัก
          </Button>
          
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full min-h-[48px]"
            size="lg"
          >
            ย้อนกลับ
          </Button>
        </div>

        {/* Additional info */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>เครื่องมือที่พร้อมใช้งาน:</strong>
          </p>
          <ul className="list-disc list-inside text-left space-y-1 pl-4">
            <li>เครื่องมือคำนวณราคาต้นไม้</li>
            <li>ข้อมูลโปรไฟล์สมาชิก</li>
            <li>ระบบสมาชิกแบบพรีเมียม</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
