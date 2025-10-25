import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  RegistrationAnalytics,
  AnalyticsEventType,
} from './registration-analytics'
import type { LiffProfile } from '@/types/liff'
import type { Member } from '@/types/database'
import type { RegistrationStatus } from '@/lib/services/auto-registration'

// Mock liffFeatures
vi.mock('@/lib/liff/config', () => ({
  liffFeatures: {
    enableDebugLogging: false,
    enableErrorTracking: true,
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

describe('RegistrationAnalytics', () => {
  let analytics: RegistrationAnalytics

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.removeItem.mockImplementation(() => {})
    analytics = new RegistrationAnalytics()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Session Management', () => {
    it('should start a new session and track initial event', () => {
      analytics.startSession()

      const events = analytics.getEvents()
      expect(events.length).toBe(1)
      expect(events[0].type).toBe(AnalyticsEventType.LIFF_INIT_START)
    })

    it('should clear previous events when starting new session', () => {
      analytics.trackEvent(AnalyticsEventType.AUTH_START)
      analytics.trackEvent(AnalyticsEventType.AUTH_SUCCESS)
      expect(analytics.getEvents().length).toBe(2)

      analytics.startSession()
      expect(analytics.getEvents().length).toBe(1)
      expect(analytics.getEvents()[0].type).toBe(AnalyticsEventType.LIFF_INIT_START)
    })

    it('should reset phase timings when starting new session', () => {
      analytics.startSession()
      analytics.trackLiffInit(true)
      
      const firstMetrics = analytics.getMetrics()
      expect(firstMetrics.liffInitDuration).toBeGreaterThan(0)

      // Start new session
      analytics.startSession()
      const secondMetrics = analytics.getMetrics()
      expect(secondMetrics.liffInitDuration).toBe(null)
    })
  })

  describe('Event Tracking', () => {
    it('should track basic event with data', () => {
      analytics.trackEvent(AnalyticsEventType.AUTH_START, {
        source: 'test',
      })

      const events = analytics.getEvents()
      expect(events.length).toBe(1)
      expect(events[0].type).toBe(AnalyticsEventType.AUTH_START)
      expect(events[0].data).toEqual({ source: 'test' })
      expect(events[0].timestamp).toBeGreaterThan(0)
    })

    it('should track event with error', () => {
      analytics.trackEvent(
        AnalyticsEventType.AUTH_ERROR,
        {},
        {
          message: 'Authentication failed',
          code: 'AUTH_001',
        }
      )

      const events = analytics.getEvents()
      expect(events[0].error).toEqual({
        message: 'Authentication failed',
        code: 'AUTH_001',
      })
    })

    it('should limit stored events to prevent memory issues', () => {
      // Track more than MAX_EVENTS (1000)
      for (let i = 0; i < 1100; i++) {
        analytics.trackEvent(AnalyticsEventType.PERFORMANCE_TIMING, { index: i })
      }

      const events = analytics.getEvents()
      expect(events.length).toBe(1000)
      // Should keep latest events
      expect(events[events.length - 1].data?.index).toBe(1099)
    })

    it('should persist events to localStorage', () => {
      analytics.trackEvent(AnalyticsEventType.AUTH_START)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'registration_analytics',
        expect.any(String)
      )
    })
  })

  describe('LIFF Initialization Tracking', () => {
    it('should track successful LIFF initialization', () => {
      analytics.startSession()
      analytics.trackLiffInit(true)

      const events = analytics.getEventsByType(AnalyticsEventType.LIFF_INIT_SUCCESS)
      expect(events.length).toBe(1)
      expect(events[0].data?.duration).toBeGreaterThanOrEqual(0)
    })

    it('should track LIFF initialization error', () => {
      analytics.startSession()
      analytics.trackLiffInit(false, {
        message: 'LIFF init failed',
        code: 'LIFF_001',
      })

      const events = analytics.getEventsByType(AnalyticsEventType.LIFF_INIT_ERROR)
      expect(events.length).toBe(1)
      expect(events[0].error?.message).toBe('LIFF init failed')
      expect(events[0].error?.code).toBe('LIFF_001')
    })
  })

  describe('Authentication Tracking', () => {
    const mockProfile: LiffProfile = {
      userId: 'test-user-123',
      displayName: 'Test User',
      pictureUrl: 'https://example.com/pic.jpg',
      statusMessage: 'Test status',
    }

    it('should track successful authentication with profile', () => {
      analytics.startSession()
      analytics.trackAuthentication(true, mockProfile)

      const authEvents = analytics.getEventsByType(AnalyticsEventType.AUTH_SUCCESS)
      const profileEvents = analytics.getEventsByType(AnalyticsEventType.AUTH_PROFILE_LOADED)

      expect(authEvents.length).toBe(1)
      expect(authEvents[0].data?.userId).toBe('test-user-123')
      expect(authEvents[0].data?.duration).toBeGreaterThanOrEqual(0)

      expect(profileEvents.length).toBe(1)
      expect(profileEvents[0].data?.user).toEqual({
        userId: 'test-user-123',
        displayName: 'Test User',
      })
    })

    it('should track authentication error', () => {
      analytics.startSession()
      analytics.trackAuthentication(false, undefined, {
        message: 'Auth failed',
        code: 'AUTH_ERROR',
      })

      const events = analytics.getEventsByType(AnalyticsEventType.AUTH_ERROR)
      expect(events.length).toBe(1)
      expect(events[0].error?.message).toBe('Auth failed')
    })
  })

  describe('Registration Tracking', () => {
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

    it('should track new user registration', () => {
      analytics.startSession()
      const status: RegistrationStatus = {
        isNewUser: true,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationTime: new Date(),
      }

      analytics.trackRegistration(status)

      const newUserEvents = analytics.getEventsByType(AnalyticsEventType.REGISTRATION_NEW_USER)
      const successEvents = analytics.getEventsByType(AnalyticsEventType.REGISTRATION_SUCCESS)

      expect(newUserEvents.length).toBe(1)
      expect(newUserEvents[0].data?.userId).toBe('test-user-123')
      expect(successEvents.length).toBe(1)
      expect(successEvents[0].data?.isNewUser).toBe(true)
    })

    it('should track existing user registration', () => {
      analytics.startSession()
      const status: RegistrationStatus = {
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
      }

      analytics.trackRegistration(status)

      const existingUserEvents = analytics.getEventsByType(
        AnalyticsEventType.REGISTRATION_EXISTING_USER
      )
      const successEvents = analytics.getEventsByType(AnalyticsEventType.REGISTRATION_SUCCESS)

      expect(existingUserEvents.length).toBe(1)
      expect(successEvents.length).toBe(1)
      expect(successEvents[0].data?.isNewUser).toBe(false)
    })

    it('should track registration error', () => {
      analytics.startSession()
      const status: RegistrationStatus = {
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: 'Registration failed',
      }

      analytics.trackRegistration(status)

      const errorEvents = analytics.getEventsByType(AnalyticsEventType.REGISTRATION_ERROR)
      expect(errorEvents.length).toBe(1)
      expect(errorEvents[0].error?.message).toBe('Registration failed')
    })

    it('should track cache hit', () => {
      analytics.trackCacheHit('test-user-123')

      const cacheEvents = analytics.getEventsByType(AnalyticsEventType.REGISTRATION_CACHE_HIT)
      expect(cacheEvents.length).toBe(1)
      expect(cacheEvents[0].data?.userId).toBe('test-user-123')
    })
  })

  describe('Flow State Tracking', () => {
    it('should track flow state changes', () => {
      analytics.trackFlowStateChange('initializing', 'authenticating')

      const events = analytics.getEventsByType(AnalyticsEventType.FLOW_STATE_CHANGE)
      expect(events.length).toBe(1)
      expect(events[0].data?.previousState).toBe('initializing')
      expect(events[0].data?.newState).toBe('authenticating')
    })

    it('should track flow completion', () => {
      analytics.startSession()
      analytics.trackFlowComplete()

      const events = analytics.getEventsByType(AnalyticsEventType.FLOW_COMPLETE)
      expect(events.length).toBe(1)
      expect(events[0].data?.totalDuration).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Member Status Tracking', () => {
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

    it('should track member status update', () => {
      analytics.trackMemberStatusUpdate(mockMember)

      const events = analytics.getEventsByType(AnalyticsEventType.MEMBER_STATUS_UPDATE)
      expect(events.length).toBe(1)
      expect(events[0].data?.memberId).toBe('member-123')
      expect(events[0].data?.lineUserId).toBe('test-user-123')
      expect(events[0].data?.isActive).toBe(true)
    })

    it('should track member status error', () => {
      analytics.trackMemberStatusUpdate(null, 'Failed to update member')

      const events = analytics.getEventsByType(AnalyticsEventType.MEMBER_STATUS_ERROR)
      expect(events.length).toBe(1)
      expect(events[0].error?.message).toBe('Failed to update member')
    })
  })

  describe('Performance Tracking', () => {
    it('should track performance timing', () => {
      analytics.trackPerformance('liff_init', 150)

      const events = analytics.getEventsByType(AnalyticsEventType.PERFORMANCE_TIMING)
      expect(events.length).toBe(1)
      expect(events[0].data?.phase).toBe('liff_init')
      expect(events[0].data?.duration).toBe(150)
    })
  })

  describe('Metrics Calculation', () => {
    beforeEach(() => {
      analytics.startSession()
    })

    it('should calculate registration metrics', () => {
      analytics.trackLiffInit(true)
      analytics.trackAuthentication(true, {
        userId: 'test-user',
        displayName: 'Test',
      })
      analytics.trackRegistration({
        isNewUser: true,
        isRegistered: true,
        member: null,
        error: null,
      })

      const metrics = analytics.getMetrics()
      expect(metrics.liffInitDuration).toBeGreaterThanOrEqual(0)
      expect(metrics.authenticationDuration).toBeGreaterThanOrEqual(0)
      expect(metrics.registrationDuration).toBeGreaterThanOrEqual(0)
      expect(metrics.totalDuration).toBeGreaterThanOrEqual(0)
    })

    it('should track flow states in metrics', () => {
      analytics.trackFlowStateChange('initializing', 'authenticating')
      analytics.trackFlowStateChange('authenticating', 'registering')
      analytics.trackFlowStateChange('registering', 'success')

      const metrics = analytics.getMetrics()
      expect(metrics.flowStates.length).toBe(3)
      expect(metrics.flowStates[0].state).toBe('authenticating')
      expect(metrics.flowStates[1].state).toBe('registering')
      expect(metrics.flowStates[2].state).toBe('success')
    })

    it('should collect errors in metrics', () => {
      analytics.trackLiffInit(false, { message: 'LIFF error' })
      analytics.trackAuthentication(false, undefined, { message: 'Auth error' })

      const metrics = analytics.getMetrics()
      expect(metrics.errors.length).toBe(2)
      expect(metrics.errors[0].message).toBe('LIFF error')
      expect(metrics.errors[0].phase).toBe('liff_initialization')
      expect(metrics.errors[1].message).toBe('Auth error')
      expect(metrics.errors[1].phase).toBe('authentication')
    })
  })

  describe('Analytics Summary', () => {
    it('should calculate success rate', () => {
      analytics.trackEvent(AnalyticsEventType.LIFF_INIT_SUCCESS)
      analytics.trackEvent(AnalyticsEventType.AUTH_SUCCESS)
      analytics.trackEvent(AnalyticsEventType.REGISTRATION_SUCCESS)
      analytics.trackEvent(AnalyticsEventType.AUTH_ERROR)

      const summary = analytics.getSummary()
      expect(summary.totalEvents).toBe(4)
      expect(summary.successRate).toBe(75) // 3 success / 4 total * 100
    })

    it('should calculate error rate', () => {
      analytics.trackEvent(AnalyticsEventType.LIFF_INIT_SUCCESS)
      analytics.trackEvent(AnalyticsEventType.AUTH_ERROR)
      analytics.trackEvent(AnalyticsEventType.REGISTRATION_ERROR)

      const summary = analytics.getSummary()
      expect(summary.errorRate).toBeCloseTo(66.67, 1) // 2 errors / 3 total * 100
    })

    it('should calculate cache hit rate', () => {
      analytics.trackEvent(AnalyticsEventType.REGISTRATION_SUCCESS)
      analytics.trackEvent(AnalyticsEventType.REGISTRATION_SUCCESS)
      analytics.trackEvent(AnalyticsEventType.REGISTRATION_CACHE_HIT)

      const summary = analytics.getSummary()
      expect(summary.cacheHitRate).toBe(50) // 1 cache hit / 2 registrations * 100
    })

    it('should calculate new user rate', () => {
      analytics.trackEvent(AnalyticsEventType.REGISTRATION_SUCCESS)
      analytics.trackEvent(AnalyticsEventType.REGISTRATION_SUCCESS)
      analytics.trackEvent(AnalyticsEventType.REGISTRATION_NEW_USER)

      const summary = analytics.getSummary()
      expect(summary.newUserRate).toBe(50) // 1 new user / 2 registrations * 100
    })

    it('should calculate average registration time', () => {
      analytics.trackEvent(AnalyticsEventType.REGISTRATION_SUCCESS, { duration: 100 })
      analytics.trackEvent(AnalyticsEventType.REGISTRATION_SUCCESS, { duration: 200 })
      analytics.trackEvent(AnalyticsEventType.REGISTRATION_SUCCESS, { duration: 300 })

      const summary = analytics.getSummary()
      expect(summary.averageRegistrationTime).toBe(200) // (100 + 200 + 300) / 3
    })
  })

  describe('Event Filtering', () => {
    it('should get events by type', () => {
      analytics.trackEvent(AnalyticsEventType.AUTH_START)
      analytics.trackEvent(AnalyticsEventType.AUTH_SUCCESS)
      analytics.trackEvent(AnalyticsEventType.REGISTRATION_SUCCESS)
      analytics.trackEvent(AnalyticsEventType.AUTH_ERROR)

      const authEvents = analytics.getEventsByType(AnalyticsEventType.AUTH_SUCCESS)
      expect(authEvents.length).toBe(1)
      expect(authEvents[0].type).toBe(AnalyticsEventType.AUTH_SUCCESS)
    })

    it('should return empty array for non-existent event type', () => {
      analytics.trackEvent(AnalyticsEventType.AUTH_START)

      const events = analytics.getEventsByType(AnalyticsEventType.FLOW_COMPLETE)
      expect(events.length).toBe(0)
    })
  })

  describe('Data Management', () => {
    it('should clear all events', () => {
      analytics.trackEvent(AnalyticsEventType.AUTH_START)
      analytics.trackEvent(AnalyticsEventType.AUTH_SUCCESS)
      expect(analytics.getEvents().length).toBe(2)

      analytics.clearEvents()
      expect(analytics.getEvents().length).toBe(0)
    })

    it('should clear persisted events from localStorage', () => {
      analytics.trackEvent(AnalyticsEventType.AUTH_START)
      analytics.clearEvents()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('registration_analytics')
    })

    it('should load persisted events from localStorage', () => {
      const mockData = {
        events: [
          {
            type: AnalyticsEventType.AUTH_START,
            timestamp: Date.now(),
          },
        ],
        startTime: Date.now(),
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData))

      analytics.loadPersistedEvents()
      expect(analytics.getEvents().length).toBe(1)
    })

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })

      // Should not throw
      expect(() => {
        analytics.trackEvent(AnalyticsEventType.AUTH_START)
      }).not.toThrow()
    })
  })

  describe('Data Export', () => {
    it('should export analytics data as JSON', () => {
      analytics.startSession()
      analytics.trackEvent(AnalyticsEventType.AUTH_START)
      analytics.trackEvent(AnalyticsEventType.AUTH_SUCCESS)

      const exported = analytics.exportData()
      const parsed = JSON.parse(exported)

      expect(parsed).toHaveProperty('summary')
      expect(parsed).toHaveProperty('events')
      expect(parsed).toHaveProperty('metrics')
      expect(parsed.events.length).toBeGreaterThan(0)
    })

    it('should include summary in exported data', () => {
      analytics.startSession()
      analytics.trackEvent(AnalyticsEventType.REGISTRATION_SUCCESS)

      const exported = analytics.exportData()
      const parsed = JSON.parse(exported)

      expect(parsed.summary).toHaveProperty('totalEvents')
      expect(parsed.summary).toHaveProperty('successRate')
      expect(parsed.summary).toHaveProperty('errorRate')
    })
  })

  describe('Phase Detection', () => {
    it('should detect LIFF initialization phase', () => {
      analytics.trackLiffInit(false, { message: 'Error' })

      const metrics = analytics.getMetrics()
      expect(metrics.errors[0].phase).toBe('liff_initialization')
    })

    it('should detect authentication phase', () => {
      analytics.trackAuthentication(false, undefined, { message: 'Error' })

      const metrics = analytics.getMetrics()
      expect(metrics.errors[0].phase).toBe('authentication')
    })

    it('should detect registration phase', () => {
      analytics.trackRegistration({
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: 'Error',
      })

      const metrics = analytics.getMetrics()
      expect(metrics.errors[0].phase).toBe('registration')
    })
  })
})
