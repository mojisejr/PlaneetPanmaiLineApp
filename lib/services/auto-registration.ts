'use client'

import { createClient } from '@/lib/supabase/client'
import { lineAuthService } from '@/lib/auth/line-auth'
import { liffFeatures } from '@/lib/liff/config'
import type { Member } from '@/types/database'
import type { LiffProfile } from '@/types/liff'

/**
 * Registration Status Interface
 * Represents the current state of user registration
 */
export interface RegistrationStatus {
  isNewUser: boolean
  isRegistered: boolean
  member: Member | null
  error: string | null
  registrationTime?: Date
}

/**
 * Registration Cache Data
 * Internal structure for cached registration information
 */
interface RegistrationCacheData {
  isNewUser: boolean
  isRegistered: boolean
  member: Member | null
  timestamp: number
  expiresAt: number
}

/**
 * Error codes for registration failures
 */
const ERROR_CODES = {
  RLS_VIOLATION: '42501',
  RLS_POLICY_ERROR: 'row-level security',
} as const

/**
 * Critical error message for RLS violations during API registration
 * This indicates a serious server-side configuration issue
 */
const CRITICAL_RLS_ERROR_MESSAGE = `⚠️ CRITICAL: RLS error detected during registration via API route. This indicates a serious server-side configuration issue. Check that SUPABASE_SERVICE_ROLE_KEY is set correctly and the API route is using the admin client.`

/**
 * Regex pattern for detecting PostgreSQL RLS error code 42501
 * Uses word boundary to avoid false positives
 */
const RLS_CODE_PATTERN = new RegExp(`\\b${ERROR_CODES.RLS_VIOLATION}\\b`)

/**
 * Auto-Registration Service
 * Automatically detects and registers new LINE users on first LIFF access
 * Integrates with existing authentication and server-side registration API
 */
export class AutoRegistrationService {
  private readonly CACHE_KEY_PREFIX = 'registration_status'
  private readonly CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000 // 24 hours
  private readonly MAX_RETRIES = 3 // Maximum retry attempts to prevent infinite loops
  private readonly RETRY_DELAY_MS = 1000 // Base delay between retries
  private supabase = createClient()

  /**
   * Main orchestrator method for checking and registering users
   * @param profile Optional LINE profile (if not provided, will get from auth service)
   * @returns Registration status with comprehensive information
   */
  async checkAndRegister(profile?: LiffProfile): Promise<RegistrationStatus> {
    try {
      // Get profile if not provided
      if (!profile) {
        const authProfile = await this.getProfileFromAuth()
        if (!authProfile) {
          return this.createErrorStatus('ไม่พบข้อมูลโปรไฟล์ กรุณาเข้าสู่ระบบใหม่')
        }
        profile = authProfile
      }

      // Check cache first
      const cachedStatus = this.getCachedRegistrationStatus(profile.userId)
      if (cachedStatus) {
        if (liffFeatures.enableDebugLogging) {
          console.log('[AutoRegistrationService] Using cached registration status:', {
            userId: profile.userId,
            isRegistered: cachedStatus.isRegistered,
            isNewUser: cachedStatus.isNewUser,
          })
        }
        return cachedStatus
      }

      // Check if member exists in database
      let member = await this.getMember(profile.userId)

      if (!member) {
        // New user - auto register
        member = await this.registerNewUser(profile)

        if (member) {
          const status: RegistrationStatus = {
            isNewUser: true,
            isRegistered: true,
            member,
            error: null,
            registrationTime: new Date(),
          }

          // Cache successful registration
          this.cacheRegistrationStatus(profile.userId, status)

          if (liffFeatures.enableDebugLogging) {
            console.log('[AutoRegistrationService] New user registered successfully:', {
              userId: profile.userId,
              displayName: profile.displayName,
            })
          }

          return status
        } else {
          return this.createErrorStatus('การลงทะเบียนผู้ใช้ใหม่ล้มเหลว กรุณาลองใหม่')
        }
      }

      // Existing user - cache and return status
      const status: RegistrationStatus = {
        isNewUser: false,
        isRegistered: true,
        member,
        error: null,
      }

      this.cacheRegistrationStatus(profile.userId, status)

      if (liffFeatures.enableDebugLogging) {
        console.log('[AutoRegistrationService] Existing user found:', {
          userId: profile.userId,
          displayName: profile.displayName,
        })
      }

      return status

    } catch (error) {
      return this.handleError(error, 'checkAndRegister')
    }
  }

