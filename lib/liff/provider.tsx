'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { liffClient, LiffProfile } from './client'

interface LiffContextType {
  isInitialized: boolean
  isLoggedIn: boolean
  profile: LiffProfile | null
  isLoading: boolean
  error: Error | null
  login: () => Promise<void>
  logout: () => void
}

const LiffContext = createContext<LiffContextType | undefined>(undefined)

export function LiffProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profile, setProfile] = useState<LiffProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function initLiff() {
      try {
        setIsLoading(true)
        setError(null)

        await liffClient.init()
        setIsInitialized(true)

        if (liffClient.isLoggedIn()) {
          setIsLoggedIn(true)
          const userProfile = await liffClient.getProfile()
          setProfile(userProfile)
        }
      } catch (err) {
        console.error('LIFF initialization error:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }

    initLiff()
  }, [])

  const login = async () => {
    try {
      await liffClient.login()
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err : new Error('Login failed'))
    }
  }

  const logout = () => {
    liffClient.logout()
    setIsLoggedIn(false)
    setProfile(null)
  }

  return (
    <LiffContext.Provider
      value={{
        isInitialized,
        isLoggedIn,
        profile,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </LiffContext.Provider>
  )
}

export function useLiff() {
  const context = useContext(LiffContext)
  if (context === undefined) {
    throw new Error('useLiff must be used within a LiffProvider')
  }
  return context
}
