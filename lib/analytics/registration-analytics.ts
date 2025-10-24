'use client'

import { liffFeatures } from '@/lib/liff/config'
import type { LiffProfile } from '@/types/liff'
import type { Member } from '@/types/database'
import type { RegistrationFlowState } from '@/components/registration/registration-flow-controller'
import type { RegistrationStatus } from '@/lib/services/auto-registration'

/**
 * Analytics Event Types
 * Comprehensive event tracking for registration flow
 */
export enum AnalyticsEventType {
  // LIFF Initialization Events
  LIFF_INIT_START = 'liff_init_start',
  LIFF_INIT_SUCCESS = 'liff_init_success',
  LIFF_INIT_ERROR = 'liff_init_error',

  // Authentication Events
  AUTH_START = 'auth_start',
  AUTH_SUCCESS = 'auth_success',
  AUTH_ERROR = 'auth_error',
  AUTH_PROFILE_LOADED = 'auth_profile_loaded',

  // Registration Events
  REGISTRATION_CHECK_START = 'registration_check_start',
  REGISTRATION_NEW_USER = 'registration_new_user',
  REGISTRATION_EXISTING_USER = 'registration_existing_user',
  REGISTRATION_SUCCESS = 'registration_success',
  REGISTRATION_ERROR = 'registration_error',
  REGISTRATION_CACHE_HIT = 'registration_cache_hit',

  // Flow State Events
  FLOW_STATE_CHANGE = 'flow_state_change',
  FLOW_COMPLETE = 'flow_complete',
  FLOW_ERROR = 'flow_error',

  // Member Status Events
  MEMBER_STATUS_UPDATE = 'member_status_update',
  MEMBER_STATUS_REFRESH = 'member_status_refresh',
  MEMBER_STATUS_ERROR = 'member_status_error',

  // Performance Events
  PERFORMANCE_TIMING = 'performance_timing',
}

/**
 * Analytics Event Data Interface
 */
export interface AnalyticsEventData {
  type: AnalyticsEventType
  timestamp: number
  data?: Record<string, unknown>
  error?: {
    message: string
    code?: string
    details?: unknown
  }
  timing?: {
    duration: number
    phase: string
  }
  user?: {
    userId?: string
    displayName?: string
    isNewUser?: boolean
  }
}

/**
 * Registration Performance Metrics
 */
export interface RegistrationMetrics {
  liffInitDuration: number | null
  authenticationDuration: number | null
  registrationDuration: number | null
  totalDuration: number | null
  flowStates: Array<{ state: RegistrationFlowState; timestamp: number }>
  errors: Array<{ message: string; timestamp: number; phase: string }>
}

/**
 * Analytics Summary Interface
 */
export interface AnalyticsSummary {
  totalEvents: number
  successRate: number
  averageRegistrationTime: number | null
  errorRate: number
  cacheHitRate: number
  newUserRate: number
  metrics: RegistrationMetrics
}

/**
 * Registration Analytics Service
 * Tracks and analyzes registration flow performance and metrics
 */
export class RegistrationAnalytics {
  private events: AnalyticsEventData[] = []
  private startTime: number | null = null
  private phaseTimings: Map<string, number> = new Map()
  private readonly MAX_EVENTS = 1000 // Prevent memory issues
  private readonly STORAGE_KEY = 'registration_analytics'

  /**
   * Start tracking a new registration session
   */
  startSession(): void {
    this.events = []
    this.startTime = Date.now()
    this.phaseTimings.clear()
    this.trackEvent(AnalyticsEventType.LIFF_INIT_START, {})
  }

  /**
   * Track an analytics event
   */
  trackEvent(
    type: AnalyticsEventType,
    data?: Record<string, unknown>,
    error?: { message: string; code?: string; details?: unknown }
  ): void {
    const event: AnalyticsEventData = {
      type,
      timestamp: Date.now(),
      ...(data && { data }),
      ...(error && { error }),
    }

    this.events.push(event)

    // Prevent memory issues by limiting stored events
    if (this.events.length > this.MAX_EVENTS) {
      this.events.shift()
    }

    // Log in development mode
    if (liffFeatures.enableDebugLogging) {
      console.log('[RegistrationAnalytics]', type, event)
    }

    // Persist to localStorage for debugging
    this.persistEvents()
  }

  /**
   * Track LIFF initialization
   */
  trackLiffInit(success: boolean, error?: { message: string; code?: string }): void {
    if (success) {
      const duration = this.calculatePhaseDuration('liff_init')
      this.trackEvent(AnalyticsEventType.LIFF_INIT_SUCCESS, {
        duration,
      })
    } else {
      this.trackEvent(AnalyticsEventType.LIFF_INIT_ERROR, {}, error)
    }
  }

