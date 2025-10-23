/**
 * LINE WebView Utilities
 * Common fixes and utilities for LINE WebView compatibility
 */

/**
 * Fix iOS WebView scroll bounce
 */
export function fixIOSScrollBounce(): void {
  if (typeof document === 'undefined') return;
  
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isIOS) return;

  // Prevent overscroll bounce
  document.body.style.overscrollBehavior = 'none';
  
  // Apply to all scrollable elements
  const scrollableElements = document.querySelectorAll('[data-scrollable]');
  scrollableElements.forEach(el => {
    (el as HTMLElement).style.overscrollBehavior = 'contain';
  });
}

/**
 * Fix Android WebView keyboard overlap
 */
export function fixAndroidKeyboardOverlap(): void {
  if (typeof window === 'undefined') return;
  
  const isAndroid = /Android/i.test(navigator.userAgent);
  if (!isAndroid) return;

  let originalHeight = window.innerHeight;

  window.addEventListener('resize', () => {
    const currentHeight = window.innerHeight;
    
    // Keyboard is showing
    if (currentHeight < originalHeight) {
      document.body.style.height = `${currentHeight}px`;
    } else {
      document.body.style.height = '';
      originalHeight = currentHeight;
    }
  });
}

/**
 * Disable pull-to-refresh in WebView
 */
export function disablePullToRefresh(): void {
  if (typeof document === 'undefined') return;

  let lastTouchY = 0;
  let preventPullToRefresh = false;

  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    lastTouchY = e.touches[0].clientY;
    preventPullToRefresh = window.scrollY === 0;
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchYDelta = touchY - lastTouchY;
    lastTouchY = touchY;

    if (preventPullToRefresh) {
      if (touchYDelta > 0) {
        e.preventDefault();
        return;
      }
      preventPullToRefresh = false;
    }
  }, { passive: false });
}

/**
 * Fix input zoom on iOS
 */
export function fixIOSInputZoom(): void {
  if (typeof document === 'undefined') return;
  
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isIOS) return;

  const inputs = document.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    const fontSize = window.getComputedStyle(input).fontSize;
    const fontSizeValue = parseFloat(fontSize);
    
    // iOS zooms on input focus if font-size < 16px
    if (fontSizeValue < 16) {
      (input as HTMLElement).style.fontSize = '16px';
    }
  });
}

/**
 * Optimize touch event handling
 */
export function optimizeTouchEvents(): void {
  if (typeof document === 'undefined') return;

  // Add touch-action for better scrolling
  document.body.style.touchAction = 'pan-y';

  // Optimize click delay
  const clickableElements = document.querySelectorAll('button, a, [role="button"]');
  clickableElements.forEach(el => {
    (el as HTMLElement).style.touchAction = 'manipulation';
  });
}

/**
 * Detect and fix WebView rendering issues
 */
export function fixWebViewRendering(): void {
  if (typeof document === 'undefined') return;

  // Force hardware acceleration
  document.body.style.transform = 'translateZ(0)';
  document.body.style.webkitTransform = 'translateZ(0)';

  // Fix webkit overflow scrolling
  const scrollContainers = document.querySelectorAll('[data-scroll]');
  scrollContainers.forEach(el => {
    (el as HTMLElement).style.webkitOverflowScrolling = 'touch';
  });
}

/**
 * Monitor WebView memory and clear cache if needed
 */
export function monitorWebViewMemory(): void {
  if (typeof window === 'undefined') return;

  const memory = (performance as any).memory;
  if (!memory) return;

  const usedMemoryMB = memory.usedJSHeapSize / (1024 * 1024);
  const limitMemoryMB = memory.jsHeapSizeLimit / (1024 * 1024);
  const usagePercent = (usedMemoryMB / limitMemoryMB) * 100;

  // Warning if memory usage > 80%
  if (usagePercent > 80) {
    console.warn(`[WebView] High memory usage: ${usagePercent.toFixed(2)}%`);
    
    // Clear caches if available
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
  }
}

/**
 * Get WebView information
 */
export function getWebViewInfo() {
  const ua = navigator.userAgent;
  
  return {
    isLINE: /Line/i.test(ua),
    isIOS: /iPhone|iPad|iPod/i.test(ua),
    isAndroid: /Android/i.test(ua),
    userAgent: ua,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
    online: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
  };
}

/**
 * Setup network status monitoring
 */
export function setupNetworkMonitoring(
  onOnline?: () => void,
  onOffline?: () => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => {
    console.log('[WebView] Network online');
    onOnline?.();
  };

  const handleOffline = () => {
    console.log('[WebView] Network offline');
    onOffline?.();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Initialize all WebView optimizations
 */
export function initializeWebViewOptimizations(): void {
  if (typeof window === 'undefined') return;

  fixIOSScrollBounce();
  fixAndroidKeyboardOverlap();
  disablePullToRefresh();
  fixIOSInputZoom();
  optimizeTouchEvents();
  fixWebViewRendering();
  
  // Monitor memory every 30 seconds
  setInterval(monitorWebViewMemory, 30000);

  // Log WebView info in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[WebView] Info:', getWebViewInfo());
  }
}

/**
 * Lazy load images for better performance
 */
export function setupLazyLoading(): void {
  if (typeof window === 'undefined') return;

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      const image = img as HTMLImageElement;
      const src = image.dataset.src;
      if (src) {
        image.src = src;
      }
    });
  }
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources(resources: string[]): void {
  if (typeof document === 'undefined') return;

  resources.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    
    // Determine resource type
    if (href.endsWith('.css')) {
      link.as = 'style';
    } else if (href.match(/\.(woff2?|ttf|otf)$/)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    } else if (href.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
      link.as = 'image';
    } else if (href.endsWith('.js')) {
      link.as = 'script';
    }
    
    link.href = href;
    document.head.appendChild(link);
  });
}
