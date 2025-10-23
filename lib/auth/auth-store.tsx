'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useLineProfile } from '@/hooks/use-line-profile'
import type { LiffProfile } from '@/types/liff'

/**
 * Authentication Context
 * Provides authentication state and methods to all components
 */

interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  profile: LiffProfile | null
  error: Error | null
  lastUpdated: number | null
  authenticate: () => Promise<LiffProfile | null>
  refreshProfile: () => Promise<LiffProfile | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Authentication Provider
 * Wraps the application and provides auth state to all components
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const authState = useLineProfile()

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  )
}

/**
 * Use Authentication Hook
 * Access authentication state and methods from any component
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
