# LINE LIFF WebView - Manual Testing Checklist

## 📋 Overview
This checklist covers comprehensive manual testing for the LINE LIFF WebView implementation. Perform these tests before each deployment to ensure optimal performance and compatibility.

## 🎯 Testing Environment Requirements

### Required Devices
- [ ] iOS Device (iPhone) - Latest iOS version
- [ ] iOS Device (iPhone) - iOS version N-1
- [ ] Android Device - Latest Android version
- [ ] Android Device - Android version N-1

### Required Apps
- [ ] LINE App installed (Latest version)
- [ ] LINE App Developer Mode enabled
- [ ] Test LINE OA account set up

### Network Conditions
- [ ] WiFi (High-speed connection)
- [ ] 4G/LTE (Medium-speed connection)
- [ ] 3G (Low-speed connection)
- [ ] Airplane mode (Offline testing)

---

## 🚀 Performance Testing

### Load Time Tests
- [ ] **Initial Load (Cold Start)**: App loads in < 3 seconds on 4G
- [ ] **Warm Start**: App loads in < 1.5 seconds on second visit
- [ ] **Slow 3G**: App shows loading indicator and completes in < 5 seconds
- [ ] **Offline**: App shows offline message clearly

### Performance Metrics
- [ ] **First Contentful Paint (FCP)**: < 1.8 seconds
- [ ] **Largest Contentful Paint (LCP)**: < 2.5 seconds
- [ ] **First Input Delay (FID)**: < 100ms
- [ ] **Cumulative Layout Shift (CLS)**: < 0.1
- [ ] **Memory Usage**: Stable, no memory leaks after 5 minutes

### Stress Testing
- [ ] Navigate between pages 20 times - No performance degradation
- [ ] Keep app open for 10 minutes - No crashes or freezes
- [ ] Switch apps and return - App resumes correctly
- [ ] Background app and return - App state preserved

---

## 📱 Viewport & Display Testing

### Screen Sizes
- [ ] **iPhone SE (Small)**: 375x667px - All content visible
- [ ] **iPhone 13 (Medium)**: 390x844px - Proper scaling
- [ ] **iPhone 13 Pro Max (Large)**: 428x926px - No wasted space
- [ ] **Android Small**: 360x640px - All content fits
- [ ] **Android Medium**: 412x915px - Proper layout
- [ ] **Android Large**: 1440x3200px - No pixelation

### Orientation
- [ ] **Portrait Mode**: Default orientation works perfectly
- [ ] **Landscape Mode**: Layout adapts or locks to portrait
- [ ] **Rotation**: Smooth transition between orientations

### Safe Areas (Notched Devices)
- [ ] Header content not hidden by notch
- [ ] Footer content not hidden by home indicator
- [ ] Content properly padded from screen edges
- [ ] Full-screen elements respect safe areas

### Display Settings
- [ ] **Standard Text Size**: Readable and properly spaced
- [ ] **Large Text Size**: Layout doesn't break, text scales
- [ ] **Bold Text**: UI remains consistent
- [ ] **Reduce Motion**: Animations respect system preference

---

## 🎨 Visual & UI Testing

### Layout
- [ ] All buttons properly sized (min 44x44px touch target)
- [ ] Text is readable (min 16px font size)
- [ ] Images load correctly and are optimized
- [ ] Icons are clear and recognizable
- [ ] Spacing is consistent throughout

### Colors & Theme
- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly
- [ ] Theme switching is smooth
- [ ] Contrast meets accessibility standards
- [ ] Brand colors consistent across components

### Scrolling
- [ ] Smooth scrolling on all pages
- [ ] No scroll bounce issues on iOS
- [ ] Proper scroll indicators
- [ ] Scroll to top functionality works
- [ ] Pull-to-refresh disabled/works correctly

---

## 🔧 Functionality Testing

### LINE LIFF Integration
- [ ] LIFF SDK initializes successfully
- [ ] User profile loads correctly
- [ ] Authentication flow works smoothly
- [ ] Permissions requested appropriately
- [ ] Profile picture displays correctly
- [ ] Display name shows properly
- [ ] LINE User ID captured correctly

### Navigation
- [ ] All navigation links work
- [ ] Back button functions correctly
- [ ] Deep links work properly
- [ ] URL parameters handled correctly
- [ ] Navigation state preserved

### Forms & Input
- [ ] All input fields accept text
- [ ] Virtual keyboard doesn't overlap inputs
- [ ] Input validation works correctly
- [ ] Form submission successful
- [ ] Error messages display clearly
- [ ] Auto-fill works properly

### Calculator Features (If Applicable)
- [ ] Price calculations accurate
- [ ] Real-time updates work
- [ ] Cart functionality correct
- [ ] Promotions applied correctly
- [ ] Results display properly

---

## 🐛 Edge Cases & Error Handling

