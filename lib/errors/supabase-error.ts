import { PostgrestError } from '@supabase/supabase-js'

export class SupabaseError extends Error {
  constructor(
    message: string,
    public error?: PostgrestError,
    public context?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'SupabaseError'

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SupabaseError)
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      context: this.context,
      statusCode: this.statusCode,
      supabaseError: this.error ? {
        message: this.error.message,
        code: this.error.code,
        details: this.error.details,
        hint: this.error.hint
      } : null
    }
  }
}

export class DatabaseConnectionError extends SupabaseError {
  constructor(message: string = 'Database connection failed') {
    super(message, undefined, 'database-connection', 500)
    this.name = 'DatabaseConnectionError'
  }
}

export class AuthenticationError extends SupabaseError {
  constructor(message: string = 'Authentication required', error?: PostgrestError, context?: string) {
    super(message, error, context || 'authentication', 401)
    this.name = 'AuthenticationError'
  }
}

export class PermissionError extends SupabaseError {
  constructor(message: string = 'Permission denied', error?: PostgrestError, context?: string) {
    super(message, error, context || 'permission', 403)
    this.name = 'PermissionError'
  }
}

export class ValidationError extends SupabaseError {
  constructor(message: string, error?: PostgrestError, context?: string, statusCode?: number) {
    super(message, error, context || 'validation', statusCode || 400)
    this.name = 'ValidationError'
  }
}

export const handleSupabaseError = (
  error: PostgrestError | null,
  context: string,
  fallbackMessage?: string
): never => {
  if (!error) {
    throw new SupabaseError(fallbackMessage || 'Unknown error occurred', undefined, context)
  }

  console.error(`Supabase Error in ${context}:`, error)

  // Handle specific error codes
  switch (error.code) {
    case 'PGRST116':
      throw new SupabaseError('Resource not found', error, context, 404)

    case 'PGRST301':
    case 'PJWT001':
      throw new AuthenticationError('Authentication required', error, context)

    case '42501':
    case 'PGRST301':
      throw new PermissionError('Permission denied', error, context)

    case '23505':
      throw new ValidationError('Resource already exists', error, context, 409)

    case '23502':
      throw new ValidationError('Required field missing', error, context, 400)

    case '23514':
      throw new ValidationError('Invalid data provided', error, context, 400)

    default:
      throw new SupabaseError(
        error.message || fallbackMessage || 'Database operation failed',
        error,
        context
      )
  }
}

export const logError = (error: Error, context?: string) => {
  console.error(`[${new Date().toISOString()}] ${context ? `${context}: ` : ''}${error.name}: ${error.message}`)

  if (error instanceof SupabaseError) {
    console.error('Supabase Error Details:', error.toJSON())
  } else {
    console.error('Stack Trace:', error.stack)
  }
}
