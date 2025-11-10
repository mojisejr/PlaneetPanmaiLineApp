'use client'

import type { SessionCreateResponse } from '@/lib/auth/line-jwt'

/**
 * Session Bridge API Client
 * Handles communication with the LINE session bridge endpoint
 */

/**
 * Create a new Supabase session using LINE ID token
 * @param lineIdToken - LINE LIFF ID token
 * @returns Promise with session response
 */
export async function createSupabaseSession(lineIdToken: string): Promise<SessionCreateResponse> {
  try {
    const response = await fetch('/api/auth/line-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lineIdToken,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json() as SessionCreateResponse
    return data
  } catch (error) {
    console.error('[Session Client] Failed to create session:', error)
    throw error
  }
}

/**
 * Validate if a session token is still valid
 * @param sessionToken - JWT session token
 * @returns Promise with validation result
 */
export async function validateSessionToken(sessionToken: string): Promise<boolean> {
  try {
    // Decode JWT to check expiration
    const parts = sessionToken.split('.')
    if (parts.length !== 3) {
      return false
    }

    const payload = parts[1]
    // Add padding if needed
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4) {
      base64 += '='
    }

    const decodedPayload = JSON.parse(atob(base64))
    const currentTime = Math.floor(Date.now() / 1000)

    return decodedPayload.exp > currentTime
  } catch (error) {
    console.error('[Session Client] Failed to validate session token:', error)
    return false
  }
}

/**
 * Parse session token expiration
 * @param sessionToken - JWT session token
 * @returns Expiration date or null if invalid
 */
export function getSessionExpiration(sessionToken: string): Date | null {
  try {
    const parts = sessionToken.split('.')
    if (parts.length !== 3) {
      return null
    }

    const payload = parts[1]
    // Add padding if needed
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4) {
      base64 += '='
    }

    const decodedPayload = JSON.parse(atob(base64))
    return new Date(decodedPayload.exp * 1000)
  } catch (error) {
    console.error('[Session Client] Failed to parse session expiration:', error)
    return null
  }
}