'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw, Bug } from 'lucide-react'

interface ErrorDisplayProps {
  title?: string
  message?: string
  error?: Error | null
  onRetry?: () => void
  showDetails?: boolean
  className?: string
}

export function ErrorDisplay({
  title = 'เกิดข้อผิดพลาด',
  message = 'กรุณาลองใหม่อีกครั้ง',
  error,
  onRetry,
  showDetails = false,
  className = ''
}: ErrorDisplayProps) {
  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {onRetry && (
          <Button onClick={onRetry} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            ลองใหม่
          </Button>
        )}

        {showDetails && error && (
          <details className="mt-4 rounded-lg border bg-muted p-4">
            <summary className="cursor-pointer font-mono text-sm font-medium flex items-center">
              <Bug className="mr-2 h-4 w-4" />
              ข้อมูลข้อผิดพลาด (สำหรับนักพัฒนา)
            </summary>
            <div className="mt-2 space-y-2">
              <div>
                <strong>ประเภท:</strong> {error.name}
              </div>
              <div>
                <strong>ข้อความ:</strong> {error.message}
              </div>
              {error.stack && (
                <div>
                  <strong>Stack Trace:</strong>
                  <pre className="mt-1 text-xs overflow-auto bg-background p-2 rounded">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  )
}
