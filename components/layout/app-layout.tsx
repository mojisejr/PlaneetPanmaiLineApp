'use client'

import { ReactNode } from 'react'
import { useLiff } from '@/lib/liff/provider'

interface AppLayoutProps {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export function AppLayout({
  children,
  showHeader = true,
  showFooter = true,
}: AppLayoutProps) {
  const { profile, isLoggedIn } = useLiff()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showHeader && isLoggedIn && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {profile?.pictureUrl && (
                  <img
                    src={profile.pictureUrl}
                    alt={profile.displayName}
                    className="w-10 h-10 rounded-full border-2 border-green-500"
                  />
                )}
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {profile?.displayName || 'สมาชิก'}
                  </h1>
                  <p className="text-xs text-gray-500">สมาชิกพิเศษ</p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>

      {showFooter && (
        <footer className="bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-gray-600">
              ระบบคำนวณราคาต้นทุเรียน © 2025 Praneet Panmai
            </p>
          </div>
        </footer>
      )}
    </div>
  )
}
