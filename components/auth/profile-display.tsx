'use client'

import { useLineProfile } from '@/hooks/use-line-profile'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorDisplay } from '@/components/ui/error-display'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, RefreshCw, LogOut, CheckCircle } from 'lucide-react'

interface ProfileDisplayProps {
  showActions?: boolean
  onProfileChange?: (profile: any) => void
}

export function ProfileDisplay({ showActions = true, onProfileChange }: ProfileDisplayProps) {
  const {
    isAuthenticated,
    isLoading,
    profile,
    error,
    lastUpdated,
    authenticate,
    refreshProfile,
    logout
  } = useLineProfile()

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <LoadingSpinner size="md" text="กำลังโหลดข้อมูล..." />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <ErrorDisplay
        title="เกิดข้อผิดพลาด"
        message="ไม่สามารถโหลดข้อมูลผู้ใช้ได้"
        error={error}
        onRetry={authenticate}
      />
    )
  }

  if (!isAuthenticated || !profile) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <User className="mx-auto h-12 w-12 text-muted-foreground" />
          <CardTitle>ยังไม่ได้เข้าสู่ระบบ</CardTitle>
          <CardDescription>
            กรุณาเข้าสู่ระบบเพื่อใช้งานแอปพลิเคชัน
          </CardDescription>
        </CardHeader>
        {showActions && (
          <CardContent>
            <Button onClick={authenticate} className="w-full">
              <User className="mr-2 h-4 w-4" />
              เข้าสู่ระบบด้วย LINE
            </Button>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
          ข้อมูลผู้ใช้
        </CardTitle>
        {lastUpdated && (
          <CardDescription>
            อัพเดทล่าสุด: {new Date(lastUpdated).toLocaleString('th-TH')}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Image and Basic Info */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.pictureUrl} alt={profile.displayName} />
            <AvatarFallback>
              {profile.displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{profile.displayName}</h3>
            <p className="text-sm text-muted-foreground">ID: {profile.userId}</p>
            {profile.statusMessage && (
              <p className="text-sm italic mt-1">&ldquo;{profile.statusMessage}&rdquo;</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex space-x-2">
            <Button
              onClick={() => refreshProfile().then(onProfileChange)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              รีเฟรช
            </Button>
            <Button
              onClick={() => logout()}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <LogOut className="mr-2 h-4 w-4" />
              ออกจากระบบ
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
