import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import {
  RegistrationFlowController,
  useRegistrationFlow,
} from './registration-flow-controller'
import type { LiffProfile } from '@/types/liff'
import type { Member } from '@/types/database'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock hooks
jest.mock('@/hooks/use-liff', () => ({
  useLiff: jest.fn(),
}))

jest.mock('@/hooks/use-line-profile', () => ({
  useLineProfile: jest.fn(),
}))

jest.mock('@/lib/context/member-status-context', () => ({
  useMemberStatus: jest.fn(),
}))

// Mock UI components
jest.mock('./registration-welcome', () => ({
  RegistrationWelcome: ({ onContinue, showContinueButton, autoHideDelay, className }: {
    onContinue?: () => void
    showContinueButton?: boolean
    autoHideDelay?: number
    className?: string
  }) => (
    <div data-testid="registration-welcome" className={className}>
      <div data-testid="welcome-continue-button">{showContinueButton ? 'true' : 'false'}</div>
      <div data-testid="welcome-auto-hide">{autoHideDelay || 'undefined'}</div>
      <button onClick={onContinue} data-testid="welcome-continue-action">
        Continue
      </button>
    </div>
  ),
}))

jest.mock('@/components/ui/loading-spinner', () => ({
  LoadingSpinner: ({ text, size }: { text: string; size: string }) => (
    <div data-testid="loading-spinner">
      <div data-testid="spinner-size">{size}</div>
      <div data-testid="spinner-text">{text}</div>
    </div>
  ),
}))

jest.mock('@/components/ui/error-display', () => ({
  ErrorDisplay: ({ title, message, error, onRetry, className }: {
    title: string
    message: string
    error?: Error | { message: string } | null
    onRetry?: () => void
    className?: string
  }) => (
    <div data-testid="error-display" className={className}>
      <div data-testid="error-title">{title}</div>
      <div data-testid="error-message">{message}</div>
      <div data-testid="error-details">{error?.message || 'no-error'}</div>
      <button onClick={onRetry} data-testid="error-retry">
        Retry
      </button>
    </div>
  ),
}))

import { useLiff } from '@/hooks/use-liff'
import { useLineProfile } from '@/hooks/use-line-profile'
import { useMemberStatus } from '@/lib/context/member-status-context'

const mockUseLiff = useLiff as jest.MockedFunction<typeof useLiff>
const mockUseLineProfile = useLineProfile as jest.MockedFunction<typeof useLineProfile>
const mockUseMemberStatus = useMemberStatus as jest.MockedFunction<typeof useMemberStatus>

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
  contact_info: null,
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// Test component to verify children rendering
const TestChildren = () => (
  <div data-testid="test-children">App Content</div>
)

