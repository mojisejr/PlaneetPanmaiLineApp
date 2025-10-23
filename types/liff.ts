import type { Liff } from '@line/liff'

// LIFF Configuration Types
export interface LiffConfig {
  liffId: string
  mock?: boolean
}

// LIFF User Profile
export interface LiffProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

// LIFF Context Types
export interface LiffContext {
  type: 'utou' | 'room' | 'group' | 'none' | 'square_chat' | 'external'
  viewType: 'compact' | 'tall' | 'full'
  userId?: string
  utouId?: string
  roomId?: string
  groupId?: string
  squareChatId?: string
}

// LIFF OS Type
export type LiffOS = 'ios' | 'android' | 'web'

// LIFF State
export interface LiffState {
  isReady: boolean
  isLoggedIn: boolean
  isInClient: boolean
  profile: LiffProfile | null
  context: LiffContext | null
  os: LiffOS | null
  language: string | null
  version: string | null
  lineVersion: string | null
  isApiAvailable: (apiName: string) => boolean
}

// LIFF Error Types
export class LiffError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'LiffError'
  }
}

// LIFF Initialization Result
export interface LiffInitResult {
  success: boolean
  error?: LiffError
  liff?: Liff
}

// LIFF Actions
export interface LiffActions {
  login: () => Promise<void>
  logout: () => void
  closeWindow: () => void
  openWindow: (url: string, external?: boolean) => void
  sendMessages: (messages: any[]) => Promise<void>
  shareTargetPicker: (messages: any[]) => Promise<void>
  scanCode: () => Promise<{ value: string } | null>
  getProfile: () => Promise<LiffProfile>
  getFriendship: () => Promise<{ friendFlag: boolean }>
}

// LIFF Hook Return Type
export interface UseLiffReturn extends LiffState, LiffActions {
  liff: Liff | null
  error: LiffError | null
  loading: boolean
}

// Export Liff type from the SDK
export type { Liff }
