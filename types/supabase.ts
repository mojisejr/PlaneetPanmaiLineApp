import { PostgrestError } from '@supabase/supabase-js'

// Extended Supabase error types
export interface SupabaseResponse<T = any> {
  data: T | null
  error: PostgrestError | null
  success: boolean
}

// Database operation result types
export type CreateResult<T> = SupabaseResponse<T>
export type ReadResult<T> = SupabaseResponse<T[]>
export type UpdateResult<T> = SupabaseResponse<T>
export type DeleteResult = SupabaseResponse<void>

// Query options
export interface QueryOptions {
  select?: string
  eq?: Record<string, any>
  order?: {
    column: string
    ascending?: boolean
  }
  limit?: number
  single?: boolean
}

// Authentication result
export interface AuthResult {
  user: any | null
  session: any | null
  error: string | null
}
