import { createClient } from './server'

export async function checkDatabaseHealth() {
  try {
    const supabase = await createClient()

    // Simple health check - test connection
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .limit(1)

    if (error) {
      return {
        status: 'error',
        message: `Database connection failed: ${error.message}`,
        timestamp: new Date().toISOString()
      }
    }

    return {
      status: 'healthy',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      tablesFound: data?.length || 0
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    }
  }
}

export async function validateEnvironment() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_PROJECT_ID'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    return {
      status: 'error',
      message: `Missing environment variables: ${missing.join(', ')}`,
      missing,
      timestamp: new Date().toISOString()
    }
  }

  return {
    status: 'valid',
    message: 'All required environment variables present',
    timestamp: new Date().toISOString()
  }
}
