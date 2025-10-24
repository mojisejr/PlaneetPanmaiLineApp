import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { registrationAnalytics, AnalyticsEventType } from '@/lib/analytics/registration-analytics'
import type { LiffProfile } from '@/types/liff'
import type { Member } from '@/types/database'

// Mock all external dependencies for E2E testing
vi.mock('@/lib/liff/config', () => ({
  liffFeatures: {
    enableDebugLogging: false,
    enableErrorTracking: true,
  },
}))

vi.mock('@/lib/liff/client', () => ({
  initializeLiff: vi.fn(),
  getLiff: vi.fn(),
  isLiffLoggedIn: vi.fn(),
  isInLineClient: vi.fn(),
  getLiffProfile: vi.fn(),
  liffLogin: vi.fn(),
  liffLogout: vi.fn(),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  })),
}))

vi.mock('@/lib/auth/line-auth', () => ({
  lineAuthService: {
    loadFromCache: vi.fn(),
    authenticate: vi.fn(),
    getState: vi.fn(() => ({
      isAuthenticated: false,
      isLoading: false,
      profile: null,
      error: null,
      lastUpdated: null,
    })),
    subscribe: vi.fn(() => vi.fn()),
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

describe('Registration E2E Tests', () => {
  const mockProfile: LiffProfile = {
    userId: 'e2e-test-user-123',
    displayName: 'E2E Test User',
    pictureUrl: 'https://example.com/pic.jpg',
    statusMessage: 'Testing',
  }

  const mockMember: Member = {
    id: 'e2e-member-123',
    line_user_id: 'e2e-test-user-123',
    display_name: 'E2E Test User',
    registration_date: '2024-01-01T00:00:00.000Z',
    contact_info: null,
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.removeItem.mockImplementation(() => {})
    registrationAnalytics.clearEvents()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Complete Registration Flow E2E', () => {
    it('should complete full registration flow for new user', async () => {
      // Step 1: Start session
      registrationAnalytics.startSession()
      expect(registrationAnalytics.getEvents().length).toBe(1)
      expect(registrationAnalytics.getEvents()[0].type).toBe(
        AnalyticsEventType.LIFF_INIT_START
      )

      // Step 2: LIFF initialization
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        registrationAnalytics.trackLiffInit(true)
      })

      const liffEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.LIFF_INIT_SUCCESS
      )
      expect(liffEvents.length).toBe(1)
      expect(liffEvents[0].data?.duration).toBeGreaterThan(0)

      // Step 3: Authentication
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        registrationAnalytics.trackAuthentication(true, mockProfile)
      })

      const authEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.AUTH_SUCCESS
      )
      expect(authEvents.length).toBe(1)
      expect(authEvents[0].data?.userId).toBe('e2e-test-user-123')

      const profileEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.AUTH_PROFILE_LOADED
      )
      expect(profileEvents.length).toBe(1)

      // Step 4: Registration check and new user registration
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        registrationAnalytics.trackRegistration({
          isNewUser: true,
          isRegistered: true,
          member: mockMember,
          error: null,
          registrationTime: new Date(),
        })
      })

      const newUserEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.REGISTRATION_NEW_USER
      )
      expect(newUserEvents.length).toBe(1)

      const regSuccessEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.REGISTRATION_SUCCESS
      )
      expect(regSuccessEvents.length).toBe(1)
      expect(regSuccessEvents[0].data?.isNewUser).toBe(true)

      // Step 5: Flow completion
      registrationAnalytics.trackFlowComplete()
      const completeEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.FLOW_COMPLETE
      )
      expect(completeEvents.length).toBe(1)

      // Verify complete metrics
      const metrics = registrationAnalytics.getMetrics()
      expect(metrics.liffInitDuration).toBeGreaterThan(0)
      expect(metrics.authenticationDuration).toBeGreaterThan(0)
      expect(metrics.registrationDuration).toBeGreaterThan(0)
      expect(metrics.totalDuration).toBeGreaterThan(0)

      // Verify summary
      const summary = registrationAnalytics.getSummary()
      expect(summary.totalEvents).toBeGreaterThan(5)
      expect(summary.successRate).toBeGreaterThan(0)
      expect(summary.newUserRate).toBe(100)
    })

    it('should complete flow for existing user with cache hit', async () => {
      // Mock cached registration data
      const cacheData = {
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        timestamp: Date.now(),
        expiresAt: Date.now() + 1000000,
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(cacheData))

      registrationAnalytics.startSession()

      // LIFF init
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        registrationAnalytics.trackLiffInit(true)
      })

      // Authentication
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        registrationAnalytics.trackAuthentication(true, mockProfile)
      })

      // Cache hit
      registrationAnalytics.trackCacheHit(mockProfile.userId)

      // Existing user registration
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        registrationAnalytics.trackRegistration({
          isNewUser: false,
          isRegistered: true,
          member: mockMember,
          error: null,
        })
      })

      registrationAnalytics.trackFlowComplete()

      // Verify cache hit was tracked
      const cacheEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.REGISTRATION_CACHE_HIT
      )
      expect(cacheEvents.length).toBe(1)

      // Verify existing user flow
      const existingUserEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.REGISTRATION_EXISTING_USER
      )
      expect(existingUserEvents.length).toBe(1)

      // Verify no new user events
      const newUserEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.REGISTRATION_NEW_USER
      )
      expect(newUserEvents.length).toBe(0)

      const summary = registrationAnalytics.getSummary()
      expect(summary.cacheHitRate).toBeGreaterThan(0)
      expect(summary.newUserRate).toBe(0)
    })
  })

  describe('Error Handling E2E', () => {
    it('should track and recover from LIFF initialization error', async () => {
      registrationAnalytics.startSession()

      // LIFF init failure
      registrationAnalytics.trackLiffInit(false, {
        message: 'LIFF initialization failed',
        code: 'LIFF_001',
      })

      const errorEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.LIFF_INIT_ERROR
      )
      expect(errorEvents.length).toBe(1)
      expect(errorEvents[0].error?.message).toBe('LIFF initialization failed')

      // Verify error metrics
      const metrics = registrationAnalytics.getMetrics()
      expect(metrics.errors.length).toBe(1)
      expect(metrics.errors[0].phase).toBe('liff_initialization')

      const summary = registrationAnalytics.getSummary()
      expect(summary.errorRate).toBeGreaterThan(0)
    })

    it('should track authentication failure', async () => {
      registrationAnalytics.startSession()
      registrationAnalytics.trackLiffInit(true)

      // Auth failure
      registrationAnalytics.trackAuthentication(false, undefined, {
        message: 'User denied authentication',
        code: 'AUTH_DENIED',
      })

      const authErrorEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.AUTH_ERROR
      )
      expect(authErrorEvents.length).toBe(1)
      expect(authErrorEvents[0].error?.code).toBe('AUTH_DENIED')

      const metrics = registrationAnalytics.getMetrics()
      expect(metrics.errors.length).toBe(1)
      expect(metrics.errors[0].phase).toBe('authentication')
    })

    it('should track registration failure', async () => {
      registrationAnalytics.startSession()
      registrationAnalytics.trackLiffInit(true)
      registrationAnalytics.trackAuthentication(true, mockProfile)

      // Registration failure
      registrationAnalytics.trackRegistration({
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: 'Database connection failed',
      })

      const regErrorEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.REGISTRATION_ERROR
      )
      expect(regErrorEvents.length).toBe(1)
      expect(regErrorEvents[0].error?.message).toBe('Database connection failed')

      const metrics = registrationAnalytics.getMetrics()
      expect(metrics.errors.length).toBe(1)
      expect(metrics.errors[0].phase).toBe('registration')
    })

    it('should track complete error flow with recovery', async () => {
      registrationAnalytics.startSession()

      // First attempt - fails at authentication
      registrationAnalytics.trackLiffInit(true)
      registrationAnalytics.trackAuthentication(false, undefined, {
        message: 'Network error',
      })

      // Track state change to error
      registrationAnalytics.trackFlowStateChange('authenticating', 'error')

      // Retry - successful
      registrationAnalytics.trackFlowStateChange('error', 'authenticating')
      registrationAnalytics.trackAuthentication(true, mockProfile)
      registrationAnalytics.trackRegistration({
        isNewUser: true,
        isRegistered: true,
        member: mockMember,
        error: null,
      })
      registrationAnalytics.trackFlowComplete()

      // Verify both error and success were tracked
      const authErrors = registrationAnalytics.getEventsByType(
        AnalyticsEventType.AUTH_ERROR
      )
      const authSuccess = registrationAnalytics.getEventsByType(
        AnalyticsEventType.AUTH_SUCCESS
      )

      expect(authErrors.length).toBe(1)
      expect(authSuccess.length).toBe(1)

      const summary = registrationAnalytics.getSummary()
      expect(summary.totalEvents).toBeGreaterThan(5)
      expect(summary.errorRate).toBeGreaterThan(0)
      expect(summary.successRate).toBeGreaterThan(0)
    })
  })

  describe('Flow State Transitions E2E', () => {
    it('should track complete state machine transitions', async () => {
      registrationAnalytics.startSession()

      // Simulate complete state machine
      const states: Array<[string, string]> = [
        ['initializing', 'authenticating'],
        ['authenticating', 'registering'],
        ['registering', 'success'],
        ['success', 'ready'],
      ]

      for (const [prev, next] of states) {
        registrationAnalytics.trackFlowStateChange(
          prev as any,
          next as any
        )
        await new Promise((resolve) => setTimeout(resolve, 5))
      }

      const metrics = registrationAnalytics.getMetrics()
      expect(metrics.flowStates.length).toBe(4)
      expect(metrics.flowStates[0].state).toBe('authenticating')
      expect(metrics.flowStates[3].state).toBe('ready')
    })

    it('should track error state and recovery transitions', async () => {
      registrationAnalytics.startSession()

      registrationAnalytics.trackFlowStateChange('initializing', 'authenticating')
      registrationAnalytics.trackFlowStateChange('authenticating', 'error')
      registrationAnalytics.trackFlowStateChange('error', 'authenticating')
      registrationAnalytics.trackFlowStateChange('authenticating', 'registering')
      registrationAnalytics.trackFlowStateChange('registering', 'success')

      const metrics = registrationAnalytics.getMetrics()
      expect(metrics.flowStates.length).toBe(5)

      // Find error state
      const errorState = metrics.flowStates.find((s) => s.state === 'error')
      expect(errorState).toBeDefined()
    })
  })

  describe('Performance Tracking E2E', () => {
    it('should measure and track performance target compliance', async () => {
      registrationAnalytics.startSession()

      // Target: ≤3 seconds total load time (3000ms)
      const TARGET_LOAD_TIME = 3000

      // Simulate realistic timing
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        registrationAnalytics.trackLiffInit(true) // ~100ms
      })

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150))
        registrationAnalytics.trackAuthentication(true, mockProfile) // ~150ms
      })

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        registrationAnalytics.trackRegistration({
          isNewUser: false,
          isRegistered: true,
          member: mockMember,
          error: null,
        }) // ~50ms
      })

      registrationAnalytics.trackFlowComplete()

      const metrics = registrationAnalytics.getMetrics()
      const totalDuration = metrics.totalDuration || 0

      // Should complete well within target
      expect(totalDuration).toBeLessThan(TARGET_LOAD_TIME)
    })

    it('should identify performance bottlenecks', async () => {
      registrationAnalytics.startSession()

      // Simulate slow authentication phase
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        registrationAnalytics.trackPerformance('liff_init', 100)
      })

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        registrationAnalytics.trackPerformance('authentication', 2500) // Slow!
      })

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        registrationAnalytics.trackPerformance('registration', 100)
      })

      const perfEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.PERFORMANCE_TIMING
      )

      const slowPhases = perfEvents.filter(
        (event) => (event.data?.duration as number) > 1000
      )

      expect(slowPhases.length).toBe(1)
      expect(slowPhases[0].data?.phase).toBe('authentication')
    })
  })

  describe('Member Status Tracking E2E', () => {
    it('should track member status lifecycle', async () => {
      registrationAnalytics.startSession()

      // Initial member status update
      registrationAnalytics.trackMemberStatusUpdate(mockMember)

      // Simulate member refresh
      await new Promise((resolve) => setTimeout(resolve, 10))
      const updatedMember = { ...mockMember, updated_at: new Date().toISOString() }
      registrationAnalytics.trackMemberStatusUpdate(updatedMember)

      const statusEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.MEMBER_STATUS_UPDATE
      )
      expect(statusEvents.length).toBe(2)
    })

    it('should track member status error and recovery', async () => {
      registrationAnalytics.startSession()

      // Error fetching member
      registrationAnalytics.trackMemberStatusUpdate(null, 'Network timeout')

      // Retry successful
      await new Promise((resolve) => setTimeout(resolve, 10))
      registrationAnalytics.trackMemberStatusUpdate(mockMember)

      const errorEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.MEMBER_STATUS_ERROR
      )
      const updateEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.MEMBER_STATUS_UPDATE
      )

      expect(errorEvents.length).toBe(1)
      expect(updateEvents.length).toBe(1)
    })
  })

  describe('Data Persistence E2E', () => {
    it('should persist analytics across sessions', () => {
      // Session 1: Track events
      registrationAnalytics.startSession()
      registrationAnalytics.trackLiffInit(true)
      registrationAnalytics.trackAuthentication(true, mockProfile)

      expect(localStorageMock.setItem).toHaveBeenCalled()

      // Simulate app restart - load persisted data
      const persistedCall = localStorageMock.setItem.mock.calls[
        localStorageMock.setItem.mock.calls.length - 1
      ]
      const persistedData = persistedCall[1]

      localStorageMock.getItem.mockReturnValue(persistedData)

      // Session 2: Load persisted data
      const newAnalyticsSession = new (registrationAnalytics.constructor as any)()
      newAnalyticsSession.loadPersistedEvents()

      expect(newAnalyticsSession.getEvents().length).toBeGreaterThan(0)
    })

    it('should export complete analytics report', () => {
      registrationAnalytics.startSession()
      registrationAnalytics.trackLiffInit(true)
      registrationAnalytics.trackAuthentication(true, mockProfile)
      registrationAnalytics.trackRegistration({
        isNewUser: true,
        isRegistered: true,
        member: mockMember,
        error: null,
      })
      registrationAnalytics.trackFlowComplete()

      const exported = registrationAnalytics.exportData()
      const parsed = JSON.parse(exported)

      expect(parsed).toHaveProperty('summary')
      expect(parsed).toHaveProperty('events')
      expect(parsed).toHaveProperty('metrics')

      expect(parsed.summary.totalEvents).toBeGreaterThan(0)
      expect(parsed.events.length).toBeGreaterThan(0)
      expect(parsed.metrics.totalDuration).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases E2E', () => {
    it('should handle rapid successive sessions', async () => {
      // Start multiple sessions rapidly
      for (let i = 0; i < 5; i++) {
        registrationAnalytics.startSession()
        registrationAnalytics.trackLiffInit(true)
        await new Promise((resolve) => setTimeout(resolve, 5))
      }

      // Should only have events from last session
      const liffEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.LIFF_INIT_SUCCESS
      )
      expect(liffEvents.length).toBe(1)
    })

    it('should handle event limit correctly', () => {
      registrationAnalytics.startSession()

      // Track more than MAX_EVENTS
      for (let i = 0; i < 1100; i++) {
        registrationAnalytics.trackEvent(AnalyticsEventType.PERFORMANCE_TIMING, {
          index: i,
        })
      }

      const events = registrationAnalytics.getEvents()
      expect(events.length).toBe(1000) // Max limit

      // Should have kept the latest events
      const lastEvent = events[events.length - 1]
      expect(lastEvent.data?.index).toBe(1099)
    })

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage quota exceeded')
      })

      // Should not throw
      expect(() => {
        registrationAnalytics.startSession()
        registrationAnalytics.trackLiffInit(true)
      }).not.toThrow()
    })
  })

  describe('Comprehensive Metrics E2E', () => {
    it('should generate accurate metrics for complete flow', async () => {
      registrationAnalytics.startSession()

      // Complete successful flow
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        registrationAnalytics.trackLiffInit(true)

        await new Promise((resolve) => setTimeout(resolve, 10))
        registrationAnalytics.trackAuthentication(true, mockProfile)

        await new Promise((resolve) => setTimeout(resolve, 10))
        registrationAnalytics.trackRegistration({
          isNewUser: true,
          isRegistered: true,
          member: mockMember,
          error: null,
        })
      })

      registrationAnalytics.trackFlowComplete()

      const summary = registrationAnalytics.getSummary()

      // Verify all metrics are present and valid
      expect(summary.totalEvents).toBeGreaterThan(0)
      expect(summary.successRate).toBe(100) // All events successful
      expect(summary.errorRate).toBe(0) // No errors
      expect(summary.newUserRate).toBe(100) // New user
      expect(summary.averageRegistrationTime).toBeGreaterThan(0)
      expect(summary.metrics.totalDuration).toBeGreaterThan(0)
      expect(summary.metrics.liffInitDuration).toBeGreaterThan(0)
      expect(summary.metrics.authenticationDuration).toBeGreaterThan(0)
      expect(summary.metrics.registrationDuration).toBeGreaterThan(0)
    })
  })
})
