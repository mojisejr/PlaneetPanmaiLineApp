'use client'

import { useEffect, useState } from 'react'
import {
  type PerformanceMetrics,
  defaultThresholds,
  performanceMonitor,
} from '@/lib/optimization/performance-monitor'
import { webViewUtils } from '@/lib/optimization/webview-utils'
import { getScreenSize } from '@/lib/optimization/viewport-config'

/**
 * Performance Overlay Component
 * Development tool for monitoring performance metrics in real-time
 * Should only be rendered in development environment
 */

interface PerformanceOverlayProps {
  enabled?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export function PerformanceOverlay({
  enabled = true,
  position = 'bottom-right',
}: PerformanceOverlayProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(enabled)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return
    }

    // Collect metrics every 2 seconds
    const interval = setInterval(() => {
      const currentMetrics = performanceMonitor.getCurrent()
      if (currentMetrics) {
        setMetrics(currentMetrics)
      }
    }, 2000)

    // Initial collection
    performanceMonitor.collect()

    return () => clearInterval(interval)
  }, [enabled])

  if (!isVisible || !metrics) {
    return null
  }

  const positionStyles = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }

  const formatTime = (ms?: number) => {
    if (ms === undefined) return 'N/A'
    return `${ms.toFixed(0)}ms`
  }

  const formatMemory = (bytes?: number) => {
    if (bytes === undefined) return 'N/A'
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`
  }

  const getMetricStatus = (value?: number, threshold?: number) => {
    if (value === undefined || threshold === undefined) return 'text-gray-400'
    return value > threshold ? 'text-red-500' : 'text-green-500'
  }

  const webViewInfo = webViewUtils.getInfo()
  const screenSize = getScreenSize()

  return (
    <div
      className={`fixed ${positionStyles[position]} z-50 bg-black/90 text-white text-xs font-mono rounded-lg shadow-xl border border-gray-700 max-w-xs`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <span className="font-semibold">Performance Monitor</span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:text-blue-400 transition-colors"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="hover:text-red-400 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-3 space-y-3">
          {/* Core Web Vitals */}
          <div>
            <div className="font-semibold mb-1 text-blue-400">Core Web Vitals</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Load Time:</span>
                <span className={getMetricStatus(metrics.loadTime, defaultThresholds.loadTime)}>
                  {formatTime(metrics.loadTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>FCP:</span>
                <span className={getMetricStatus(metrics.fcp, defaultThresholds.fcp)}>
                  {formatTime(metrics.fcp)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>LCP:</span>
                <span className={getMetricStatus(metrics.lcp, defaultThresholds.lcp)}>
                  {formatTime(metrics.lcp)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>FID:</span>
                <span className={getMetricStatus(metrics.fid, defaultThresholds.fid)}>
                  {formatTime(metrics.fid)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>CLS:</span>
                <span className={getMetricStatus(metrics.cls, defaultThresholds.cls)}>
                  {metrics.cls?.toFixed(3) ?? 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div>
            <div className="font-semibold mb-1 text-blue-400">System</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Memory:</span>
                <span>{formatMemory(metrics.memoryUsage)}</span>
              </div>
              <div className="flex justify-between">
                <span>DOM Ready:</span>
                <span>{formatTime(metrics.domReady)}</span>
              </div>
              <div className="flex justify-between">
                <span>TTFB:</span>
                <span>{formatTime(metrics.ttfb)}</span>
              </div>
            </div>
          </div>

          {/* WebView Info */}
          <div>
            <div className="font-semibold mb-1 text-blue-400">WebView</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Type:</span>
                <span>{webViewInfo.isLineWebView ? 'LINE' : webViewInfo.isWebView ? 'WebView' : 'Browser'}</span>
              </div>
              <div className="flex justify-between">
                <span>OS:</span>
                <span className="uppercase">{webViewInfo.os}</span>
              </div>
              {screenSize && (
                <div className="flex justify-between">
                  <span>Screen:</span>
                  <span>{`${screenSize.width}×${screenSize.height}`}</span>
                </div>
              )}
            </div>
          </div>

          {/* Thresholds */}
          <div className="pt-2 border-t border-gray-700 text-xs text-gray-400">
            <div>Target: &lt;{defaultThresholds.loadTime}ms load time</div>
          </div>
        </div>
      )}
    </div>
  )
}
