'use client'

import liff from '@line/liff'

export interface LiffProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

export class LiffClient {
  private static instance: LiffClient
  private initialized = false
  private initializing = false

  private constructor() {}

  static getInstance(): LiffClient {
    if (!LiffClient.instance) {
      LiffClient.instance = new LiffClient()
    }
    return LiffClient.instance
  }

  async init(liffId: string): Promise<void> {
    if (this.initialized) return
    
    if (this.initializing) {
      // Wait for ongoing initialization
      while (this.initializing) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return
    }

    try {
      this.initializing = true
      await liff.init({ liffId })
      this.initialized = true
    } catch (error) {
      console.error('LIFF initialization failed:', error)
      throw error
    } finally {
      this.initializing = false
    }
  }

  isInitialized(): boolean {
    return this.initialized
  }

  isLoggedIn(): boolean {
    if (!this.initialized) return false
    return liff.isLoggedIn()
  }

  async login(): Promise<void> {
    if (!this.initialized) {
      throw new Error('LIFF is not initialized')
    }
    liff.login()
  }

  logout(): void {
    if (!this.initialized) return
    liff.logout()
  }

  async getProfile(): Promise<LiffProfile | null> {
    if (!this.initialized || !this.isLoggedIn()) {
      return null
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
      return null
    }
  }

  isInClient(): boolean {
    if (!this.initialized) return false
    return liff.isInClient()
  }

  openWindow(url: string, external = false): void {
    if (!this.initialized) return
    liff.openWindow({
      url,
      external,
    })
  }

  closeWindow(): void {
    if (!this.initialized) return
    liff.closeWindow()
  }
}

export const liffClient = LiffClient.getInstance()