  /**
   * Quick check if registration is complete for a user
   * @param lineUserId LINE user ID to check
   * @returns boolean indicating if registration is complete
   */
  isRegistrationComplete(lineUserId: string): boolean {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}_${lineUserId}`
      const cached = this.getCacheItem(cacheKey)

      if (!cached) {
        return false
      }

      // Check if cache is expired
      if (Date.now() > cached.expiresAt) {
        this.removeCacheItem(cacheKey)
        return false
      }

      return cached.isRegistered && cached.member !== null
    } catch (error) {
      if (liffFeatures.enableErrorTracking) {
        console.error('[AutoRegistrationService] Failed to check registration completion:', error)
      }
      return false
    }
  }

  /**
   * Clear registration cache for a user or all users
   * @param lineUserId Optional LINE user ID (if not provided, clears all registration cache)
   */
  clearRegistrationCache(lineUserId?: string): void {
    try {
      if (lineUserId) {
        const cacheKey = `${this.CACHE_KEY_PREFIX}_${lineUserId}`
        this.removeCacheItem(cacheKey)

        if (liffFeatures.enableDebugLogging) {
          console.log('[AutoRegistrationService] Cleared registration cache for user:', lineUserId)
        }
      } else {
        // Clear all registration cache
        if (typeof window !== 'undefined') {
          const keys = Object.keys(localStorage)
          keys.forEach(key => {
            if (key.startsWith(this.CACHE_KEY_PREFIX)) {
              localStorage.removeItem(key)
            }
          })
        }

        if (liffFeatures.enableDebugLogging) {
          console.log('[AutoRegistrationService] Cleared all registration cache')
        }
      }
    } catch (error) {
      if (liffFeatures.enableErrorTracking) {
        console.error('[AutoRegistrationService] Failed to clear registration cache:', error)
      }
    }
  }

  /**
   * Get cached registration status for a user
   * @param lineUserId LINE user ID
   * @returns Registration status or null if not found/expired
   */
  getCachedRegistrationStatus(lineUserId: string): RegistrationStatus | null {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}_${lineUserId}`
      const cached = this.getCacheItem(cacheKey)

      if (!cached) {
        return null
      }

      // Check if cache is expired
      if (Date.now() > cached.expiresAt) {
        this.removeCacheItem(cacheKey)
        return null
      }

