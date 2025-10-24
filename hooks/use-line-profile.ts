'use client'

import { useState, useEffect, useCallback } from 'react'
import { lineAuthService, type AuthState } from '@/lib/auth/line-auth'
import type { LiffProfile } from '@/types/liff'

/**
 * React Hook for LINE Profile
 * Provides authentication state and methods for React components
 */
export function useLineProfile() {
  // Local state mirrors the service state
  const [state, setState] = useState<AuthState>(lineAuthService.getState())

  // Load cached profile on mount
  useEffect(() => {
    // Try to load from cache immediately
    const cachedProfile = lineAuthService.loadFromCache()

    if (cachedProfile) {
      setState(lineAuthService.getState())
    }

    // Subscribe to state changes
    const unsubscribe = lineAuthService.subscribe((newState) => {
      setState(newState)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // Authenticate callback
  const authenticate = useCallback(async (): Promise<LiffProfile | null> => {
    try {
      return await lineAuthService.authenticate()
    } catch (error) {
      // Error is already handled and stored in state by the service
      throw error
    }
  }, [])

  // Refresh profile callback
  const refreshProfile = useCallback(async (): Promise<LiffProfile | null> => {
    try {
      return await lineAuthService.refreshProfile()
    } catch (error) {
      // Error is already handled and stored in state by the service
      throw error
    }
  }, [])

  // Logout callback
  const logout = useCallback((): void => {
    try {
      lineAuthService.logout()
    } catch (error) {
      // Error is already handled and stored in state by the service
      throw error
    }
  }, [])

  return {
    // State
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    profile: state.profile,
    error: state.error,
    lastUpdated: state.lastUpdated,

    // Methods
    authenticate,
    refreshProfile,
    logout,
  }
}
