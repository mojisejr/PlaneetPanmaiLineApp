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
  LineSession,
  SessionState,
  SessionActions,
} from '@/types/liff'

/**
 * Session storage keys for persistence
 */
const SESSION_STORAGE_KEY = 'liff-session-data'
const SESSION_EXPIRY_KEY = 'liff-session-expiry'

/**
 * Helper function to store session data
 */
function storeSessionData(session: LineSession) {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    localStorage.setItem(SESSION_EXPIRY_KEY, session.expiresAt)
  } catch (error) {
    console.warn('[useLiff] Failed to store session data:', error)
  }
}

/**
 * Helper function to retrieve session data
 */
function retrieveSessionData(): LineSession | null {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY)
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY)

    if (!stored || !expiry) return null

    const session: LineSession = JSON.parse(stored)

    // Check if session has expired
    if (new Date() >= new Date(expiry)) {
      clearSessionData()
      return null
    }

    return session
  } catch (error) {
    console.warn('[useLiff] Failed to retrieve session data:', error)
    return null
  }
}

/**
 * Helper function to clear session data
 */
function clearSessionData() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    localStorage.removeItem(SESSION_EXPIRY_KEY)
  } catch (error) {
    console.warn('[useLiff] Failed to clear session data:', error)
  }
}

/**
 * React Hook for LIFF with Session Management
 * Manages LIFF state, session bridge integration, and provides actions
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

  // Session management state
  const [session, setSession] = useState<LineSession | null>(null)
  const [isSessionLoading, setIsSessionLoading] = useState(false)
  const [sessionError, setSessionError] = useState<LiffError | null>(null)

  // Initialize LIFF and session
  useEffect(() => {
    let isMounted = true

    const init = async () => {
      try {
        setLoading(true)
        setError(null)
        setSessionError(null)

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

        // Initialize session management
        if (liff.isLoggedIn()) {
          // Try to restore existing session from storage
          const existingSession = retrieveSessionData()
          if (existingSession) {
            setSession(existingSession)
            if (liffFeatures.enableDebugLogging) {
              console.log('[useLiff] Existing session restored')
            }
          } else {
            // Create new session automatically when logged in
            if (isMounted) {
              await createSessionInternal()
            }
          }
        } else {
          // Clear session if not logged in
          setSession(null)
          clearSessionData()
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

  /**
   * Internal session creation function
   */
  const createSessionInternal = async (): Promise<void> => {
    try {
      setIsSessionLoading(true)
      setSessionError(null)

      const liff = getLiff()
      if (!liff || !liff.isLoggedIn()) {
        throw new Error('LIFF is not initialized or user is not logged in')
      }

      // Get LINE ID token from LIFF
      const idToken = liff.getIDToken()
      if (!idToken) {
        throw new Error('Failed to get LINE ID token from LIFF')
      }

      // Call session bridge API
      const response = await fetch('/api/auth/line-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineIdToken: idToken,
        }),
      })

      const sessionData = await response.json()

      if (!response.ok) {
        throw new Error(sessionData.error || 'Failed to create session')
      }

      if (!sessionData.success) {
        throw new Error(sessionData.error || 'Session creation failed')
      }

      const newSession: LineSession = {
        sessionToken: sessionData.sessionToken,
        expiresAt: sessionData.expiresAt,
      }

      // Store session
      setSession(newSession)
      storeSessionData(newSession)

      if (liffFeatures.enableDebugLogging) {
        console.log('[useLiff] Session created successfully')
      }
    } catch (err) {
      const sessionError: LiffError = {
        name: 'SessionError',
        message: err instanceof Error ? err.message : 'Session creation failed',
        code: 'SESSION_CREATE_ERROR',
        details: err,
      }
      setSessionError(sessionError)
      throw sessionError
    } finally {
      setIsSessionLoading(false)
    }
  }

  // Login action
  const login = useCallback(async (redirectUri?: string) => {
    try {
      liffLogin(redirectUri)
      // Note: Session will be created automatically in the initialization effect
      // when LIFF becomes logged in
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
      // Clear session on logout
      setSession(null)
      clearSessionData()
      setSessionError(null)
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

  // Session management actions
  const createSession = useCallback(async () => {
    await createSessionInternal()
  }, [])

  const clearSession = useCallback(() => {
    setSession(null)
    clearSessionData()
    setSessionError(null)
  }, [])

  const refreshSession = useCallback(async () => {
    // Clear current session and create a new one
    clearSessionData()
    await createSessionInternal()
  }, [])

  // Computed session state
  const isAuthenticated = !!session && isLoggedIn

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

    // Session state
    session,
    isAuthenticated,
    isSessionLoading,
    sessionError,

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

    // Session actions
    createSession,
    clearSession,
    refreshSession,
  }
}
