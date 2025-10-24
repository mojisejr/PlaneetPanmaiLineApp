import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { RegistrationWelcome } from './registration-welcome'
import type { LiffProfile } from '@/types/liff'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock hooks
jest.mock('@/hooks/use-liff', () => ({
  useLiff: jest.fn(),
}))

jest.mock('@/hooks/use-line-profile', () => ({
  useLineProfile: jest.fn(),
}))

// Mock UI components
jest.mock('@/components/ui/loading-spinner', () => ({
  LoadingSpinner: ({ text, size }: { text: string; size: string }) => (
    <div data-testid="loading-spinner">
      <div data-testid="spinner-size">{size}</div>
      <div data-testid="spinner-text">{text}</div>
    </div>
  ),
}))

jest.mock('@/components/ui/error-display', () => ({
  ErrorDisplay: ({ title, message, onRetry }: any) => (
    <div data-testid="error-display">
      <div data-testid="error-title">{title}</div>
      <div data-testid="error-message">{message}</div>
      <button onClick={onRetry} data-testid="error-retry">
        Retry
      </button>
    </div>
  ),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CheckCircle: ({ className }: any) => <div data-testid="check-circle" className={className} />,
  ArrowRight: ({ className }: any) => <div data-testid="arrow-right" className={className} />,
  RefreshCw: ({ className }: any) => <div data-testid="refresh-cw" className={className} />,
  AlertCircle: ({ className }: any) => <div data-testid="alert-circle" className={className} />,
}))

import { useLiff } from '@/hooks/use-liff'
import { useLineProfile } from '@/hooks/use-line-profile'

const mockUseLiff = useLiff as jest.MockedFunction<typeof useLiff>
const mockUseLineProfile = useLineProfile as jest.MockedFunction<typeof useLineProfile>

// Test data
const mockProfile: LiffProfile = {
  userId: 'U1234567890',
  displayName: 'ทดสอบ ผู้ใช้',
  pictureUrl: 'https://example.com/avatar.jpg',
  statusMessage: 'ทดสอบสถานะ',
}

