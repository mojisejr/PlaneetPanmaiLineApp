/**
 * useLiff Hook Tests
 * 
 * Unit tests covering:
 * - Successful session creation
 * - Session persistence (localStorage)
 * - Failure handling (API errors)
 * - Loading states
 * - Session expiration
 * - Logout clearing session
 */

import { renderHook, waitFor, act } from '@testing-library/react'
import { useLiff } from '@/hooks/use-liff'
import * as liffClient from '@/lib/liff/client'

// Mock LIFF client
jest.mock('@/lib/liff/client', () => ({
  initializeLiff: jest.fn(),
  getLiff: jest.fn(),
  isLiffLoggedIn: jest.fn(),
  isInLineClient: jest.fn(),
  getLiffProfile: jest.fn(),
  liffLogin: jest.fn(),
  liffLogout: jest.fn(),
  closeLiffWindow: jest.fn(),
  openLiffWindow: jest.fn(),
  sendLiffMessages: jest.fn(),
  shareLiffTargetPicker: jest.fn(),
  scanLiffCode: jest.fn(),
  getLiffFriendship: jest.fn(),
  isLiffApiAvailable: jest.fn(),
}))

// Mock LIFF config
jest.mock('@/lib/liff/config', () => ({
  liffFeatures: {
    enableDebugLogging: false,
  },
}))

