'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Member {
  id: string
  line_user_id: string
  display_name: string
  picture_url?: string
  registration_date: string
  created_at: string
  updated_at: string
}

export const memberService = {
  async getMemberByLineUserId(lineUserId: string): Promise<Member | null> {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('line_user_id', lineUserId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching member:', error)
      return null
    }
  },

  async createMember(lineUserId: string, displayName: string, pictureUrl?: string): Promise<Member | null> {
    try {
      const { data, error } = await supabase
        .from('members')
        .insert({
          line_user_id: lineUserId,
          display_name: displayName,
          picture_url: pictureUrl,
          registration_date: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error creating member:', error)
      return null
    }
  },

  async upsertMember(lineUserId: string, displayName: string, pictureUrl?: string): Promise<Member | null> {
    try {
      const { data, error } = await supabase
        .from('members')
        .upsert(
          {
            line_user_id: lineUserId,
            display_name: displayName,
            picture_url: pictureUrl,
            registration_date: new Date().toISOString(),
          },
          {
            onConflict: 'line_user_id',
          }
        )
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error upserting member:', error)
      return null
    }
  },
}
