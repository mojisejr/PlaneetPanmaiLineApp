// LINE LIFF Type Definitions
export interface LineUserProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

export interface LiffState {
  isInitialized: boolean
  isLoggedIn: boolean
  error: Error | null
}

export interface LiffContext {
  type: 'utou' | 'room' | 'group' | 'square' | 'external' | 'none'
  viewType: 'compact' | 'tall' | 'full'
  userId?: string
  utouId?: string
  roomId?: string
  groupId?: string
  d?: string
}
