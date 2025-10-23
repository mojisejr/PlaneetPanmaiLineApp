'use client'

import liff from '@line/liff'

export interface LiffProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

export interface LiffContext {
  type: 'utou' | 'room' | 'group' | 'none' | 'external' | 'square_chat'
  viewType?: 'compact' | 'tall' | 'full' | 'frame' | 'full-flex'
  userId?: string
  utouId?: string
  roomId?: string
  groupId?: string
}

class LiffClient {
  private initialized = false

  async init(): Promise<void> {
    if (this.initialized) return

    const liffId = process.env.NEXT_PUBLIC_LIFF_ID
    if (!liffId) {
      throw new Error('LIFF ID is not configured. Please set NEXT_PUBLIC_LIFF_ID environment variable.')
    }

    try {
      await liff.init({ liffId })
      this.initialized = true
    } catch (error) {
      console.error('LIFF initialization failed:', error)
      throw error
    }
  }

  isInitialized(): boolean {
    return this.initialized
  }

  isLoggedIn(): boolean {
    return liff.isLoggedIn()
  }

  async login(): Promise<void> {
    if (!this.initialized) {
      throw new Error('LIFF is not initialized. Call init() first.')
    }
    liff.login()
  }

  logout(): void {
    liff.logout()
  }

  async getProfile(): Promise<LiffProfile> {
    if (!this.isLoggedIn()) {
      throw new Error('User is not logged in')
    }

    try {
      const profile = await liff.getProfile()
      return {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      }
    } catch (error) {
      console.error('Failed to get profile:', error)
      throw error
    }
  }

  getAccessToken(): string | null {
    return liff.getAccessToken()
  }

  getContext(): LiffContext | null {
    if (!this.initialized) return null

    const context = liff.getContext()
    if (!context) return null

    return {
      type: context.type,
      viewType: context.viewType,
      userId: context.userId,
      utouId: context.utouId,
      roomId: context.roomId,
      groupId: context.groupId,
    }
  }

  isInClient(): boolean {
    return liff.isInClient()
  }

  getOS(): 'ios' | 'android' | 'web' | undefined {
    return liff.getOS()
  }

  closeWindow(): void {
    liff.closeWindow()
  }

  openWindow(url: string, external = false): void {
    liff.openWindow({
      url,
      external,
    })
  }

  async sendMessages(messages: any[]): Promise<void> {
    if (!liff.isInClient()) {
      throw new Error('sendMessages can only be used in LINE client')
    }

    try {
      await liff.sendMessages(messages)
    } catch (error) {
      console.error('Failed to send messages:', error)
      throw error
    }
  }
}

export const liffClient = new LiffClient()
export default liffClient
