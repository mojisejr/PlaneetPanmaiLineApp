# LIFF WebView Testing Documentation

## Overview

This directory contains testing documentation and tools for the Praneet Panmai LINE App LIFF WebView implementation.

## Contents

### 📋 Manual Testing Checklist
**File**: `manual-testing-checklist.md`

A comprehensive manual testing checklist covering all aspects of the LIFF WebView implementation:
- Performance testing
- Viewport and layout testing
- Touch and interaction testing
- LIFF API testing
- Error handling
- Accessibility
- Security

**Usage**:
1. Open the checklist file
2. Follow each test scenario
3. Mark items as completed
4. Record any issues found
5. Sign off when testing is complete

### 🤖 Automated Test Runner
**File**: `../../scripts/test/liff-test-runner.js`

An automated test scenario generator that helps organize and track manual testing efforts.

**Features**:
- Multiple test scenarios (performance, viewport, LIFF init, auth, etc.)
- Colorized terminal output
- Verbose mode for detailed information
- Help documentation

**Usage**:

```bash
# Show help and available scenarios
node scripts/test/liff-test-runner.js --help

# Run a specific scenario
node scripts/test/liff-test-runner.js --scenario performance

# Run all scenarios
node scripts/test/liff-test-runner.js --all

# Run with verbose output
node scripts/test/liff-test-runner.js --all --verbose
```

**Available Scenarios**:
1. `performance` - Performance benchmark tests
2. `viewport` - Viewport configuration tests
3. `liff-init` - LIFF initialization tests
4. `auth` - Authentication flow tests
5. `profile` - User profile tests
6. `webview` - WebView compatibility tests
7. `responsive` - Responsive design tests
8. `error-handling` - Error handling tests

## Testing Workflow

### 1. Development Testing

During development, use the Performance Overlay component to monitor real-time metrics:

```tsx
import { PerformanceOverlay } from '@/components/optimization/performance-overlay'

// In your development environment
{process.env.NODE_ENV === 'development' && (
  <PerformanceOverlay enabled={true} position="bottom-right" />
)}
```

### 2. Manual Testing

Before releasing to production:

1. Run the test scenario generator:
   ```bash
   node scripts/test/liff-test-runner.js --all
   ```

2. Open `manual-testing-checklist.md`

3. Test on actual devices:
   - iPhone SE (minimum supported)
   - iPhone 12/13/14 (standard)
   - iPhone 14 Pro/15 Pro (notched)
   - Android Samsung Galaxy
   - Android Google Pixel

4. Complete each test case

5. Record results and issues

6. Sign off on the checklist

### 3. Performance Validation

Ensure performance targets are met:

- **Load Time**: < 3000ms (3 seconds)
- **FCP (First Contentful Paint)**: < 1800ms
- **LCP (Largest Contentful Paint)**: < 2500ms
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

Use the Performance Overlay in development to validate these metrics.

## Testing on Real Devices

### iOS Testing

1. Add LIFF app to LINE OA
2. Send LIFF URL to test LINE account
3. Open on iPhone
4. Test in LINE app (WebView)
5. Test in Safari (external browser)

### Android Testing

1. Add LIFF app to LINE OA
2. Send LIFF URL to test LINE account
3. Open on Android device
4. Test in LINE app (WebView)
5. Test in Chrome (external browser)

## Common Issues and Solutions

### Issue: App loads slowly
- Check network conditions
- Verify image optimization
- Check bundle size
- Review performance metrics

### Issue: Viewport doesn't display correctly
- Check viewport meta tag
- Verify viewport configuration
- Test on different screen sizes
- Check for CSS issues

### Issue: Touch events not working
- Verify touch target sizes (44×44px minimum)
- Check for overlapping elements
- Test scroll behavior
- Verify iOS/Android specific fixes

### Issue: LIFF initialization fails
- Check LIFF ID configuration
- Verify environment variables
- Check console for errors
- Test authentication flow

## Performance Monitoring

The Performance Monitor tracks:

### Core Web Vitals
- **FCP**: Time to first paint
- **LCP**: Time to largest paint
- **FID**: First input responsiveness
- **CLS**: Layout stability
- **TTFB**: Server response time

### Custom Metrics
- Load time
- DOM ready time
- Memory usage
- Resource loading

### WebView Detection
- WebView type (LINE/generic/browser)
- Operating system (iOS/Android/web)
- Screen dimensions
- Device orientation

## Tools Integration

### Development Tools

The optimization utilities can be integrated into your development workflow:

```typescript
import {
  initializeViewport,
  initializePerformanceMonitor,
  initializeWebViewFixes,
} from '@/lib/optimization'

// Initialize all optimizations
function initializeOptimizations() {
  initializeViewport()
  initializePerformanceMonitor()
  initializeWebViewFixes()
}
```

### Production Monitoring

For production, consider:
- Disabling Performance Overlay
- Enabling error tracking
- Monitoring real user metrics
- Setting up performance alerts

## Best Practices

1. **Test Early and Often**: Run tests during development
2. **Test on Real Devices**: Emulators don't catch all issues
3. **Track Performance**: Monitor metrics continuously
4. **Document Issues**: Record all problems found
5. **Validate Fixes**: Re-test after fixing issues
6. **Automate Where Possible**: Use scripts to reduce manual work

## Resources

- [LINE LIFF Documentation](https://developers.line.biz/en/docs/liff/)
- [Web Vitals](https://web.dev/vitals/)
- [Mobile Testing Best Practices](https://web.dev/mobile/)
- [WebView Debugging](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/webviews)

## Support

For questions or issues:
1. Check this documentation
2. Review the manual testing checklist
3. Check console logs and error messages
4. Review the optimization utilities code
5. Consult the development team

---

**Last Updated**: 2025-10-23  
**Version**: 1.0  
**Maintained by**: Development Team
