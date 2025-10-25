'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useMemo, useCallback } from 'react'
import { useLineProfile } from '@/hooks/use-line-profile'
import { supabaseOps } from '@/lib/supabase/operations'
import type { Member } from '@/types/database'

/**
 * Member Status State Interface
 * Manages global member state for the application
 */
interface MemberStatusState {
  member: Member | null
  isAuthenticated: boolean
  isFirstTimeUser: boolean
  lastCalculationDate: string | null
  error: string | null
  loading: boolean
}

/**
 * Member Status Context Type
 * Extends state with action methods for member management
 */
interface MemberStatusContextType extends MemberStatusState {
  updateMember: (updates: Partial<Member>) => Promise<void>
  refreshMember: () => Promise<void>
  clearError: () => void
  setFirstTimeUser: (date: string) => void
}

/**
 * Action types for the member status reducer
 */
type MemberStatusAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_MEMBER'; payload: Member | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FIRST_TIME_USER'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_STATE' }

/**
 * Member Status Provider Props
 */
interface MemberStatusProviderProps {
  children: ReactNode
}

/**
 * Context instance for member status management
 */
const MemberStatusContext = createContext<MemberStatusContextType | undefined>(undefined)

/**
 * Member Status Reducer
 * Handles state updates for member status using immutable patterns
 */
const memberStatusReducer = (state: MemberStatusState, action: MemberStatusAction): MemberStatusState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_MEMBER':
      return {
        ...state,
        member: action.payload,
        loading: false,
        error: null,
        isAuthenticated: !!action.payload,
        isFirstTimeUser: !action.payload?.registration_date
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
        member: null,
        isAuthenticated: false,
        isFirstTimeUser: false
      }

    case 'SET_FIRST_TIME_USER':
      return {
        ...state,
        lastCalculationDate: action.payload,
        isFirstTimeUser: false
      }

    case 'CLEAR_ERROR':
      return { ...state, error: null }

    case 'RESET_STATE':
      return {
        member: null,
        isAuthenticated: false,
        isFirstTimeUser: false,
        lastCalculationDate: null,
        error: null,
        loading: false
      }

    default:
      return state
  }
}

/**
 * Initial state for member status
 */
const initialState: MemberStatusState = {
  member: null,
  isAuthenticated: false,
  isFirstTimeUser: false,
  lastCalculationDate: null,
  error: null,
  loading: true
}

/**
 * Member Status Provider Component
 * Manages global member state and provides context to child components
 */
export const MemberStatusProvider: React.FC<MemberStatusProviderProps> = React.memo(({ children }) => {
  const [state, dispatch] = useReducer(memberStatusReducer, initialState)

  // Get LINE profile and registration status from existing hook
  const {
    isAuthenticated: isLineAuthenticated,
    profile,
    member: hookMember,
    isRegistered: isLineRegistered,
    registrationError
  } = useLineProfile()

  /**
   * Fetch member data from Supabase
   */
  const fetchMemberData = useCallback(async (lineUserId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const memberData = await supabaseOps.getMember(lineUserId)

      if (memberData) {
        dispatch({ type: 'SET_MEMBER', payload: memberData })
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Member data not found' })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch member data'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    }
  }, [])

  /**
   * Initialize member data when LINE authentication changes
   */
  useEffect(() => {
    if (isLineAuthenticated && profile?.userId) {
      // If we have member data from the hook, use it
      if (isLineRegistered && hookMember) {
        dispatch({ type: 'SET_MEMBER', payload: hookMember })
      } else {
        // Otherwise fetch from database
        fetchMemberData(profile.userId)
      }
    } else {
      // Reset state when not authenticated
      dispatch({ type: 'RESET_STATE' })
    }
  }, [isLineAuthenticated, profile, isLineRegistered, hookMember, fetchMemberData])

  /**
   * Handle registration errors from LINE profile hook
   */
  useEffect(() => {
    if (registrationError) {
      dispatch({ type: 'SET_ERROR', payload: registrationError })
    }
  }, [registrationError])

  /**
   * Update member data in database and state
   */
  const updateMember = useCallback(async (updates: Partial<Member>): Promise<void> => {
    if (!state.member?.line_user_id) {
      throw new Error('No member found to update')
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const updatedMember = await supabaseOps.updateMember(
        state.member.line_user_id,
        updates
      )

      dispatch({ type: 'SET_MEMBER', payload: updatedMember })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update member'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error
    }
  }, [state.member])

  /**
   * Refresh member data from database
   */
  const refreshMember = useCallback(async (): Promise<void> => {
    if (!profile?.userId) {
      throw new Error('No authenticated user found')
    }

    await fetchMemberData(profile.userId)
  }, [profile, fetchMemberData])

  /**
   * Clear current error state
   */
  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  /**
   * Mark user as having completed first calculation
   */
  const setFirstTimeUser = useCallback((date: string): void => {
    dispatch({ type: 'SET_FIRST_TIME_USER', payload: date })
  }, [])

  /**
   * Memoize context value to prevent unnecessary re-renders
   */
  const contextValue = useMemo<MemberStatusContextType>(() => ({
    ...state,
    updateMember,
    refreshMember,
    clearError,
    setFirstTimeUser
  }), [
    state,
    updateMember,
    refreshMember,
    clearError,
    setFirstTimeUser
  ])

  return (
    <MemberStatusContext.Provider value={contextValue}>
      {children}
    </MemberStatusContext.Provider>
  )
})

MemberStatusProvider.displayName = 'MemberStatusProvider'

/**
 * Hook to access member status context
 * @throws Error if used outside MemberStatusProvider
 */
export const useMemberStatus = (): MemberStatusContextType => {
  const context = useContext(MemberStatusContext)

  if (context === undefined) {
    throw new Error('useMemberStatus must be used within a MemberStatusProvider')
  }

  return context
}

/**
 * Hook to check if user is first-time user
 */
export const useIsFirstTime = (): boolean => {
  const { isFirstTimeUser } = useMemberStatus()
  return isFirstTimeUser
}

/**
 * Hook to check if user is registered member
 */
export const useIsRegistered = (): boolean => {
  const { isAuthenticated, member } = useMemberStatus()
  return isAuthenticated && !!member
}

/**
 * Hook to get member data
 */
export const useMemberData = (): Member | null => {
  const { member } = useMemberStatus()
  return member
}

/**
 * Hook to get member action methods
 */
export const useMemberActions = () => {
  const { updateMember, refreshMember, clearError, setFirstTimeUser } = useMemberStatus()

  return {
    updateMember,
    refreshMember,
    clearError,
    setFirstTimeUser
  }
}

/**
 * Hook to get member loading and error states
 */
export const useMemberStatusState = () => {
  const { loading, error, isAuthenticated, isFirstTimeUser } = useMemberStatus()

  return {
    loading,
    error,
    isAuthenticated,
    isFirstTimeUser
  }
}

/**
 * Hook to check if member is active
 */
export const useMemberIsActive = (): boolean => {
  const { member } = useMemberStatus()
  return member?.is_active ?? false
}

/**
 * Hook to get member display name
 */
export const useMemberDisplayName = (): string | null => {
  const { member } = useMemberStatus()
  return member?.display_name ?? null
}

/**
 * Hook to get member registration date
 */
export const useMemberRegistrationDate = (): string | null => {
  const { member } = useMemberStatus()
  return member?.registration_date ?? null
}

/**
 * Hook to get member contact info
 */
export const useMemberContactInfo = (): string | null => {
  const { member } = useMemberStatus()
  return member?.contact_info ?? null
}

export default MemberStatusProvider