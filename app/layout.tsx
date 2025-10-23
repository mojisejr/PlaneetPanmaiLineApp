import type { Metadata, Viewport } from 'next'
import { LiffProvider } from '@/lib/liff/liff-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'ร้านต้นทุเรียน - Premium Member Calculator',
  description: 'เครื่องคำนวณราคาต้นทุเรียนสำหรับสมาชิกพิเศษ',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID || ''

  if (!liffId) {
    console.error('NEXT_PUBLIC_LIFF_ID is not set in environment variables')
  }

  return (
    <html lang="th">
      <body className="antialiased">
        <LiffProvider liffId={liffId}>
          {children}
        </LiffProvider>
      </body>
    </html>
  )
}
