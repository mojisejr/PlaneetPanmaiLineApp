import type { LiffConfig } from '@/types/liff';

/**
 * LIFF Configuration
 * Environment-based configuration for different LIFF app IDs
 */

/**
 * Get LIFF configuration from environment variables
 * @returns LiffConfig object with liffId
 * @throws Error if NEXT_PUBLIC_LIFF_ID is not defined
 */
export function getLiffConfig(): LiffConfig {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

  if (!liffId) {
    throw new Error(
      'NEXT_PUBLIC_LIFF_ID is not defined in environment variables. ' +
      'Please add it to your .env.local file.'
    );
  }

  return {
    liffId,
    mock: process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_LIFF_MOCK === 'true',
  };
}

/**
 * Validate LIFF configuration
 * @param config LiffConfig to validate
 * @returns true if valid
 * @throws Error if invalid
 */
export function validateLiffConfig(config: LiffConfig): boolean {
  if (!config.liffId) {
    throw new Error('LIFF ID is required');
  }

  // LIFF ID format: nnnnnnnnnn-xxxxxxxx (10 digits - 8 alphanumeric)
  const liffIdPattern = /^\d{10}-[a-zA-Z0-9]{8}$/;
  if (!liffIdPattern.test(config.liffId)) {
    console.warn(
      'LIFF ID format may be invalid. Expected format: nnnnnnnnnn-xxxxxxxx ' +
      '(e.g., 1234567890-AbcdEfgh)'
    );
  }

  return true;
}

/**
 * LIFF environment helper
 */
export const liffEnv = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isMock: process.env.NEXT_PUBLIC_LIFF_MOCK === 'true',
};

/**
 * LIFF logging configuration
 */
export const liffLogger = {
  enabled: process.env.NEXT_PUBLIC_LIFF_DEBUG === 'true' || liffEnv.isDevelopment,
  
  log: (...args: unknown[]) => {
    if (liffLogger.enabled) {
      console.log('[LIFF]', ...args);
    }
  },
  
  error: (...args: unknown[]) => {
    if (liffLogger.enabled) {
      console.error('[LIFF Error]', ...args);
    }
  },
  
  warn: (...args: unknown[]) => {
    if (liffLogger.enabled) {
      console.warn('[LIFF Warning]', ...args);
    }
  },
};
