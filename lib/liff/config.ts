import type { LiffConfig } from '@/types/liff'

/**
 * LIFF Configuration
 * Environment-based configuration for LINE LIFF SDK
 * Supports both development and production environments
 */

/**
 * Environment Configuration Interface
 * Defines the structure for environment-specific settings
 */
export interface LiffEnvironmentConfig {
  liffId: string
  appUrl: string
  isProduction: boolean
  isDevelopment: boolean
}

// Environment detection
export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Validate environment variable
 * @param value - Environment variable value
 * @param name - Environment variable name
 * @param required - Whether the variable is required
 * @returns Validated value or empty string if not required
 */
const validateEnvVar = (
  value: string | undefined,
  name: string,
  required: boolean = false
): string => {
  if (!value && required) {
    // Don't throw during build, return placeholder
    if (typeof window === 'undefined') {
      return `placeholder-${name.toLowerCase()}`
    }
    console.error(`${name} is not configured in environment variables`)
    throw new Error(`${name} is required. Please set it in your .env file.`)
  }

  return value || ''
}

/**
 * Get environment-specific LIFF ID
 * Automatically selects between development and production LIFF IDs
 * Falls back to legacy NEXT_PUBLIC_LIFF_ID if environment-specific ID is not set
 */
const getLiffId = (): string => {
  // Try environment-specific LIFF IDs first
  const devLiffId = process.env.NEXT_PUBLIC_LIFF_ID_DEV
  const prodLiffId = process.env.NEXT_PUBLIC_LIFF_ID_PROD
  
  // Legacy fallback for backward compatibility
  const legacyLiffId = process.env.NEXT_PUBLIC_LIFF_ID

  let liffId: string

  if (isProduction) {
    // Production environment: prefer NEXT_PUBLIC_LIFF_ID_PROD
    liffId = prodLiffId || legacyLiffId || ''
  } else {
    // Development environment: prefer NEXT_PUBLIC_LIFF_ID_DEV
    liffId = devLiffId || legacyLiffId || ''
  }

  return validateEnvVar(liffId, 'NEXT_PUBLIC_LIFF_ID', true)
}

/**
 * Get environment-specific App URL
 * Supports both HTTP and HTTPS protocols for localhost
 */
const getAppUrl = (): string => {
  // Try environment-specific App URLs first
  const devAppUrl = process.env.NEXT_PUBLIC_APP_URL_DEV
  const prodAppUrl = process.env.NEXT_PUBLIC_APP_URL_PROD
  
  // Legacy fallback
  const legacyAppUrl = process.env.NEXT_PUBLIC_APP_URL

  let appUrl: string

  if (isProduction) {
    // Production environment: prefer NEXT_PUBLIC_APP_URL_PROD
    appUrl = prodAppUrl || legacyAppUrl || ''
  } else {
    // Development environment: prefer NEXT_PUBLIC_APP_URL_DEV, default to localhost
    appUrl = devAppUrl || legacyAppUrl || 'http://localhost:3000'
  }

  return validateEnvVar(appUrl, 'NEXT_PUBLIC_APP_URL', false)
}

/**
 * Detect if running on localhost
 * Checks for both HTTP and HTTPS localhost URLs
 */
export const isLocalhost = (): boolean => {
  if (typeof window === 'undefined') {
    // Server-side: check app URL configuration
    const appUrl = getAppUrl()
    return (
      appUrl.includes('localhost') ||
      appUrl.includes('127.0.0.1') ||
      appUrl.includes('0.0.0.0')
    )
  }

  // Client-side: check window.location
  const hostname = window.location.hostname
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0'
  )
}

/**
 * Get environment configuration
 * Returns complete environment-specific configuration
 */
export const getEnvironmentConfig = (): LiffEnvironmentConfig => {
  return {
    liffId: getLiffId(),
    appUrl: getAppUrl(),
    isProduction,
    isDevelopment,
  }
}

// LIFF Configuration
// Get environment configuration first
const envConfig = getEnvironmentConfig()

export const liffConfig: LiffConfig = {
  liffId: envConfig.liffId,
  mock: isDevelopment && process.env.NEXT_PUBLIC_LIFF_MOCK === 'true',
}

// Export environment configuration for use in other modules
export const environmentConfig = envConfig

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
 * Ensures all required configuration is present and valid
 */
export const validateLiffConfig = (): boolean => {
  try {
    const config = getEnvironmentConfig()

    // Check LIFF ID format (should be like 1234567890-AbcdEfgh)
    const liffIdRegex = /^\d{10}-[a-zA-Z0-9]{8}$/
    
    // Skip validation for placeholder during build
    if (config.liffId.startsWith('placeholder-')) {
      return true
    }

    if (!liffIdRegex.test(config.liffId)) {
      console.warn(
        'LIFF ID format may be invalid. Expected format: 1234567890-AbcdEfgh',
        `Current value: ${config.liffId}`
      )
    }

    // Validate App URL format
    if (config.appUrl && !config.appUrl.startsWith('placeholder-')) {
      try {
        new URL(config.appUrl)
      } catch {
        console.warn(
          'App URL format may be invalid. Expected format: http://localhost:3000 or https://domain.com',
          `Current value: ${config.appUrl}`
        )
      }

      // Warn if production is using localhost
      if (config.isProduction && isLocalhost()) {
        console.warn(
          'Production environment is configured with localhost URL. This may cause issues in production.'
        )
      }
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
    const config = getEnvironmentConfig()
    console.log('[LIFF Config]', {
      hasLiffId: !!liffConfig.liffId,
      liffIdPrefix: liffConfig.liffId.substring(0, 10) + '...',
      mock: liffConfig.mock,
      environment: process.env.NODE_ENV,
      isProduction: config.isProduction,
      isDevelopment: config.isDevelopment,
      appUrl: config.appUrl,
      isLocalhost: isLocalhost(),
    })
  }
}
