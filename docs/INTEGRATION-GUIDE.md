# LIFF WebView Optimization - Integration Guide

## 📋 Overview

This guide helps you integrate the LIFF WebView optimization system into your Next.js application.

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14 (App Router)
- React 18
- LINE LIFF SDK
- Supabase Client
- TypeScript

### Step 2: Configure Environment Variables

Create `.env` file based on `.env.example`:

```bash
# LINE LIFF Configuration
NEXT_PUBLIC_LIFF_ID=1234567890-AbcdEfgh

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
NODE_ENV=development
```

### Step 3: Initialize Optimizations in Your App

Create or update `app/layout.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { initializeViewport } from '@/lib/optimization/viewport-config';
import { initializePerformanceMonitor } from '@/lib/optimization/performance-monitor';
import { initializeWebViewOptimizations } from '@/lib/optimization/webview-utils';
import { PerformanceOverlay } from '@/components/optimization/performance-overlay';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize viewport optimization
    const deviceInfo = initializeViewport();
    console.log('[App] Device detected:', deviceInfo);

    // Initialize performance monitoring
    initializePerformanceMonitor();

    // Initialize WebView optimizations
    initializeWebViewOptimizations();
  }, []);

  return (
    <html lang="en">
      <body>
        {children}
        {/* Show performance overlay in development */}
        <PerformanceOverlay />
      </body>
    </html>
  );
}
```

### Step 4: Add Safe Area Support to CSS

Add to your `globals.css` or `app/globals.css`:

```css
:root {
  /* Safe area insets for notched devices */
  --sat: env(safe-area-inset-top);
  --sar: env(safe-area-inset-right);
  --sab: env(safe-area-inset-bottom);
  --sal: env(safe-area-inset-left);
}

body {
  /* Apply safe areas */
  padding-top: var(--sat);
  padding-right: var(--sar);
  padding-bottom: var(--sab);
  padding-left: var(--sal);
  
  /* WebView optimizations */
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

/* Prevent zoom on input focus (iOS) */
input,
select,
textarea {
  font-size: 16px;
}

/* Optimize scrollable areas */
[data-scrollable] {
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
```

### Step 5: Test the Implementation

```bash
# Run automated tests
npm run test:liff

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Testing in LINE WebView

### 1. Setup LINE Developers Console
1. Go to https://developers.line.biz/
2. Create or select your channel
3. Create a LIFF app
4. Copy the LIFF ID to your `.env` file

### 2. Test with LINE App
1. Open LINE app on your device
2. Scan QR code or click LIFF URL
3. Check the performance overlay (bottom-right corner)
4. Verify device detection and metrics

### 3. Use Manual Testing Checklist
Follow the comprehensive checklist in `docs/testing/manual-testing-checklist.md`

## 🔧 Configuration Options

### Performance Monitoring Thresholds

Customize in your code:

```typescript
import { initializePerformanceMonitor, DEFAULT_THRESHOLDS } from '@/lib/optimization/performance-monitor';

// Custom thresholds
initializePerformanceMonitor({
  ...DEFAULT_THRESHOLDS,
  loadTime: 2500,  // More strict: 2.5s instead of 3s
  firstContentfulPaint: 1500,
});
```

### Viewport Configuration

The viewport is automatically optimized based on device detection. You can customize behavior:

```typescript
import { detectDevice, getOptimalViewportConfig } from '@/lib/optimization/viewport-config';

const device = detectDevice();
const config = getOptimalViewportConfig(device);

// Customize config if needed
if (device.type === 'mobile') {
  config.minimumScale = 1.0;
  config.userScalable = false; // Disable zoom
}
```

### WebView Utilities

Enable specific fixes:

```typescript
import {
  fixIOSScrollBounce,
  fixAndroidKeyboardOverlap,
  fixIOSInputZoom,
  disablePullToRefresh,
} from '@/lib/optimization/webview-utils';

// Apply specific fixes
fixIOSScrollBounce();
fixAndroidKeyboardOverlap();
fixIOSInputZoom();
disablePullToRefresh();
```

## 📊 Performance Monitoring

### Development Mode

The performance overlay shows real-time metrics:
- Core Web Vitals (FCP, LCP, FID, CLS)
- Load times (total, DOM ready, first paint)
- Memory usage
- WebView information

Toggle visibility with the button in the corner.

### Production Mode

Send metrics to your analytics:

```typescript
import { getPerformanceMonitor } from '@/lib/optimization/performance-monitor';

window.addEventListener('load', () => {
  setTimeout(() => {
    const monitor = getPerformanceMonitor();
    if (monitor) {
      const metrics = monitor.getMetrics();
      const score = monitor.getScore();
      
      // Send to analytics (Google Analytics, Mixpanel, etc.)
      gtag('event', 'web_vitals', {
        performance_score: score,
        load_time: metrics.loadTime,
        fcp: metrics.firstContentfulPaint,
        lcp: metrics.largestContentfulPaint,
      });
    }
  }, 2000);
});
```

## 🐛 Troubleshooting

### Issue: Performance overlay not showing
**Solution:** Check that `NODE_ENV=development` is set or pass `enabled={true}` to the component.

### Issue: Metrics not collecting
**Solution:** Ensure the performance monitor is initialized before the page fully loads.

### Issue: iOS scroll bounce still visible
**Solution:** Apply the fix after DOM is ready and ensure all scrollable elements have the fix applied.

### Issue: Android keyboard overlaps input
**Solution:** The fix listens to window resize events. Make sure it's initialized early.

### Issue: High memory usage warning
**Solution:** The system automatically clears caches when memory usage > 80%. Check for memory leaks in your code.

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` file
2. **LIFF ID**: Safe to expose (public)
3. **API Keys**: Keep server-side only
4. **Performance Data**: May contain sensitive timing information

## 📚 Additional Resources

- [LINE LIFF Documentation](https://developers.line.biz/en/docs/liff/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Manual Testing Checklist](./testing/manual-testing-checklist.md)
- [Optimization Library README](../lib/optimization/README.md)

## ✅ Verification Checklist

Before deploying:

- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] Type check passes (`npm run type-check`)
- [ ] Automated tests pass (`npm run test:liff`)
- [ ] Performance overlay works in development
- [ ] Tested on iOS LINE app
- [ ] Tested on Android LINE app
- [ ] Manual testing checklist completed
- [ ] Performance metrics meet targets (< 3s load time)

## 🆘 Need Help?

1. Check the automated test results
2. Review the manual testing checklist
3. Check browser/WebView console for errors
4. Enable performance overlay in development
5. Create an issue in the repository with:
   - Device information
   - LINE app version
   - Steps to reproduce
   - Screenshots/videos

## 📈 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Load Time | < 3000ms | 🎯 |
| First Contentful Paint | < 1800ms | 🎯 |
| Largest Contentful Paint | < 2500ms | 🎯 |
| First Input Delay | < 100ms | 🎯 |
| Cumulative Layout Shift | < 0.1 | 🎯 |
| Performance Score | ≥ 70% | 🎯 |

## 🎉 Success!

Once integrated, your LINE LIFF app will have:
- ✅ Optimized viewport for all devices
- ✅ Real-time performance monitoring
- ✅ WebView-specific fixes for iOS and Android
- ✅ Development tools for debugging
- ✅ Comprehensive testing framework

Your users will experience faster load times and smoother interactions! 🚀
