'use client'

import { useState, useEffect, useCallback } from 'react'
import { lineAuthService, type AuthState } from '@/lib/auth/line-auth'
import { autoRegistrationService, type RegistrationStatus } from '@/lib/services/auto-registration'
import type { LiffProfile } from '@/types/liff'

/**
 * React Hook for LINE Profile
 * Provides authentication state and methods for React components
 * Integrated with auto-registration service for seamless user registration
 */
export function useLineProfile() {
  // Local state mirrors the service state
  const [state, setState] = useState<AuthState>(lineAuthService.getState())

  // Registration state
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)

  // Auto-register user after successful authentication
  const autoRegister = useCallback(async (profile: LiffProfile): Promise<RegistrationStatus> => {
    try {
      setIsRegistering(true)
      const regStatus = await autoRegistrationService.checkAndRegister(profile)
      setRegistrationStatus(regStatus)
      return regStatus
    } catch (error) {
      const errorStatus: RegistrationStatus = {
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: error instanceof Error ? error.message : 'การลงทะเบียนอัตโนมัติล้มเหลว',
      }
      setRegistrationStatus(errorStatus)
      throw error
    } finally {
      setIsRegistering(false)
    }
  }, [])

  // Load cached profile on mount and check registration
  useEffect(() => {
    // Try to load from cache immediately
    const cachedProfile = lineAuthService.loadFromCache()

    if (cachedProfile) {
      setState(lineAuthService.getState())

      // Check registration status for cached profile
      autoRegister(cachedProfile).catch(error => {
        console.warn('Failed to auto-register cached profile:', error)
      })
    }

    // Subscribe to state changes
    const unsubscribe = lineAuthService.subscribe((newState) => {
      setState(newState)

      // Auto-register when user becomes authenticated
      if (newState.isAuthenticated && newState.profile && !registrationStatus) {
        autoRegister(newState.profile).catch(error => {
          console.warn('Failed to auto-register on state change:', error)
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [autoRegister, registrationStatus])

  // Authenticate callback with auto-registration
  const authenticate = useCallback(async (): Promise<LiffProfile | null> => {
    try {
      const profile = await lineAuthService.authenticate()
      if (profile) {
        // Trigger auto-registration after successful authentication
        await autoRegister(profile)
      }
      return profile
    } catch (error) {
      // Error is already handled and stored in state by the service
      throw error
    }
  }, [autoRegister])

  // Refresh profile callback with auto-registration
  const refreshProfile = useCallback(async (): Promise<LiffProfile | null> => {
    try {
      const profile = await lineAuthService.refreshProfile()
      if (profile) {
        // Re-run auto-registration after profile refresh
        await autoRegister(profile)
      }
      return profile
    } catch (error) {
      // Error is already handled and stored in state by the service
      throw error
    }
  }, [autoRegister])

  // Logout callback with cache cleanup
  const logout = useCallback((): void => {
    try {
      // Clear registration cache when logging out
      if (state.profile) {
        autoRegistrationService.clearRegistrationCache(state.profile.userId)
      }

      // Reset registration state
      setRegistrationStatus(null)
      setIsRegistering(false)

      // Perform actual logout
      lineAuthService.logout()
    } catch (error) {
      // Error is already handled and stored in state by the service
      throw error
    }
  }, [state.profile])

  // Manual registration check
  const checkRegistration = useCallback(async (profile?: LiffProfile): Promise<RegistrationStatus> => {
    try {
      setIsRegistering(true)
      const regStatus = await autoRegistrationService.checkAndRegister(profile)
      setRegistrationStatus(regStatus)
      return regStatus
    } catch (error) {
      const errorStatus: RegistrationStatus = {
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: error instanceof Error ? error.message : 'การตรวจสอบการลงทะเบียนล้มเหลว',
      }
      setRegistrationStatus(errorStatus)
      throw error
    } finally {
      setIsRegistering(false)
    }
  }, [])

  // Clear registration cache
  const clearRegistrationCache = useCallback((lineUserId?: string): void => {
    autoRegistrationService.clearRegistrationCache(lineUserId)
    if (!lineUserId) {
      setRegistrationStatus(null)
    }
  }, [])

  return {
    // Authentication State
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    profile: state.profile,
    error: state.error,
    lastUpdated: state.lastUpdated,

    // Registration State
    registrationStatus,
    isRegistering,
    isRegistered: registrationStatus?.isRegistered ?? false,
    isNewUser: registrationStatus?.isNewUser ?? false,
    member: registrationStatus?.member ?? null,
    registrationError: registrationStatus?.error ?? null,

    // Methods
    authenticate,
    refreshProfile,
    logout,
    checkRegistration,
    clearRegistrationCache,
  }
}
