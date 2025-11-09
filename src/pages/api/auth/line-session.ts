import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseService } from '@/lib/supabase/service-role'
import {
  verifyLineIdToken,
  generateCustomJwt,
  type SessionCreateResponse,
  type LineIdTokenPayload,
} from '@/lib/auth/line-jwt'
import { z } from 'zod'

/**
 * LINE Session Bridge API Endpoint
 * 
 * This endpoint validates LINE LIFF tokens and creates Supabase sessions
 * using custom JWT tokens. It bridges LINE authentication with Supabase RLS.
 * 
 * Flow:
 * 1. Client sends LINE LIFF ID token
 * 2. Server verifies token with LINE Platform
 * 3. Server checks if user is registered member
 * 4. Server generates custom JWT token
 * 5. Client stores JWT for Supabase requests
 */

// Request validation schema
const SessionRequestSchema = z.object({
  lineIdToken: z.string().min(1, 'LINE ID token is required'),
})

// Error response type
interface ErrorResponse {
  success: false
  error: string
  details?: unknown
}

/**
 * POST /api/auth/line-session
 * Create a new session for authenticated LINE user
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SessionCreateResponse | ErrorResponse>
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    // Validate request body
    const validationResult = SessionRequestSchema.safeParse(req.body)
    
    if (!validationResult.success) {
      console.error('[LINE Session] Validation failed:', validationResult.error)
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validationResult.error.errors,
      })
    }

    const { lineIdToken } = validationResult.data

    console.log('[LINE Session] Processing session creation request')

    // Step 1: Verify LINE ID token with LINE Platform
    let linePayload: LineIdTokenPayload
    try {
      // Get LIFF ID from environment for validation
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID || 
                     process.env.NEXT_PUBLIC_LIFF_ID_PROD ||
                     process.env.NEXT_PUBLIC_LIFF_ID_DEV

      linePayload = await verifyLineIdToken(lineIdToken, liffId)
      if (process.env.NODE_ENV !== 'production') {
        console.log('[LINE Session] LINE token verified:', {
          userId: linePayload.sub,
          name: linePayload.name,
        })
      } else {
        console.log('[LINE Session] LINE token verified');
      }
    } catch (error) {
      console.error('[LINE Session] LINE token verification failed:', error)
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired LINE token',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    // Step 2: Extract LINE user ID
    const lineUserId = linePayload.sub
    const pictureUrl = linePayload.picture

    // Step 3: Check if user is registered member
    const { data: member, error: memberError } = await supabaseService
      .from('members')
      .select('id, line_user_id, display_name, is_active')
      .eq('line_user_id', lineUserId)
      .eq('is_active', true)
      .single()

    if (memberError || !member) {
      console.error('[LINE Session] Member not found or inactive:', {
        lineUserId,
        error: memberError,
      })
      return res.status(403).json({
        success: false,
        error: 'User is not a registered member',
      })
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[LINE Session] Member found:', {
        memberId: member.id,
        lineUserId: member.line_user_id,
      })
    }

    // Step 4: Generate custom JWT token
    let sessionToken: string
    try {
      sessionToken = await generateCustomJwt(
        member.line_user_id,
        member.display_name,
        member.id,
        pictureUrl
      )
    } catch (error) {
      console.error('[LINE Session] JWT generation failed:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to generate session token',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    // Calculate expiration time (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    console.log('[LINE Session] Session created successfully:', {
      memberId: member.id,
      expiresAt,
    })

    // Step 5: Return session token
    return res.status(200).json({
      success: true,
      sessionToken,
      expiresAt,
    })

  } catch (error) {
    console.error('[LINE Session] Unexpected error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      ...(process.env.NODE_ENV !== 'production' && {
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    })
  }
}
