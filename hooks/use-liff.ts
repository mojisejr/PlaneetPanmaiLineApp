'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  initializeLiff,
  getLiff,
  isLiffLoggedIn,
  isInLineClient,
  getLiffProfile,
  liffLogin,
  liffLogout,
  closeLiffWindow,
  openLiffWindow,
  sendLiffMessages,
  shareLiffTargetPicker,
  scanLiffCode,
  getLiffFriendship,
  isLiffApiAvailable,
} from '@/lib/liff/client'
import { liffFeatures } from '@/lib/liff/config'
import type {
  UseLiffReturn,
  LiffProfile,
  LiffContext,
  LiffOS,
  LiffError,
} from '@/types/liff'

/**
 * React Hook for LIFF
 * Manages LIFF state and provides actions
 */
export function useLiff(): UseLiffReturn {
  const [isReady, setIsReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isInClient, setIsInClient] = useState(false)
  const [profile, setProfile] = useState<LiffProfile | null>(null)
  const [context, setContext] = useState<LiffContext | null>(null)
  const [os, setOs] = useState<LiffOS | null>(null)
  const [language, setLanguage] = useState<string | null>(null)
  const [version, setVersion] = useState<string | null>(null)
  const [lineVersion, setLineVersion] = useState<string | null>(null)
  const [error, setError] = useState<LiffError | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize LIFF
  useEffect(() => {
    let isMounted = true

    const init = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await initializeLiff()

        if (!isMounted) return

        if (!result.success) {
          setError(result.error || null)
          setLoading(false)
          return
        }

        const liff = getLiff()
        if (!liff) {
          setError({
            name: 'LiffError',
            message: 'LIFF instance is not available',
            code: 'NO_INSTANCE',
          } as LiffError)
          setLoading(false)
          return
        }

        // Update state
        setIsReady(true)
        setIsLoggedIn(liff.isLoggedIn())
        setIsInClient(liff.isInClient())
        setOs(liff.getOS() as LiffOS)
        setLanguage(liff.getLanguage())
        setVersion(liff.getVersion())
        setLineVersion(liff.getLineVersion())

        // Get context
        try {
          const ctx = liff.getContext()
          if (ctx) {
            setContext({
              type: ctx.type as any,
              viewType: ctx.viewType as any,
              userId: ctx.userId,
              utouId: ctx.utouId,
              roomId: ctx.roomId,
              groupId: ctx.groupId,
              squareChatId: ctx.squareChatId,
            })
          }
        } catch (err) {
          // Context may not be available in all environments
          if (liffFeatures.enableDebugLogging) {
            console.warn('[useLiff] Failed to get context:', err)
          }
        }

        // Get profile if logged in
        if (liff.isLoggedIn()) {
          try {
            const userProfile = await getLiffProfile()
            if (isMounted && userProfile) {
              setProfile(userProfile)

              if (liffFeatures.enableDebugLogging) {
                console.log('[useLiff] Profile loaded:', {
                  userId: userProfile.userId,
                  displayName: userProfile.displayName,
                })
              }
            }
          } catch (err) {
            if (liffFeatures.enableDebugLogging) {
              console.error('[useLiff] Failed to load profile:', err)
            }
          }
        }

        setLoading(false)
      } catch (err) {
        if (isMounted) {
          const liffError: LiffError = {
            name: 'LiffError',
            message:
              err instanceof Error ? err.message : 'Unknown initialization error',
            code: 'INIT_ERROR',
            details: err,
          } as LiffError
          setError(liffError)
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      isMounted = false
    }
  }, [])

  // Login action
  const login = useCallback(async (redirectUri?: string) => {
    try {
      liffLogin(redirectUri)
    } catch (err) {
      const liffError: LiffError = {
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Login failed',
        code: 'LOGIN_ERROR',
        details: err,
      } as LiffError
      setError(liffError)
      throw liffError
    }
  }, [])

  // Logout action
  const logout = useCallback(() => {
    try {
      liffLogout()
      setIsLoggedIn(false)
      setProfile(null)
    } catch (err) {
      const liffError: LiffError = {
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Logout failed',
        code: 'LOGOUT_ERROR',
        details: err,
      } as LiffError
      setError(liffError)
      throw liffError
    }
  }, [])

  // Close window action
  const closeWindow = useCallback(() => {
    try {
      closeLiffWindow()
    } catch (err) {
      const liffError: LiffError = {
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Close window failed',
        code: 'CLOSE_ERROR',
        details: err,
      } as LiffError
      setError(liffError)
      throw liffError
    }
  }, [])

  // Open window action
  const openWindow = useCallback((url: string, external = true) => {
    try {
      openLiffWindow(url, external)
    } catch (err) {
      const liffError: LiffError = {
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Open window failed',
        code: 'OPEN_ERROR',
        details: err,
      } as LiffError
      setError(liffError)
      throw liffError
    }
  }, [])

  // Send messages action
  const sendMessages = useCallback(async (messages: any[]) => {
    try {
      await sendLiffMessages(messages)
    } catch (err) {
      const liffError: LiffError = {
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Send messages failed',
        code: 'SEND_ERROR',
        details: err,
      } as LiffError
      setError(liffError)
      throw liffError
    }
  }, [])

  // Share target picker action
  const shareTargetPicker = useCallback(async (messages: any[]) => {
    try {
      await shareLiffTargetPicker(messages)
    } catch (err) {
      const liffError: LiffError = {
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Share failed',
        code: 'SHARE_ERROR',
        details: err,
      } as LiffError
      setError(liffError)
      throw liffError
    }
  }, [])

  // Scan code action
  const scanCode = useCallback(async () => {
    try {
      return await scanLiffCode()
    } catch (err) {
      const liffError: LiffError = {
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Scan code failed',
        code: 'SCAN_ERROR',
        details: err,
      } as LiffError
      setError(liffError)
      throw liffError
    }
  }, [])

  // Get profile action
  const getProfile = useCallback(async () => {
    try {
      const userProfile = await getLiffProfile()
      if (userProfile) {
        setProfile(userProfile)
      }
      return userProfile!
    } catch (err) {
      const liffError: LiffError = {
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Get profile failed',
        code: 'PROFILE_ERROR',
        details: err,
      } as LiffError
      setError(liffError)
      throw liffError
    }
  }, [])

  // Get friendship action
  const getFriendship = useCallback(async () => {
    try {
      return await getLiffFriendship()
    } catch (err) {
      const liffError: LiffError = {
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Get friendship failed',
        code: 'FRIENDSHIP_ERROR',
        details: err,
      } as LiffError
      setError(liffError)
      throw liffError
    }
  }, [])

  // Check API availability
  const isApiAvailable = useCallback((apiName: string) => {
    return isLiffApiAvailable(apiName)
  }, [])

  return {
    // State
    liff: getLiff(),
    isReady,
    isLoggedIn,
    isInClient,
    profile,
    context,
    os,
    language,
    version,
    lineVersion,
    error,
    loading,
    isApiAvailable,

    // Actions
    login,
    logout,
    closeWindow,
    openWindow,
    sendMessages,
    shareTargetPicker,
    scanCode,
    getProfile,
    getFriendship,
  }
}
