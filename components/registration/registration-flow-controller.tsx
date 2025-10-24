'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useLiff } from '@/hooks/use-liff'
import { useLineProfile } from '@/hooks/use-line-profile'
import { useMemberStatus } from '@/lib/context/member-status-context'
import { RegistrationWelcome } from './registration-welcome'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorDisplay } from '@/components/ui/error-display'

/**
 * Registration Flow States
 * Represents all possible states in the registration flow
 */
export type RegistrationFlowState =
  | 'initializing'       // LIFF SDK initializing
  | 'authenticating'     // User logging in with LINE
  | 'registering'        // Auto-registration in progress
  | 'success'            // Registration completed successfully
  | 'error'              // Error occurred
  | 'ready'              // Ready to proceed to main app

/**
 * Registration Flow Controller Props
 */
export interface RegistrationFlowControllerProps {
  children: React.ReactNode
  onComplete?: () => void
  autoHideWelcome?: boolean
  welcomeDelay?: number
  className?: string
}

/**
 * Registration Flow Controller
 * 
 * Layout-level component that orchestrates the complete registration flow with
 * state management, error handling, and smooth transitions.
 * 
 * Features:
 * - Orchestrates LIFF initialization, authentication, and registration
 * - Manages flow state transitions with proper error handling
 * - Integrates with existing hooks: useLiff, useLineProfile, useMemberStatus
 * - Provides loading states with Thai messaging
 * - Handles retry logic for failed operations
 * - Shows welcome screen for new users
 * - Auto-hides welcome screen with configurable delay
 * - Mobile-first responsive design for LINE WebView
 * - Accessibility compliance (WCAG 2.1 AA)
 * 
 * @example
 * ```tsx
 * <RegistrationFlowController
 *   onComplete={() => router.push('/calculator')}
 *   autoHideWelcome={true}
 *   welcomeDelay={5000}
 * >
 *   <CalculatorApp />
 * </RegistrationFlowController>
 * ```
 */