      // Convert cache data to registration status
      return {
        isNewUser: cached.isNewUser,
        isRegistered: cached.isRegistered,
        member: cached.member,
        error: null,
        registrationTime: new Date(cached.timestamp),
      }
    } catch (error) {
      if (liffFeatures.enableErrorTracking) {
        console.error('[AutoRegistrationService] Failed to get cached registration status:', error)
      }
      return null
    }
  }

  /**
   * Get profile from existing authentication service
   * @returns LINE profile or null if not authenticated
   */
  private async getProfileFromAuth(): Promise<LiffProfile | null> {
    try {
      // Try to get from auth service cache first
      const cachedProfile = lineAuthService.loadFromCache()
      if (cachedProfile) {
        return cachedProfile
      }

      // If not in cache, try to authenticate
      const profile = await lineAuthService.authenticate()
      return profile
    } catch (error) {
      if (liffFeatures.enableErrorTracking) {
        console.error('[AutoRegistrationService] Failed to get profile from auth service:', error)
      }
      return null
    }
  }

  /**
   * Get member from database using API-first approach
   * @param lineUserId LINE user ID
   * @returns Member or null if not found
   */
  private async getMember(lineUserId: string): Promise<Member | null> {
    try {
      // Use API-first approach to avoid client-side RLS issues
      const response = await fetch(`/api/auth/profile?lineUserId=${lineUserId}`)

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.exists && data.member) {
        return data.member as Member
      }

      return null
    } catch (error) {
      if (liffFeatures.enableErrorTracking) {
        console.error('[AutoRegistrationService] Failed to get member via API:', error)
      }
      throw error
    }
  }

  /**
   * Register a new user via server-side API route
   * Uses service_role key to bypass RLS policies
   * Implements retry logic: up to 3 attempts with exponential backoff (1s, 2s, 4s)
   * @param profile LINE profile data
   * @returns Created member or null if all attempts fail
   */
  private async registerNewUser(profile: LiffProfile): Promise<Member | null> {
    let lastError: Error | null = null

    // Retry loop with exponential backoff to handle transient failures
    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        if (liffFeatures.enableDebugLogging && attempt > 0) {
          console.log(`[AutoRegistrationService] Retry attempt ${attempt + 1}/${this.MAX_RETRIES}`)
        }

        // Call server-side API route to register user (bypasses RLS)
        const response = await fetch('/api/auth/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: profile.userId,
            displayName: profile.displayName,
          }),
        })

        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response)
          throw new Error(errorData.message)
        }

        const result = await response.json()

        if (result.success && result.member) {
          if (liffFeatures.enableDebugLogging) {
            console.log('[AutoRegistrationService] User registered successfully via API')
          }
          return result.member as Member
        }

        throw new Error('Registration API returned invalid response')
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown registration error')

        if (liffFeatures.enableErrorTracking) {
          console.error(`[AutoRegistrationService] Registration attempt ${attempt + 1} failed:`, error)
        }

        // Check if this is an RLS error (should not happen with API route, but defensive)
        if (this.isRlsError(lastError)) {
          console.error(CRITICAL_RLS_ERROR_MESSAGE)
          // Don't retry RLS errors as they indicate a configuration issue
          break
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.MAX_RETRIES - 1) {
          const delay = this.RETRY_DELAY_MS * Math.pow(2, attempt)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    // All retries failed
    if (liffFeatures.enableErrorTracking) {
      console.error('[AutoRegistrationService] All registration attempts failed:', lastError)
    }

    return null
  }

  /**
   * Parse error response from API
   * @param response Fetch Response object
   * @returns Structured error information
   */
  private async parseErrorResponse(response: Response): Promise<{ message: string; status: number }> {
    try {
      const errorData = await response.json()
      return {
        message: errorData.error || `Registration failed with status ${response.status}`,
        status: response.status,
      }
    } catch {
      // Failed to parse JSON error response
      return {
        message: `Network error: ${response.status} ${response.statusText}`,
        status: response.status,
      }
    }
  }

  /**
   * Check if error is an RLS violation
   * Uses specific pattern matching to avoid false positives
   * @param error Error object to check
   * @returns True if RLS error detected
   */
  private isRlsError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase()
    
    // Check for specific RLS policy error phrase
    if (errorMessage.includes(ERROR_CODES.RLS_POLICY_ERROR)) {
      return true
    }
    
    // Check for PostgreSQL error code 42501 using pre-compiled pattern
    return RLS_CODE_PATTERN.test(errorMessage)
  }

  /**
   * Cache registration status for a user
   * @param lineUserId LINE user ID
   * @param status Registration status to cache
   */
  private cacheRegistrationStatus(lineUserId: string, status: RegistrationStatus): void {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}_${lineUserId}`
      const cacheData: RegistrationCacheData = {
        isNewUser: status.isNewUser,
        isRegistered: status.isRegistered,
        member: status.member,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.CACHE_EXPIRATION_MS,
      }

      this.setCacheItem(cacheKey, cacheData)

      if (liffFeatures.enableDebugLogging) {
        console.log('[AutoRegistrationService] Cached registration status:', {
          userId: lineUserId,
          isRegistered: status.isRegistered,
          expiresAt: new Date(cacheData.expiresAt).toISOString(),
        })
      }
    } catch (error) {
      if (liffFeatures.enableErrorTracking) {
        console.error('[AutoRegistrationService] Failed to cache registration status:', error)
      }
    }
  }

  /**
   * Get cache item with localStorage safety checks
   * @param cacheKey Cache key
   * @returns Cache data or null
   */
  private getCacheItem(cacheKey: string): RegistrationCacheData | null {
    if (typeof window === 'undefined') {
      return null
    }

    try {
      const cached = localStorage.getItem(cacheKey)
      if (!cached) {
        return null
      }

      return JSON.parse(cached) as RegistrationCacheData
    } catch (error) {
      if (liffFeatures.enableErrorTracking) {
        console.error('[AutoRegistrationService] Failed to get cache item:', error)
      }
      return null
    }
  }

  /**
   * Set cache item with localStorage safety checks
   * @param cacheKey Cache key
   * @param data Data to cache
   */
  private setCacheItem(cacheKey: string, data: RegistrationCacheData): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.setItem(cacheKey, JSON.stringify(data))
    } catch (error) {
      if (liffFeatures.enableErrorTracking) {
        console.error('[AutoRegistrationService] Failed to set cache item:', error)
      }
    }
  }

  /**
   * Remove cache item with localStorage safety checks
   * @param cacheKey Cache key
   */
  private removeCacheItem(cacheKey: string): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.removeItem(cacheKey)
    } catch (error) {
      if (liffFeatures.enableErrorTracking) {
        console.error('[AutoRegistrationService] Failed to remove cache item:', error)
      }
    }
  }

  /**
   * Create error status with Thai error message
   * @param message Error message
   * @returns Registration status with error
   */
  private createErrorStatus(message: string): RegistrationStatus {
    return {
      isNewUser: false,
      isRegistered: false,
      member: null,
      error: message,
    }
  }

  /**
   * Handle errors and return appropriate error status
   * @param error Error object
   * @param context Context where error occurred
   * @returns Registration status with Thai error message
   */
  private handleError(error: any, context: string): RegistrationStatus {
    const errorMessage = this.getThaiErrorMessage(error, context)

    if (liffFeatures.enableErrorTracking) {
      console.error(`[AutoRegistrationService] ${context}:`, error)
    }

    return this.createErrorStatus(errorMessage)
  }

  /**
   * Convert error to user-friendly Thai message
   * @param error Error object
   * @param context Context where error occurred
   * @returns Thai error message
   */
  private getThaiErrorMessage(error: any, _context: string): string {
    const errorCode = error?.code || 'UNKNOWN_ERROR'
    const errorMessage = error?.message?.toLowerCase() || ''

    // Check for RLS-specific errors using constants
    if (errorCode === ERROR_CODES.RLS_VIOLATION || errorMessage.includes(ERROR_CODES.RLS_POLICY_ERROR)) {
      return 'การลงทะเบียนถูกปฏิเสธ กรุณาติดต่อผู้ดูแลระบบ'
    }

    const errorMessages: Record<string, string> = {
      'NETWORK_ERROR': 'เครือข่ายมีปัญหา กรุณาลองใหม่อีกครั้ง',
      'AUTH_ERROR': 'การยืนยันตัวตนล้มเหลว กรุณาเข้าสู่ระบบใหม่',
      'DATABASE_ERROR': 'การเชื่อมต่อฐานข้อมูลมีปัญหา กรุณาลองใหม่',
      'REGISTRATION_FAILED': 'การลงทะเบียนล้มเหลว กรุณาติดต่อฝ่ายสนับสนุน',
      'VALIDATION_ERROR': 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่',
      'TIMEOUT_ERROR': 'การเชื่อมต่อหมดเวลา กรุณาลองใหม่',
      'UNKNOWN_ERROR': 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่',
    }

    return errorMessages[errorCode] || errorMessages['UNKNOWN_ERROR']
  }
}

// Export singleton instance
export const autoRegistrationService = new AutoRegistrationService()

// Export hook for React components
export function useAutoRegistration() {
  return autoRegistrationService
}