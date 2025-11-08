/**
 * Supabase Service Role Client
 *
 * Bypasses RLS policies for server-side operations requiring elevated privileges.
 * Use ONLY for specific backend operations that cannot be performed with user permissions.
 *
 * 🚨 SECURITY WARNING:
 * - Service role key has full database access
 - Bypasses ALL RLS policies
 - NEVER expose to client-side code
 - Use sparingly and only when absolutely necessary
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

/**
 * Service role Supabase client for backend operations
 * Bypasses RLS policies - use with extreme caution
 */
export const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})