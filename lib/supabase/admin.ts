import { createClient } from '@supabase/supabase-js'

/**
 * Create an admin Supabase client with service_role key
 * This client bypasses Row Level Security (RLS) policies
 * 
 * SECURITY WARNING: This client has full database access.
 * Only use server-side in API routes. Never expose to the browser.
 * 
 * @returns Supabase client with admin privileges
 * @throws Error if required environment variables are missing
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error(
      'Missing Supabase URL. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL environment variable.'
    )
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase service role key. Please set SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
      'This key should only be set on the server (e.g., in Vercel environment variables) and never committed to the repository.'
    )
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
