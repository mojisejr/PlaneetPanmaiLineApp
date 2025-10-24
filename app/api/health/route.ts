import { NextResponse } from 'next/server'
import { checkDatabaseHealth, validateEnvironment } from '@/lib/supabase/health-check'

export async function GET() {
  const envCheck = await validateEnvironment()
  const dbHealth = await checkDatabaseHealth()

  return NextResponse.json({
    status: envCheck.status === 'valid' && dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    environment: envCheck,
    database: dbHealth
  })
}
