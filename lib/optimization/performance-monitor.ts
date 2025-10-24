/**
 * Performance Monitor for LINE WebView
 * Tracks and reports performance metrics
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte

  // Custom metrics
  loadTime?: number
  domReady?: number
  resourcesLoaded?: number
  memoryUsage?: number
  
  // Timestamps
  timestamp: number
}

export interface PerformanceThresholds {
  loadTime: number // Target: 3000ms
  fcp: number // Target: 1800ms
  lcp: number // Target: 2500ms
  fid: number // Target: 100ms
  cls: number // Target: 0.1
}

// Default performance thresholds based on LINE requirements
export const defaultThresholds: PerformanceThresholds = {
  loadTime: 3000, // 3 seconds as per requirements
  fcp: 1800,
  lcp: 2500,
  fid: 100,
  cls: 0.1,
}

let performanceData: PerformanceMetrics[] = []
let monitoringEnabled = false

/**
 * Initialize performance monitoring
 */
export const initializePerformanceMonitor = (): void => {
  if (typeof window === 'undefined' || monitoringEnabled) {
    return
  }

  monitoringEnabled = true

  // Monitor page load
  if (window.performance) {
    window.addEventListener('load', () => {
      collectPerformanceMetrics()
    })
  }

  // Monitor Web Vitals using PerformanceObserver
  try {
    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcpEntry = entries.find(
        (entry) => entry.name === 'first-contentful-paint'
      )
      if (fcpEntry) {
        updateMetric('fcp', fcpEntry.startTime)
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        updateMetric('lcp', lastEntry.startTime)
      }
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming
          const fid = fidEntry.processingStart - fidEntry.startTime
          updateMetric('fid', fid)
        }
      })
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === 'layout-shift') {
          // Type assertion for layout shift entry
          const layoutShiftEntry = entry as PerformanceEntry & {
            hadRecentInput: boolean
            value: number
          }
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value
            updateMetric('cls', clsValue)
          }
        }
      })
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
  } catch (error) {
    // PerformanceObserver not supported
    console.warn('[Performance Monitor] PerformanceObserver not supported:', error)
  }
}

/**
 * Collect performance metrics from Navigation Timing API
 */
export const collectPerformanceMetrics = (): PerformanceMetrics => {
  const metrics: PerformanceMetrics = {
    timestamp: Date.now(),
  }

  if (typeof window === 'undefined' || !window.performance) {
    return metrics
  }

  const navigation = window.performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming

  if (navigation) {
    // Calculate load time
    metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart
    metrics.domReady = navigation.domContentLoadedEventEnd - navigation.fetchStart
    metrics.ttfb = navigation.responseStart - navigation.requestStart
  }

  // Get memory usage if available
  if ('memory' in window.performance) {
    const memory = (window.performance as Performance & {
      memory?: { usedJSHeapSize: number }
    }).memory
    metrics.memoryUsage = memory?.usedJSHeapSize
  }

  // Store metrics
  performanceData.push(metrics)

  return metrics
}

/**
 * Update specific metric
 */
const updateMetric = (
  key: keyof PerformanceMetrics,
  value: number
): void => {
  if (performanceData.length === 0) {
    performanceData.push({
      timestamp: Date.now(),
      [key]: value,
    })
  } else {
    const latest = performanceData[performanceData.length - 1]
    latest[key] = value
  }
}

/**
 * Get current performance metrics
 */
export const getCurrentMetrics = (): PerformanceMetrics | null => {
  if (performanceData.length === 0) {
    return null
  }
  return performanceData[performanceData.length - 1]
}

/**
 * Get all performance metrics
 */
export const getAllMetrics = (): PerformanceMetrics[] => {
  return [...performanceData]
}

/**
 * Check if metrics meet thresholds
 */
export const checkPerformanceThresholds = (
  metrics: PerformanceMetrics,
  thresholds: PerformanceThresholds = defaultThresholds
): { passed: boolean; failures: string[] } => {
  const failures: string[] = []

  if (metrics.loadTime && metrics.loadTime > thresholds.loadTime) {
    failures.push(`Load time: ${metrics.loadTime.toFixed(0)}ms (threshold: ${thresholds.loadTime}ms)`)
  }

  if (metrics.fcp && metrics.fcp > thresholds.fcp) {
    failures.push(`FCP: ${metrics.fcp.toFixed(0)}ms (threshold: ${thresholds.fcp}ms)`)
  }

  if (metrics.lcp && metrics.lcp > thresholds.lcp) {
    failures.push(`LCP: ${metrics.lcp.toFixed(0)}ms (threshold: ${thresholds.lcp}ms)`)
  }

  if (metrics.fid && metrics.fid > thresholds.fid) {
    failures.push(`FID: ${metrics.fid.toFixed(0)}ms (threshold: ${thresholds.fid}ms)`)
  }

  if (metrics.cls && metrics.cls > thresholds.cls) {
    failures.push(`CLS: ${metrics.cls.toFixed(3)} (threshold: ${thresholds.cls})`)
  }

  return {
    passed: failures.length === 0,
    failures,
  }
}

/**
 * Get performance report
 */
export const getPerformanceReport = (): {
  metrics: PerformanceMetrics | null
  thresholds: PerformanceThresholds
  status: { passed: boolean; failures: string[] }
} => {
  const metrics = getCurrentMetrics()
  const status = metrics
    ? checkPerformanceThresholds(metrics)
    : { passed: false, failures: ['No metrics available'] }

  return {
    metrics,
    thresholds: defaultThresholds,
    status,
  }
}

/**
 * Clear performance data
 */
export const clearPerformanceData = (): void => {
  performanceData = []
}

/**
 * Performance monitor utilities
 */
export const performanceMonitor = {
  initialize: initializePerformanceMonitor,
  collect: collectPerformanceMetrics,
  getCurrent: getCurrentMetrics,
  getAll: getAllMetrics,
  check: checkPerformanceThresholds,
  getReport: getPerformanceReport,
  clear: clearPerformanceData,
}
