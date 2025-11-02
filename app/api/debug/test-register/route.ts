import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * DEBUG ENDPOINT - TEMPORARY
 * 
 * POST /api/debug/test-register
 * Test server-side member registration using admin client
 * 
 * Request body: { userId: string, displayName: string }
 * 
 * ⚠️ IMPORTANT:
 * - This endpoint is for debugging and verification only
 * - Should be removed or protected after RLS issue is verified as fixed
 * - Never use this endpoint in production client code
 * - Consider adding authentication or rate limiting if kept
 * 
 * TODO: Delete this file after verifying server-side registration works
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, displayName } = body

    // Validate required fields
    if (!userId || !displayName) {
      return NextResponse.json(
        { 
          error: 'userId and displayName are required',
          usage: 'POST { "userId": "U123456789", "displayName": "Test User" }'
        },
        { status: 400 }
      )
    }

    // Create admin client to bypass RLS
    const supabaseAdmin = createAdminClient()

    // Attempt to insert a member
    const { data, error } = await supabaseAdmin
      .from('members')
      .insert({
        line_user_id: userId,
        display_name: displayName,
        registration_date: new Date().toISOString(),
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('[DEBUG] Test registration failed:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })

      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          },
          data: null,
        },
        { status: 500 }
      )
    }

    console.log('[DEBUG] Test registration succeeded:', {
      userId,
      displayName,
      memberId: data.id,
    })

    return NextResponse.json(
      {
        success: true,
        data,
        error: null,
        message: 'Member registered successfully via admin client',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[DEBUG] Test registration endpoint error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          details: String(error),
        },
        data: null,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/debug/test-register
 * Show endpoint documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/debug/test-register',
    description: 'Debug endpoint for testing server-side member registration with admin client',
    method: 'POST',
    body: {
      userId: 'string (required) - LINE User ID',
      displayName: 'string (required) - Display name',
    },
    example: {
      userId: 'U123456789abcdef',
      displayName: 'Test User',
    },
    warning: 'This is a temporary debug endpoint. Remove after verification.',
  })
}
