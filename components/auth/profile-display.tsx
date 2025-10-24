'use client'

import React, { useEffect } from 'react'
import { useLineProfile } from '@/hooks/use-line-profile'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorDisplay } from '@/components/ui/error-display'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RefreshCw, LogOut, User } from 'lucide-react'
import type { LiffProfile } from '@/types/liff'

interface ProfileDisplayProps {
  showActions?: boolean
  onProfileChange?: (profile: LiffProfile | null) => void
  className?: string
}

export function ProfileDisplay({
  showActions = true,
  onProfileChange,
  className = '',
}: ProfileDisplayProps) {
  const {
    isAuthenticated,
    isLoading,
    profile,
    error,
    authenticate,
    refreshProfile,
    logout,
  } = useLineProfile()

  // Notify parent of profile changes
  useEffect(() => {
    if (onProfileChange) {
      onProfileChange(profile)
    }
  }, [profile, onProfileChange])

  // Auto-authenticate on mount if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading && !error) {
      authenticate().catch((err) => {
        console.error('Auto-authenticate failed:', err)
      })
    }
  }, [isAuthenticated, isLoading, error, authenticate])

  // Handle refresh action
  const handleRefresh = async () => {
    try {
      await refreshProfile()
    } catch (err) {
      console.error('Refresh failed:', err)
    }
  }

  // Handle logout action
  const handleLogout = () => {
    try {
      logout()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  // Handle retry after error
  const handleRetry = async () => {
    try {
      await authenticate()
    } catch (err) {
      console.error('Retry failed:', err)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <LoadingSpinner size="lg" text="กำลังโหลดโปรไฟล์..." />
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <ErrorDisplay
        title="ไม่สามารถโหลดโปรไฟล์ได้"
        message={error.message || 'กรุณาลองใหม่อีกครั้ง'}
        error={error}
        onRetry={handleRetry}
        className={className}
      />
    )
  }

  // Not authenticated state
  if (!isAuthenticated || !profile) {
    return (
      <Card className={className}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">กรุณาเข้าสู่ระบบ</CardTitle>
          <CardDescription>
            คุณต้องเข้าสู่ระบบด้วย LINE เพื่อใช้งานคุณสมบัตินี้
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={authenticate} className="w-full" size="lg">
            เข้าสู่ระบบด้วย LINE
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Authenticated state - show profile
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>โปรไฟล์ของคุณ</CardTitle>
        <CardDescription>ข้อมูลบัญชี LINE ของคุณ</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16">
            {profile.pictureUrl && (
              <AvatarImage src={profile.pictureUrl} alt={profile.displayName} />
            )}
            <AvatarFallback className="text-lg font-semibold">
              {profile.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Profile Info */}
          <div className="flex-1 space-y-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                ชื่อแสดง
              </div>
              <div className="text-lg font-semibold">{profile.displayName}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">
                User ID
              </div>
              <div className="text-sm font-mono text-muted-foreground">
                {profile.userId}
              </div>
            </div>

            {profile.statusMessage && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  สถานะ
                </div>
                <div className="text-sm">{profile.statusMessage}</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      {showActions && (
        <CardFooter className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            รีเฟรช
          </Button>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="flex-1"
            disabled={isLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            ออกจากระบบ
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