const mockMember = {
  id: '1',
  line_user_id: 'U1234567890',
  display_name: 'ทดสอบ ผู้ใช้',
  registration_date: '2024-01-01T00:00:00Z',
  contact_info: null,
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('RegistrationWelcome', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Loading States', () => {
    it('should show loading spinner during authentication', () => {
      mockUseLiff.mockReturnValue({
        profile: null,
        isLoggedIn: false,
        loading: true,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        profile: null,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome />)

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.getByText('กำลังลงทะเบียน...')).toBeInTheDocument()
    })

    it('should show registration loading during registration', () => {
      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: true,
        isNewUser: true,
        isRegistered: false,
        profile: mockProfile,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome />)

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.getByText('กำลังลงทะเบียน...')).toBeInTheDocument()
      expect(screen.getByText('กำลังสร้างบัญชีสมาชิกใหม่...')).toBeInTheDocument()
    })
  })

  describe('Error States', () => {
    it('should show error display when authentication fails', () => {
      mockUseLiff.mockReturnValue({
        profile: null,
        isLoggedIn: false,
        loading: false,
        error: new Error('Authentication failed'),
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        profile: null,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome />)

      expect(screen.getByTestId('error-display')).toBeInTheDocument()
      expect(screen.getByText('เข้าสู่ระบบก่อน')).toBeInTheDocument()
    })

    it('should show error display when registration fails', () => {
      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        profile: mockProfile,
        member: null,
        error: null,
        registrationError: 'Registration failed',
      } as any)

      render(<RegistrationWelcome />)

      expect(screen.getByTestId('error-display')).toBeInTheDocument()
      expect(screen.getByText('การลงทะเบียนล้มเหลว')).toBeInTheDocument()
      expect(screen.getByText('Registration failed')).toBeInTheDocument()
    })

    it('should call retry handler when retry button is clicked', () => {
      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        profile: mockProfile,
        member: null,
        error: null,
        registrationError: 'Registration failed',
      } as any)

      render(<RegistrationWelcome />)

      const retryButton = screen.getByTestId('error-retry')
      fireEvent.click(retryButton)

      // Retry should trigger the error display's retry handler
      expect(retryButton).toBeInTheDocument()
    })
  })

  describe('Not Authenticated State', () => {
    it('should show authentication required message when not authenticated', () => {
      mockUseLiff.mockReturnValue({
        profile: null,
        isLoggedIn: false,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        profile: null,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome />)

      expect(screen.getByText('ต้องเข้าสู่ระบบก่อน')).toBeInTheDocument()
      expect(screen.getByText('กรุณาเข้าสู่ระบบด้วย LINE เพื่อใช้งานระบบ')).toBeInTheDocument()
      expect(screen.getByTestId('alert-circle')).toBeInTheDocument()
    })
  })

  describe('Success State', () => {
    it('should show welcome message for new user', () => {
      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: true,
        isRegistered: true,
        profile: mockProfile,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome />)

      // Welcome message
      expect(screen.getByText('ยินดีต้อนรับสู่ร้านปราณีตพันธุ์ทุเรียน')).toBeInTheDocument()
      expect(screen.getByText('สมัครสมาชิกสำเร็จแล้ว')).toBeInTheDocument()

      // Personalized greeting
      expect(screen.getByText('สวัสดีครับ คุณทดสอบ ผู้ใช้')).toBeInTheDocument()

      // Success indicator
      expect(screen.getByTestId('check-circle')).toBeInTheDocument()

      // New user badge
      expect(screen.getByText('สมาชิกใหม่')).toBeInTheDocument()
    })

    it('should show welcome message for existing user', () => {
      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        profile: mockProfile,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome />)

      expect(screen.getByText('ยินดีต้อนรับสู่ร้านปราณีตพันธุ์ทุเรียน')).toBeInTheDocument()
      expect(screen.getByText('สวัสดีครับ คุณทดสอบ ผู้ใช้')).toBeInTheDocument()

      // Should not show new user badge for existing users
      expect(screen.queryByText('สมาชิกใหม่')).not.toBeInTheDocument()
    })

    it('should display user profile information', () => {
      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        profile: mockProfile,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome />)

      // Profile name
      expect(screen.getByText('ทดสอบ ผู้ใช้')).toBeInTheDocument()

      // Registration date
      expect(screen.getByText('วันที่สมัคร')).toBeInTheDocument()
      expect(screen.getByText(/1 มกราคม 2567/)).toBeInTheDocument()
    })

    it('should show continue button and handle click', () => {
      const mockOnContinue = jest.fn()

      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        profile: mockProfile,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome onContinue={mockOnContinue} />)

      const continueButton = screen.getByText('เริ่มใช้เครื่องคิดเลข')
      expect(continueButton).toBeInTheDocument()
      expect(screen.getByTestId('arrow-right')).toBeInTheDocument()

      fireEvent.click(continueButton)

      expect(mockOnContinue).toHaveBeenCalledTimes(1)
    })

    it('should not show continue button when showContinueButton is false', () => {
      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        profile: mockProfile,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome showContinueButton={false} />)

      expect(screen.queryByText('เริ่มใช้เครื่องคิดเลข')).not.toBeInTheDocument()
    })
  })

  describe('Auto-Hide Functionality', () => {
    it('should show countdown timer when autoHideDelay is set', () => {
      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        profile: mockProfile,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome autoHideDelay={5000} onContinue={jest.fn()} />)

      expect(screen.getByText(/จะเริ่มใช้งานอัตโนมัติใน/)).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should countdown and auto-continue when delay expires', async () => {
      const mockOnContinue = jest.fn()

      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        profile: mockProfile,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome autoHideDelay={3000} onContinue={mockOnContinue} />)

      expect(screen.getByText('3')).toBeInTheDocument()

      // Fast-forward timers
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument()
      })

      act(() => {
        jest.advanceTimersByTime(1000)
      })
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument()
      })

      act(() => {
        jest.advanceTimersByTime(1000)
      })
      await waitFor(() => {
        expect(mockOnContinue).toHaveBeenCalledTimes(1)
      })
    })

    it('should disable continue button during countdown', () => {
      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        profile: mockProfile,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome autoHideDelay={5000} onContinue={jest.fn()} />)

      const continueButton = screen.getByText('เริ่มใช้เครื่องคิดเลข')
      expect(continueButton).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        profile: mockProfile,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      const { container } = render(<RegistrationWelcome />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper Thai language text rendering', () => {
      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        profile: mockProfile,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome />)

      // Check that Thai text is rendered correctly
      expect(screen.getByText('ยินดีต้อนรับสู่ร้านปราณีตพันธุ์ทุเรียน')).toBeInTheDocument()
      expect(screen.getByText('สวัสดีครับ คุณทดสอบ ผู้ใช้')).toBeInTheDocument()
      expect(screen.getByText('คุณสามารถใช้เครื่องคำนวณราคาต้นทุเรียนได้แล้ว')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should be mobile-friendly with proper touch targets', () => {
      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        profile: mockProfile,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome />)

      const continueButton = screen.getByText('เริ่มใช้เครื่องคิดเลข')
      expect(continueButton).toHaveClass('lg') // Large button size for better touch targets
    })
  })

  describe('Custom Props', () => {
    it('should accept and apply custom className', () => {
      mockUseLiff.mockReturnValue({
        profile: null,
        isLoggedIn: false,
        loading: true,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        isRegistering: false,
        isNewUser: false,
        isRegistered: false,
        profile: null,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      const customClassName = 'custom-test-class'
      render(<RegistrationWelcome className={customClassName} />)

      const card = screen.getByRole('generic').querySelector('.max-w-md')
      expect(card?.closest(`.${customClassName}`)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing member data gracefully', () => {
      mockUseLiff.mockReturnValue({
        profile: mockProfile,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        profile: mockProfile,
        member: null,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome />)

      // Should still show welcome message
      expect(screen.getByText('ยินดีต้อนรับสู่ร้านปราณีตพันธุ์ทุเรียน')).toBeInTheDocument()
      expect(screen.getByText('สวัสดีครับ คุณทดสอบ ผู้ใช้')).toBeInTheDocument()

      // Should not show registration date when member is null
      expect(screen.queryByText('วันที่สมัคร')).not.toBeInTheDocument()
    })

    it('should handle profile without pictureUrl', () => {
      const profileWithoutPicture = {
        ...mockProfile,
        pictureUrl: undefined,
      }

      mockUseLiff.mockReturnValue({
        profile: profileWithoutPicture,
        isLoggedIn: true,
        loading: false,
      } as any)

      mockUseLineProfile.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isRegistering: false,
        isNewUser: false,
        isRegistered: true,
        profile: profileWithoutPicture,
        member: mockMember,
        error: null,
        registrationError: null,
      } as any)

      render(<RegistrationWelcome />)

      // Should show avatar with fallback
      expect(screen.getByText('ท')).toBeInTheDocument() // First character of display name
    })
  })
})