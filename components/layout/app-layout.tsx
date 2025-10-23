'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLiff } from '@/lib/liff/liff-provider'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter()
  const { profile, logout } = useLiff()
  const [showMenu, setShowMenu] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  // App lifecycle management
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
      
      if (!document.hidden) {
        // App became visible - could refresh data here
        console.log('App became visible')
      } else {
        // App became hidden
        console.log('App became hidden')
      }
    }

    const handleFocus = () => {
      console.log('App focused')
      setIsVisible(true)
    }

    const handleBlur = () => {
      console.log('App blurred')
      setIsVisible(false)
    }

    // Add event listeners for app lifecycle
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-nature-50 to-nature-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🌱</div>
            <div>
              <h1 className="text-lg font-bold text-nature-800">
                ร้านต้นทุเรียน
              </h1>
              <p className="text-xs text-nature-600">Premium Calculator</p>
            </div>
          </div>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg p-2 hover:bg-nature-50 transition-colors"
            aria-label="Menu"
          >
            <svg
              className="h-6 w-6 text-nature-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-4 top-16 w-64 rounded-lg bg-white shadow-lg">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                {profile?.pictureUrl && (
                  <img
                    src={profile.pictureUrl}
                    alt={profile.displayName}
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {profile?.displayName}
                  </p>
                  <p className="text-xs text-nature-600">สมาชิกพิเศษ</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  setShowMenu(false)
                  router.push('/calculator')
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-nature-50 transition-colors"
              >
                <span className="text-xl">💰</span>
                <span className="text-sm font-medium text-gray-700">
                  เครื่องคำนวณราคา
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-red-50 transition-colors"
              >
                <span className="text-xl">🚪</span>
                <span className="text-sm font-medium text-red-600">
                  ออกจากระบบ
                </span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Main Content */}
      <main className="pb-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-nature-200 bg-white py-4">
        <div className="px-4 text-center text-sm text-nature-600">
          <p>© 2025 ร้านต้นทุเรียน</p>
          <p className="mt-1 text-xs">สำหรับสมาชิกพิเศษเท่านั้น</p>
        </div>
      </footer>

      {/* Visibility indicator (for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
          {isVisible ? '👁️ Visible' : '🙈 Hidden'}
        </div>
      )}
    </div>
  )
}