  /**
   * Track authentication
   */
  trackAuthentication(
    success: boolean,
    profile?: LiffProfile,
    error?: { message: string; code?: string }
  ): void {
    if (success && profile) {
      const duration = this.calculatePhaseDuration('authentication')
      this.trackEvent(AnalyticsEventType.AUTH_SUCCESS, {
        duration,
        userId: profile.userId,
      })
      this.trackEvent(AnalyticsEventType.AUTH_PROFILE_LOADED, {
        user: {
          userId: profile.userId,
          displayName: profile.displayName,
        },
      })
    } else {
      this.trackEvent(AnalyticsEventType.AUTH_ERROR, {}, error)
    }
  }

  /**
   * Track registration status
   */
  trackRegistration(status: RegistrationStatus): void {
    const duration = this.calculatePhaseDuration('registration')

    if (status.isRegistered) {
      if (status.isNewUser) {
        this.trackEvent(AnalyticsEventType.REGISTRATION_NEW_USER, {
          duration,
          userId: status.member?.line_user_id,
          registrationTime: status.registrationTime?.toISOString(),
        })
      } else {
        this.trackEvent(AnalyticsEventType.REGISTRATION_EXISTING_USER, {
          duration,
          userId: status.member?.line_user_id,
        })
      }
      this.trackEvent(AnalyticsEventType.REGISTRATION_SUCCESS, {
        isNewUser: status.isNewUser,
        member: {
          id: status.member?.id,
          lineUserId: status.member?.line_user_id,
        },
      })
    } else if (status.error) {
      this.trackEvent(
        AnalyticsEventType.REGISTRATION_ERROR,
        {
          duration,
        },
        {
          message: status.error,
        }
      )
    }
  }

  /**
   * Track registration cache hit
   */
  trackCacheHit(userId: string): void {
    this.trackEvent(AnalyticsEventType.REGISTRATION_CACHE_HIT, {
      userId,
    })
  }

  /**
   * Track flow state change
   */
  trackFlowStateChange(
    previousState: RegistrationFlowState,
    newState: RegistrationFlowState
  ): void {
    this.trackEvent(AnalyticsEventType.FLOW_STATE_CHANGE, {
      previousState,
      newState,
      timestamp: Date.now(),
    })
  }

  /**
   * Track flow completion
   */
  trackFlowComplete(): void {
    const totalDuration = this.startTime ? Date.now() - this.startTime : null
    this.trackEvent(AnalyticsEventType.FLOW_COMPLETE, {
      totalDuration,
    })
  }

  /**
   * Track member status update
   */
  trackMemberStatusUpdate(member: Member | null, error?: string): void {
    if (error) {
      this.trackEvent(
        AnalyticsEventType.MEMBER_STATUS_ERROR,
        {},
        { message: error }
      )
    } else {
      this.trackEvent(AnalyticsEventType.MEMBER_STATUS_UPDATE, {
        memberId: member?.id,
        lineUserId: member?.line_user_id,
        isActive: member?.is_active,
      })
    }
  }

  /**
   * Track performance timing
   */
  trackPerformance(phase: string, duration: number): void {
    this.trackEvent(AnalyticsEventType.PERFORMANCE_TIMING, {
      phase,
      duration,
    })
  }

  /**
   * Calculate phase duration
   */
  private calculatePhaseDuration(phase: string): number {
    if (!this.startTime) return 0

    const now = Date.now()
    const previousPhaseTime = this.phaseTimings.get(phase) || this.startTime
    const duration = now - previousPhaseTime

    this.phaseTimings.set(phase, now)

    return duration
  }

  /**
   * Get all tracked events
   */
  getEvents(): AnalyticsEventData[] {
    return [...this.events]
  }

  /**
   * Get events by type
   */
  getEventsByType(type: AnalyticsEventType): AnalyticsEventData[] {
    return this.events.filter((event) => event.type === type)
  }

  /**
   * Get registration metrics
   */
  getMetrics(): RegistrationMetrics {
    const liffInitEvents = this.getEventsByType(
      AnalyticsEventType.LIFF_INIT_SUCCESS
    )
    const authEvents = this.getEventsByType(AnalyticsEventType.AUTH_SUCCESS)
    const registrationEvents = this.getEventsByType(
      AnalyticsEventType.REGISTRATION_SUCCESS
    )
    const flowStateEvents = this.getEventsByType(
      AnalyticsEventType.FLOW_STATE_CHANGE
    )
    const errorEvents = this.events.filter(
      (event) => event.type.toString().includes('error') || event.error
    )

    return {
      liffInitDuration:
        liffInitEvents.length > 0
          ? (liffInitEvents[0].data?.duration as number) || null
          : null,
      authenticationDuration:
        authEvents.length > 0
          ? (authEvents[0].data?.duration as number) || null
          : null,
      registrationDuration:
        registrationEvents.length > 0
          ? (registrationEvents[0].data?.duration as number) || null
          : null,
      totalDuration: this.startTime ? Date.now() - this.startTime : null,
      flowStates: flowStateEvents.map((event) => ({
        state: event.data?.newState as RegistrationFlowState,
        timestamp: event.timestamp,
      })),
      errors: errorEvents.map((event) => ({
        message: event.error?.message || 'Unknown error',
        timestamp: event.timestamp,
        phase: this.detectPhaseFromEvent(event),
      })),
    }
  }

