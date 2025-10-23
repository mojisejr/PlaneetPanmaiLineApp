'use client'

import {
  initializeLiff,
  isLiffLoggedIn,
  getLiffProfile,
  liffLogout,
} from '@/lib/liff/client'
import { liffFeatures } from '@/lib/liff/config'
import type { LiffProfile } from '@/types/liff'

/**
 * LINE Authentication Service
 * Singleton service for managing LINE authentication state
 */

// Cache expiration time (24 hours)
const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000
const CACHE_KEY = 'line_auth_cache'

// Authentication state interface
export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  profile: LiffProfile | null
  error: Error | null
  lastUpdated: number | null
}

// Cached profile data interface
interface CachedProfile {
  profile: LiffProfile
  timestamp: number
}

/**
 * LINE Authentication Service Class
 */
class LineAuthService {
  private state: AuthState = {
    isAuthenticated: false,
    isLoading: false,
    profile: null,
    error: null,
    lastUpdated: null,
  }

  private listeners: Set<(state: AuthState) => void> = new Set()

  /**
   * Subscribe to authentication state changes
   */
  public subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state))
  }

  /**
   * Update state and notify listeners
   */
  private updateState(updates: Partial<AuthState>): void {
    this.state = { ...this.state, ...updates }
    this.notifyListeners()
  }

  /**
   * Get current authentication state
   */
  public getState(): AuthState {
    return { ...this.state }
  }

  /**
   * Load profile from localStorage cache
   */
  public loadFromCache(): LiffProfile | null {
    try {
      if (!liffFeatures.enableProfileCache) {
        return null
      }

      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) {
        return null
      }

      const data: CachedProfile = JSON.parse(cached)
      const now = Date.now()

      // Check if cache is expired
      if (now - data.timestamp > CACHE_EXPIRATION_MS) {
        if (liffFeatures.enableDebugLogging) {
          console.log('[LineAuth] Cache expired, clearing')
        }
        localStorage.removeItem(CACHE_KEY)
        return null
      }

      if (liffFeatures.enableDebugLogging) {
        console.log('[LineAuth] Profile loaded from cache:', {
          userId: data.profile.userId,
          displayName: data.profile.displayName,
          age: Math.floor((now - data.timestamp) / 1000 / 60),
        })
      }

      // Update state with cached profile
      this.updateState({
        profile: data.profile,
        isAuthenticated: true,
        lastUpdated: data.timestamp,
      })

      return data.profile
    } catch (error) {
      if (liffFeatures.enableErrorTracking) {
        console.error('[LineAuth] Failed to load cache:', error)
      }
      return null
    }
  }

  /**
   * Save profile to localStorage cache
   */
  private saveToCache(profile: LiffProfile): void {
    try {
      if (!liffFeatures.enableProfileCache) {
        return
      }

      const data: CachedProfile = {
        profile,
        timestamp: Date.now(),
      }

      localStorage.setItem(CACHE_KEY, JSON.stringify(data))

      if (liffFeatures.enableDebugLogging) {
        console.log('[LineAuth] Profile saved to cache:', {
          userId: profile.userId,
          displayName: profile.displayName,
        })
      }
    } catch (error) {
      if (liffFeatures.enableErrorTracking) {
        console.error('[LineAuth] Failed to save cache:', error)
      }
    }
  }

  /**
   * Clear cache from localStorage
   */
  private clearCache(): void {
    try {
      localStorage.removeItem(CACHE_KEY)

      if (liffFeatures.enableDebugLogging) {
        console.log('[LineAuth] Cache cleared')
      }
    } catch (error) {
      if (liffFeatures.enableErrorTracking) {
        console.error('[LineAuth] Failed to clear cache:', error)
      }
    }
  }

  /**
   * Authenticate user with LINE
   * Ensures LIFF is initialized, checks login status, and retrieves profile
   */
  public async authenticate(): Promise<LiffProfile | null> {
    try {
      this.updateState({ isLoading: true, error: null })

      // Initialize LIFF if not already done
      const result = await initializeLiff()

      if (!result.success) {
        throw new Error(
          result.error?.message || 'Failed to initialize LIFF SDK'
        )
      }

      // Check if user is logged in
      if (!isLiffLoggedIn()) {
        this.updateState({
          isLoading: false,
          isAuthenticated: false,
          profile: null,
        })
        return null
      }

      // Get user profile
      const profile = await getLiffProfile()

      if (!profile) {
        this.updateState({
          isLoading: false,
          isAuthenticated: false,
          profile: null,
        })
        return null
      }

      // Save to cache
      this.saveToCache(profile)

      // Update state
      this.updateState({
        isLoading: false,
        isAuthenticated: true,
        profile,
        lastUpdated: Date.now(),
      })

      if (liffFeatures.enableDebugLogging) {
        console.log('[LineAuth] Authentication successful:', {
          userId: profile.userId,
          displayName: profile.displayName,
        })
      }

      return profile
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Authentication failed')

      this.updateState({
        isLoading: false,
        isAuthenticated: false,
        profile: null,
        error: err,
      })

      if (liffFeatures.enableErrorTracking) {
        console.error('[LineAuth] Authentication failed:', error)
      }

      throw err
    }
  }

  /**
   * Refresh user profile
   * Updates profile data and cache
   */
  public async refreshProfile(): Promise<LiffProfile | null> {
    try {
      this.updateState({ isLoading: true, error: null })

      // Check if user is logged in
      if (!isLiffLoggedIn()) {
        this.updateState({
          isLoading: false,
          isAuthenticated: false,
          profile: null,
        })
        return null
      }

      // Get fresh profile
      const profile = await getLiffProfile()

      if (!profile) {
        this.updateState({
          isLoading: false,
          isAuthenticated: false,
          profile: null,
        })
        return null
      }

      // Save to cache
      this.saveToCache(profile)

      // Update state
      this.updateState({
        isLoading: false,
        isAuthenticated: true,
        profile,
        lastUpdated: Date.now(),
      })

      if (liffFeatures.enableDebugLogging) {
        console.log('[LineAuth] Profile refreshed:', {
          userId: profile.userId,
          displayName: profile.displayName,
        })
      }

      return profile
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Profile refresh failed')

      this.updateState({
        isLoading: false,
        error: err,
      })

      if (liffFeatures.enableErrorTracking) {
        console.error('[LineAuth] Profile refresh failed:', error)
      }

      throw err
    }
  }

  /**
   * Logout user
   * Clears authentication state and cache
   */
  public logout(): void {
    try {
      // Logout from LIFF
      liffLogout()

      // Clear cache
      this.clearCache()

      // Update state
      this.updateState({
        isAuthenticated: false,
        profile: null,
        error: null,
        lastUpdated: null,
      })

      if (liffFeatures.enableDebugLogging) {
        console.log('[LineAuth] Logout successful')
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Logout failed')

      this.updateState({
        error: err,
      })

      if (liffFeatures.enableErrorTracking) {
        console.error('[LineAuth] Logout failed:', error)
      }

      throw err
    }
  }
}

// Export singleton instance
export const lineAuthService = new LineAuthService()
