'use client';

/**
 * Performance Overlay Component
 * Development tool for monitoring performance in real-time
 */

import { useEffect, useState } from 'react';
import {
  getPerformanceMonitor,
  PerformanceMetrics,
  initializePerformanceMonitor,
} from '@/lib/optimization/performance-monitor';
import { getWebViewInfo } from '@/lib/optimization/webview-utils';

interface PerformanceOverlayProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function PerformanceOverlay({
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
}: PerformanceOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [score, setScore] = useState(0);
  const [webViewInfo, setWebViewInfo] = useState<any>(null);

  useEffect(() => {
    if (!enabled) return;

    // Initialize performance monitor
    initializePerformanceMonitor();

    // Get WebView info
    setWebViewInfo(getWebViewInfo());

    // Update metrics every second
    const interval = setInterval(() => {
      const monitor = getPerformanceMonitor();
      if (monitor) {
        setMetrics(monitor.getMetrics());
        setScore(monitor.getScore());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatMs = (ms: number | undefined) => {
    if (ms === undefined) return 'N/A';
    return `${Math.round(ms)}ms`;
  };

  const formatMB = (mb: number | undefined) => {
    if (mb === undefined) return 'N/A';
    return `${mb.toFixed(2)}MB`;
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed ${positionClasses[position]} z-[9998] bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-mono shadow-lg hover:bg-black/90 transition-colors`}
        aria-label="Toggle performance overlay"
      >
        {isVisible ? '📊 Hide' : '📊 Show'}
      </button>

      {/* Performance Overlay */}
      {isVisible && (
        <div
          className={`fixed ${
            position.includes('top') ? 'top-14' : 'bottom-14'
          } ${
            position.includes('left') ? 'left-4' : 'right-4'
          } z-[9999] bg-black/95 text-white p-4 rounded-lg shadow-2xl max-w-sm text-xs font-mono`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
            <h3 className="font-bold text-sm">Performance Monitor</h3>
            <span className={`font-bold text-lg ${getScoreColor(score)}`}>
              {score}%
            </span>
          </div>

          {/* Core Web Vitals */}
          <div className="space-y-2 mb-3">
            <h4 className="font-semibold text-yellow-400">Core Web Vitals</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-gray-400">FCP</div>
                <div className="font-semibold">
                  {formatMs(metrics.firstContentfulPaint)}
                </div>
              </div>
              <div>
                <div className="text-gray-400">LCP</div>
                <div className="font-semibold">
                  {formatMs(metrics.largestContentfulPaint)}
                </div>
              </div>
              <div>
                <div className="text-gray-400">FID</div>
                <div className="font-semibold">
                  {formatMs(metrics.firstInputDelay)}
                </div>
              </div>
              <div>
                <div className="text-gray-400">CLS</div>
                <div className="font-semibold">
                  {metrics.cumulativeLayoutShift?.toFixed(3) ?? 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Load Metrics */}
          <div className="space-y-2 mb-3">
            <h4 className="font-semibold text-blue-400">Load Metrics</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Load Time:</span>
                <span className="font-semibold">
                  {formatMs(metrics.loadTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">DOM Ready:</span>
                <span className="font-semibold">
                  {formatMs(metrics.domContentLoaded)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">First Paint:</span>
                <span className="font-semibold">
                  {formatMs(metrics.firstPaint)}
                </span>
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          {metrics.memoryUsage !== undefined && (
            <div className="space-y-2 mb-3">
              <h4 className="font-semibold text-purple-400">Memory</h4>
              <div className="flex justify-between">
                <span className="text-gray-400">JS Heap:</span>
                <span className="font-semibold">
                  {formatMB(metrics.memoryUsage)}
                </span>
              </div>
            </div>
          )}

          {/* WebView Info */}
          {webViewInfo && (
            <div className="space-y-2 pt-2 border-t border-gray-700">
              <h4 className="font-semibold text-green-400">WebView Info</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">LINE:</span>
                  <span>{webViewInfo.isLINE ? '✅' : '❌'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform:</span>
                  <span>
                    {webViewInfo.isIOS
                      ? 'iOS'
                      : webViewInfo.isAndroid
                      ? 'Android'
                      : 'Other'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Viewport:</span>
                  <span>
                    {webViewInfo.viewportWidth}x{webViewInfo.viewportHeight}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pixel Ratio:</span>
                  <span>{webViewInfo.pixelRatio}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network:</span>
                  <span>{webViewInfo.online ? '✅ Online' : '❌ Offline'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-3 pt-2 border-t border-gray-700 text-xs text-gray-400">
            <div>FCP: First Contentful Paint</div>
            <div>LCP: Largest Contentful Paint</div>
            <div>FID: First Input Delay</div>
            <div>CLS: Cumulative Layout Shift</div>
          </div>
        </div>
      )}
    </>
  );
}
