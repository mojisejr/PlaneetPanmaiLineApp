'use client'

import liff from '@line/liff'
import type { Liff } from '@line/liff'
import { liffConfig, liffFeatures, logLiffConfig } from './config'
import { LiffError, type LiffInitResult, type LiffProfile } from '@/types/liff'

/**
 * LIFF Client
 * Manages LINE LIFF SDK initialization and lifecycle
 */

let isInitialized = false
let isInitializing = false
let initializationPromise: Promise<LiffInitResult> | null = null

/**
 * Initialize LIFF SDK
 * @returns Promise with initialization result
 */
export const initializeLiff = async (): Promise<LiffInitResult> => {
  // Return existing promise if initialization is in progress
  if (isInitializing && initializationPromise) {
    return initializationPromise
  }

  // Return success immediately if already initialized
  if (isInitialized) {
    return {
      success: true,
      liff,
    }
  }

  // Start initialization
  isInitializing = true

  initializationPromise = (async () => {
    try {
      // Log configuration in development
      logLiffConfig()

      // Initialize LIFF
      await liff.init({
        liffId: liffConfig.liffId,
        withLoginOnExternalBrowser: true,
      })

      isInitialized = true
      isInitializing = false

      if (liffFeatures.enableDebugLogging) {
        console.log('[LIFF] Initialization successful', {
          isLoggedIn: liff.isLoggedIn(),
          isInClient: liff.isInClient(),
          os: liff.getOS(),
          language: liff.getLanguage(),
          version: liff.getVersion(),
        })
      }

      return {
        success: true,
        liff,
      }
    } catch (error) {
      isInitialized = false
      isInitializing = false

      const liffError = new LiffError(
        'Failed to initialize LIFF SDK',
        'INIT_ERROR',
        error
      )

      if (liffFeatures.enableErrorTracking) {
        console.error('[LIFF] Initialization failed:', error)
      }

      return {
        success: false,
        error: liffError,
      }
    } finally {
      initializationPromise = null
    }
  })()

  return initializationPromise
}

/**
 * Get LIFF instance
 * @returns LIFF instance or null if not initialized
 */
export const getLiff = (): Liff | null => {
  return isInitialized ? liff : null
}

/**
 * Check if LIFF is initialized
 */
export const isLiffInitialized = (): boolean => {
  return isInitialized
}

/**
 * Check if user is logged in
 */
export const isLiffLoggedIn = (): boolean => {
  return isInitialized && liff.isLoggedIn()
}

/**
 * Check if running in LINE client
 */
export const isInLineClient = (): boolean => {
  return isInitialized && liff.isInClient()
}

/**
 * Get user profile
 * @returns User profile or null if not available
 */
export const getLiffProfile = async (): Promise<LiffProfile | null> => {
  try {
    if (!isLiffLoggedIn()) {
      return null
    }

    const profile = await liff.getProfile()

    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
    }
  } catch (error) {
    if (liffFeatures.enableErrorTracking) {
      console.error('[LIFF] Failed to get profile:', error)
    }
    throw new LiffError('Failed to get user profile', 'PROFILE_ERROR', error)
  }
}

/**
 * Get redirect URI for login
 * Returns current URL with correct protocol (HTTP/HTTPS)
 * @param customUri - Optional custom redirect URI
 * @returns Redirect URI string
 */
const getRedirectUri = (customUri?: string): string => {
  // Use custom URI if provided
  if (customUri) {
    return customUri
  }

  // Server-side: cannot determine redirect URI
  if (typeof window === 'undefined') {
    return ''
  }

  // Client-side: use current URL
  const currentUrl = window.location.href
  
  if (liffFeatures.enableDebugLogging) {
    console.log('[LIFF] Redirect URI:', currentUrl)
  }

  return currentUrl
}

/**
 * Login user
 * Redirects to LINE login page with proper callback handling
 * @param redirectUri - Optional redirect URI after login (defaults to current URL)
 */
export const liffLogin = (redirectUri?: string): void => {
  if (!isInitialized) {
    throw new LiffError(
      'LIFF is not initialized. Call initializeLiff() first.',
      'NOT_INITIALIZED'
    )
  }

  if (liff.isLoggedIn()) {
    if (liffFeatures.enableDebugLogging) {
      console.log('[LIFF] User is already logged in')
    }
    return
  }

  try {
    const targetUri = getRedirectUri(redirectUri)
    
    if (liffFeatures.enableDebugLogging) {
      console.log('[LIFF] Initiating login with redirect URI:', targetUri)
    }

    // Login with redirect URI to prevent infinite loops
    liff.login({
      redirectUri: targetUri || undefined,
    })
  } catch (error) {
    if (liffFeatures.enableErrorTracking) {
      console.error('[LIFF] Login failed:', error)
    }
    throw new LiffError('Failed to initiate login', 'LOGIN_ERROR', error)
  }
}

