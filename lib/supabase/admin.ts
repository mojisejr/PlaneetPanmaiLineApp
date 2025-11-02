import { createClient } from '@supabase/supabase-js'

/**
 * Create Supabase Admin Client
 * Uses service_role key to bypass RLS for administrative operations
 * 
 * ⚠️ WARNING: This client has full database access and bypasses RLS.
 * Only use in server-side API routes, never expose to client-side code.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for admin client')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
