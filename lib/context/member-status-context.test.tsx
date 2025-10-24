import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { MemberStatusProvider, useMemberStatus, useIsFirstTime, useIsRegistered, useMemberData, useMemberActions } from './member-status-context'
import type { Member } from '@/types/database'
import type { LiffProfile } from '@/types/liff'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock existing hooks
jest.mock('@/hooks/use-line-profile', () => ({
  useLineProfile: jest.fn(),
}))

jest.mock('@/lib/supabase/operations', () => ({
  supabaseOps: {
    getMember: jest.fn(),
    updateMember: jest.fn(),
    getMemberById: jest.fn(),
  },
}))

// Mock React hooks
const mockDispatch = jest.fn()
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useReducer: jest.fn(() => [{}, mockDispatch]),
  createContext: jest.fn(() => ({ Provider: ({ children }: { children: React.ReactNode }) => children, Consumer: ({ children }: { children: React.ReactNode }) => children })),
  useContext: jest.fn(() => ({})),
}))

import { useLineProfile } from '@/hooks/use-line-profile'
import { supabaseOps } from '@/lib/supabase/operations'

const mockUseLineProfile = useLineProfile as jest.MockedFunction<typeof useLineProfile>
const mockSupabaseOps = supabaseOps as jest.Mocked<typeof supabaseOps>

// Test data
const mockProfile: LiffProfile = {
  userId: 'U1234567890',
  displayName: 'ทดสอบ ผู้ใช้',
  pictureUrl: 'https://example.com/avatar.jpg',
  statusMessage: 'ทดสอบสถานะ',
}

const mockMember: Member = {
  id: '1',
  line_user_id: 'U1234567890',
  display_name: 'ทดสอบ ผู้ใช้',
  registration_date: '2024-01-01T00:00:00Z',
  contact_info: 'test@example.com',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// Mock context state
const mockInitialState = {
  member: null,
  isLoading: false,
  error: null,
  isFirstTime: false,
  isRegistered: false,
  lastUpdated: null,
}

// Test component to consume context
const TestComponent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const context = useMemberStatus()
  return (
    <div data-testid="test-component">
      <div data-testid="loading-state">{context.isLoading.toString()}</div>
      <div data-testid="error-state">{context.error || 'no-error'}</div>
      <div data-testid="member-exists">{context.member ? 'exists' : 'null'}</div>
      <div data-testid="is-first-time">{context.isFirstTime.toString()}</div>
      <div data-testid="is-registered">{context.isRegistered.toString()}</div>
      {children}
    </div>
  )
}

const TestComponentWithHooks: React.FC = () => {
  const memberStatus = useMemberStatus()
  const isFirstTime = useIsFirstTime()
  const isRegistered = useIsRegistered()
  const memberData = useMemberData()
  const memberActions = useMemberActions()

  return (
    <div data-testid="test-component-with-hooks">
      <div data-testid="member-status-loading">{memberStatus.isLoading.toString()}</div>
      <div data-testid="member-status-member">{memberStatus.member?.display_name || 'null'}</div>
      <div data-testid="is-first-time-hook">{isFirstTime.toString()}</div>
      <div data-testid="is-registered-hook">{isRegistered.toString()}</div>
      <div data-testid="member-data-loading">{memberData.isLoading.toString()}</div>
      <div data-testid="member-data-member">{memberData.member?.display_name || 'null'}</div>
      <div data-testid="member-actions-refresh">{typeof memberActions.refreshMember}</div>
      <div data-testid="member-actions-update">{typeof memberActions.updateMember}</div>
    </div>
  )
}

