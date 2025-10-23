# LINE WebView Optimization Library

## Overview
This library provides comprehensive optimization and monitoring tools for LINE LIFF WebView applications.

## Components

### 1. Viewport Configuration (`viewport-config.ts`)
Optimizes viewport settings for different screen sizes and device types.

**Key Features:**
- Automatic device detection (iOS/Android/Desktop)
- Screen size optimization
- Safe area insets support for notched devices
- LINE WebView detection and version checking

**Usage:**
```typescript
import { initializeViewport } from '@/lib/optimization/viewport-config';

// Initialize viewport on app load
const deviceInfo = initializeViewport();
console.log('Device:', deviceInfo);
```

### 2. Performance Monitor (`performance-monitor.ts`)
Real-time performance monitoring with Core Web Vitals tracking.

**Key Features:**
- Core Web Vitals (FCP, LCP, FID, CLS)
- Load time monitoring
- Memory usage tracking
- Performance score calculation (0-100)
- Configurable thresholds

**Usage:**
```typescript
import { initializePerformanceMonitor, getQuickPerformanceReport } from '@/lib/optimization/performance-monitor';

// Initialize on app load
initializePerformanceMonitor();

// Get performance report
const report = getQuickPerformanceReport();
console.log('Performance Score:', report.score);
console.log('Metrics:', report.metrics);
```

**Performance Targets:**
- Load Time: < 3000ms
- First Contentful Paint: < 1800ms
- Largest Contentful Paint: < 2500ms
- Time to Interactive: < 3800ms
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

### 3. WebView Utilities (`webview-utils.ts`)
Collection of WebView-specific fixes and optimizations.

**Key Features:**
- iOS scroll bounce fix
- Android keyboard overlap fix
- Input zoom prevention (iOS)
- Pull-to-refresh control
- Touch event optimization
- Memory monitoring
- Network status tracking
- Lazy loading for images
- Resource preloading

**Usage:**
```typescript
import { initializeWebViewOptimizations, getWebViewInfo } from '@/lib/optimization/webview-utils';

// Initialize all optimizations
initializeWebViewOptimizations();

// Get WebView information
const info = getWebViewInfo();
console.log('WebView Info:', info);
```

## Integration Guide

### Step 1: Initialize on App Load
Add to your root layout or _app file:

```typescript
'use client';

import { useEffect } from 'react';
import { initializeViewport } from '@/lib/optimization/viewport-config';
import { initializePerformanceMonitor } from '@/lib/optimization/performance-monitor';
import { initializeWebViewOptimizations } from '@/lib/optimization/webview-utils';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Initialize viewport
    initializeViewport();
    
    // Initialize performance monitoring
    initializePerformanceMonitor();
    
    // Initialize WebView optimizations
    initializeWebViewOptimizations();
  }, []);

  return <html>{children}</html>;
}
```

### Step 2: Add Performance Overlay (Development)
Add to your layout for development monitoring:

```typescript
import { PerformanceOverlay } from '@/components/optimization/performance-overlay';

export default function RootLayout({ children }) {
  return (
    <>
      {children}
      <PerformanceOverlay />
    </>
  );
}
```

### Step 3: Configure Safe Areas in CSS
Add to your global CSS:

```css
:root {
  --sat: env(safe-area-inset-top);
  --sar: env(safe-area-inset-right);
  --sab: env(safe-area-inset-bottom);
  --sal: env(safe-area-inset-left);
}

body {
  padding-top: var(--sat);
  padding-right: var(--sar);
  padding-bottom: var(--sab);
  padding-left: var(--sal);
}
```

## Testing

### Manual Testing
See `docs/testing/manual-testing-checklist.md` for comprehensive testing guidelines.

### Automated Testing
Run the automated test suite:

```bash
# Test all scenarios
npm run test:liff

# Test specific scenarios
node scripts/test/liff-test-runner.js viewport
node scripts/test/liff-test-runner.js perf
node scripts/test/liff-test-runner.js webview
```

## Performance Monitoring in Production

### Logging Performance Metrics
```typescript
import { getPerformanceMonitor } from '@/lib/optimization/performance-monitor';

// On page load complete
window.addEventListener('load', () => {
  setTimeout(() => {
    const monitor = getPerformanceMonitor();
    if (monitor) {
      const metrics = monitor.getMetrics();
      const score = monitor.getScore();
      
      // Send to analytics
      analytics.track('performance', {
        score,
        loadTime: metrics.loadTime,
        fcp: metrics.firstContentfulPaint,
        lcp: metrics.largestContentfulPaint,
      });
    }
  }, 2000);
});
```

## Best Practices

### 1. Viewport Optimization
- Always initialize viewport on app load
- Test on multiple device sizes
- Respect safe areas on notched devices
- Use proper viewport meta tags

### 2. Performance Monitoring
- Monitor Core Web Vitals in production
- Set up alerts for performance degradation
- Track performance trends over time
- Optimize based on real user data

### 3. WebView Compatibility
- Test on both iOS and Android LINE apps
- Handle WebView-specific issues gracefully
- Provide fallbacks for unsupported features
- Monitor memory usage continuously

### 4. Image Optimization
- Use lazy loading for images
- Preload critical resources
- Optimize image sizes for mobile
- Use modern image formats (WebP)

### 5. Network Handling
- Implement proper offline handling
- Show loading states clearly
- Provide retry mechanisms
- Cache resources appropriately

## Troubleshooting

### Issue: App loads slowly on LINE WebView
**Solution:**
1. Check performance metrics using the overlay
2. Optimize images and reduce bundle size
3. Implement code splitting
4. Preload critical resources

### Issue: Scroll bounce on iOS
**Solution:**
```typescript
import { fixIOSScrollBounce } from '@/lib/optimization/webview-utils';
fixIOSScrollBounce();
```

### Issue: Keyboard overlaps input on Android
**Solution:**
```typescript
import { fixAndroidKeyboardOverlap } from '@/lib/optimization/webview-utils';
fixAndroidKeyboardOverlap();
```

### Issue: Input zoom on iOS
**Solution:**
```typescript
import { fixIOSInputZoom } from '@/lib/optimization/webview-utils';
fixIOSInputZoom();
```

## Support

For issues and questions:
- Check the manual testing checklist
- Run the automated test suite
- Review WebView information in development
- Monitor performance metrics

## License

Part of the Praneet Panmai Line App project.
