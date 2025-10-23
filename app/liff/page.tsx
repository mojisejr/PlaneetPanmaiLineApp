'use client';

import { useLiff } from '@/hooks/use-liff';
import Image from 'next/image';

/**
 * LIFF App Entry Point
 * Main page for LINE LIFF application
 */
export default function LiffPage() {
  const {
    isInitialized,
    isLoading,
    isLoggedIn,
    error,
    profile,
    login,
    logout,
    isInClient,
  } = useLiff();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด LIFF...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-red-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              เกิดข้อผิดพลาด
            </h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              ลองอีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not initialized state
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-yellow-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              ไม่สามารถเริ่มต้น LIFF ได้
            </h2>
            <p className="text-gray-600 mb-4">
              กรุณาเปิดแอปพลิเคชันผ่าน LINE แอปเท่านั้น
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="text-green-600 text-5xl mb-4">🌱</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              ร้านต้นทุเรียนปราณีตพันธุ์ไม้
            </h1>
            <p className="text-gray-600 mb-6">
              สมาชิกพิเศษ - เครื่องคำนวนราคา
            </p>
            <button
              onClick={login}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full"
            >
              เข้าสู่ระบบด้วย LINE
            </button>
            {!isInClient() && (
              <p className="text-sm text-gray-500 mt-4">
                💡 เพื่อประสบการณ์ที่ดีที่สุด กรุณาเปิดผ่านแอป LINE
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Logged in - Show profile
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="text-center">
            {/* Profile Picture */}
            {profile?.pictureUrl && (
              <Image
                src={profile.pictureUrl}
                alt={profile.displayName}
                width={96}
                height={96}
                className="rounded-full mx-auto mb-4 border-4 border-green-200"
              />
            )}
            
            {/* Display Name */}
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {profile?.displayName || 'ผู้ใช้ LINE'}
            </h2>
            
            {/* Status Message */}
            {profile?.statusMessage && (
              <p className="text-gray-600 text-sm mb-2">
                {profile.statusMessage}
              </p>
            )}
            
            {/* Member Badge */}
            <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full">
              สมาชิกพิเศษ ✨
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            เครื่องมือพิเศษ
          </h3>
          
          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg p-4 transition-colors">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-sm font-semibold text-gray-800">
                คำนวนราคา
              </div>
            </button>
            
            <button className="bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-lg p-4 transition-colors">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-sm font-semibold text-gray-800">
                เปรียบเทียบราคา
              </div>
            </button>
            
            <button className="bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-lg p-4 transition-colors">
              <div className="text-3xl mb-2">🗺️</div>
              <div className="text-sm font-semibold text-gray-800">
                แผนที่ร้าน
              </div>
            </button>
            
            <button className="bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-lg p-4 transition-colors">
              <div className="text-3xl mb-2">📱</div>
              <div className="text-sm font-semibold text-gray-800">
                Facebook
              </div>
            </button>
          </div>
        </div>

        {/* User Info (Development) */}
        {process.env.NODE_ENV === 'development' && profile && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              ข้อมูลผู้ใช้ (Dev)
            </h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>User ID:</strong> {profile.userId}</p>
              <p><strong>In Client:</strong> {isInClient() ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <button
            onClick={logout}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
