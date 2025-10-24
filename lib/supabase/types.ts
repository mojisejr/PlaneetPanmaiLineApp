// Basic types for Supabase client integration
// This file will be extended with database schema types when tables are created

export interface SupabaseHealthCheck {
  status: 'healthy' | 'error'
  message: string
  timestamp: string
  tablesFound?: number
}

export interface EnvironmentValidation {
  status: 'valid' | 'error'
  message: string
  timestamp: string
  missing?: string[]
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  environment: EnvironmentValidation
  database: SupabaseHealthCheck
}
