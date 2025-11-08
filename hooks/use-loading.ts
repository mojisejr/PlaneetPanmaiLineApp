'use client'

import { useState, useCallback } from 'react'

interface LoadingState {
  isLoading: boolean
  message: string | null
}

export function useLoading() {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: null
  })

  const showLoading = useCallback((message?: string) => {
    setLoadingState({
      isLoading: true,
      message: message || null
    })
  }, [])

  const hideLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
      message: null
    })
  }, [])

  return {
    isLoading: loadingState.isLoading,
    loadingMessage: loadingState.message,
    showLoading,
    hideLoading
  }
}