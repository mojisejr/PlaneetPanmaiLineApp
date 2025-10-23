import { liffClient } from '@/lib/liff/client'
import type { LineUserProfile } from '@/types/liff'

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  profile: LineUserProfile | null
  error: Error | null
  lastUpdated: Date | null
}

export class LineAuthService {
  private static instance: LineAuthService
  private state: AuthState = {
    isAuthenticated: false,
    isLoading: false,
    profile: null,
    error: null,
    lastUpdated: null
  }

  private constructor() {}

  static getInstance(): LineAuthService {
    if (!LineAuthService.instance) {
      LineAuthService.instance = new LineAuthService()
    }
    return LineAuthService.instance
  }

  async authenticate(): Promise<LineUserProfile> {
    this.state.isLoading = true
    this.state.error = null

    try {
      // Ensure LIFF is initialized
      if (!liffClient.getState().isInitialized) {
        await liffClient.initialize()
      }

      // Check if logged in
      if (!liffClient.getState().isLoggedIn) {
        await liffClient.login()
      }

      // Get profile
      const profile = await liffClient.getProfile()

      this.state.isAuthenticated = true
      this.state.profile = profile
      this.state.lastUpdated = new Date()

      // Cache to localStorage
      this.cacheProfile(profile)

      return profile
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Authentication failed')
      this.state.error = err
      this.state.isAuthenticated = false
      this.state.profile = null

      throw err
    } finally {
      this.state.isLoading = false
    }
  }

  async refreshProfile(): Promise<LineUserProfile | null> {
    if (!this.state.isAuthenticated) {
      return null
    }

    try {
      const profile = await liffClient.getProfile()
      this.state.profile = profile
      this.state.lastUpdated = new Date()

      this.cacheProfile(profile)
      return profile
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Profile refresh failed')
      this.state.error = err

      return null
    }
  }

  async logout(): Promise<void> {
    try {
      await liffClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.state.isAuthenticated = false
      this.state.profile = null
      this.state.error = null
      this.state.lastUpdated = null

      this.clearCache()
    }
  }

  getState(): AuthState {
    return { ...this.state }
  }

  loadFromCache(): LineUserProfile | null {
    try {
      const cached = localStorage.getItem('line_profile')
      if (cached) {
        const profile = JSON.parse(cached)
        const cachedTime = localStorage.getItem('line_profile_time')

        if (cachedTime) {
          const timeDiff = Date.now() - parseInt(cachedTime)
          const hoursDiff = timeDiff / (1000 * 60 * 60)

          // Cache valid for 24 hours
          if (hoursDiff < 24) {
            this.state.profile = profile
            this.state.lastUpdated = new Date(parseInt(cachedTime))
            return profile
          } else {
            this.clearCache()
          }
        }
      }
    } catch (error) {
      console.error('Failed to load profile from cache:', error)
      this.clearCache()
    }

    return null
  }

  private cacheProfile(profile: LineUserProfile): void {
    try {
      localStorage.setItem('line_profile', JSON.stringify(profile))
      localStorage.setItem('line_profile_time', Date.now().toString())
    } catch (error) {
      console.error('Failed to cache profile:', error)
    }
  }

  private clearCache(): void {
    try {
      localStorage.removeItem('line_profile')
      localStorage.removeItem('line_profile_time')
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }
}

export const lineAuthService = LineAuthService.getInstance()
