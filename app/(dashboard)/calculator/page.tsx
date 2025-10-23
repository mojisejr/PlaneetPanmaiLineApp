'use client'

import { AuthGuard } from '@/lib/routing/auth-guard'
import { useLiff } from '@/lib/liff/provider'

export default function CalculatorPage() {
  const { profile, logout } = useLiff()

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Header */}
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
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">
                เครื่องคำนวณราคาต้นทุเรียน
              </h2>
              <p className="text-green-100">
                คำนวณราคาและเปรียบเทียบราคาตลาดได้ทันที
              </p>
            </div>

            {/* Calculator Section */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-12 h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  เครื่องคำนวณพร้อมใช้งาน
                </h3>
                <p className="text-gray-600 mb-6">
                  ระบบคำนวณราคาต้นทุเรียนสำหรับสมาชิกพิเศษ
                </p>
                <div className="inline-flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>คุณมีสิทธิ์เข้าถึงเครื่องคำนวณนี้</span>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  คำนวณราคาแม่นยำ
                </h4>
                <p className="text-sm text-gray-600">
                  ระบบคำนวณราคาตามขนาดถุงและพันธุ์ทุเรียน
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  เปรียบเทียบราคาตลาด
                </h4>
                <p className="text-sm text-gray-600">
                  ดูราคาอ้างอิงจากตลาดเพื่อเปรียบเทียบ
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-gray-600">
              ระบบคำนวณราคาต้นทุเรียน © 2025 Praneet Panmai
            </p>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}
