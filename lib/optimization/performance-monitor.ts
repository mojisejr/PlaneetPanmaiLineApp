/**
 * Performance Monitoring System for LINE WebView
 * Tracks load times, render performance, and user interactions
 */

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  memoryUsage?: number;
}

export interface PerformanceThresholds {
  loadTime: number; // Target: < 3000ms
  firstContentfulPaint: number; // Target: < 1800ms
  largestContentfulPaint: number; // Target: < 2500ms
  timeToInteractive: number; // Target: < 3800ms
  cumulativeLayoutShift: number; // Target: < 0.1
  firstInputDelay: number; // Target: < 100ms
}

export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  loadTime: 3000,
  firstContentfulPaint: 1800,
  largestContentfulPaint: 2500,
  timeToInteractive: 3800,
  cumulativeLayoutShift: 0.1,
  firstInputDelay: 100,
};

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private thresholds: PerformanceThresholds;
  private startTime: number;
  private observers: Map<string, PerformanceObserver> = new Map();

  constructor(thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS) {
    this.thresholds = thresholds;
    this.startTime = performance.now();
    this.initialize();
  }

  private initialize(): void {
    // Measure navigation timing
    this.measureNavigationTiming();

    // Observe paint timing
    this.observePaintTiming();

    // Observe layout shifts
    this.observeLayoutShift();

    // Observe first input delay
    this.observeFirstInput();

    // Observe largest contentful paint
    this.observeLargestContentfulPaint();

    // Monitor memory usage (if available)
    this.monitorMemoryUsage();
  }

  private measureNavigationTiming(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
        this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      } else {
        // Fallback for older browsers
        const timing = performance.timing;
        this.metrics.loadTime = timing.loadEventEnd - timing.fetchStart;
        this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.fetchStart;
      }
    });
  }

  private observePaintTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint') {
            this.metrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });
      this.observers.set('paint', observer);
    } catch (e) {
      console.warn('[Performance] Paint timing observer failed:', e);
    }
  }

  private observeLayoutShift(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
            this.metrics.cumulativeLayoutShift = clsValue;
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('layout-shift', observer);
    } catch (e) {
      console.warn('[Performance] Layout shift observer failed:', e);
    }
  }

  private observeFirstInput(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const firstInput = list.getEntries()[0];
        if (firstInput) {
          this.metrics.firstInputDelay = (firstInput as any).processingStart - firstInput.startTime;
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('first-input', observer);
    } catch (e) {
      console.warn('[Performance] First input observer failed:', e);
    }
  }

  private observeLargestContentfulPaint(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', observer);
    } catch (e) {
      console.warn('[Performance] LCP observer failed:', e);
    }
  }

  private monitorMemoryUsage(): void {
    if (typeof window === 'undefined') return;

    const memory = (performance as any).memory;
    if (memory) {
      this.metrics.memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // MB
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): Partial<PerformanceMetrics> {
    this.monitorMemoryUsage(); // Update memory usage
    return { ...this.metrics };
  }

  /**
   * Check if metrics meet performance thresholds
   */
  checkThresholds(): Record<string, boolean> {
    const results: Record<string, boolean> = {};

    if (this.metrics.loadTime !== undefined) {
      results.loadTime = this.metrics.loadTime <= this.thresholds.loadTime;
    }

    if (this.metrics.firstContentfulPaint !== undefined) {
      results.firstContentfulPaint = this.metrics.firstContentfulPaint <= this.thresholds.firstContentfulPaint;
    }

    if (this.metrics.largestContentfulPaint !== undefined) {
      results.largestContentfulPaint = this.metrics.largestContentfulPaint <= this.thresholds.largestContentfulPaint;
    }

    if (this.metrics.timeToInteractive !== undefined) {
      results.timeToInteractive = this.metrics.timeToInteractive <= this.thresholds.timeToInteractive;
    }

    if (this.metrics.cumulativeLayoutShift !== undefined) {
      results.cumulativeLayoutShift = this.metrics.cumulativeLayoutShift <= this.thresholds.cumulativeLayoutShift;
    }

    if (this.metrics.firstInputDelay !== undefined) {
      results.firstInputDelay = this.metrics.firstInputDelay <= this.thresholds.firstInputDelay;
    }

    return results;
  }

  /**
   * Get performance score (0-100)
   */
  getScore(): number {
    const checks = this.checkThresholds();
    const total = Object.keys(checks).length;
    
    if (total === 0) return 0;
    
    const passed = Object.values(checks).filter(Boolean).length;
    return Math.round((passed / total) * 100);
  }

  /**
   * Mark a custom performance measure
   */
  mark(name: string): void {
    performance.mark(name);
  }

  /**
   * Measure time between two marks
   */
  measure(name: string, startMark: string, endMark: string): number {
    performance.measure(name, startMark, endMark);
    const measures = performance.getEntriesByName(name, 'measure');
    return measures.length > 0 ? measures[measures.length - 1].duration : 0;
  }

  /**
   * Log performance report to console
   */
  logReport(): void {
    const metrics = this.getMetrics();
    const checks = this.checkThresholds();
    const score = this.getScore();

    console.group('🔍 Performance Report');
    console.log('Overall Score:', score);
    console.log('Metrics:', metrics);
    console.log('Threshold Checks:', checks);
    console.groupEnd();
  }

  /**
   * Dispose and cleanup observers
   */
  dispose(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Singleton instance
let monitorInstance: PerformanceMonitor | null = null;

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitor(thresholds?: PerformanceThresholds): PerformanceMonitor {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor(thresholds);
  }
  return monitorInstance;
}

/**
 * Get current performance monitor instance
 */
export function getPerformanceMonitor(): PerformanceMonitor | null {
  return monitorInstance;
}

/**
 * Quick performance check
 */
export function getQuickPerformanceReport(): {
  metrics: Partial<PerformanceMetrics>;
  score: number;
  passed: boolean;
} {
  const monitor = getPerformanceMonitor();
  
  if (!monitor) {
    return {
      metrics: {},
      score: 0,
      passed: false,
    };
  }

  const metrics = monitor.getMetrics();
  const score = monitor.getScore();
  
  return {
    metrics,
    score,
    passed: score >= 70, // 70% threshold
  };
}
