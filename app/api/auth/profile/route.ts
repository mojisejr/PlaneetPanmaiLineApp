import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { LineUserProfile } from '@/types/liff'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lineUserId = searchParams.get('lineUserId')

    if (!lineUserId) {
      return NextResponse.json(
        { error: 'Line User ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if member exists
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('line_user_id', lineUserId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return NextResponse.json({
      exists: !!member,
      member: member || null,
      profile: null // Will be populated by client
    })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile: LineUserProfile = await request.json()
    const supabase = await createClient()

    // Check if member exists
    const { data: existingMember } = await supabase
      .from('members')
      .select('id')
      .eq('line_user_id', profile.userId)
      .single()

    if (!existingMember) {
      // Create new member
      const { data: newMember, error } = await supabase
        .from('members')
        .insert({
          line_user_id: profile.userId,
          display_name: profile.displayName,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({
        success: true,
        member: newMember,
        isNew: true
      })
    }

    // Update existing member
    const { data: updatedMember, error } = await supabase
      .from('members')
      .update({
        display_name: profile.displayName,
        updated_at: new Date().toISOString()
      })
      .eq('line_user_id', profile.userId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      member: updatedMember,
      isNew: false
    })
  } catch (error) {
    console.error('Profile sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync profile' },
      { status: 500 }
    )
  }
}
