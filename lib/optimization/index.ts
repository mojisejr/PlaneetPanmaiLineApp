/**
 * Optimization Module
 * Exports all LINE WebView optimization utilities
 */

// Viewport configuration
export {
  type ViewportConfig,
  type ScreenSize,
  getViewportConfig,
  getScreenSize,
  applyViewportConfig,
  initializeViewport,
  handleViewportResize,
  viewportUtils,
} from './viewport-config'

// Performance monitoring
export {
  type PerformanceMetrics,
  type PerformanceThresholds,
  defaultThresholds,
  initializePerformanceMonitor,
  collectPerformanceMetrics,
  getCurrentMetrics,
  getAllMetrics,
  checkPerformanceThresholds,
  getPerformanceReport,
  clearPerformanceData,
  performanceMonitor,
} from './performance-monitor'

// WebView utilities
export {
  type WebViewInfo,
  isWebView,
  isLineWebView,
  getWebViewInfo,
  fixIosScrollIssues,
  fixAndroidTouchIssues,
  disablePullToRefresh,
  fixViewportHeight,
  preventZoomOnInputFocus,
  enableSafeAreaInsets,
  initializeWebViewFixes,
  webViewUtils,
} from './webview-utils'
