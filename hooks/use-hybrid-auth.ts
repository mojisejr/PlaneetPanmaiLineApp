'use client'

import { useState, useEffect, useCallback } from 'react'
import { authClient } from '@/lib/auth-client'
import {
  initializeLiff,
  getLiff,
  isLiffLoggedIn,
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
import type { LiffProfile, LiffContext, LiffOS, LiffError } from '@/types/liff'

/**
 * Get LIFF context from LIFF instance
 * @returns LIFF context or null if not available
 */
const getLiffContext = (): LiffContext | null => {
  try {
    const liff = getLiff()
    if (!liff) return null

    const ctx = liff.getContext()
    if (!ctx) return null

    return {
      type: ctx.type as any,
      viewType: ctx.viewType as any,
      userId: ctx.userId,
      utouId: ctx.utouId,
      roomId: ctx.roomId,
      groupId: ctx.groupId,
      squareChatId: ctx.squareChatId,
    }
  } catch (error) {
    // Context may not be available in all environments
    return null
  }
}

/**
 * Hybrid Authentication Hook
 * Combines BetterAuth for authentication with LIFF for platform features
 */
export function useHybridAuth() {
  // BetterAuth state (temporarily disabled until proper integration)
  const [session, setSession] = useState<any>(null)
  const [isPending, setIsPending] = useState(false)
  const [authError, setAuthError] = useState<any>(null)

  // LIFF state and functions (preserved)
  const [profile, setProfile] = useState<LiffProfile | null>(null)
  const [context, setContext] = useState<LiffContext | null>(null)
  const [liffError, setLiffError] = useState<LiffError | null>(null)
  const [isLiffReady, setIsLiffReady] = useState(false)
  const [isLiffLoading, setIsLiffLoading] = useState(true)

  // LIFF initialization (preserved)
  useEffect(() => {
    const initLiff = async () => {
      try {
        setIsLiffLoading(true)

        // Initialize LIFF
        const result = await initializeLiff()

        if (!result.success) {
          setLiffError(result.error || null)
          setIsLiffLoading(false)
          return
        }

        setIsLiffReady(true)

        const liff = getLiff()
        if (!liff) {
          setLiffError({
            name: 'LiffError',
            message: 'LIFF instance is not available',
            code: 'NO_INSTANCE',
          } as LiffError)
          setIsLiffLoading(false)
          return
        }

        // Get LIFF profile (for platform features) if logged in
        if (liff.isLoggedIn()) {
          try {
            const liffProfile = await getLiffProfile()
            if (liffProfile) {
              setProfile(liffProfile)
            }
          } catch (err) {
            console.warn('[HybridAuth] Failed to load LIFF profile:', err)
          }
        }

        // Get LIFF context
        const ctx = getLiffContext()
        if (ctx) {
          setContext(ctx)
        }

        setIsLiffLoading(false)
      } catch (error) {
        console.warn('[HybridAuth] LIFF initialization error:', error)
        setLiffError({
          name: 'LiffError',
          message:
            error instanceof Error
              ? error.message
              : 'LIFF initialization failed',
          code: 'INIT_ERROR',
          details: error,
        } as LiffError)
        setIsLiffLoading(false)
      }
    }

    initLiff()
  }, [])

  // Authentication state
  const isAuthenticated = !!session && isLiffLoggedIn()
  const isLoading = isPending || isLiffLoading

  // BetterAuth authentication functions
  const login = useCallback(async () => {
    try {
      // For BetterAuth, we need to redirect to LINE OAuth
      // In the context of LIFF, we'll use LIFF login for now
      // and let BetterAuth handle the session creation on callback
      liffLogin()
    } catch (error) {
      setLiffError({
        name: 'AuthError',
        message: error instanceof Error ? error.message : 'Login failed',
        code: 'LOGIN_ERROR',
        details: error,
      } as LiffError)
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      // Sign out from BetterAuth (temporarily disabled)
      // await authClient.signOut()

      // Logout from LIFF
      liffLogout()

      // Clear LIFF state
      setProfile(null)
      setContext(null)
      setLiffError(null)
      setSession(null)
    } catch (error) {
      setLiffError({
        name: 'AuthError',
        message: error instanceof Error ? error.message : 'Logout failed',
        code: 'LOGOUT_ERROR',
        details: error,
      } as LiffError)
      throw error
    }
  }, [])

  // LIFF platform functions (preserved)
  const closeWindow = useCallback(() => {
    try {
      closeLiffWindow()
    } catch (err) {
      setLiffError({
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Close window failed',
        code: 'CLOSE_ERROR',
        details: err,
      } as LiffError)
      throw err
    }
  }, [])

  const openWindow = useCallback((url: string, external = true) => {
    try {
      openLiffWindow(url, external)
    } catch (err) {
      setLiffError({
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Open window failed',
        code: 'OPEN_ERROR',
        details: err,
      } as LiffError)
      throw err
    }
  }, [])

  const sendMessages = useCallback(async (messages: any[]) => {
    try {
      await sendLiffMessages(messages)
    } catch (err) {
      setLiffError({
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Send messages failed',
        code: 'SEND_ERROR',
        details: err,
      } as LiffError)
      throw err
    }
  }, [])

  const shareTargetPicker = useCallback(async (messages: any[]) => {
    try {
      await shareLiffTargetPicker(messages)
    } catch (err) {
      setLiffError({
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Share failed',
        code: 'SHARE_ERROR',
        details: err,
      } as LiffError)
      throw err
    }
  }, [])

  const scanCode = useCallback(async () => {
    try {
      return await scanLiffCode()
    } catch (err) {
      setLiffError({
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Scan code failed',
        code: 'SCAN_ERROR',
        details: err,
      } as LiffError)
      throw err
    }
  }, [])

  const getFriendship = useCallback(async () => {
    try {
      return await getLiffFriendship()
    } catch (err) {
      setLiffError({
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Get friendship failed',
        code: 'FRIENDSHIP_ERROR',
        details: err,
      } as LiffError)
      throw err
    }
  }, [])

  const isApiAvailable = useCallback((apiName: string) => {
    return isLiffApiAvailable(apiName)
  }, [])

  const getProfile = useCallback(async () => {
    try {
      const userProfile = await getLiffProfile()
      if (userProfile) {
        setProfile(userProfile)
      }
      return userProfile!
    } catch (err) {
      setLiffError({
        name: 'LiffError',
        message: err instanceof Error ? err.message : 'Get profile failed',
        code: 'PROFILE_ERROR',
        details: err,
      } as LiffError)
      throw err
    }
  }, [])

  // Get LIFF OS and language info
  const getLiffInfo = useCallback(() => {
    const liff = getLiff()
    if (!liff) {
      return {
        os: null,
        language: null,
        version: null,
        lineVersion: null,
        isInClient: false,
      }
    }

    return {
      os: liff.getOS() as LiffOS,
      language: liff.getLanguage(),
      version: liff.getVersion(),
      lineVersion: liff.getLineVersion(),
      isInClient: liff.isInClient(),
    }
  }, [])

  const liffInfo = getLiffInfo()

  return {
    // BetterAuth state
    user: session?.user,
    session,
    isAuthenticated,
    isLoading,
    authError: authError,

    // LIFF state (preserved)
    profile,
    context,
    liffError,
    isLiffReady,
    isLiffLoading,

    // LIFF info
    ...liffInfo,

    // Authentication functions (BetterAuth)
    login,
    logout,

    // LIFF platform functions (preserved)
    closeWindow,
    openWindow,
    sendMessages,
    shareTargetPicker,
    scanCode,
    getFriendship,
    isApiAvailable,
    getProfile,

    // Legacy compatibility (for existing components)
    liff: getLiff(),
    isReady: isLiffReady,
    isLoggedIn: isAuthenticated,
    displayName: profile?.displayName || session?.user?.name || '',
    pictureUrl: profile?.pictureUrl || session?.user?.image || undefined,
  }
}
