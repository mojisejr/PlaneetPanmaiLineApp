# LINE LIFF WebView Manual Testing Checklist

## Overview
This checklist provides comprehensive manual testing scenarios for the Praneet Panmai LINE App LIFF WebView implementation. All tests should be performed on actual devices where possible.

## Testing Devices
- [ ] iPhone SE (iOS 15+) - Minimum supported device
- [ ] iPhone 12/13/14 (iOS 16+) - Standard device
- [ ] iPhone 14 Pro/15 Pro (iOS 17+) - Device with Dynamic Island
- [ ] Android Samsung Galaxy S10+ (Android 10+)
- [ ] Android Google Pixel 5/6 (Android 12+)
- [ ] iPad (for tablet testing)

---

## 1. Initial Load & Performance Testing

### 1.1 First Load Performance
- [ ] App loads within 3 seconds on 4G connection
- [ ] App loads within 2 seconds on 5G/WiFi connection
- [ ] Splash screen or loading indicator displays immediately
- [ ] No white screen flashing during load
- [ ] No layout shifts after initial render

### 1.2 Cold Start Testing
- [ ] Clear LINE app cache
- [ ] Open LIFF app from LINE OA message
- [ ] Verify LIFF initialization completes successfully
- [ ] Check that user profile loads correctly
- [ ] Verify authentication flow works on first visit

### 1.3 Warm Start Testing
- [ ] Close LINE app completely
- [ ] Reopen LINE and access LIFF app
- [ ] Verify faster load time (cached resources)
- [ ] Session should persist
- [ ] No unnecessary re-authentication

---

## 2. Viewport & Layout Testing

### 2.1 Portrait Mode Testing
- [ ] Layout displays correctly in portrait mode
- [ ] All content is visible without horizontal scrolling
- [ ] Touch targets are at least 44×44 pixels
- [ ] Text is readable without zooming (minimum 16px)
- [ ] Images scale proportionally

### 2.2 Landscape Mode Testing
- [ ] Rotate device to landscape mode
- [ ] Layout adapts to landscape orientation
- [ ] No content is cut off or hidden
- [ ] Navigation remains accessible
- [ ] Form inputs remain usable

### 2.3 Screen Size Variations
- [ ] Test on small screen (320×568 - iPhone SE)
- [ ] Test on medium screen (375×667 - iPhone 8)
- [ ] Test on large screen (414×896 - iPhone 11 Pro Max)
- [ ] Test on tablet (768×1024 - iPad)
- [ ] Verify responsive breakpoints work correctly

### 2.4 Safe Area Insets (Notched Devices)
- [ ] Content respects safe area at top (notch/Dynamic Island)
- [ ] Content respects safe area at bottom (home indicator)
- [ ] No important UI elements hidden behind notch
- [ ] Navigation bar doesn't overlap home indicator

---

## 3. Touch & Interaction Testing

### 3.1 Touch Gestures
- [ ] Tap targets respond immediately (no 300ms delay)
- [ ] Buttons provide visual feedback on press
- [ ] Scrolling is smooth and responsive
- [ ] Swipe gestures work correctly (if implemented)
- [ ] No accidental double-tap zoom

### 3.2 Form Interactions
- [ ] Input fields focus correctly on tap
- [ ] Keyboard appears without delay
- [ ] Keyboard doesn't cover input fields
- [ ] Can scroll to see covered content while keyboard is open
- [ ] Numeric keyboard appears for number inputs
- [ ] Date picker works correctly (if applicable)

### 3.3 Scroll Behavior
- [ ] Momentum scrolling works on iOS
- [ ] Scroll bounce/rubber band is disabled where appropriate
- [ ] Pull-to-refresh is disabled
- [ ] Scroll position persists on navigation
- [ ] Long lists scroll smoothly without lag

---

## 4. WebView-Specific Testing

### 4.1 iOS WebView Issues
- [ ] No white flash when loading dark content
- [ ] Fixed position elements stay fixed while scrolling
- [ ] CSS animations perform smoothly
- [ ] Backdrop filters work correctly (if used)
- [ ] No input zoom on focus (font-size ≥ 16px)

### 4.2 Android WebView Issues
- [ ] Font rendering is clear and crisp
- [ ] CSS Grid and Flexbox layouts work correctly
- [ ] Transitions and animations are smooth
- [ ] No text rendering issues with custom fonts
- [ ] Touch events register accurately

### 4.3 LINE WebView Specifics
- [ ] LIFF SDK initializes without errors
- [ ] User profile data loads correctly
- [ ] LINE login flow works seamlessly
- [ ] Share functionality works (if implemented)
- [ ] Close window function works correctly

---

## 5. LIFF API Testing

### 5.1 LIFF Initialization
- [ ] `liff.init()` completes successfully
- [ ] LIFF ID is correctly configured
- [ ] Error handling works for init failures
- [ ] Environment detection (web vs LINE client) works

### 5.2 Authentication Flow
- [ ] `liff.isLoggedIn()` returns correct status
- [ ] `liff.login()` redirects to LINE login
- [ ] Login callback returns to correct URL
- [ ] `liff.logout()` clears session correctly
- [ ] Token refresh works automatically

### 5.3 User Profile
- [ ] `liff.getProfile()` returns user data
- [ ] Display name is shown correctly
- [ ] Profile picture loads (if available)
- [ ] User ID is accessible for registration
- [ ] Error handling for profile fetch failures

