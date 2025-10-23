/**
 * Viewport Configuration for LINE WebView
 * Optimizes viewport settings for different screen sizes and devices
 */

export interface ViewportConfig {
  width: number
  height: number
  scale: number
  minScale: number
  maxScale: number
  userScalable: boolean
}

export interface ScreenSize {
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
}

/**
 * Get optimal viewport configuration based on screen size
 */
export const getViewportConfig = (
  screenSize?: ScreenSize
): ViewportConfig => {
  const defaultConfig: ViewportConfig = {
    width: 375, // iPhone SE width as minimum
    height: 667,
    scale: 1.0,
    minScale: 1.0,
    maxScale: 1.0,
    userScalable: false, // Disable zoom for better UX in LINE
  }

  if (!screenSize) {
    return defaultConfig
  }

  // Adjust for different screen sizes
  if (screenSize.width < 375) {
    // Small screens (< iPhone SE)
    return {
      ...defaultConfig,
      width: 320,
      scale: 0.9,
    }
  }

  if (screenSize.width >= 768) {
    // Tablet sizes
    return {
      ...defaultConfig,
      width: 768,
      scale: 1.0,
    }
  }

  return defaultConfig
}

/**
 * Get current screen size
 */
export const getScreenSize = (): ScreenSize | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
  }
}

/**
 * Apply viewport meta tag configuration
 */
export const applyViewportConfig = (config: ViewportConfig): void => {
  if (typeof document === 'undefined') {
    return
  }

  let viewportMeta = document.querySelector('meta[name="viewport"]')

  if (!viewportMeta) {
    viewportMeta = document.createElement('meta')
    viewportMeta.setAttribute('name', 'viewport')
    document.head.appendChild(viewportMeta)
  }

  const content = [
    `width=${config.width}`,
    `initial-scale=${config.scale}`,
    `minimum-scale=${config.minScale}`,
    `maximum-scale=${config.maxScale}`,
    `user-scalable=${config.userScalable ? 'yes' : 'no'}`,
  ].join(', ')

  viewportMeta.setAttribute('content', content)
}

/**
 * Initialize viewport configuration
 * Call this on app initialization
 */
export const initializeViewport = (): void => {
  const screenSize = getScreenSize()
  const config = getViewportConfig(screenSize || undefined)
  applyViewportConfig(config)
}

/**
 * Handle viewport resize events
 */
export const handleViewportResize = (
  callback: (screenSize: ScreenSize) => void
): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleResize = () => {
    const screenSize = getScreenSize()
    if (screenSize) {
      callback(screenSize)
    }
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('orientationchange', handleResize)

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('orientationchange', handleResize)
  }
}

/**
 * Viewport utilities for LINE WebView
 */
export const viewportUtils = {
  getConfig: getViewportConfig,
  getScreenSize,
  apply: applyViewportConfig,
  initialize: initializeViewport,
  onResize: handleViewportResize,
}