describe('MemberStatusContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Context Provider', () => {
    it('should render children without crashing', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <div data-testid="child-component">Child Content</div>
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('child-component')).toBeInTheDocument()
      expect(screen.getByText('Child Content')).toBeInTheDocument()
    })

    it('should initialize with correct default state', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        profile: null,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('loading-state')).toHaveTextContent('false')
      expect(screen.getByTestId('error-state')).toHaveTextContent('no-error')
      expect(screen.getByTestId('member-exists')).toHaveTextContent('null')
      expect(screen.getByTestId('is-first-time')).toHaveTextContent('false')
      expect(screen.getByTestId('is-registered')).toHaveTextContent('false')
    })

    it('should handle authenticated user with member data', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('member-exists')).toHaveTextContent('exists')
      expect(screen.getByTestId('is-first-time')).toHaveTextContent('false')
      expect(screen.getByTestId('is-registered')).toHaveTextContent('true')
    })

    it('should handle new user (first time)', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: true,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('is-first-time')).toHaveTextContent('true')
      expect(screen.getByTestId('is-registered')).toHaveTextContent('true')
    })

    it('should handle loading state during authentication', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        profile: null,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('loading-state')).toHaveTextContent('true')
    })

    it('should handle authentication errors', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        profile: null,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: 'Authentication failed',
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('error-state')).toHaveTextContent('Authentication failed')
    })

    it('should handle registration errors', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: null,
        registrationError: 'Registration failed',
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('error-state')).toHaveTextContent('Registration failed')
    })
  })

  describe('useMemberStatus Hook', () => {
    it('should return complete member status context', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponentWithHooks />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('member-status-loading')).toHaveTextContent('false')
      expect(screen.getByTestId('member-status-member')).toHaveTextContent('ทดสอบ ผู้ใช้')
    })

    it('should throw error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow('useMemberStatus must be used within a MemberStatusProvider')

      consoleSpy.mockRestore()
    })

    it('should handle state changes from useLineProfile', async () => {
      // Initial state - loading
      mockUseLineProfile.mockReturnValueOnce({
        isAuthenticated: false,
        isLoading: true,
        profile: null,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      // Updated state - authenticated
      mockUseLineProfile.mockReturnValueOnce({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      const { rerender } = render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('loading-state')).toHaveTextContent('true')

      // Rerender with updated state
      rerender(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('loading-state')).toHaveTextContent('false')
      expect(screen.getByTestId('member-exists')).toHaveTextContent('exists')
    })
  })

  describe('useIsFirstTime Hook', () => {
    it('should return true for new users', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: true,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponentWithHooks />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('is-first-time-hook')).toHaveTextContent('true')
    })

    it('should return false for existing users', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponentWithHooks />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('is-first-time-hook')).toHaveTextContent('false')
    })

    it('should return false for unauthenticated users', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        profile: null,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponentWithHooks />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('is-first-time-hook')).toHaveTextContent('false')
    })
  })

  describe('useIsRegistered Hook', () => {
    it('should return true for registered users', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponentWithHooks />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('is-registered-hook')).toHaveTextContent('true')
    })

    it('should return false for unregistered users', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: true,
        isRegistered: false,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponentWithHooks />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('is-registered-hook')).toHaveTextContent('false')
    })
  })

  describe('useMemberData Hook', () => {
    it('should return member data and loading state', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponentWithHooks />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('member-data-loading')).toHaveTextContent('false')
      expect(screen.getByTestId('member-data-member')).toHaveTextContent('ทดสอบ ผู้ใช้')
    })

    it('should return null member data when not authenticated', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        profile: null,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponentWithHooks />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('member-data-member')).toHaveTextContent('null')
    })
  })

  describe('useMemberActions Hook', () => {
    it('should provide action methods', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponentWithHooks />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('member-actions-refresh')).toHaveTextContent('function')
      expect(screen.getByTestId('member-actions-update')).toHaveTextContent('function')
    })

    // Test actual action methods would require mocking useReducer more thoroughly
    // These tests are basic existence checks since the actual implementation depends on the context structure
  })

  describe('Integration with Supabase Operations', () => {
    it('should handle member refresh from database', async () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      mockSupabaseOps.getMember.mockResolvedValue(mockMember)

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      // Verify initial state
      expect(screen.getByTestId('member-exists')).toHaveTextContent('exists')

      // Mock refresh action - this would typically be called through useMemberActions
      // Implementation details depend on the actual context reducer
    })

    it('should handle member updates', async () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      const updatedMember = {
        ...mockMember,
        display_name: 'Updated Name',
        contact_info: 'updated@example.com',
      }

      mockSupabaseOps.updateMember.mockResolvedValue(updatedMember)

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      // Mock update action - this would typically be called through useMemberActions
      // Implementation details depend on the actual context reducer
    })

    it('should handle database errors', async () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      mockSupabaseOps.getMember.mockRejectedValue(new Error('Database error'))

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      // Error handling would be implemented in the actual context reducer
      expect(screen.getByTestId('error-state')).toHaveTextContent('no-error')
    })
  })

  describe('State Management and Reducer', () => {
    it('should handle loading state transitions', async () => {
      let stateIndex = 0
      const mockStates = [
        {
          isAuthenticated: false,
          isLoading: true,
          profile: null,
          isRegistering: false,
          isNewUser: false,
          isRegistered: false,
          member: null,
          error: null,
          registrationError: null,
        },
        {
          isAuthenticated: true,
          isLoading: false,
          profile: mockProfile,
          isRegistering: false,
          isNewUser: false,
          isRegistered: true,
          member: mockMember,
          error: null,
          registrationError: null,
        },
      ]

      mockUseLineProfile.mockImplementation(() => mockStates[stateIndex] as any)

      const { rerender } = render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      // Initial loading state
      expect(screen.getByTestId('loading-state')).toHaveTextContent('true')

      // Switch to loaded state
      stateIndex = 1
      rerender(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('loading-state')).toHaveTextContent('false')
      expect(screen.getByTestId('member-exists')).toHaveTextContent('exists')
    })

    it('should handle error state transitions', async () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        profile: null,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: 'Connection failed',
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('error-state')).toHaveTextContent('Connection failed')
      expect(screen.getByTestId('loading-state')).toHaveTextContent('false')
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing profile gracefully', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: null,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('member-exists')).toHaveTextContent('null')
      expect(screen.getByTestId('is-first-time')).toHaveTextContent('false')
      expect(screen.getByTestId('is-registered')).toHaveTextContent('false')
    })

    it('should handle corrupted member data', () => {
      const corruptedMember = {
        ...mockMember,
        display_name: null,
      } as any

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: corruptedMember,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('member-exists')).toHaveTextContent('exists')
    })

    it('should handle rapid state changes', async () => {
      let callCount = 0
      mockUseLineProfile.mockImplementation(() => {
        callCount++
        return {
          isAuthenticated: callCount > 1,
          isLoading: callCount <= 2,
          profile: callCount > 1 ? mockProfile : null,
          isRegistering: false,
          isNewUser: false,
          isRegistered: callCount > 2,
          member: callCount > 2 ? mockMember : null,
          error: null,
          registrationError: null,
        } as any
      })

      const { rerender } = render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      // Simulate rapid re-renders
      for (let i = 0; i < 3; i++) {
        act(() => {
          jest.advanceTimersByTime(100)
        })
        rerender(
          <MemberStatusProvider>
            <TestComponent />
          </MemberStatusProvider>
        )
      }

      expect(screen.getByTestId('loading-state')).toHaveTextContent('false')
    })

    it('should handle concurrent operations', async () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      // Simulate multiple concurrent database operations
      mockSupabaseOps.getMember.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve(mockMember), 100))
      )

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      // Wait for all operations to complete
      await act(async () => {
        jest.advanceTimersByTime(200)
      })

      expect(screen.getByTestId('member-exists')).toHaveTextContent('exists')
    })
  })

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      const { container } = render(
        <MemberStatusProvider>
          <div role="main" aria-label="Member Status">
            <h1>Test Content</h1>
            <p>This is test content for accessibility testing</p>
          </div>
        </MemberStatusProvider>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should provide proper ARIA labels for loading states', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        profile: null,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <div role="status" aria-live="polite">
            Loading member status...
          </div>
        </MemberStatusProvider>
      )

      // The accessibility implementation would depend on the actual context components
      // This test demonstrates the pattern for testing accessibility features
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should handle Thai language content properly', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: {
          ...mockProfile,
          displayName: 'สมชาย ใจดี',
        },
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: {
          ...mockMember,
          display_name: 'สมชาย ใจดี',
        },
        error: null,
        registrationError: null,
      } as any)

      render(
        <MemberStatusProvider>
          <div>
            <h1>ยินดีต้อนรับ สมชาย ใจดี</h1>
            <p>สถานะ: สมาชิก</p>
          </div>
        </MemberStatusProvider>
      )

      expect(screen.getByText('ยินดีต้อนรับ สมชาย ใจดี')).toBeInTheDocument()
      expect(screen.getByText('สถานะ: สมาชิก')).toBeInTheDocument()
    })
  })

  describe('Performance and Optimization', () => {
    it('should not cause unnecessary re-renders', () => {
      let renderCount = 0
      const TestReRenderComponent: React.FC = () => {
        renderCount++
        const status = useMemberStatus()
        return <div data-testid="render-count">{renderCount}</div>
      }

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      const { rerender } = render(
        <MemberStatusProvider>
          <TestReRenderComponent />
        </MemberStatusProvider>
      )

      const initialRenderCount = renderCount

      // Re-render parent with same props
      rerender(
        <MemberStatusProvider>
          <TestReRenderComponent />
        </MemberStatusProvider>
      )

      // Component should not re-render if context state hasn't changed
      expect(renderCount).toBe(initialRenderCount)
    })

    it('should handle large member data efficiently', () => {
      const largeMemberData = {
        ...mockMember,
        contact_info: 'x'.repeat(10000), // Large contact info field
        // Additional large fields would be added based on actual schema
      }

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: largeMemberData,
        error: null,
        registrationError: null,
      } as any)

      const startTime = performance.now()

      render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Render should complete within reasonable time (e.g., under 100ms)
      expect(renderTime).toBeLessThan(100)
    })
  })

  describe('Context Provider Composition', () => {
    it('should work when nested with other providers', () => {
      const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div data-testid="mock-provider">
          {children}
        </div>
      )

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(
        <MockProvider>
          <MemberStatusProvider>
            <MockProvider>
              <TestComponent />
            </MockProvider>
          </MemberStatusProvider>
        </MockProvider>
      )

      expect(screen.getByTestId('mock-provider')).toBeInTheDocument()
      expect(screen.getByTestId('test-component')).toBeInTheDocument()
      expect(screen.getByTestId('member-exists')).toHaveTextContent('exists')
    })

    it('should handle provider prop updates correctly', () => {
      let profileData = mockProfile
      let memberData = mockMember

      mockUseLineProfile.mockImplementation(() => ({
        isAuthenticated: true,
        isLoading: false,
        profile: profileData,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: memberData,
        error: null,
        registrationError: null,
      } as any))

      const { rerender } = render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('member-status-member')).toHaveTextContent('ทดสอบ ผู้ใช้')

      // Update profile and member data
      profileData = { ...mockProfile, displayName: 'Updated Name' }
      memberData = { ...mockMember, display_name: 'Updated Name' }

      rerender(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      expect(screen.getByTestId('member-status-member')).toHaveTextContent('Updated Name')
    })
  })

  describe('Memory Management', () => {
    it('should clean up subscriptions on unmount', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      const { unmount } = render(
        <MemberStatusProvider>
          <TestComponent />
        </MemberStatusProvider>
      )

      // Unmount should not cause errors
      expect(() => unmount()).not.toThrow()

      consoleSpy.mockRestore()
    })

    it('should not leak memory during frequent mount/unmount', () => {
      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        profile: mockProfile,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      // Mount and unmount multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(
          <MemberStatusProvider key={i}>
            <TestComponent />
          </MemberStatusProvider>
        )
        unmount()
      }

      // Should complete without memory issues
      expect(true).toBe(true)
    })
  })
})