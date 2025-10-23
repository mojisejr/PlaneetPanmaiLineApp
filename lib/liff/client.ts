'use client'

import liff from '@line/liff'
import type { LineUserProfile, LiffState } from '@/types/liff'

class LiffClient {
  private state: LiffState = {
    isInitialized: false,
    isLoggedIn: false,
    error: null
  }

  async initialize(): Promise<void> {
    if (this.state.isInitialized) {
      return
    }

    try {
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID
      if (!liffId) {
        throw new Error('LIFF ID is not configured')
      }

      await liff.init({ liffId })
      this.state.isInitialized = true
      this.state.isLoggedIn = liff.isLoggedIn()
      this.state.error = null
    } catch (error) {
      const err = error instanceof Error ? error : new Error('LIFF initialization failed')
      this.state.error = err
      throw err
    }
  }

  async login(): Promise<void> {
    if (!this.state.isInitialized) {
      await this.initialize()
    }

    try {
      if (!liff.isLoggedIn()) {
        liff.login()
      }
      this.state.isLoggedIn = true
    } catch (error) {
      const err = error instanceof Error ? error : new Error('LIFF login failed')
      this.state.error = err
      throw err
    }
  }

  async logout(): Promise<void> {
    try {
      if (liff.isLoggedIn()) {
        liff.logout()
      }
      this.state.isLoggedIn = false
    } catch (error) {
      console.error('LIFF logout error:', error)
    }
  }

  async getProfile(): Promise<LineUserProfile> {
    if (!this.state.isInitialized) {
      await this.initialize()
    }

    if (!liff.isLoggedIn()) {
      await this.login()
    }

    try {
      const profile = await liff.getProfile()
      return {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get profile')
      this.state.error = err
      throw err
    }
  }

  getAccessToken(): string | null {
    if (!this.state.isInitialized || !liff.isLoggedIn()) {
      return null
    }

    return liff.getAccessToken()
  }

  getState(): LiffState {
    return { ...this.state }
  }

  isInClient(): boolean {
    return typeof window !== 'undefined' && liff.isInClient()
  }
}

export const liffClient = new LiffClient()
