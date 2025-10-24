import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { autoRegistrationService } from './auto-registration'
import { lineAuthService } from '@/lib/auth/line-auth'
import { liffFeatures } from '@/lib/liff/config'
import type { Member } from '@/types/database'
import type { LiffProfile } from '@/types/liff'

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
  })),
}

// Mock dependencies
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}))

// Mock liffFeatures to avoid unused import warning
vi.mock('@/lib/liff/config', () => ({
  liffFeatures: {
    enableDebugLogging: false,
    enableErrorTracking: true,
  },
}))

vi.mock('@/lib/auth/line-auth', () => ({
  lineAuthService: {
    loadFromCache: vi.fn(),
    authenticate: vi.fn(),
  },
}))

vi.mock('@/lib/liff/config', () => ({
  liffFeatures: {
    enableDebugLogging: false,
    enableErrorTracking: true,
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('AutoRegistrationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.removeItem.mockImplementation(() => {})

    // Reset Supabase mock
    mockSupabaseClient.from.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Test data shared across tests
const mockProfile: LiffProfile = {
  userId: 'test-user-id',
  displayName: 'Test User',
  pictureUrl: 'https://example.com/picture.jpg',
  statusMessage: 'Test status',
}

const mockMember: Member = {
  id: 'member-id',
  line_user_id: 'test-user-id',
  display_name: 'Test User',
  registration_date: '2024-01-01T00:00:00.000Z',
  contact_info: null,
  is_active: true,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

const mockSingleResponse = (data: unknown, error: unknown = null) => {
  const mockSingle = vi.fn().mockResolvedValue({ data, error })
  mockSupabaseClient.from.mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: mockSingle,
      }),
    }),
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: mockSingle,
      }),
    }),
  } as any)
  return mockSingle
}