### 5.4 Context Information
- [ ] `liff.getContext()` returns correct data
- [ ] View type (compact/tall/full) is detected
- [ ] Chat context (1-on-1/group/room) is correct
- [ ] External browser detection works

### 5.5 Device Information
- [ ] `liff.getOS()` returns correct OS (ios/android/web)
- [ ] `liff.getVersion()` returns LIFF SDK version
- [ ] `liff.getLanguage()` returns user language
- [ ] `liff.isInClient()` works correctly

---

## 6. Performance Monitoring Testing

### 6.1 Performance Overlay (Development)
- [ ] Performance overlay displays in development mode
- [ ] Load time metric is shown and accurate
- [ ] FCP (First Contentful Paint) is tracked
- [ ] LCP (Largest Contentful Paint) is tracked
- [ ] FID (First Input Delay) is tracked
- [ ] CLS (Cumulative Layout Shift) is tracked
- [ ] Memory usage is displayed
- [ ] WebView type is correctly identified

### 6.2 Performance Thresholds
- [ ] Load time is under 3000ms
- [ ] FCP is under 1800ms
- [ ] LCP is under 2500ms
- [ ] FID is under 100ms
- [ ] CLS is under 0.1
- [ ] Metrics are color-coded (green/red) correctly

---

## 7. Error Handling Testing

### 7.1 Network Errors
- [ ] App handles offline state gracefully
- [ ] Connection timeout shows appropriate message
- [ ] Failed API calls display error messages
- [ ] Retry mechanism works for failed requests
- [ ] User can recover from network errors

### 7.2 LIFF Errors
- [ ] Invalid LIFF ID shows error message
- [ ] LIFF init failure is handled gracefully
- [ ] Login failures show helpful messages
- [ ] Profile fetch errors are handled
- [ ] API not available errors are caught

### 7.3 WebView Errors
- [ ] JavaScript errors don't crash the app
- [ ] Console errors are tracked (development)
- [ ] Unhandled promise rejections are caught
- [ ] Cross-origin errors are handled
- [ ] Resource loading errors are managed

---

## 8. Accessibility Testing

### 8.1 Touch Targets
- [ ] All buttons are at least 44×44 pixels
- [ ] Touch targets have adequate spacing (8px minimum)
- [ ] No overlapping touch areas
- [ ] Interactive elements are easily tappable

### 8.2 Text Readability
- [ ] Font size is at least 16px for body text
- [ ] Color contrast ratio meets WCAG 2.1 AA (4.5:1)
- [ ] Text is legible in bright sunlight (if testable)
- [ ] No tiny text that requires zooming

### 8.3 Visual Feedback
- [ ] Buttons show active/pressed state
- [ ] Loading states are indicated
- [ ] Success/error states are clear
- [ ] Focus indicators are visible

---

## 9. Calculator-Specific Testing (App Features)

### 9.1 Product Display
- [ ] Product images load correctly
- [ ] Product names display without truncation
- [ ] Prices are formatted correctly (Thai Baht)
- [ ] Available vs reference products are distinguished
- [ ] Product grid layout works on all screen sizes

### 9.2 Price Calculation
- [ ] Quantity input works correctly (1-4, 5-9, 10+)
- [ ] Tier pricing applies automatically
- [ ] Total price updates in real-time
- [ ] Multiple products can be added to cart
- [ ] Cart total is calculated correctly

### 9.3 Member-Only Features
- [ ] Non-members are blocked from calculator
- [ ] Member status is verified on load
- [ ] Authentication guard redirects correctly
- [ ] Member benefits are displayed

---

## 10. Security Testing

### 10.1 Authentication Security
- [ ] Sessions expire appropriately
- [ ] Tokens are stored securely
- [ ] No sensitive data in URL parameters
- [ ] HTTPS is enforced
- [ ] CSRF protection is implemented

### 10.2 Data Privacy
- [ ] User data is not logged to console (production)
- [ ] Profile data is handled securely
- [ ] No PII in error messages
- [ ] Analytics respects privacy settings

---

## 11. Cross-Browser Testing (External Browser)

### 11.1 Safari (iOS)
- [ ] App works in Safari browser
- [ ] External login flow works
- [ ] All features functional outside LINE

### 11.2 Chrome (Android)
- [ ] App works in Chrome browser
- [ ] External login flow works
- [ ] All features functional outside LINE

---

## 12. Regression Testing

### 12.1 After Updates
- [ ] Existing features still work after code changes
- [ ] No new console errors introduced
- [ ] Performance hasn't degraded
- [ ] Build and lint pass with zero errors

### 12.2 After LIFF SDK Updates
- [ ] App initializes with new SDK version
- [ ] All API calls work correctly
- [ ] No breaking changes impact functionality
- [ ] Performance is maintained or improved

---

## Test Results Summary

### Test Execution Date: ________________

### Tester Name: ________________

### Device Used: ________________

### Results:
- Total Tests: _____ 
- Passed: _____ 
- Failed: _____ 
- Blocked: _____ 
- Not Applicable: _____

### Critical Issues Found:
1. ________________________________________________
2. ________________________________________________
3. ________________________________________________

### Notes:
________________________________________________________
________________________________________________________
________________________________________________________

---

## Sign-Off

### Tester Signature: ________________  Date: ________

### Reviewer Signature: ________________  Date: ________

---

**Version**: 1.0  
**Last Updated**: 2025-10-23  
**Maintained by**: Development Team