### Network Errors
- [ ] Offline mode handled gracefully
- [ ] Network timeout shows error message
- [ ] Retry mechanism works
- [ ] Error messages are user-friendly
- [ ] App recovers when network returns

### LIFF Errors
- [ ] LIFF init failure handled
- [ ] Login cancellation handled
- [ ] Permission denial handled gracefully
- [ ] Profile fetch error handled
- [ ] Unsupported browser message shown

### WebView Issues
- [ ] iOS scroll issues fixed
- [ ] Android keyboard overlap fixed
- [ ] Input zoom on iOS prevented
- [ ] Touch events work correctly
- [ ] No rendering glitches

### Data Issues
- [ ] Empty states display properly
- [ ] Loading states show correctly
- [ ] Error states are clear
- [ ] Large data sets handled
- [ ] No data loss on navigation

---

## 🔒 Security Testing

### Data Protection
- [ ] Sensitive data not exposed in console
- [ ] API keys not visible in frontend
- [ ] User data encrypted in transit
- [ ] Session management secure
- [ ] No XSS vulnerabilities

### Authentication
- [ ] Only authenticated users access calculator
- [ ] Session timeout works correctly
- [ ] Re-authentication required when needed
- [ ] User data isolated per session

---

## ♿ Accessibility Testing

### Screen Reader
- [ ] All interactive elements labeled
- [ ] Navigation announcements clear
- [ ] Form fields properly labeled
- [ ] Error messages announced
- [ ] Dynamic content updates announced

### Keyboard Navigation
- [ ] Tab order is logical
- [ ] All interactive elements reachable
- [ ] Focus indicators visible
- [ ] Keyboard shortcuts work

### Visual Accessibility
- [ ] Sufficient color contrast (4.5:1 for text)
- [ ] No information conveyed by color alone
- [ ] Text resizable up to 200%
- [ ] No flickering or flashing content

---

## 🔄 Integration Testing

### LINE OA Features
- [ ] QR Code scan opens LIFF correctly
- [ ] Rich Menu buttons work
- [ ] Chat commands trigger LIFF
- [ ] Profile buttons open LIFF
- [ ] Multi-channel access works

### Multi-Channel Access
- [ ] QR Code → LIFF flow works
- [ ] Rich Menu → LIFF flow works
- [ ] Chat Commands → LIFF flow works
- [ ] OA Profile → LIFF flow works
- [ ] URL parameters preserved across channels

---

## 📊 Analytics & Monitoring

### Event Tracking
- [ ] Page views tracked correctly
- [ ] Button clicks tracked
- [ ] Errors logged properly
- [ ] Performance metrics collected
- [ ] User journey captured

### Performance Monitoring
- [ ] Performance overlay shows metrics (dev mode)
- [ ] Metrics match expectations
- [ ] No performance regressions
- [ ] Memory usage stable

---

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] `npm run build` passes with 0 errors
- [ ] `npm run lint` passes with 0 warnings
- [ ] `npm run type-check` passes
- [ ] All console.log removed from production code
- [ ] All TODO/FIXME comments resolved

### Testing
- [ ] All critical paths tested
- [ ] Error scenarios tested
- [ ] Performance benchmarks met
- [ ] Security checklist completed
- [ ] Accessibility standards met

### Documentation
- [ ] README updated
- [ ] API documentation current
- [ ] Environment variables documented
- [ ] Deployment guide updated
- [ ] Testing results recorded

### Configuration
- [ ] Environment variables set correctly
- [ ] LIFF ID configured
- [ ] API endpoints correct
- [ ] Feature flags set appropriately
- [ ] Analytics configured

---

## 📝 Test Results Template

```
Test Date: _______________
Tester Name: _______________
Device: _______________
OS Version: _______________
LINE Version: _______________
Network: _______________

Performance Score: _____ / 100
Load Time: _____ ms
Critical Issues: _____ 
Major Issues: _____ 
Minor Issues: _____

Overall Status: ☐ Pass  ☐ Fail  ☐ Needs Review

Notes:
_______________________________________
_______________________________________
_______________________________________
```

---

## 🚨 Critical Issues Template

```
Issue #: _____
Severity: ☐ Critical  ☐ Major  ☐ Minor
Device: _______________
Steps to Reproduce:
1. 
2. 
3. 

Expected Result:
_______________________________________

Actual Result:
_______________________________________

Screenshots/Videos:
_______________________________________
```

---

## 📞 Support Contact

If you encounter issues during testing:
- Create an issue in GitHub with detailed reproduction steps
- Include screenshots/videos when possible
- Note device, OS, and LINE app version
- Describe expected vs actual behavior

---

**Testing Tip**: Test in real LINE app, not in mobile browser. LINE WebView has specific behaviors that differ from standard browsers.

**Performance Tip**: Use the Performance Overlay (dev mode) to monitor real-time metrics during testing.

**Accessibility Tip**: Test with actual assistive technologies when possible, not just automated tools.
