import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { LiffProfile } from '@/types/liff'

/**
 * GET /api/auth/profile
 * Check if a member exists in the database by LINE User ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lineUserId = searchParams.get('lineUserId')

    if (!lineUserId) {
      return NextResponse.json(
        { error: 'lineUserId is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if member exists
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('line_user_id', lineUserId)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - member not found
        return NextResponse.json(
          { exists: false, member: null },
          { status: 200 }
        )
      }

      console.error('[API] Failed to check member:', error)
      return NextResponse.json(
        { error: 'Failed to check member existence' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { exists: true, member: data },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] GET /api/auth/profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/auth/profile
 * Create or update a member in the database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const profile = body as LiffProfile
    if (!profile.userId || !profile.displayName) {
      return NextResponse.json(
        { error: 'userId and displayName are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if member already exists
    const { data: existingMember } = await supabase
      .from('members')
      .select('*')
      .eq('line_user_id', profile.userId)
      .single()

    if (existingMember) {
      // Update existing member
      const { data, error } = await supabase
        .from('members')
        .update({
          display_name: profile.displayName,
          updated_at: new Date().toISOString(),
        })
        .eq('line_user_id', profile.userId)
        .select()
        .single()

      if (error) {
        console.error('[API] Failed to update member:', error)
        return NextResponse.json(
          { error: 'Failed to update member' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: true, member: data, action: 'updated' },
        { status: 200 }
      )
    } else {
      // Create new member
      const { data, error } = await supabase
        .from('members')
        .insert({
          line_user_id: profile.userId,
          display_name: profile.displayName,
          registration_date: new Date().toISOString(),
          is_active: true,
        })
        .select()
        .single()

      if (error) {
        console.error('[API] Failed to create member:', error)
        return NextResponse.json(
          { error: 'Failed to create member' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: true, member: data, action: 'created' },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('[API] POST /api/auth/profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
