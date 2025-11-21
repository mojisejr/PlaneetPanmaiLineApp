import { createAuthClient } from 'better-auth/client'

/**
 * BetterAuth Client Configuration
 * Handles client-side authentication with BetterAuth
 */
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000'),
})

/**
 * Export BetterAuth client utilities
 */
export const { signIn, signUp, signOut, getSession, useSession } = authClient