describe('useLiff Hook', () => {
  // Mock LIFF instance
  const mockLiffInstance = {
    isLoggedIn: jest.fn(),
    isInClient: jest.fn(),
    getOS: jest.fn(),
    getLanguage: jest.fn(),
    getVersion: jest.fn(),
    getLineVersion: jest.fn(),
    getContext: jest.fn(),
    getIDToken: jest.fn(),
  }

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    
    // Clear localStorage
    localStorage.clear()
    
    // Mock fetch for session API
    global.fetch = jest.fn()
    
    // Default mock implementations
    ;(liffClient.initializeLiff as jest.Mock).mockResolvedValue({
      success: true,
    })
    ;(liffClient.getLiff as jest.Mock).mockReturnValue(mockLiffInstance)
    mockLiffInstance.isLoggedIn.mockReturnValue(false)
    mockLiffInstance.isInClient.mockReturnValue(true)
    mockLiffInstance.getOS.mockReturnValue('ios')
    mockLiffInstance.getLanguage.mockReturnValue('en')
    mockLiffInstance.getVersion.mockReturnValue('2.27.2')
    mockLiffInstance.getLineVersion.mockReturnValue('13.0.0')
    mockLiffInstance.getContext.mockReturnValue({
      type: 'utou',
      viewType: 'full',
      userId: 'U1234567890',
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize LIFF successfully', async () => {
      const { result } = renderHook(() => useLiff())

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isReady).toBe(true)
      expect(result.current.error).toBeNull()
      expect(liffClient.initializeLiff).toHaveBeenCalled()
    })

    it('should handle initialization failure', async () => {
      ;(liffClient.initializeLiff as jest.Mock).mockResolvedValue({
        success: false,
        error: { name: 'LiffError', message: 'Init failed', code: 'INIT_ERROR' },
      })

      const { result } = renderHook(() => useLiff())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isReady).toBe(false)
      expect(result.current.error).not.toBeNull()
      expect(result.current.error?.message).toBe('Init failed')
    })
  })

  describe('Session Creation', () => {
    it('should create session after successful login', async () => {
      const mockIdToken = 'mock-line-id-token'
      
      mockLiffInstance.isLoggedIn.mockReturnValue(true)
      mockLiffInstance.getIDToken.mockReturnValue(mockIdToken)
      
      ;(liffClient.getLiffProfile as jest.Mock).mockResolvedValue({
        userId: 'U1234567890',
        displayName: 'Test User',
        pictureUrl: 'https://example.com/pic.jpg',
      })

      // Mock successful session creation
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          sessionToken: 'mock-session-token',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      })

      const { result } = renderHook(() => useLiff())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isLoggedIn).toBe(true)
      expect(result.current.sessionToken).toBe('mock-session-token')
      expect(result.current.sessionError).toBeNull()
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/line-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineIdToken: mockIdToken }),
      })
    })

    it('should handle session creation failure gracefully', async () => {
      const mockIdToken = 'mock-line-id-token'
      
      mockLiffInstance.isLoggedIn.mockReturnValue(true)
      mockLiffInstance.getIDToken.mockReturnValue(mockIdToken)
      
      ;(liffClient.getLiffProfile as jest.Mock).mockResolvedValue({
        userId: 'U1234567890',
        displayName: 'Test User',
      })

      // Mock session creation failure
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          error: 'User is not a registered member',
        }),
      })

      const { result } = renderHook(() => useLiff())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Should still be logged in to LIFF, but session creation failed
      expect(result.current.isLoggedIn).toBe(true)
      expect(result.current.sessionToken).toBeNull()
      expect(result.current.sessionError).not.toBeNull()
      expect(result.current.sessionError?.message).toContain('registered member')
    })

    it('should not create session if user not logged in', async () => {
      mockLiffInstance.isLoggedIn.mockReturnValue(false)

      const { result } = renderHook(() => useLiff())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isLoggedIn).toBe(false)
      expect(result.current.sessionToken).toBeNull()
      expect(global.fetch).not.toHaveBeenCalled()
    })
  })

  describe('Session Persistence', () => {
    it('should load existing session from localStorage', async () => {
      const mockToken = 'existing-session-token'
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      
      localStorage.setItem('liff_session_token', mockToken)
      localStorage.setItem('liff_session_expires', expiresAt)

      const { result } = renderHook(() => useLiff())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.sessionToken).toBe(mockToken)
    })

    it('should not load expired session from localStorage', async () => {
      const mockToken = 'expired-session-token'
      const expiresAt = new Date(Date.now() - 1000).toISOString() // Expired 1 second ago
      
      localStorage.setItem('liff_session_token', mockToken)
      localStorage.setItem('liff_session_expires', expiresAt)

      const { result } = renderHook(() => useLiff())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.sessionToken).toBeNull()
      expect(localStorage.getItem('liff_session_token')).toBeNull()
    })

    it('should save session to localStorage on creation', async () => {
      const mockIdToken = 'mock-line-id-token'
      const mockSessionToken = 'new-session-token'
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      
      mockLiffInstance.isLoggedIn.mockReturnValue(true)
      mockLiffInstance.getIDToken.mockReturnValue(mockIdToken)
      
      ;(liffClient.getLiffProfile as jest.Mock).mockResolvedValue({
        userId: 'U1234567890',
        displayName: 'Test User',
      })

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          sessionToken: mockSessionToken,
          expiresAt,
        }),
      })

      const { result } = renderHook(() => useLiff())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(localStorage.getItem('liff_session_token')).toBe(mockSessionToken)
      expect(localStorage.getItem('liff_session_expires')).toBe(expiresAt)
    })
  })

  describe('Logout', () => {
    it('should clear session on logout', async () => {
      const mockToken = 'session-to-clear'
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      
      localStorage.setItem('liff_session_token', mockToken)
      localStorage.setItem('liff_session_expires', expiresAt)

      mockLiffInstance.isLoggedIn.mockReturnValue(true)

      const { result } = renderHook(() => useLiff())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.sessionToken).toBe(mockToken)

      // Logout with act()
      act(() => {
        result.current.logout()
      })

      expect(result.current.sessionToken).toBeNull()
      expect(localStorage.getItem('liff_session_token')).toBeNull()
      expect(localStorage.getItem('liff_session_expires')).toBeNull()
      expect(liffClient.liffLogout).toHaveBeenCalled()
    })
  })

  describe('Loading States', () => {
    it('should show loading during initialization', () => {
      const { result } = renderHook(() => useLiff())

      expect(result.current.loading).toBe(true)
      expect(result.current.isReady).toBe(false)
    })

    it('should show sessionLoading during session creation', async () => {
      const mockIdToken = 'mock-line-id-token'
      
      mockLiffInstance.isLoggedIn.mockReturnValue(true)
      mockLiffInstance.getIDToken.mockReturnValue(mockIdToken)
      
      ;(liffClient.getLiffProfile as jest.Mock).mockResolvedValue({
        userId: 'U1234567890',
        displayName: 'Test User',
      })

      // Delay session creation to observe loading state
      ;(global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: async () => ({
                  success: true,
                  sessionToken: 'mock-token',
                  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                }),
              })
            }, 100)
          })
      )

      const { result } = renderHook(() => useLiff())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Session creation might still be loading
      await waitFor(() => {
        expect(result.current.sessionLoading).toBe(false)
      })

      expect(result.current.sessionToken).toBe('mock-token')
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors during session creation', async () => {
      const mockIdToken = 'mock-line-id-token'
      
      mockLiffInstance.isLoggedIn.mockReturnValue(true)
      mockLiffInstance.getIDToken.mockReturnValue(mockIdToken)
      
      ;(liffClient.getLiffProfile as jest.Mock).mockResolvedValue({
        userId: 'U1234567890',
        displayName: 'Test User',
      })

      // Mock network error
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useLiff())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.sessionError).not.toBeNull()
      expect(result.current.sessionError?.message).toContain('Network error')
    })

    it('should handle API error responses', async () => {
      const mockIdToken = 'mock-line-id-token'
      
      mockLiffInstance.isLoggedIn.mockReturnValue(true)
      mockLiffInstance.getIDToken.mockReturnValue(mockIdToken)
      
      ;(liffClient.getLiffProfile as jest.Mock).mockResolvedValue({
        userId: 'U1234567890',
        displayName: 'Test User',
      })

      // Mock API error
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          error: 'Invalid or expired LINE token',
        }),
      })

      const { result } = renderHook(() => useLiff())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.sessionError).not.toBeNull()
      expect(result.current.sessionError?.code).toBe('SESSION_CREATE_ERROR')
    })
  })
})
