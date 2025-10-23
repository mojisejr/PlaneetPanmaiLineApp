'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useLineProfile } from '@/hooks/use-line-profile'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  profile: any
  error: Error | null
  authenticate: () => Promise<any>
  refreshProfile: () => Promise<any>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useLineProfile()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
