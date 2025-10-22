'use client'

import React from 'react'
import { ErrorDisplay } from '@/components/ui/error-display'
import { logError } from './supabase-error'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, 'ErrorBoundary')
    this.setState({ error, errorInfo })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <ErrorDisplay
            title="เกิดข้อผิดพลาด"
            message="เรากำลังพยายามแก้ไขปัญหานี้"
            error={this.state.error}
            onRetry={() => window.location.reload()}
            showDetails={process.env.NODE_ENV === 'development'}
          />
        </div>
      )
    }

    return this.props.children
  }
}

// Async Error Boundary for handling async errors
export function AsyncErrorBoundary({ children, fallback }: Props) {
  return (
    <ErrorBoundary
      fallback={fallback}
      onError={(_error, _errorInfo) => {
        // Send error to monitoring service in production
        if (process.env.NODE_ENV === 'production') {
          // Example: sendToErrorService(error, errorInfo)
        }
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
