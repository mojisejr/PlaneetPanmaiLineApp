export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-nature-50 to-nature-100">
      <div className="text-center">
        <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-nature-500 border-r-transparent"></div>
        <p className="text-lg text-nature-700">กำลังโหลด...</p>
      </div>
    </div>
  )
}
