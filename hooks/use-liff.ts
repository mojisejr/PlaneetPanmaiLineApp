'use client';

import { useState, useEffect, useCallback } from 'react';
import { liffClient } from '@/lib/liff/client';
import type { LiffState, LiffProfile } from '@/types/liff';
import { liffLogger } from '@/lib/liff/config';

/**
 * React Hook for LIFF State Management
 * Provides LIFF state and operations to React components
 * 
 * @returns LiffState and methods to interact with LIFF
 */
export function useLiff() {
  const [state, setState] = useState<LiffState>({
    isInitialized: false,
    isLoading: true,
    isLoggedIn: false,
    error: null,
    profile: null,
  });

  /**
   * Initialize LIFF on mount
   */
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Initialize LIFF
        await liffClient.initialize();

        // Check login status
        const isLoggedIn = liffClient.isLoggedIn();

        // Fetch profile if logged in
        let profile: LiffProfile | null = null;
        if (isLoggedIn) {
          try {
            profile = await liffClient.getProfile();
          } catch (error) {
            liffLogger.warn('Failed to fetch profile:', error);
          }
        }

        setState({
          isInitialized: true,
          isLoading: false,
          isLoggedIn,
          error: null,
          profile,
        });
      } catch (error) {
        liffLogger.error('Failed to initialize LIFF:', error);
        setState({
          isInitialized: false,
          isLoading: false,
          isLoggedIn: false,
          error: error instanceof Error ? error : new Error('Unknown error'),
          profile: null,
        });
      }
    };

    initializeLiff();
  }, []);

  /**
   * Login to LINE
   */
  const login = useCallback(() => {
    try {
      liffClient.login();
    } catch (error) {
      liffLogger.error('Login failed:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Login failed'),
      }));
    }
  }, []);

  /**
   * Logout from LINE
   */
  const logout = useCallback(() => {
    try {
      liffClient.logout();
      setState(prev => ({
        ...prev,
        isLoggedIn: false,
        profile: null,
      }));
      
      // Reload page to reset state
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      liffLogger.error('Logout failed:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Logout failed'),
      }));
    }
  }, []);

  /**
   * Refresh user profile
   */
  const refreshProfile = useCallback(async () => {
    if (!state.isLoggedIn) {
      return;
    }

    try {
      const profile = await liffClient.getProfile();
      setState(prev => ({ ...prev, profile }));
    } catch (error) {
      liffLogger.error('Failed to refresh profile:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to refresh profile'),
      }));
    }
  }, [state.isLoggedIn]);

  /**
   * Check if running in LINE client
   */
  const isInClient = useCallback(() => {
    return liffClient.isInClient();
  }, []);

  return {
    ...state,
    login,
    logout,
    refreshProfile,
    isInClient,
    liffClient,
  };
}
