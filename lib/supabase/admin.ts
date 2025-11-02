import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Create an admin Supabase client with service role key
 * This client bypasses Row Level Security (RLS) policies
 * 
 * ⚠️ SECURITY WARNING:
 * - Only use this on the server side (API routes, server components)
 * - Never expose the service role key to the client
 * - This client has full database access - use with caution
 * 
 * @throws Error if SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set
 * @returns Supabase client with admin privileges
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error(
      'SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is required for admin client. ' +
      'Please set this in your environment variables.'
    )
  }

  if (!supabaseServiceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for admin client. ' +
      'Please set this in your server-side environment variables (Vercel Project Settings). ' +
      'Never commit this key to source control.'
    )
  }

  // Create client with service role key to bypass RLS
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
