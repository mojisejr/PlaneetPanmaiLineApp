import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🌱</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          ร้านต้นทุเรียนปราณีตพันธุ์ไม้
        </h1>
        <p className="text-gray-600 mb-6">
          ยินดีต้อนรับสู่ระบบสมาชิกพิเศษ
        </p>
        <Link
          href="/liff"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          เข้าสู่แอปพลิเคชัน
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          💡 กรุณาเปิดผ่านแอป LINE เพื่อประสบการณ์ที่ดีที่สุด
        </p>
      </div>
    </div>
  );
}
