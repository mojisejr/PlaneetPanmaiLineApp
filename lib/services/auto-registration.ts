'use client'

import { supabase } from '@/lib/database/supabase-client'
import { LiffProfile } from '@/lib/liff/client'

interface RegistrationResult {
  isNewUser: boolean
  success: boolean
  error?: string
}

interface MemberRecord {
  line_user_id: string
  display_name: string
  picture_url?: string
  registration_date: string
  last_login_date: string
}

class AutoRegistrationService {
  private registrationCache = new Map<string, boolean>()
  private readonly CACHE_TTL = 1000 * 60 * 60 // 1 hour in milliseconds
  private cacheTimestamps = new Map<string, number>()

  /**
   * Check if user is registered in the cache
   */
  private isCacheValid(userId: string): boolean {
    const timestamp = this.cacheTimestamps.get(userId)
    if (!timestamp) return false
    return Date.now() - timestamp < this.CACHE_TTL
  }

  /**
   * Check if user exists in the database
   */
  private async checkUserExists(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('line_user_id')
        .eq('line_user_id', userId)
        .single()

      if (error) {
        // User doesn't exist (not found error is expected)
        if (error.code === 'PGRST116') {
          return false
        }
        throw error
      }

      return !!data
    } catch (error) {
      console.error('Error checking user existence:', error)
      return false
    }
  }

  /**
   * Register a new user in the database
   */
  private async registerUser(profile: LiffProfile): Promise<boolean> {
    try {
      const memberRecord: MemberRecord = {
        line_user_id: profile.userId,
        display_name: profile.displayName,
        picture_url: profile.pictureUrl,
        registration_date: new Date().toISOString(),
        last_login_date: new Date().toISOString(),
      }

      const { error } = await supabase.from('members').insert([memberRecord])

      if (error) {
        console.error('Error registering user:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in registerUser:', error)
      return false
    }
  }

  /**
   * Update last login date for existing user
   */
  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await supabase
        .from('members')
        .update({ last_login_date: new Date().toISOString() })
        .eq('line_user_id', userId)
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  }

  /**
   * Main method to check and register user automatically
   * @param profile - LINE user profile from LIFF
   * @returns RegistrationResult with status information
   */
  async checkAndRegister(profile: LiffProfile): Promise<RegistrationResult> {
    try {
      const userId = profile.userId

      // Check cache first
      if (this.isCacheValid(userId) && this.registrationCache.has(userId)) {
        const isRegistered = this.registrationCache.get(userId)!
        if (isRegistered) {
          // Update last login for cached users
          await this.updateLastLogin(userId)
        }
        return {
          isNewUser: false,
          success: true,
        }
      }

      // Check if user exists in database
      const userExists = await this.checkUserExists(userId)

      if (userExists) {
        // Update cache
        this.registrationCache.set(userId, true)
        this.cacheTimestamps.set(userId, Date.now())

        // Update last login
        await this.updateLastLogin(userId)

        return {
          isNewUser: false,
          success: true,
        }
      }

      // Register new user
      const registrationSuccess = await this.registerUser(profile)

      if (registrationSuccess) {
        // Update cache
        this.registrationCache.set(userId, true)
        this.cacheTimestamps.set(userId, Date.now())

        return {
          isNewUser: true,
          success: true,
        }
      }

      return {
        isNewUser: false,
        success: false,
        error: 'Failed to register user',
      }
    } catch (error) {
      console.error('Error in checkAndRegister:', error)
      return {
        isNewUser: false,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Clear the registration cache (useful for testing or logout)
   */
  clearCache(userId?: string): void {
    if (userId) {
      this.registrationCache.delete(userId)
      this.cacheTimestamps.delete(userId)
    } else {
      this.registrationCache.clear()
      this.cacheTimestamps.clear()
    }
  }

  /**
   * Get cache statistics (useful for debugging)
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.registrationCache.size,
      entries: Array.from(this.registrationCache.keys()),
    }
  }
}

// Export singleton instance
export const autoRegistrationService = new AutoRegistrationService()
export default autoRegistrationService
