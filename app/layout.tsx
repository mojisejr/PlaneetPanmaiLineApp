import type { Metadata } from 'next'
import './globals.css'
import { LiffProvider } from '@/lib/liff/provider'

export const metadata: Metadata = {
  title: 'Praneet Panmai - Premium Member Calculator',
  description: 'ระบบคำนวณราคาต้นทุเรียนสำหรับสมาชิกพิเศษ',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="font-sans antialiased">
        <LiffProvider>
          {children}
        </LiffProvider>
      </body>
    </html>
  )
}
