import type { LiffConfig } from '@/types/liff'

/**
 * LIFF Configuration
 * Environment-based configuration for LINE LIFF SDK
 */

// Get LIFF ID from environment variables
const getLiffId = (): string => {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID

  if (!liffId) {
    // Don't throw during build, return placeholder
    if (typeof window === 'undefined') {
      return 'placeholder-liff-id'
    }
    console.error('LIFF ID is not configured in environment variables')
    throw new Error(
      'NEXT_PUBLIC_LIFF_ID is required. Please set it in your .env file.'
    )
  }

  return liffId
}

// Environment detection
export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'

// LIFF Configuration
export const liffConfig: LiffConfig = {
  liffId: getLiffId(),
  mock: isDevelopment && process.env.NEXT_PUBLIC_LIFF_MOCK === 'true',
}

// LIFF Feature Flags
export const liffFeatures = {
  enableAutoLogin: true,
  enableProfileCache: true,
  enableErrorTracking: true,
  enableDebugLogging: isDevelopment,
}

// LIFF Endpoints (for reference)
export const liffEndpoints = {
  authorization: 'https://access.line.me/oauth2/v2.1/authorize',
  profile: 'https://api.line.me/v2/profile',
  friendship: 'https://api.line.me/friendship/v1/status',
}

// LIFF Permissions
export const liffPermissions = {
  openid: true,
  profile: true,
  chat_message: {
    write: true,
  },
}

/**
 * Validate LIFF Configuration
 * Ensures all required configuration is present
 */
export const validateLiffConfig = (): boolean => {
  try {
    // Check LIFF ID format (should be like 1234567890-AbcdEfgh)
    const liffIdRegex = /^\d{10}-[a-zA-Z0-9]{8}$/
    if (!liffIdRegex.test(liffConfig.liffId)) {
      console.warn(
        'LIFF ID format may be invalid. Expected format: 1234567890-AbcdEfgh'
      )
    }

    return true
  } catch (error) {
    console.error('LIFF configuration validation failed:', error)
    return false
  }
}

/**
 * Get LIFF Configuration
 * Returns the current LIFF configuration
 */
export const getLiffConfig = (): LiffConfig => {
  return liffConfig
}

/**
 * Debug utility to log LIFF configuration (without sensitive data)
 */
export const logLiffConfig = (): void => {
  if (liffFeatures.enableDebugLogging) {
    console.log('[LIFF Config]', {
      hasLiffId: !!liffConfig.liffId,
      liffIdPrefix: liffConfig.liffId.substring(0, 10) + '...',
      mock: liffConfig.mock,
      environment: process.env.NODE_ENV,
    })
  }
}
