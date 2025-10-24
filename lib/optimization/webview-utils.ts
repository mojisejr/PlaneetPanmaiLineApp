/**
 * WebView Utilities for LINE WebView
 * Provides utilities and fixes for common WebView issues
 */

export interface WebViewInfo {
  isWebView: boolean
  isLineWebView: boolean
  userAgent: string
  platform: string
  os: 'ios' | 'android' | 'web' | 'unknown'
  version?: string
}

/**
 * Detect if running in WebView
 */
export const isWebView = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  const userAgent = window.navigator.userAgent.toLowerCase()

  // Check for common WebView patterns
  return (
    userAgent.includes('wv') ||
    userAgent.includes('webview') ||
    userAgent.includes('line') ||
    (userAgent.includes('android') && !userAgent.includes('chrome'))
  )
}

/**
 * Detect if running in LINE WebView
 */
export const isLineWebView = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  const userAgent = window.navigator.userAgent.toLowerCase()
  return userAgent.includes('line')
}

/**
 * Get WebView information
 */
export const getWebViewInfo = (): WebViewInfo => {
  if (typeof window === 'undefined') {
    return {
      isWebView: false,
      isLineWebView: false,
      userAgent: '',
      platform: '',
      os: 'unknown',
    }
  }

  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  const userAgentLower = userAgent.toLowerCase()

  let os: WebViewInfo['os'] = 'unknown'
  if (userAgentLower.includes('iphone') || userAgentLower.includes('ipad')) {
    os = 'ios'
  } else if (userAgentLower.includes('android')) {
    os = 'android'
  } else if (!isWebView()) {
    os = 'web'
  }

  // Extract LINE version if available
  const lineVersionMatch = userAgent.match(/Line\/(\d+\.\d+\.\d+)/i)
  const version = lineVersionMatch ? lineVersionMatch[1] : undefined

  return {
    isWebView: isWebView(),
    isLineWebView: isLineWebView(),
    userAgent,
    platform,
    os,
    version,
  }
}

/**
 * Fix iOS WebView scroll issues
 */
export const fixIosScrollIssues = (): void => {
  if (typeof document === 'undefined') {
    return
  }

  const webViewInfo = getWebViewInfo()
  if (webViewInfo.os !== 'ios') {
    return
  }

  // Fix momentum scrolling on iOS
  // Use type assertion for webkit-specific property
  (document.body.style as CSSStyleDeclaration & {
    webkitOverflowScrolling?: string
  }).webkitOverflowScrolling = 'touch'

  // Prevent rubber band effect on scroll
  document.body.addEventListener(
    'touchmove',
    (e) => {
      const target = e.target as HTMLElement
      if (target.scrollHeight <= target.clientHeight) {
        e.preventDefault()
      }
    },
    { passive: false }
  )
}

/**
 * Fix Android WebView touch issues
 */
export const fixAndroidTouchIssues = (): void => {
  if (typeof document === 'undefined') {
    return
  }

  const webViewInfo = getWebViewInfo()
  if (webViewInfo.os !== 'android') {
    return
  }

  // Fix touch delay on Android
  document.addEventListener('touchstart', () => {}, { passive: true })
}

/**
 * Disable pull-to-refresh on mobile
 */
export const disablePullToRefresh = (): void => {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overscrollBehavior = 'none'

  // Prevent pull-to-refresh gesture
  let lastTouchY = 0
  let preventPullToRefresh = false

  document.body.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) {
        return
      }
      lastTouchY = e.touches[0].clientY
      preventPullToRefresh = window.scrollY === 0
    },
    { passive: false }
  )

  document.body.addEventListener(
    'touchmove',
    (e) => {
      const touchY = e.touches[0].clientY
      const touchYDelta = touchY - lastTouchY
      lastTouchY = touchY

      if (preventPullToRefresh && touchYDelta > 0) {
        e.preventDefault()
      }
    },
    { passive: false }
  )
}

/**
 * Fix viewport height for mobile browsers
 * Handles dynamic toolbar showing/hiding
 */
export const fixViewportHeight = (): void => {
  if (typeof document === 'undefined') {
    return
  }

  const setVh = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  setVh()
  window.addEventListener('resize', setVh)
  window.addEventListener('orientationchange', setVh)
}

/**
 * Prevent zoom on input focus (iOS)
 */
export const preventZoomOnInputFocus = (): void => {
  if (typeof document === 'undefined') {
    return
  }

  const webViewInfo = getWebViewInfo()
  if (webViewInfo.os !== 'ios') {
    return
  }

  // Add font-size to prevent iOS zoom
  const style = document.createElement('style')
  style.innerHTML = `
    input, textarea, select {
      font-size: 16px !important;
    }
  `
  document.head.appendChild(style)
}

/**
 * Enable safe area insets for notched devices
 */
export const enableSafeAreaInsets = (): void => {
  if (typeof document === 'undefined') {
    return
  }

  // Add CSS variables for safe area insets
  const style = document.createElement('style')
  style.innerHTML = `
    :root {
      --safe-area-inset-top: env(safe-area-inset-top);
      --safe-area-inset-right: env(safe-area-inset-right);
      --safe-area-inset-bottom: env(safe-area-inset-bottom);
      --safe-area-inset-left: env(safe-area-inset-left);
    }
  `
  document.head.appendChild(style)
}

/**
 * Initialize all WebView fixes
 */
export const initializeWebViewFixes = (): void => {
  fixIosScrollIssues()
  fixAndroidTouchIssues()
  disablePullToRefresh()
  fixViewportHeight()
  preventZoomOnInputFocus()
  enableSafeAreaInsets()
}

/**
 * WebView utilities
 */
export const webViewUtils = {
  isWebView,
  isLineWebView,
  getInfo: getWebViewInfo,
  fixes: {
    ios: fixIosScrollIssues,
    android: fixAndroidTouchIssues,
    pullToRefresh: disablePullToRefresh,
    viewportHeight: fixViewportHeight,
    inputZoom: preventZoomOnInputFocus,
    safeArea: enableSafeAreaInsets,
    all: initializeWebViewFixes,
  },
}
