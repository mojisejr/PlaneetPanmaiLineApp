import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service-role'
import { handleSupabaseError } from '@/lib/errors/supabase-error'
import { z } from 'zod'

/**
 * Auto-registration API route for LINE LIFF users
 *
 * This endpoint creates new members using service role privileges to bypass RLS policies.
 * It's designed to be called from client-side code after LINE authentication succeeds.
 *
 * Security Note: This endpoint only creates members, never updates existing ones.
 * All validation and error handling is performed server-side.
 */

// Input validation schema
const AutoRegisterSchema = z.object({
  lineUserId: z.string().min(1, 'LINE User ID is required'),
  displayName: z.string().min(1, 'Display name is required'),
  pictureUrl: z.string().url().optional(),
})

/**
 * POST /api/auth/auto-register
 * Auto-register a new LINE user as a member
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validationResult = AutoRegisterSchema.safeParse(body)

    if (!validationResult.success) {
      console.error('[API] Auto-registration validation failed:', validationResult.error)
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { lineUserId, displayName, pictureUrl } = validationResult.data

    console.log(`[API] Auto-registering user: ${lineUserId} (${displayName})`)

    // Check if member already exists to prevent duplicates
    const { data: existingMember } = await supabaseService
      .from('members')
      .select('id')
      .eq('line_user_id', lineUserId)
      .single()

    if (existingMember) {
      console.log(`[API] Member already exists: ${lineUserId}`)
      return NextResponse.json(
        {
          success: false,
          message: 'Member already exists',
          member: existingMember
        },
        { status: 409 } // Conflict
      )
    }

    // Create new member using service role to bypass RLS
    const memberData = {
      line_user_id: lineUserId,
      display_name: displayName,
      picture_url: pictureUrl || null,
      registration_date: new Date().toISOString(),
      is_active: true,
    }

    const { data, error } = await supabaseService
      .from('members')
      .insert(memberData)
      .select()
      .single()

    if (error) {
      console.error('[API] Failed to create member:', error)
      handleSupabaseError(error, 'autoRegister', 'Failed to auto-register member')

      return NextResponse.json(
        { error: 'Failed to create member' },
        { status: 500 }
      )
    }

    console.log(`[API] Successfully created member: ${lineUserId} -> ${data.id}`)

    return NextResponse.json(
      {
        success: true,
        member: data,
        action: 'created'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('[API] POST /api/auth/auto-register error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/auto-register
 * Check if a user is already registered
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lineUserId = searchParams.get('lineUserId')

    if (!lineUserId) {
      return NextResponse.json(
        { error: 'lineUserId query parameter is required' },
        { status: 400 }
      )
    }

    // Check if member exists using service role for accurate results
    const { data, error } = await supabaseService
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

      console.error('[API] Failed to check member existence:', error)
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
    console.error('[API] GET /api/auth/auto-register error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}