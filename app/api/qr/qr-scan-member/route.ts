import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseService } from '@/lib/supabase/service-role'
import { handleSupabaseError } from '@/lib/errors/supabase-error'
import { z } from 'zod'

/**
 * QR Scan Member Registration API Route
 *
 * This endpoint provides a dedicated registration route for QR code scans.
 * It handles auto-registration for new LINE users and validates existing members.
 * This isolates registration logic from component mounting race conditions.
 *
 * Security Features:
 * - Input validation with Zod schemas
 * - Service role for bypassing RLS during registration
 * - Comprehensive error handling
 * - Request deduplication tracking
 */

// Input validation schema for QR registration
const QRRegisterSchema = z.object({
  lineUserId: z.string().min(1, 'LINE User ID is required'),
  displayName: z.string().min(1, 'Display name is required'),
  pictureUrl: z.string().url().optional(),
})

// Request deduplication tracking (in-memory for this request)
const ongoingRegistrations = new Map<string, Promise<any>>()

/**
 * POST /api/qr/qr-scan-member
 * Auto-register a new LINE user from QR code scan
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validationResult = QRRegisterSchema.safeParse(body)

    if (!validationResult.success) {
      console.error('[QR Registration API] Validation failed:', validationResult.error)
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { lineUserId, displayName, pictureUrl } = validationResult.data

    console.log(`[QR Registration API] Processing QR registration for user: ${lineUserId} (${displayName})`)

    // Request deduplication - prevent concurrent registrations for same user
    if (ongoingRegistrations.has(lineUserId)) {
      console.log(`[QR Registration API] Registration already in progress for: ${lineUserId}`)
      return NextResponse.json(
        {
          success: false,
          message: 'Registration already in progress',
          retryAfter: 2000
        },
        { status: 429 }
      )
    }

    // Create registration promise and track it
    const registrationPromise = performRegistration(lineUserId, displayName, pictureUrl)
    ongoingRegistrations.set(lineUserId, registrationPromise)

    try {
      const result = await registrationPromise

      // Clean up tracking after completion
      ongoingRegistrations.delete(lineUserId)

      return NextResponse.json(result, { status: result.action === 'created' ? 201 : 200 })

    } catch (error) {
      // Clean up tracking on error
      ongoingRegistrations.delete(lineUserId)
      throw error
    }

  } catch (error) {
    console.error('[QR Registration API] POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/qr/qr-scan-member
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

    console.log(`[QR Registration API] Checking registration status for: ${lineUserId}`)

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
          {
            exists: false,
            member: null,
            needsRegistration: true
          },
          { status: 200 }
        )
      }

      console.error('[QR Registration API] Failed to check member existence:', error)
      return NextResponse.json(
        { error: 'Failed to check member existence' },
        { status: 500 }
      )
    }

    console.log(`[QR Registration API] Member found: ${lineUserId} -> ${data.id}`)

    return NextResponse.json(
      {
        exists: true,
        member: data,
        needsRegistration: false
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('[QR Registration API] GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Perform the actual registration logic
 * This function is isolated to maintain clean error handling and deduplication
 */
async function performRegistration(
  lineUserId: string,
  displayName: string,
  pictureUrl?: string
): Promise<any> {
  try {
    // Check if member already exists to prevent duplicates
    const { data: existingMember } = await supabaseService
      .from('members')
      .select('id')
      .eq('line_user_id', lineUserId)
      .single()

    if (existingMember) {
      console.log(`[QR Registration API] Member already exists: ${lineUserId}`)

      // Get full member data
      const { data: fullMemberData } = await supabaseService
        .from('members')
        .select('*')
        .eq('line_user_id', lineUserId)
        .single()

      return {
        success: true,
        member: fullMemberData,
        action: 'already_exists',
        message: 'Member already registered'
      }
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
      console.error('[QR Registration API] Failed to create member:', error)
      handleSupabaseError(error, 'qrRegister', 'Failed to register member')
      throw new Error('Failed to create member')
    }

    console.log(`[QR Registration API] Successfully created member: ${lineUserId} -> ${data.id}`)

    return {
      success: true,
      member: data,
      action: 'created',
      message: 'Member successfully registered'
    }

  } catch (error) {
    console.error('[QR Registration API] Registration failed:', error)
    throw error
  }
}