describe('checkAndRegister', () => {
  it('should register new user successfully', async () => {
    // Mock dependencies
    vi.mocked(lineAuthService.loadFromCache).mockReturnValue(mockProfile)

    // Mock getMember returns null (user doesn't exist)
    mockSingleResponse(null, { code: 'PGRST116' })

    // Mock createMember returns new member
    const mockCreateMember = mockSingleResponse(mockMember)

    const result = await autoRegistrationService.checkAndRegister()

    expect(result).toEqual({
      isNewUser: true,
      isRegistered: true,
      member: mockMember,
      error: null,
      registrationTime: expect.any(Date),
    })

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('members')
    expect(mockCreateMember).toHaveBeenCalled()
  })

  it('should return existing user without registration', async () => {
    // Mock dependencies
    vi.mocked(lineAuthService.loadFromCache).mockReturnValue(mockProfile)

    // Mock getMember returns existing member
    mockSingleResponse(mockMember)

    const result = await autoRegistrationService.checkAndRegister()

    expect(result).toEqual({
      isNewUser: false,
      isRegistered: true,
      member: mockMember,
      error: null,
    })

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('members')
  })

  it('should use provided profile instead of getting from auth service', async () => {
    // Mock getMember returns null (user doesn't exist)
    mockSingleResponse(null, { code: 'PGRST116' })

    // Mock createMember returns new member
    const mockCreateMember = mockSingleResponse(mockMember)

    const result = await autoRegistrationService.checkAndRegister(mockProfile)

    expect(result).toEqual({
      isNewUser: true,
      isRegistered: true,
      member: mockMember,
      error: null,
      registrationTime: expect.any(Date),
    })

    expect(lineAuthService.loadFromCache).not.toHaveBeenCalled()
    expect(lineAuthService.authenticate).not.toHaveBeenCalled()
    expect(mockCreateMember).toHaveBeenCalled()
  })

  it('should handle authentication failure', async () => {
    // Mock dependencies
    vi.mocked(lineAuthService.loadFromCache).mockReturnValue(null)
    vi.mocked(lineAuthService.authenticate).mockResolvedValue(null)

    const result = await autoRegistrationService.checkAndRegister()

    expect(result).toEqual({
      isNewUser: false,
      isRegistered: false,
      member: null,
      error: 'ไม่พบข้อมูลโปรไฟล์ กรุณาเข้าสู่ระบบใหม่',
    })
  })

  it('should handle database errors', async () => {
    // Mock dependencies
    vi.mocked(lineAuthService.loadFromCache).mockReturnValue(mockProfile)

    // Mock database error
    mockSingleResponse(null, new Error('Database error'))

    const result = await autoRegistrationService.checkAndRegister()

    expect(result).toEqual({
      isNewUser: false,
      isRegistered: false,
      member: null,
      error: expect.any(String),
    })
  })

  it('should handle member creation failure', async () => {
    // Mock dependencies
    vi.mocked(lineAuthService.loadFromCache).mockReturnValue(mockProfile)

    // Mock getMember returns null (user doesn't exist)
    mockSingleResponse(null, { code: 'PGRST116' })

    // Mock createMember returns null (creation failed)
    mockSingleResponse(null, null)

    const result = await autoRegistrationService.checkAndRegister()

    expect(result).toEqual({
      isNewUser: false,
      isRegistered: false,
      member: null,
      error: 'การลงทะเบียนผู้ใช้ใหม่ล้มเหลว กรุณาลองใหม่',
    })
  })
})

  describe('isRegistrationComplete', () => {
    it('should return true for cached registration', () => {
      const cacheData = {
        isNewUser: false,
        isRegistered: true,
        member: { id: 'member-id' } as Member,
        timestamp: Date.now(),
        expiresAt: Date.now() + 1000000,
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(cacheData))

      const result = autoRegistrationService.isRegistrationComplete('test-user-id')

      expect(result).toBe(true)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('registration_status_test-user-id')
    })

    it('should return false for expired cache', () => {
      const cacheData = {
        isNewUser: false,
        isRegistered: true,
        member: { id: 'member-id' } as Member,
        timestamp: Date.now(),
        expiresAt: Date.now() - 1000, // Expired
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(cacheData))

      const result = autoRegistrationService.isRegistrationComplete('test-user-id')

      expect(result).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('registration_status_test-user-id')
    })

    it('should return false when no cache exists', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = autoRegistrationService.isRegistrationComplete('test-user-id')

      expect(result).toBe(false)
    })
  })

  describe('clearRegistrationCache', () => {
    it('should clear cache for specific user', () => {
      localStorageMock.getItem.mockReturnValue('{}')

      autoRegistrationService.clearRegistrationCache('test-user-id')

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('registration_status_test-user-id')
    })

    it('should clear all registration cache when no user ID provided', () => {
      // Mock localStorage with multiple keys
      const mockKeys = [
        'registration_status_user1',
        'registration_status_user2',
        'other_key',
        'some_other_data',
      ]

      Object.defineProperty(localStorageMock, 'length', { value: 4 })
      localStorageMock.key = vi.fn((_index: number) => mockKeys[_index])

      autoRegistrationService.clearRegistrationCache()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('registration_status_user1')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('registration_status_user2')
      expect(localStorageMock.removeItem).not.toHaveBeenCalledWith('other_key')
      expect(localStorageMock.removeItem).not.toHaveBeenCalledWith('some_other_data')
    })
  })

  describe('getCachedRegistrationStatus', () => {
    const mockCacheData = {
      isNewUser: true,
      isRegistered: true,
      member: {
        id: 'member-id',
        line_user_id: 'test-user-id',
        display_name: 'Test User',
        registration_date: '2024-01-01T00:00:00.000Z',
        contact_info: null,
        is_active: true,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      } as Member,
      timestamp: Date.now(),
      expiresAt: Date.now() + 1000000,
    }

    it('should return cached registration status', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCacheData))

      const result = autoRegistrationService.getCachedRegistrationStatus('test-user-id')

      expect(result).toEqual({
        isNewUser: true,
        isRegistered: true,
        member: mockCacheData.member,
        error: null,
        registrationTime: expect.any(Date),
      })
    })

    it('should return null for expired cache', () => {
      const expiredCacheData = {
        ...mockCacheData,
        expiresAt: Date.now() - 1000, // Expired
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(expiredCacheData))

      const result = autoRegistrationService.getCachedRegistrationStatus('test-user-id')

      expect(result).toBe(null)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('registration_status_test-user-id')
    })

    it('should return null when no cache exists', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = autoRegistrationService.getCachedRegistrationStatus('test-user-id')

      expect(result).toBe(null)
    })
  })

  describe('error handling', () => {
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })

      const result = autoRegistrationService.isRegistrationComplete('test-user-id')

      expect(result).toBe(false)
    })

    it('should provide Thai error messages', async () => {
      vi.mocked(lineAuthService.loadFromCache).mockReturnValue(null)
      vi.mocked(lineAuthService.authenticate).mockRejectedValue(new Error('Auth failed'))

      const result = await autoRegistrationService.checkAndRegister()

      expect(result.error).toEqual(expect.any(String))
      expect(result.error).toMatch(/[ก-๙]/) // Should contain Thai characters
    })
  })

  describe('caching behavior', () => {
    const mockProfile: LiffProfile = {
      userId: 'test-user-id',
      displayName: 'Test User',
    }

    const mockMember: Member = {
      id: 'member-id',
      line_user_id: 'test-user-id',
      display_name: 'Test User',
      registration_date: '2024-01-01T00:00:00.000Z',
      contact_info: null,
      is_active: true,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    }

    it('should cache registration status after successful registration', async () => {
      vi.mocked(lineAuthService.loadFromCache).mockReturnValue(mockProfile)

      // Mock getMember returns null (user doesn't exist)
      mockSingleResponse(null, { code: 'PGRST116' })

      // Mock createMember returns new member
      mockSingleResponse(mockMember)

      await autoRegistrationService.checkAndRegister()

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'registration_status_test-user-id',
        expect.any(String)
      )

      const cachedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1])
      expect(cachedData.isNewUser).toBe(true)
      expect(cachedData.isRegistered).toBe(true)
      expect(cachedData.member).toEqual(mockMember)
    })

    it('should use cached status on subsequent calls', async () => {
      const cacheData = {
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        timestamp: Date.now(),
        expiresAt: Date.now() + 1000000,
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(cacheData))

      const result = await autoRegistrationService.checkAndRegister()

      expect(result).toEqual({
        isNewUser: false,
        isRegistered: true,
        member: mockMember,
        error: null,
      })

      // Should not call database operations
      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
    })
  })

  describe('integration with lineAuthService', () => {
    const mockProfile: LiffProfile = {
      userId: 'test-user-id',
      displayName: 'Test User',
    }

    it('should use cached profile from lineAuthService', async () => {
      vi.mocked(lineAuthService.loadFromCache).mockReturnValue(mockProfile)

      // Mock getMember returns existing member
      mockSingleResponse(mockMember)

      const result = await autoRegistrationService.checkAndRegister()

      expect(result.isRegistered).toBe(true)
      expect(lineAuthService.loadFromCache).toHaveBeenCalled()
      expect(lineAuthService.authenticate).not.toHaveBeenCalled()
    })

    it('should authenticate if no cached profile', async () => {
      vi.mocked(lineAuthService.loadFromCache).mockReturnValue(null)
      vi.mocked(lineAuthService.authenticate).mockResolvedValue(mockProfile)

      // Mock getMember returns existing member
      mockSingleResponse(mockMember)

      const result = await autoRegistrationService.checkAndRegister()

      expect(result.isRegistered).toBe(true)
      expect(lineAuthService.loadFromCache).toHaveBeenCalled()
      expect(lineAuthService.authenticate).toHaveBeenCalled()
    })
  })
})