/**
 * Logout user
 */
export const liffLogout = (): void => {
  if (!isInitialized) {
    throw new LiffError(
      'LIFF is not initialized. Call initializeLiff() first.',
      'NOT_INITIALIZED'
    )
  }

  liff.logout()

  if (liffFeatures.enableDebugLogging) {
    console.log('[LIFF] User logged out')
  }
}

/**
 * Close LIFF window
 */
export const closeLiffWindow = (): void => {
  if (!isInitialized) {
    throw new LiffError(
      'LIFF is not initialized. Call initializeLiff() first.',
      'NOT_INITIALIZED'
    )
  }

  liff.closeWindow()
}

/**
 * Open external browser
 * @param url URL to open
 * @param external Open in external browser (default: true)
 */
export const openLiffWindow = (url: string, external = true): void => {
  if (!isInitialized) {
    throw new LiffError(
      'LIFF is not initialized. Call initializeLiff() first.',
      'NOT_INITIALIZED'
    )
  }

  liff.openWindow({
    url,
    external,
  })
}

/**
 * Send messages to LINE
 * @param messages Array of LINE message objects
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendLiffMessages = async (messages: any[]): Promise<void> => {
  if (!isInitialized) {
    throw new LiffError(
      'LIFF is not initialized. Call initializeLiff() first.',
      'NOT_INITIALIZED'
    )
  }

  if (!liff.isInClient()) {
    throw new LiffError(
      'sendMessages is only available in LINE client',
      'NOT_IN_CLIENT'
    )
  }

  try {
    await liff.sendMessages(messages)

    if (liffFeatures.enableDebugLogging) {
      console.log('[LIFF] Messages sent successfully', messages)
    }
  } catch (error) {
    if (liffFeatures.enableErrorTracking) {
      console.error('[LIFF] Failed to send messages:', error)
    }
    throw new LiffError('Failed to send messages', 'SEND_ERROR', error)
  }
}

/**
 * Share target picker
 * @param messages Array of LINE message objects
 */
export const shareLiffTargetPicker = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[]
): Promise<void> => {
  if (!isInitialized) {
    throw new LiffError(
      'LIFF is not initialized. Call initializeLiff() first.',
      'NOT_INITIALIZED'
    )
  }

  try {
    await liff.shareTargetPicker(messages)

    if (liffFeatures.enableDebugLogging) {
      console.log('[LIFF] Shared via target picker', messages)
    }
  } catch (error) {
    if (liffFeatures.enableErrorTracking) {
      console.error('[LIFF] Failed to share via target picker:', error)
    }
    throw new LiffError(
      'Failed to share via target picker',
      'SHARE_ERROR',
      error
    )
  }
}

/**
 * Scan QR code
 * @returns Scanned code value or null if cancelled
 */
export const scanLiffCode = async (): Promise<{ value: string } | null> => {
  if (!isInitialized) {
    throw new LiffError(
      'LIFF is not initialized. Call initializeLiff() first.',
      'NOT_INITIALIZED'
    )
  }

  if (!liff.isInClient()) {
    throw new LiffError(
      'scanCode is only available in LINE client',
      'NOT_IN_CLIENT'
    )
  }

  try {
    const result = await liff.scanCodeV2()

    if (liffFeatures.enableDebugLogging) {
      console.log('[LIFF] QR code scanned:', result)
    }

    // Handle null value from scan result
    if (result && result.value) {
      return { value: result.value }
    }

    return null
  } catch (error) {
    if (liffFeatures.enableErrorTracking) {
      console.error('[LIFF] Failed to scan QR code:', error)
    }
    throw new LiffError('Failed to scan QR code', 'SCAN_ERROR', error)
  }
}

/**
 * Get friendship status
 * @returns Friend flag status
 */
export const getLiffFriendship = async (): Promise<{
  friendFlag: boolean
}> => {
  if (!isInitialized) {
    throw new LiffError(
      'LIFF is not initialized. Call initializeLiff() first.',
      'NOT_INITIALIZED'
    )
  }

  if (!isLiffLoggedIn()) {
    throw new LiffError('User is not logged in', 'NOT_LOGGED_IN')
  }

  try {
    const friendship = await liff.getFriendship()

    if (liffFeatures.enableDebugLogging) {
      console.log('[LIFF] Friendship status:', friendship)
    }

    return friendship
  } catch (error) {
    if (liffFeatures.enableErrorTracking) {
      console.error('[LIFF] Failed to get friendship status:', error)
    }
    throw new LiffError(
      'Failed to get friendship status',
      'FRIENDSHIP_ERROR',
      error
    )
  }
}

/**
 * Check if API is available
 * @param apiName API name to check
 * @returns Whether API is available
 */
export const isLiffApiAvailable = (apiName: string): boolean => {
  if (!isInitialized) {
    return false
  }

  return liff.isApiAvailable(apiName)
}
