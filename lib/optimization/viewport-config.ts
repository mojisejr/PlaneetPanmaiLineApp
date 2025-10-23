/**
 * LINE WebView Viewport Configuration
 * Optimizes viewport settings for different screen sizes and device types
 */

export interface ViewportConfig {
  width: number;
  height: number;
  initialScale: number;
  minimumScale: number;
  maximumScale: number;
  userScalable: boolean;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: 'ios' | 'android' | 'other';
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
}

/**
 * Detect device information from LINE WebView
 */
export function detectDevice(): DeviceInfo {
  const ua = navigator.userAgent;
  const width = window.innerWidth || document.documentElement.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight;
  const pixelRatio = window.devicePixelRatio || 1;

  // Detect OS
  let os: 'ios' | 'android' | 'other' = 'other';
  if (/iPhone|iPad|iPod/i.test(ua)) {
    os = 'ios';
  } else if (/Android/i.test(ua)) {
    os = 'android';
  }

  // Detect device type based on screen width
  let type: 'mobile' | 'tablet' | 'desktop' = 'mobile';
  if (width >= 1024) {
    type = 'desktop';
  } else if (width >= 768) {
    type = 'tablet';
  }

  return {
    type,
    os,
    screenWidth: width,
    screenHeight: height,
    pixelRatio,
  };
}

/**
 * Get optimal viewport configuration for current device
 */
export function getOptimalViewportConfig(device: DeviceInfo): ViewportConfig {
  const baseConfig: ViewportConfig = {
    width: device.screenWidth,
    height: device.screenHeight,
    initialScale: 1.0,
    minimumScale: 1.0,
    maximumScale: 5.0,
    userScalable: true,
  };

  // iOS-specific optimizations
  if (device.os === 'ios') {
    return {
      ...baseConfig,
      // Prevent zoom on form input focus
      minimumScale: device.type === 'mobile' ? 1.0 : 0.8,
      maximumScale: 3.0,
      userScalable: true,
    };
  }

  // Android-specific optimizations
  if (device.os === 'android') {
    return {
      ...baseConfig,
      // Android WebView handles scaling better
      minimumScale: 0.5,
      maximumScale: 5.0,
      userScalable: true,
    };
  }

  return baseConfig;
}

/**
 * Apply viewport meta tag to document
 */
export function applyViewportConfig(config: ViewportConfig): void {
  const viewport = document.querySelector('meta[name="viewport"]');
  
  const content = [
    `width=${config.width}`,
    `initial-scale=${config.initialScale}`,
    `minimum-scale=${config.minimumScale}`,
    `maximum-scale=${config.maximumScale}`,
    `user-scalable=${config.userScalable ? 'yes' : 'no'}`,
  ].join(', ');

  if (viewport) {
    viewport.setAttribute('content', content);
  } else {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = content;
    document.head.appendChild(meta);
  }
}

/**
 * Initialize viewport optimization for LINE WebView
 */
export function initializeViewport(): DeviceInfo {
  const device = detectDevice();
  const config = getOptimalViewportConfig(device);
  applyViewportConfig(config);
  
  // Log configuration in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Viewport] Device detected:', device);
    console.log('[Viewport] Configuration applied:', config);
  }
  
  return device;
}

/**
 * Get safe area insets for notched devices
 */
export function getSafeAreaInsets() {
  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(style.getPropertyValue('--sat') || style.getPropertyValue('env(safe-area-inset-top)') || '0'),
    right: parseInt(style.getPropertyValue('--sar') || style.getPropertyValue('env(safe-area-inset-right)') || '0'),
    bottom: parseInt(style.getPropertyValue('--sab') || style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    left: parseInt(style.getPropertyValue('--sal') || style.getPropertyValue('env(safe-area-inset-left)') || '0'),
  };
}

/**
 * Check if running in LINE WebView
 */
export function isLINEWebView(): boolean {
  return /Line/i.test(navigator.userAgent);
}

/**
 * Get LINE WebView version
 */
export function getLINEWebViewVersion(): string | null {
  const match = navigator.userAgent.match(/Line\/(\d+\.\d+\.\d+)/i);
  return match ? match[1] : null;
}
