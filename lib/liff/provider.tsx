import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { liffClient, LiffProfile } from './client'
import { autoRegistrationService } from '@/lib/services'

interface LiffContextType {
  isInitialized: boolean
  isLoggedIn: boolean
  profile: LiffProfile | null
  login: () => Promise<void>
  logout: () => void
}

const LiffContext = createContext<LiffContextType | undefined>(undefined)

export function LiffProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profile, setProfile] = useState<LiffProfile | null>(null)

  useEffect(() => {
    let mounted = true

    async function initLiff() {
      try {
        await liffClient.init()
        if (!mounted) return
        setIsInitialized(true)

        if (liffClient.isLoggedIn()) {
          setIsLoggedIn(true)
          const userProfile = await liffClient.getProfile()
          setProfile(userProfile)

          // Auto-register user on first LIFF access (best-effort)
          try {
            const registrationResult = await autoRegistrationService.checkAndRegister(userProfile)
            if (registrationResult.success && registrationResult.isNewUser) {
              console.log('New user registered:', userProfile.userId)
            } else if (!registrationResult.success) {
              console.warn('Auto-registration failed:', registrationResult.error)
            }
          } catch (err) {
            console.warn('Auto-registration error:', err)
          }
        }
      } catch (err) {
        console.error('LIFF initialization error:', err)
      }
    }

    initLiff()

    return () => {
      mounted = false
    }
  }, [])

  const login = async () => {
    try {
      await liffClient.login()
      if (!liffClient.isLoggedIn()) return
      setIsLoggedIn(true)
      const userProfile = await liffClient.getProfile()
      setProfile(userProfile)

      // Auto-register after successful login
      try {
        const registrationResult = await autoRegistrationService.checkAndRegister(userProfile)
        if (registrationResult.success && registrationResult.isNewUser) {
          console.log('New user registered:', userProfile.userId)
        } else if (!registrationResult.success) {
          console.warn('Auto-registration failed:', registrationResult.error)
        }
      } catch (err) {
        console.warn('Auto-registration error:', err)
      }
    } catch (err) {
      console.error('LIFF login error:', err)
    }
  }

  const logout = () => {
    // Capture userId before clearing profile state to avoid race conditions
    const userId = profile?.userId

    try {
      liffClient.logout()
    } catch (err) {
      console.warn('LIFF logout error:', err)
    }

    setIsLoggedIn(false)
    setProfile(null)

    // Clear registration cache on logout (best-effort)
    if (userId) {
      try {
        autoRegistrationService.clearCache(userId)
      } catch (err) {
        console.warn('Error clearing registration cache for user', userId, err)
      }
    }
  }

  return (
    <LiffContext.Provider value={{ isInitialized, isLoggedIn, profile, login, logout }}>
      {children}
    </LiffContext.Provider>
  )
}

export function useLiff() {
  const ctx = useContext(LiffContext)
  if (!ctx) throw new Error('useLiff must be used within LiffProvider')
  return ctx
}