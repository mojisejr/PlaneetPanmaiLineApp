'use client'

import { useHybridAuth } from './use-hybrid-auth'
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
 * Hybrid LIFF Hook
 * Uses BetterAuth for authentication with LIFF for platform features
 * Maintains exact same interface as the original useLiff hook for backward compatibility
 */
export function useLiff(): UseLiffReturn {
  const hybrid = useHybridAuth()

  // Create mock session for backward compatibility
  // BetterAuth handles sessions internally, so we create a compatible structure
  const mockSession: LineSession | null = hybrid.session
    ? {
        sessionToken: 'better-auth-session', // BetterAuth handles tokens internally
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      }
    : null

  return {
    // LIFF State (preserved interface)
    liff: hybrid.liff,
    isReady: hybrid.isLiffReady,
    isLoggedIn: hybrid.isLoggedIn,
    isInClient: hybrid.isInClient,
    profile: hybrid.profile,
    context: hybrid.context,
    os: hybrid.os,
    language: hybrid.language,
    version: hybrid.version,
    lineVersion: hybrid.lineVersion,
    error: hybrid.liffError,
    loading: hybrid.isLoading,
    isApiAvailable: hybrid.isApiAvailable,

    // Session State (mapped from BetterAuth)
    session: mockSession,
    isAuthenticated: hybrid.isAuthenticated,
    isSessionLoading: hybrid.isLoading,
    sessionError: hybrid.authError as LiffError | null,

    // Actions (mapped from hybrid hook)
    login: hybrid.login,
    logout: hybrid.logout,
    closeWindow: hybrid.closeWindow,
    openWindow: hybrid.openWindow,
    sendMessages: hybrid.sendMessages,
    shareTargetPicker: hybrid.shareTargetPicker,
    scanCode: hybrid.scanCode,
    getProfile: hybrid.getProfile,
    getFriendship: hybrid.getFriendship,

    // Session Actions (backward compatibility - no-op with BetterAuth)
    createSession: () => Promise.resolve(), // BetterAuth handles this automatically
    clearSession: () => {}, // BetterAuth handles this automatically
    refreshSession: () => Promise.resolve(), // BetterAuth handles this automatically
  }
}

// Export the hybrid hook for direct usage
export { useHybridAuth } from './use-hybrid-auth'
