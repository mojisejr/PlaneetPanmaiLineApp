import { ReactNode } from 'react'
import { AuthGuard } from '@/lib/routing/auth-guard'
import { AppLayout } from '@/components/layout/app-layout'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  )
}
