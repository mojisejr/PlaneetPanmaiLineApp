'use client'

import React, { useEffect, useState } from 'react'
import { useLiff } from '@/hooks/use-liff'
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
import { CheckCircle, ArrowRight, AlertCircle } from 'lucide-react'

export interface RegistrationWelcomeProps {
  onContinue?: () => void
  showContinueButton?: boolean
  autoHideDelay?: number
  className?: string
}

/**
 * Registration Welcome Component
 *
 * Displays elegant welcome flow for first-time LINE users with profile confirmation,
 * built for current hook-based LIFF architecture.
 *
 * Features:
 * - Loading state with Thai messaging
 * - Success state with checkmark animation
 * - Error state with retry functionality
 * - Auto-hide functionality with countdown
 * - Mobile-first responsive design for LINE WebView
 * - Thai language support with proper typography
 * - Smooth animations respecting reduced motion
 * - Accessibility compliance (WCAG 2.1 AA)
 */
export function RegistrationWelcome({
  onContinue,
  showContinueButton = true,
  autoHideDelay,
  className = '',
}: RegistrationWelcomeProps) {
  // Hook states
  const { profile: liffProfile } = useLiff()
  const {
    isAuthenticated,
    isLoading,
    profile: authProfile,
    error,
    isRegistering,
    isNewUser,
    isRegistered,
    member,
    registrationError,
  } = useLineProfile()

  // Component states
  const [showSuccess, setShowSuccess] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isCountdownActive, setIsCountdownActive] = useState(false)

  // Get current profile (prefer auth profile, fallback to liff profile)
  const currentProfile = authProfile || liffProfile

  /**
   * Effect: Handle auto-hide countdown
   */
  useEffect(() => {
    if (autoHideDelay && showSuccess && isCountdownActive && countdown !== null) {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1)
        }, 1000)
        return () => clearTimeout(timer)
      } else if (countdown === 0) {
        handleContinue()
      }
    }
  }, [countdown, showSuccess, isCountdownActive, autoHideDelay, handleContinue])

  /**
   * Effect: Show success when user is authenticated and registered
   */
  useEffect(() => {
    if (isAuthenticated && isRegistered && !isLoading && !isRegistering) {
      setShowSuccess(true)
      if (autoHideDelay) {
        setCountdown(Math.floor(autoHideDelay / 1000))
        setIsCountdownActive(true)
      }
    } else {
      setShowSuccess(false)
      setCountdown(null)
      setIsCountdownActive(false)
    }
  }, [isAuthenticated, isRegistered, isLoading, isRegistering, autoHideDelay])

  /**
   * Handle continue action
   */
  const handleContinue = React.useCallback(() => {
    setIsCountdownActive(false)
    setCountdown(null)
    if (onContinue) {
      onContinue()
    }
  }, [onContinue])

  /**
   * Handle retry action
   */
  const handleRetry = async () => {
    setShowSuccess(false)
    setCountdown(null)
    setIsCountdownActive(false)
    // The useLineProfile hook automatically handles retry logic
    // when isRegistering state changes
  }

  // Loading State
  if (isLoading || isRegistering) {
    return (
      <Card className={`w-full max-w-md mx-auto ${className}`}>
        <CardContent className="py-8">
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" text="กำลังลงทะเบียน..." />
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                กรุณารอสักครู่
              </p>
              {isRegistering && (
                <p className="text-xs text-muted-foreground">
                  กำลังสร้างบัญชีสมาชิกใหม่...
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error State
  if (error || registrationError) {
    return (
      <ErrorDisplay
        title="การลงทะเบียนล้มเหลว"
        message={registrationError || error?.message || 'ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่'}
        error={error}
        onRetry={handleRetry}
        className={`w-full max-w-md mx-auto ${className}`}
      />
    )
  }

  // Not Authenticated State
  if (!isAuthenticated || !currentProfile) {
    return (
      <Card className={`w-full max-w-md mx-auto ${className}`}>
        <CardContent className="py-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-warning" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                ต้องเข้าสู่ระบบก่อน
              </h3>
              <p className="text-sm text-muted-foreground">
                กรุณาเข้าสู่ระบบด้วย LINE เพื่อใช้งานระบบ
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Success State - Registration Welcome
  if (showSuccess) {
    return (
      <Card className={`w-full max-w-md mx-auto ${className}`}>
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success animate-pulse" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl text-success">
              ยินดีต้อนรับสู่ร้านปราณีตพันธุ์ทุเรียน
            </CardTitle>
            <CardDescription>
              สมัครสมาชิกสำเร็จแล้ว
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Display Section */}
          <div className="space-y-4">
            <h4 className="text-center text-sm font-medium text-muted-foreground">
              ข้อมูลสมาชิก
            </h4>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <Avatar className="h-16 w-16">
                {currentProfile.pictureUrl && (
                  <AvatarImage
                    src={currentProfile.pictureUrl}
                    alt={currentProfile.displayName}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                  {currentProfile.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    ชื่อแสดง
                  </div>
                  <div className="text-lg font-semibold">
                    {currentProfile.displayName}
                  </div>
                </div>

                {member && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      วันที่สมัคร
                    </div>
                    <div className="text-sm">
                      {member.registration_date
                        ? new Date(member.registration_date).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : new Date().toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                      }
                    </div>
                  </div>
                )}

                {isNewUser && (
                  <div className="text-xs text-success bg-success/10 px-2 py-1 rounded-md inline-block">
                    สมาชิกใหม่
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center space-y-2">
            <p className="text-lg text-foreground">
              สวัสดีครับ คุณ{currentProfile.displayName}
            </p>
            <p className="text-sm text-muted-foreground">
              ยินดีต้อนรับเข้าสู่ระบบสมาชิกพิเศษ<br/>
              คุณสามารถใช้เครื่องคำนวณราคาต้นทุเรียนได้แล้ว
            </p>
          </div>

          {/* Countdown Timer */}
          {isCountdownActive && countdown !== null && (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                จะเริ่มใช้งานอัตโนมัติใน
                <span className="font-mono font-semibold text-primary mx-1">
                  {countdown}
                </span>
                วินาที
              </p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${((autoHideDelay || 5000) - (countdown * 1000)) / (autoHideDelay || 5000) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>

        {/* Action Buttons */}
        {showContinueButton && (
          <CardFooter className="flex gap-3 pt-6">
            <Button
              onClick={handleContinue}
              className="flex-1"
              size="lg"
              disabled={isCountdownActive}
            >
              เริ่มใช้เครื่องคิดเลข
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {isCountdownActive && (
              <Button
                onClick={() => setIsCountdownActive(false)}
                variant="outline"
                size="lg"
              >
                ยกเลิก
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    )
  }

  // Processing State (between authentication and registration)
  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardContent className="py-8">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" text="กำลังตรวจสอบข้อมูลสมาชิก..." />
          <p className="text-sm text-muted-foreground">
            กรุณารอสักครู่
          </p>
        </div>
      </CardContent>
    </Card>
  )
}