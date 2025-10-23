'use client'

import { useLiff } from '@/lib/liff/liff-provider'

export default function CalculatorPage() {
  const { profile } = useLiff()

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-nature-800">
          💰 เครื่องคำนวณราคาต้นทุเรียน
        </h1>
        <p className="text-nature-600">
          คำนวณราคาต้นทุเรียนแบบเรียลไทม์ สำหรับสมาชิกพิเศษ
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center gap-4">
          {profile?.pictureUrl && (
            <img
              src={profile.pictureUrl}
              alt={profile.displayName}
              className="h-16 w-16 rounded-full"
            />
          )}
          <div>
            <p className="text-sm text-gray-500">ยินดีต้อนรับ</p>
            <p className="text-xl font-semibold text-gray-800">
              {profile?.displayName}
            </p>
            <p className="text-xs text-nature-600">✨ สมาชิกพิเศษ</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-nature-50 p-6 text-center">
            <div className="mb-4 text-6xl">🌱</div>
            <h2 className="mb-2 text-xl font-semibold text-nature-800">
              เครื่องคำนวณราคา
            </h2>
            <p className="mb-4 text-nature-600">
              ฟีเจอร์นี้กำลังพัฒนา
            </p>
            <div className="rounded-lg bg-white p-4">
              <p className="text-sm text-gray-600">
                <strong>คุณสมบัติที่จะมี:</strong>
              </p>
              <ul className="mt-2 space-y-1 text-left text-sm text-gray-700">
                <li>✅ เลือกพันธุ์ทุเรียนและขนาดต้น</li>
                <li>✅ คำนวณราคาแบบเรียลไทม์</li>
                <li>✅ เปรียบเทียบราคาตลาด</li>
                <li>✅ ระบบแถมต้นอัตโนมัติ</li>
                <li>✅ แสดงต้นที่ร้านมีขายจริง</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <div className="mb-2 text-3xl">📊</div>
              <p className="text-sm font-semibold text-blue-800">
                เปรียบเทียบราคา
              </p>
              <p className="text-xs text-blue-600">เร็วๆ นี้</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <div className="mb-2 text-3xl">📍</div>
              <p className="text-sm font-semibold text-purple-800">
                ข้อมูลร้าน
              </p>
              <p className="text-xs text-purple-600">เร็วๆ นี้</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-nature-100 p-4">
        <p className="text-center text-sm text-nature-700">
          <strong>💡 เคล็ดลับ:</strong> ระบบจะช่วยคำนวณราคาและแถมต้นให้อัตโนมัติ
          <br />
          ทำให้คุณได้ข้อมูลที่แม่นยำและรวดเร็ว
        </p>
      </div>
    </div>
  )
}
