import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent } from '@/components/ui/card'

export default function CalculatorLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="py-12">
          <LoadingSpinner size="lg" text="กำลังโหลดเครื่องคำนวณ..." />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            กรุณารอสักครู่
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
