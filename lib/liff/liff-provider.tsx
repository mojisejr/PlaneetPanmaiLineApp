'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { liffClient, LiffProfile } from './liff-client'

interface LiffContextValue {
  isInitialized: boolean
  isLoggedIn: boolean
  profile: LiffProfile | null
  isLoading: boolean
  error: string | null
  login: () => Promise<void>
  logout: () => void
}

const LiffContext = createContext<LiffContextValue | undefined>(undefined)

export function useLiff() {
  const context = useContext(LiffContext)
  if (!context) {
    throw new Error('useLiff must be used within LiffProvider')
  }
  return context
}

interface LiffProviderProps {
  children: ReactNode
  liffId: string
}

export function LiffProvider({ children, liffId }: LiffProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profile, setProfile] = useState<LiffProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initLiff = async () => {
      try {
        setIsLoading(true)
        setError(null)

        await liffClient.init(liffId)
        setIsInitialized(true)

        const loggedIn = liffClient.isLoggedIn()
        setIsLoggedIn(loggedIn)

        if (loggedIn) {
          const userProfile = await liffClient.getProfile()
          setProfile(userProfile)
        }
      } catch (err) {
        console.error('LIFF initialization error:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize LIFF')
      } finally {
        setIsLoading(false)
      }
    }

    initLiff()
  }, [liffId])

  const login = async () => {
    try {
      await liffClient.login()
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const logout = () => {
    try {
      liffClient.logout()
      setIsLoggedIn(false)
      setProfile(null)
    } catch (err) {
      console.error('Logout error:', err)
      setError(err instanceof Error ? err.message : 'Logout failed')
    }
  }

  const value: LiffContextValue = {
    isInitialized,
    isLoggedIn,
    profile,
    isLoading,
    error,
    login,
    logout,
  }

  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>
}
