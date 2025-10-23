import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-nature-50 to-nature-100 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 text-8xl">🤷</div>
        <h1 className="mb-2 text-3xl font-bold text-nature-800">
          ไม่พบหน้านี้
        </h1>
        <p className="mb-6 text-nature-600">
          ขอโทษครับ หน้าที่คุณกำลังมองหาไม่มีอยู่ในระบบ
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-nature-500 px-6 py-3 text-white hover:bg-nature-600 transition-colors"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  )
}