  /**
   * Get analytics summary
   */
  getSummary(): AnalyticsSummary {
    const totalEvents = this.events.length
    const successEvents = this.events.filter((event) =>
      event.type.toString().includes('success')
    )
    const errorEvents = this.events.filter(
      (event) => event.type.toString().includes('error') || event.error
    )
    const cacheHitEvents = this.getEventsByType(
      AnalyticsEventType.REGISTRATION_CACHE_HIT
    )
    const newUserEvents = this.getEventsByType(
      AnalyticsEventType.REGISTRATION_NEW_USER
    )
    const registrationEvents = this.getEventsByType(
      AnalyticsEventType.REGISTRATION_SUCCESS
    )

    const successRate =
      totalEvents > 0 ? (successEvents.length / totalEvents) * 100 : 0
    const errorRate =
      totalEvents > 0 ? (errorEvents.length / totalEvents) * 100 : 0
    const cacheHitRate =
      registrationEvents.length > 0
        ? (cacheHitEvents.length / registrationEvents.length) * 100
        : 0
    const newUserRate =
      registrationEvents.length > 0
        ? (newUserEvents.length / registrationEvents.length) * 100
        : 0

    const registrationTimes = registrationEvents
      .map((event) => event.data?.duration as number)
      .filter((duration) => duration !== undefined && duration !== null)

    const averageRegistrationTime =
      registrationTimes.length > 0
        ? registrationTimes.reduce((sum, time) => sum + time, 0) /
          registrationTimes.length
        : null

    return {
      totalEvents,
      successRate,
      averageRegistrationTime,
      errorRate,
      cacheHitRate,
      newUserRate,
      metrics: this.getMetrics(),
    }
  }

  /**
   * Detect phase from event type
   */
  private detectPhaseFromEvent(event: AnalyticsEventData): string {
    if (event.type.toString().includes('liff')) return 'liff_initialization'
    if (event.type.toString().includes('auth')) return 'authentication'
    if (event.type.toString().includes('registration')) return 'registration'
    if (event.type.toString().includes('flow')) return 'flow_control'
    if (event.type.toString().includes('member')) return 'member_status'
    return 'unknown'
  }

  /**
   * Clear all events
   */
  clearEvents(): void {
    this.events = []
    this.startTime = null
    this.phaseTimings.clear()
    this.clearPersistedEvents()
  }

  /**
   * Persist events to localStorage for debugging
   */
  private persistEvents(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = {
          events: this.events,
          startTime: this.startTime,
          timestamp: Date.now(),
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
      }
    } catch (error) {
      // Silently fail - localStorage may be unavailable
      if (liffFeatures.enableDebugLogging) {
        console.warn('[RegistrationAnalytics] Failed to persist events:', error)
      }
    }
  }

  /**
   * Load persisted events from localStorage
   */
  loadPersistedEvents(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem(this.STORAGE_KEY)
        if (data) {
          const parsed = JSON.parse(data)
          this.events = parsed.events || []
          this.startTime = parsed.startTime || null
        }
      }
    } catch (error) {
      // Silently fail - localStorage may be unavailable or corrupted
      if (liffFeatures.enableDebugLogging) {
        console.warn('[RegistrationAnalytics] Failed to load persisted events:', error)
      }
    }
  }

  /**
   * Clear persisted events from localStorage
   */
  private clearPersistedEvents(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(this.STORAGE_KEY)
      }
    } catch (error) {
      // Silently fail
      if (liffFeatures.enableDebugLogging) {
        console.warn('[RegistrationAnalytics] Failed to clear persisted events:', error)
      }
    }
  }

  /**
   * Export analytics data as JSON
   */
  exportData(): string {
    return JSON.stringify(
      {
        summary: this.getSummary(),
        events: this.events,
        metrics: this.getMetrics(),
      },
      null,
      2
    )
  }
}

/**
 * Singleton instance for global registration analytics
 */
export const registrationAnalytics = new RegistrationAnalytics()

/**
 * React hook for using registration analytics
 */
export function useRegistrationAnalytics() {
  return registrationAnalytics
}
