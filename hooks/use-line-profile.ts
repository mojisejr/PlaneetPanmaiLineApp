'use client'

import { useState, useEffect, useCallback } from 'react'
import { lineAuthService, type AuthState } from '@/lib/auth/line-auth'
import type { LineUserProfile } from '@/types/liff'

export function useLineProfile() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    profile: null,
    error: null,
    lastUpdated: null
  })

  const updateState = useCallback(() => {
    setState(lineAuthService.getState())
  }, [])

  const authenticate = useCallback(async () => {
    try {
      const profile = await lineAuthService.authenticate()
      updateState()
      return profile
    } catch (error) {
      updateState()
      throw error
    }
  }, [updateState])

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await lineAuthService.refreshProfile()
      updateState()
      return profile
    } catch (error) {
      updateState()
      throw error
    }
  }, [updateState])

  const logout = useCallback(async () => {
    await lineAuthService.logout()
    updateState()
  }, [updateState])

  useEffect(() => {
    // Try to load from cache first
    const cachedProfile = lineAuthService.loadFromCache()
    updateState()

    // If no cached profile, check if already authenticated
    if (!cachedProfile) {
      const currentState = lineAuthService.getState()
      if (currentState.isAuthenticated && currentState.profile) {
        updateState()
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }
  }, [updateState])

  return {
    ...state,
    authenticate,
    refreshProfile,
    logout
  }
}
