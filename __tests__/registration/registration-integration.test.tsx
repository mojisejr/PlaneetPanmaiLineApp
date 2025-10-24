import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, waitFor, screen } from '@testing-library/react'
import { registrationAnalytics, AnalyticsEventType } from '@/lib/analytics/registration-analytics'
import { autoRegistrationService } from '@/lib/services/auto-registration'
import { lineAuthService } from '@/lib/auth/line-auth'
import type { LiffProfile } from '@/types/liff'
import type { Member } from '@/types/database'

// Mock dependencies
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

vi.mock('@/lib/liff/config', () => ({
  liffFeatures: {
    enableDebugLogging: false,
    enableErrorTracking: true,
  },
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

describe('Registration Integration Tests', () => {
  const mockProfile: LiffProfile = {
    userId: 'test-user-123',
    displayName: 'Test User',
    pictureUrl: 'https://example.com/pic.jpg',
    statusMessage: 'Test status',
  }

  const mockMember: Member = {
    id: 'member-123',
    line_user_id: 'test-user-123',
    display_name: 'Test User',
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

  describe('Analytics Integration with Auto-Registration Service', () => {
    it('should track complete registration flow for new user', async () => {
      // Start analytics session
      registrationAnalytics.startSession()

      // Mock successful authentication
      vi.mocked(lineAuthService.loadFromCache).mockReturnValue(mockProfile)

      // Mock new user registration
      const mockSupabaseResponse = {
        data: null,
        error: { code: 'PGRST116' }, // User doesn't exist
      }

      // Simulate registration analytics tracking
      registrationAnalytics.trackLiffInit(true)
      registrationAnalytics.trackAuthentication(true, mockProfile)
      registrationAnalytics.trackRegistration({
        isNewUser: true,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationTime: new Date(),
      })
      registrationAnalytics.trackFlowComplete()

      // Verify analytics tracked all phases
      const events = registrationAnalytics.getEvents()
      expect(events.length).toBeGreaterThan(0)

      const liffEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.LIFF_INIT_SUCCESS
      )
      expect(liffEvents.length).toBe(1)

      const authEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.AUTH_SUCCESS
      )
      expect(authEvents.length).toBe(1)

      const regEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.REGISTRATION_SUCCESS
      )
      expect(regEvents.length).toBe(1)

      const completeEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.FLOW_COMPLETE
      )
      expect(completeEvents.length).toBe(1)
    })

    it('should track registration flow for existing user', async () => {
      registrationAnalytics.startSession()

      vi.mocked(lineAuthService.loadFromCache).mockReturnValue(mockProfile)

      registrationAnalytics.trackLiffInit(true)
      registrationAnalytics.trackAuthentication(true, mockProfile)
      registrationAnalytics.trackRegistration({
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
      })

      const existingUserEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.REGISTRATION_EXISTING_USER
      )
      expect(existingUserEvents.length).toBe(1)

      const newUserEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.REGISTRATION_NEW_USER
      )
      expect(newUserEvents.length).toBe(0)
    })

    it('should track cache hit when using cached registration', async () => {
      // Simulate cache hit
      const cacheData = {
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        timestamp: Date.now(),
        expiresAt: Date.now() + 1000000,
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(cacheData))

      registrationAnalytics.trackCacheHit(mockProfile.userId)

      const cacheEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.REGISTRATION_CACHE_HIT
      )
      expect(cacheEvents.length).toBe(1)
      expect(cacheEvents[0].data?.userId).toBe(mockProfile.userId)
    })
  })

  describe('Analytics Integration with Flow States', () => {
    it('should track flow state transitions', () => {
      registrationAnalytics.startSession()

      // Simulate flow state transitions
      registrationAnalytics.trackFlowStateChange('initializing', 'authenticating')
      registrationAnalytics.trackFlowStateChange('authenticating', 'registering')
      registrationAnalytics.trackFlowStateChange('registering', 'success')

      const metrics = registrationAnalytics.getMetrics()
      expect(metrics.flowStates.length).toBe(3)
      expect(metrics.flowStates[0].state).toBe('authenticating')
      expect(metrics.flowStates[1].state).toBe('registering')
      expect(metrics.flowStates[2].state).toBe('success')
    })

    it('should track error state transitions', () => {
      registrationAnalytics.startSession()

      registrationAnalytics.trackFlowStateChange('initializing', 'authenticating')
      registrationAnalytics.trackFlowStateChange('authenticating', 'error')

      const errorEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.FLOW_STATE_CHANGE
      )
      const lastEvent = errorEvents[errorEvents.length - 1]
      expect(lastEvent.data?.newState).toBe('error')
    })
  })

  describe('Analytics Metrics Calculation Integration', () => {
    it('should calculate end-to-end registration metrics', async () => {
      registrationAnalytics.startSession()

      // Simulate complete flow with timing
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
        registrationTime: new Date(),
      })

      registrationAnalytics.trackFlowComplete()

      const metrics = registrationAnalytics.getMetrics()
      expect(metrics.liffInitDuration).toBeGreaterThan(0)
      expect(metrics.authenticationDuration).toBeGreaterThan(0)
      expect(metrics.registrationDuration).toBeGreaterThan(0)
      expect(metrics.totalDuration).toBeGreaterThan(0)
    })

    it('should generate comprehensive summary with all metrics', () => {
      registrationAnalytics.startSession()

      // Track various events
      registrationAnalytics.trackLiffInit(true)
      registrationAnalytics.trackAuthentication(true, mockProfile)
      registrationAnalytics.trackRegistration({
        isNewUser: true,
        isRegistered: true,
        member: mockMember,
        error: null,
      })
      registrationAnalytics.trackCacheHit(mockProfile.userId)

      const summary = registrationAnalytics.getSummary()

      expect(summary.totalEvents).toBeGreaterThan(0)
      expect(summary.successRate).toBeGreaterThan(0)
      expect(summary.errorRate).toBeGreaterThanOrEqual(0)
      expect(summary.cacheHitRate).toBeGreaterThanOrEqual(0)
      expect(summary.newUserRate).toBeGreaterThan(0)
      expect(summary.metrics).toBeDefined()
    })
  })

  describe('Error Tracking Integration', () => {
    it('should track and aggregate errors across phases', () => {
      registrationAnalytics.startSession()

      // Track errors in different phases
      registrationAnalytics.trackLiffInit(false, {
        message: 'LIFF initialization failed',
        code: 'LIFF_001',
      })

      registrationAnalytics.trackAuthentication(false, undefined, {
        message: 'Authentication failed',
        code: 'AUTH_001',
      })

      registrationAnalytics.trackRegistration({
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: 'Registration failed',
      })

      const metrics = registrationAnalytics.getMetrics()
      expect(metrics.errors.length).toBe(3)
      expect(metrics.errors[0].phase).toBe('liff_initialization')
      expect(metrics.errors[1].phase).toBe('authentication')
      expect(metrics.errors[2].phase).toBe('registration')

      const summary = registrationAnalytics.getSummary()
      expect(summary.errorRate).toBeGreaterThan(0)
    })
  })

  describe('Performance Monitoring Integration', () => {
    it('should track performance across all phases', () => {
      registrationAnalytics.startSession()

      // Track performance metrics
      registrationAnalytics.trackPerformance('liff_init', 100)
      registrationAnalytics.trackPerformance('authentication', 200)
      registrationAnalytics.trackPerformance('registration', 150)

      const perfEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.PERFORMANCE_TIMING
      )
      expect(perfEvents.length).toBe(3)
      expect(perfEvents[0].data?.duration).toBe(100)
      expect(perfEvents[1].data?.duration).toBe(200)
      expect(perfEvents[2].data?.duration).toBe(150)
    })

    it('should identify slow phases in registration', () => {
      registrationAnalytics.startSession()

      registrationAnalytics.trackPerformance('liff_init', 50)
      registrationAnalytics.trackPerformance('authentication', 3000) // Slow
      registrationAnalytics.trackPerformance('registration', 100)

      const perfEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.PERFORMANCE_TIMING
      )

      const slowPhases = perfEvents.filter(
        (event) => (event.data?.duration as number) > 2000
      )
      expect(slowPhases.length).toBe(1)
      expect(slowPhases[0].data?.phase).toBe('authentication')
    })
  })

  describe('Member Status Integration', () => {
    it('should track member status updates', () => {
      registrationAnalytics.trackMemberStatusUpdate(mockMember)

      const events = registrationAnalytics.getEventsByType(
        AnalyticsEventType.MEMBER_STATUS_UPDATE
      )
      expect(events.length).toBe(1)
      expect(events[0].data?.memberId).toBe(mockMember.id)
      expect(events[0].data?.lineUserId).toBe(mockMember.line_user_id)
    })

    it('should track member status errors', () => {
      registrationAnalytics.trackMemberStatusUpdate(null, 'Failed to fetch member')

      const events = registrationAnalytics.getEventsByType(
        AnalyticsEventType.MEMBER_STATUS_ERROR
      )
      expect(events.length).toBe(1)
      expect(events[0].error?.message).toBe('Failed to fetch member')
    })
  })

  describe('Data Persistence Integration', () => {
    it('should persist and restore analytics data', () => {
      registrationAnalytics.startSession()
      registrationAnalytics.trackEvent(AnalyticsEventType.AUTH_START)
      registrationAnalytics.trackEvent(AnalyticsEventType.AUTH_SUCCESS)

      // Check that data was persisted
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'registration_analytics',
        expect.any(String)
      )

      // Create new instance and load persisted data
      const newAnalytics = new (registrationAnalytics.constructor as any)()
      
      const persistedData = JSON.stringify({
        events: registrationAnalytics.getEvents(),
        startTime: Date.now(),
      })
      localStorageMock.getItem.mockReturnValue(persistedData)

      newAnalytics.loadPersistedEvents()
      expect(newAnalytics.getEvents().length).toBeGreaterThan(0)
    })

    it('should clear persisted data on clearEvents', () => {
      registrationAnalytics.trackEvent(AnalyticsEventType.AUTH_START)
      registrationAnalytics.clearEvents()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('registration_analytics')
    })
  })

  describe('Export and Reporting Integration', () => {
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

      const exported = registrationAnalytics.exportData()
      const parsed = JSON.parse(exported)

      expect(parsed).toHaveProperty('summary')
      expect(parsed).toHaveProperty('events')
      expect(parsed).toHaveProperty('metrics')

      expect(parsed.summary.totalEvents).toBeGreaterThan(0)
      expect(parsed.metrics.liffInitDuration).toBeDefined()
      expect(parsed.events.length).toBeGreaterThan(0)
    })
  })

  describe('Concurrent Registration Tracking', () => {
    it('should handle multiple concurrent registration attempts', () => {
      // Simulate multiple users registering simultaneously
      const users = [
        { userId: 'user-1', displayName: 'User 1' },
        { userId: 'user-2', displayName: 'User 2' },
        { userId: 'user-3', displayName: 'User 3' },
      ]

      registrationAnalytics.startSession()

      users.forEach((user) => {
        registrationAnalytics.trackAuthentication(true, user as LiffProfile)
        registrationAnalytics.trackRegistration({
          isNewUser: true,
          isRegistered: true,
          member: { ...mockMember, line_user_id: user.userId } as Member,
          error: null,
        })
      })

      const authEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.AUTH_SUCCESS
      )
      const regEvents = registrationAnalytics.getEventsByType(
        AnalyticsEventType.REGISTRATION_SUCCESS
      )

      expect(authEvents.length).toBe(3)
      expect(regEvents.length).toBe(3)
    })
  })

  describe('Edge Cases Integration', () => {
    it('should handle analytics tracking without session start', () => {
      // Track event without starting session
      registrationAnalytics.trackEvent(AnalyticsEventType.AUTH_START)

      const events = registrationAnalytics.getEvents()
      expect(events.length).toBe(1)
    })

    it('should handle empty analytics data export', () => {
      registrationAnalytics.clearEvents()

      const exported = registrationAnalytics.exportData()
      const parsed = JSON.parse(exported)

      expect(parsed.summary.totalEvents).toBe(0)
      expect(parsed.events.length).toBe(0)
    })

    it('should handle localStorage unavailability gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage not available')
      })

      // Should not throw
      expect(() => {
        registrationAnalytics.trackEvent(AnalyticsEventType.AUTH_START)
      }).not.toThrow()
    })
  })
})
