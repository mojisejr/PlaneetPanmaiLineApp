'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-nature-50 to-nature-100 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-red-600">
              เกิดข้อผิดพลาด
            </h2>
            <p className="text-gray-600">
              ขออภัย เกิดข้อผิดพลาดในการทำงานของแอปพลิเคชัน
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 rounded-lg bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">
                ข้อผิดพลาด:
              </p>
              <p className="mt-1 text-xs text-red-700 font-mono break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="mt-2 text-xs text-red-600">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full rounded-lg bg-nature-500 px-6 py-3 text-white hover:bg-nature-600 transition-colors"
            >
              ลองใหม่อีกครั้ง
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full rounded-lg border border-nature-500 px-6 py-3 text-nature-600 hover:bg-nature-50 transition-colors"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-nature-600">
          <p>หากปัญหายังคงอยู่ กรุณาติดต่อเจ้าหน้าที่</p>
        </div>
      </div>
    </div>
  )
}