describe('RegistrationFlowController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Flow State: initializing', () => {
    it('should show loading spinner during LIFF initialization', () => {
      mockUseLiff.mockReturnValue({
        isReady: false,
        isLoggedIn: false,
        loading: true,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isRegistered: false,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.getByText('กำลังเริ่มต้นระบบ...')).toBeInTheDocument()
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument()
    })

    it('should show proper loading message during initialization', () => {
      mockUseLiff.mockReturnValue({
        isReady: false,
        isLoggedIn: false,
        loading: true,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isRegistered: false,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByText('กรุณารอสักครู่')).toBeInTheDocument()
    })
  })

  describe('Flow State: authenticating', () => {
    it('should show authentication loading when LIFF ready but not logged in', () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: false,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isRegistered: false,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.getByText('กำลังยืนยันตัวตน...')).toBeInTheDocument()
      expect(screen.getByText('กำลังเชื่อมต่อกับ LINE')).toBeInTheDocument()
    })
  })

  describe('Flow State: registering', () => {
    it('should show registration loading during auto-registration', () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: true,
        isRegistered: false,
        isNewUser: true,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.getByText('กำลังลงทะเบียน...')).toBeInTheDocument()
      expect(screen.getByText('กำลังสร้างบัญชีสมาชิกของคุณ')).toBeInTheDocument()
      expect(screen.getByText('กระบวนการนี้จะใช้เวลาเพียงไม่กี่วินาที')).toBeInTheDocument()
    })

    it('should show registration loading when member status is loading', () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: true,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.getByText('กำลังลงทะเบียน...')).toBeInTheDocument()
    })
  })

  describe('Flow State: success', () => {
    it('should show welcome screen for new users', () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: true,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: mockMember,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('registration-welcome')).toBeInTheDocument()
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument()
    })

    it('should pass correct props to RegistrationWelcome', () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: true,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: mockMember,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController
          autoHideWelcome={true}
          welcomeDelay={3000}
          className="custom-class"
        >
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('welcome-continue-button')).toHaveTextContent('true')
      expect(screen.getByTestId('welcome-auto-hide')).toHaveTextContent('3000')
      expect(screen.getByTestId('registration-welcome')).toHaveClass('custom-class')
    })

    it('should not auto-hide welcome when autoHideWelcome is false', () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: true,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: mockMember,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController autoHideWelcome={false}>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('welcome-auto-hide')).toHaveTextContent('undefined')
    })

    it('should call onComplete when welcome is completed', () => {
      const mockOnComplete = jest.fn()

      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: true,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: mockMember,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController onComplete={mockOnComplete}>
          <TestChildren />
        </RegistrationFlowController>
      )

      const continueButton = screen.getByTestId('welcome-continue-action')
      fireEvent.click(continueButton)

      expect(mockOnComplete).toHaveBeenCalledTimes(1)
    })
  })

  describe('Flow State: ready', () => {
    it('should render children when registration is complete', () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: mockMember,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('test-children')).toBeInTheDocument()
      expect(screen.getByText('App Content')).toBeInTheDocument()
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
      expect(screen.queryByTestId('registration-welcome')).not.toBeInTheDocument()
    })
  })

  describe('Flow State: error', () => {
    it('should show error display when LIFF error occurs', () => {
      const mockError = {
        name: 'LiffError',
        message: 'LIFF initialization failed',
        code: 'INIT_ERROR',
      }

      mockUseLiff.mockReturnValue({
        isReady: false,
        isLoggedIn: false,
        loading: false,
        error: mockError,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isRegistered: false,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('error-display')).toBeInTheDocument()
      expect(screen.getByTestId('error-title')).toHaveTextContent('เกิดข้อผิดพลาด')
      expect(screen.getByTestId('error-message')).toHaveTextContent('LIFF initialization failed')
    })

    it('should show error display when authentication error occurs', () => {
      const mockError = {
        message: 'Authentication failed',
      }

      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: false,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isRegistered: false,
        isNewUser: false,
        error: mockError,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('error-display')).toBeInTheDocument()
      expect(screen.getByTestId('error-message')).toHaveTextContent('Authentication failed')
    })

    it('should show error display when registration error occurs', () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: false,
        isNewUser: false,
        error: null,
        registrationError: 'Registration failed',
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('error-display')).toBeInTheDocument()
      expect(screen.getByTestId('error-message')).toHaveTextContent('Registration failed')
    })

    it('should show error display when member status error occurs', () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: 'Failed to fetch member data',
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('error-display')).toBeInTheDocument()
      expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to fetch member data')
    })

    it('should handle retry action', async () => {
      const mockClearError = jest.fn()
      const mockRefreshMember = jest.fn().mockResolvedValue(undefined)
      const mockAuthenticate = jest.fn().mockResolvedValue(mockProfile)

      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: false,
        error: null,
        registrationError: null,
        authenticate: mockAuthenticate,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: 'Failed to fetch member data',
        clearError: mockClearError,
        refreshMember: mockRefreshMember,
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      const retryButton = screen.getByTestId('error-retry')
      fireEvent.click(retryButton)

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled()
        expect(mockRefreshMember).toHaveBeenCalled()
      })
    })

    it('should show retry count after retries', async () => {
      const mockClearError = jest.fn()
      const mockRefreshMember = jest.fn().mockRejectedValue(new Error('Still failing'))

      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: false,
        error: null,
        registrationError: null,
        authenticate: jest.fn(),
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: 'Failed to fetch member data',
        clearError: mockClearError,
        refreshMember: mockRefreshMember,
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      const retryButton = screen.getByTestId('error-retry')
      
      // First retry
      fireEvent.click(retryButton)
      await waitFor(() => {
        expect(screen.getByText('ความพยายามครั้งที่ 1')).toBeInTheDocument()
      })

      // Second retry
      fireEvent.click(retryButton)
      await waitFor(() => {
        expect(screen.getByText('ความพยายามครั้งที่ 2')).toBeInTheDocument()
      })
    })
  })

  describe('State Transitions', () => {
    it('should transition from initializing to authenticating', async () => {
      let liffState = {
        isReady: false,
        isLoggedIn: false,
        loading: true,
        error: null,
      }

      mockUseLiff.mockImplementation(() => liffState as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isRegistered: false,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      const { rerender } = render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByText('กำลังเริ่มต้นระบบ...')).toBeInTheDocument()

      // Update state: LIFF ready but not logged in
      liffState = {
        isReady: true,
        isLoggedIn: false,
        loading: false,
        error: null,
      }

      rerender(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      await waitFor(() => {
        expect(screen.getByText('กำลังยืนยันตัวตน...')).toBeInTheDocument()
      })
    })

    it('should transition from authenticating to registering', async () => {
      let lineProfileState = {
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isRegistered: false,
        isNewUser: false,
        error: null,
        registrationError: null,
      }

      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockImplementation(() => lineProfileState as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      const { rerender } = render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      // Start registration
      lineProfileState = {
        isAuthenticated: true,
        isLoading: false,
        isRegistering: true,
        isRegistered: false,
        isNewUser: true,
        error: null,
        registrationError: null,
      }

      rerender(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      await waitFor(() => {
        expect(screen.getByText('กำลังลงทะเบียน...')).toBeInTheDocument()
      })
    })

    it('should transition from registering to success for new users', async () => {
      let lineProfileState = {
        isAuthenticated: true,
        isLoading: false,
        isRegistering: true,
        isRegistered: false,
        isNewUser: true,
        error: null,
        registrationError: null,
      }

      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockImplementation(() => lineProfileState as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      const { rerender } = render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByText('กำลังลงทะเบียน...')).toBeInTheDocument()

      // Registration complete
      lineProfileState = {
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: true,
        error: null,
        registrationError: null,
      }

      mockUseMemberStatus.mockReturnValue({
        member: mockMember,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      rerender(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      await waitFor(() => {
        expect(screen.getByTestId('registration-welcome')).toBeInTheDocument()
      })
    })

    it('should transition from success to ready after welcome complete', async () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: true,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: mockMember,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('registration-welcome')).toBeInTheDocument()

      const continueButton = screen.getByTestId('welcome-continue-action')
      fireEvent.click(continueButton)

      await waitFor(() => {
        expect(screen.getByTestId('test-children')).toBeInTheDocument()
        expect(screen.queryByTestId('registration-welcome')).not.toBeInTheDocument()
      })
    })

    it('should skip welcome and go directly to ready for existing users', () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: mockMember,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('test-children')).toBeInTheDocument()
      expect(screen.queryByTestId('registration-welcome')).not.toBeInTheDocument()
    })
  })

  describe('useRegistrationFlow Hook', () => {
    it('should provide complete registration flow state', () => {
      let flowState: ReturnType<typeof useRegistrationFlow> | null = null

      const TestComponent = () => {
        flowState = useRegistrationFlow()
        return <div data-testid="test">Test</div>
      }

      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: mockMember,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(<TestComponent />)

      expect(flowState).toMatchObject({
        isLiffReady: true,
        isLoggedIn: true,
        liffLoading: false,
        liffError: null,
        isAuthenticated: true,
        authLoading: false,
        authError: null,
        isRegistering: false,
        isRegistered: true,
        isNewUser: false,
        registrationError: null,
        member: mockMember,
        memberLoading: false,
        memberError: null,
        isReady: true,
        hasError: false,
      })
    })

    it('should indicate hasError when any error exists', () => {
      let flowState: ReturnType<typeof useRegistrationFlow> | null = null

      const TestComponent = () => {
        flowState = useRegistrationFlow()
        return <div data-testid="test">Test</div>
      }

      mockUseLiff.mockReturnValue({
        isReady: false,
        isLoggedIn: false,
        loading: false,
        error: { message: 'LIFF error' },
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isRegistered: false,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(<TestComponent />)

      expect(flowState.hasError).toBe(true)
    })

    it('should indicate not ready when member is null', () => {
      let flowState: ReturnType<typeof useRegistrationFlow> | null = null

      const TestComponent = () => {
        flowState = useRegistrationFlow()
        return <div data-testid="test">Test</div>
      }

      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(<TestComponent />)

      expect(flowState.isReady).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('should have no accessibility violations in loading state', async () => {
      mockUseLiff.mockReturnValue({
        isReady: false,
        isLoggedIn: false,
        loading: true,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isRegistered: false,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      const { container } = render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations in ready state', async () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: mockMember,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      const { container } = render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should properly render Thai language content', () => {
      mockUseLiff.mockReturnValue({
        isReady: false,
        isLoggedIn: false,
        loading: true,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isRegistered: false,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByText('กำลังเริ่มต้นระบบ...')).toBeInTheDocument()
      expect(screen.getByText('กรุณารอสักครู่')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid state changes', async () => {
      let callCount = 0
      const states = [
        { loading: true, isReady: false, isLoggedIn: false },
        { loading: false, isReady: true, isLoggedIn: false },
        { loading: false, isReady: true, isLoggedIn: true },
      ]

      mockUseLiff.mockImplementation(() => {
        const state = states[Math.min(callCount, states.length - 1)]
        callCount++
        return { ...state, error: null } as any
      })

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isRegistered: false,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      const { rerender } = render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      // Rapid re-renders
      for (let i = 0; i < 5; i++) {
        rerender(
          <RegistrationFlowController>
            <TestChildren />
          </RegistrationFlowController>
        )
      }

      // Should not crash
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('should handle missing error message gracefully', () => {
      mockUseLiff.mockReturnValue({
        isReady: false,
        isLoggedIn: false,
        loading: false,
        error: { name: 'Error', message: '', code: 'TEST' },
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isRegistered: false,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('error-message')).toHaveTextContent('เกิดข้อผิดพลาดในการเชื่อมต่อกับ LINE')
    })

    it('should handle null member during ready state', () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: false,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: null,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      // Should show loading/registering state since member is null
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })
  })

  describe('Custom Props', () => {
    it('should accept and apply custom className', () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: true,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: mockMember,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      const customClassName = 'custom-test-class'
      render(
        <RegistrationFlowController className={customClassName}>
          <TestChildren />
        </RegistrationFlowController>
      )

      expect(screen.getByTestId('registration-welcome')).toHaveClass(customClassName)
    })

    it('should use default welcomeDelay when not specified', () => {
      mockUseLiff.mockReturnValue({
        isReady: true,
        isLoggedIn: true,
        loading: false,
        error: null,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isRegistered: true,
        isNewUser: true,
        error: null,
        registrationError: null,
      } as any)

      mockUseMemberStatus.mockReturnValue({
        member: mockMember,
        loading: false,
        error: null,
        clearError: jest.fn(),
        refreshMember: jest.fn(),
      } as any)

      render(
        <RegistrationFlowController>
          <TestChildren />
        </RegistrationFlowController>
      )

      // Default delay is 5000ms
      expect(screen.getByTestId('welcome-auto-hide')).toHaveTextContent('5000')
    })
  })
})