export function RegistrationFlowController({
  children,
  onComplete,
  autoHideWelcome = true,
  welcomeDelay = 5000,
  className = '',
}: RegistrationFlowControllerProps) {
  // Hook states
  const liff = useLiff()
  const lineProfile = useLineProfile()
  const memberStatus = useMemberStatus()

  // Local flow state
  const [flowState, setFlowState] = useState<RegistrationFlowState>('initializing')
  const [retryCount, setRetryCount] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)

  /**
   * Determine current flow state based on hook states
   */
  const determineFlowState = useCallback((): RegistrationFlowState => {
    // Priority 1: Handle errors
    if (liff.error || lineProfile.error || memberStatus.error) {
      return 'error'
    }

    // Priority 2: Handle loading/initialization states
    if (liff.loading) {
      return 'initializing'
    }

    // Priority 3: Handle authentication flow
    if (!liff.isLoggedIn && liff.isReady) {
      return 'authenticating'
    }

    // Priority 4: Handle registration flow
    if (lineProfile.isRegistering) {
      return 'registering'
    }

    // Priority 5: Handle success states
    if (lineProfile.isRegistered && memberStatus.member) {
      // Show welcome for new users
      if (lineProfile.isNewUser && !showWelcome) {
        return 'success'
      }
      // Ready to proceed
      return 'ready'
    }

    // Priority 6: Handle member status loading
    if (memberStatus.loading) {
      return 'registering'
    }

    // Default: still initializing
    return 'initializing'
  }, [
    liff.error,
    liff.loading,
    liff.isLoggedIn,
    liff.isReady,
    lineProfile.error,
    lineProfile.isRegistering,
    lineProfile.isRegistered,
    lineProfile.isNewUser,
    memberStatus.error,
    memberStatus.loading,
    memberStatus.member,
    showWelcome,
  ])

  /**
   * Update flow state when hook states change
   */
  useEffect(() => {
    const newState = determineFlowState()
    setFlowState(newState)

    // Show welcome screen when reaching success state
    if (newState === 'success' && !showWelcome) {
      setShowWelcome(true)
    }
  }, [determineFlowState, showWelcome])

  /**
   * Handle welcome screen completion
   */
  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false)
    setFlowState('ready')
    if (onComplete) {
      onComplete()
    }
  }, [onComplete])

  /**
   * Handle retry after error
   */
  const handleRetry = useCallback(async () => {
    setRetryCount(prev => prev + 1)
    setFlowState('initializing')

    // Clear errors
    memberStatus.clearError()

    // Try to re-authenticate if needed
    if (!lineProfile.isAuthenticated) {
      try {
        await lineProfile.authenticate()
      } catch (error) {
        console.error('[RegistrationFlowController] Retry authentication failed:', error)
      }
    }

    // Try to refresh member status if authenticated
    if (lineProfile.isAuthenticated && !memberStatus.member) {
      try {
        await memberStatus.refreshMember()
      } catch (error) {
        console.error('[RegistrationFlowController] Retry refresh member failed:', error)
      }
    }
  }, [lineProfile, memberStatus])

  /**
   * Get error message for display
   */
  const errorMessage = useMemo(() => {
    if (liff.error) {
      return liff.error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ LINE'
    }
    if (lineProfile.error) {
      return lineProfile.error.message || 'การยืนยันตัวตนล้มเหลว'
    }
    if (lineProfile.registrationError) {
      return lineProfile.registrationError
    }
    if (memberStatus.error) {
      return memberStatus.error
    }
    return 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
  }, [liff.error, lineProfile.error, lineProfile.registrationError, memberStatus.error])

  /**
   * Render content based on flow state
   */
  const renderContent = () => {
    switch (flowState) {
      case 'initializing':
        return (
          <div className="flex min-h-screen flex-col items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6 text-center">
              <LoadingSpinner size="lg" text="กำลังเริ่มต้นระบบ..." />
              <p className="text-sm text-muted-foreground">
                กรุณารอสักครู่
              </p>
            </div>
          </div>
        )

      case 'authenticating':
        return (
          <div className="flex min-h-screen flex-col items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6 text-center">
              <LoadingSpinner size="lg" text="กำลังยืนยันตัวตน..." />
              <p className="text-sm text-muted-foreground">
                กำลังเชื่อมต่อกับ LINE
              </p>
            </div>
          </div>
        )

      case 'registering':
        return (
          <div className="flex min-h-screen flex-col items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6 text-center">
              <LoadingSpinner size="lg" text="กำลังลงทะเบียน..." />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  กำลังสร้างบัญชีสมาชิกของคุณ
                </p>
                <p className="text-xs text-muted-foreground">
                  กระบวนการนี้จะใช้เวลาเพียงไม่กี่วินาที
                </p>
              </div>
            </div>
          </div>
        )

      case 'success':
        return (
          <div className="flex min-h-screen flex-col items-center justify-center p-6">
            <RegistrationWelcome
              onContinue={handleWelcomeComplete}
              showContinueButton={true}
              autoHideDelay={autoHideWelcome ? welcomeDelay : undefined}
              className={className}
            />
          </div>
        )

      case 'error':
        return (
          <div className="flex min-h-screen flex-col items-center justify-center p-6">
            <ErrorDisplay
              title="เกิดข้อผิดพลาด"
              message={errorMessage}
              error={liff.error || lineProfile.error || undefined}
              onRetry={handleRetry}
              className={`w-full max-w-md ${className}`}
            />
            {retryCount > 0 && (
              <div className="mt-4 text-center text-xs text-muted-foreground">
                ความพยายามครั้งที่ {retryCount}
              </div>
            )}
          </div>
        )

      case 'ready':
        return children

      default:
        return (
          <div className="flex min-h-screen flex-col items-center justify-center p-6">
            <LoadingSpinner size="lg" text="กำลังโหลด..." />
          </div>
        )
    }
  }

  return <>{renderContent()}</>
}

/**
 * Hook to access registration flow state
 * For use within components wrapped by RegistrationFlowController
 */
export function useRegistrationFlow() {
  const liff = useLiff()
  const lineProfile = useLineProfile()
  const memberStatus = useMemberStatus()

  return {
    // LIFF state
    isLiffReady: liff.isReady,
    isLoggedIn: liff.isLoggedIn,
    liffLoading: liff.loading,
    liffError: liff.error,

    // Authentication state
    isAuthenticated: lineProfile.isAuthenticated,
    authLoading: lineProfile.isLoading,
    authError: lineProfile.error,

    // Registration state
    isRegistering: lineProfile.isRegistering,
    isRegistered: lineProfile.isRegistered,
    isNewUser: lineProfile.isNewUser,
    registrationError: lineProfile.registrationError,

    // Member state
    member: memberStatus.member,
    memberLoading: memberStatus.loading,
    memberError: memberStatus.error,

    // Combined state
    isReady: lineProfile.isRegistered && memberStatus.member !== null && !memberStatus.loading,
    hasError: !!(liff.error || lineProfile.error || lineProfile.registrationError || memberStatus.error),
  }
}
