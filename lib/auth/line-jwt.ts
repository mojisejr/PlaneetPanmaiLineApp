import { SignJWT, jwtVerify } from 'jose'

/**
 * LINE LIFF ID Token Payload (simplified)
 * Based on LINE LIFF v2 API documentation
 */
export interface LineIdTokenPayload {
  iss: string // Issuer (LINE)
  sub: string // LINE user ID
  aud: string // LIFF ID
  exp: number // Expiration timestamp
  iat: number // Issued at timestamp
  name?: string // Display name
  picture?: string // Picture URL
  email?: string // Email (if scope granted)
}

/**
 * Custom JWT Payload for Supabase session
 * Contains LINE user information for RLS policy validation
 */
export interface CustomJwtPayload {
  line_user_id: string
  display_name: string
  picture_url?: string
  member_id: string
  exp: number
  iat: number
  [key: string]: unknown // Index signature for JWTPayload compatibility
}

/**
 * Session creation request interface
 */
export interface SessionCreateRequest {
  lineIdToken: string // LINE LIFF ID token from client
}

/**
 * Session creation response interface
 */
export interface SessionCreateResponse {
  success: boolean
  sessionToken?: string
  expiresAt?: string
  error?: string
}

/**
 * Generate custom JWT token for Supabase authentication
 * 
 * @param lineUserId - LINE user ID from LIFF token
 * @param displayName - User display name
 * @param memberId - Database member ID
 * @param pictureUrl - Optional profile picture URL
 * @returns JWT token string
 */
export async function generateCustomJwt(
  lineUserId: string,
  displayName: string,
  memberId: string,
  pictureUrl?: string
): Promise<string> {
  // Get JWT secret from environment
  const secret = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET
  
  if (!secret) {
    throw new Error('JWT_SECRET or SUPABASE_JWT_SECRET environment variable is required')
  }

  // Convert secret to Uint8Array
  const secretKey = new TextEncoder().encode(secret)

  // Set expiration to 24 hours from now
  const expirationTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60)

  // Create payload
  const payload: CustomJwtPayload = {
    line_user_id: lineUserId,
    display_name: displayName,
    member_id: memberId,
    picture_url: pictureUrl,
    exp: expirationTime,
    iat: Math.floor(Date.now() / 1000),
  }

  // Sign JWT
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(expirationTime)
    .setIssuedAt()
    .sign(secretKey)

  return jwt
}

/**
 * Verify and decode custom JWT token
 * 
 * @param token - JWT token string
 * @returns Decoded payload
 */
export async function verifyCustomJwt(token: string): Promise<CustomJwtPayload> {
  const secret = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET
  
  if (!secret) {
    throw new Error('JWT_SECRET or SUPABASE_JWT_SECRET environment variable is required')
  }

  const secretKey = new TextEncoder().encode(secret)

  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    })

    return payload as CustomJwtPayload
  } catch (error) {
    throw new Error(`JWT verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Decode base64url string to UTF-8 string
 * Works in both Node.js and edge runtime environments
 * 
 * @param base64url - Base64url encoded string
 * @returns Decoded UTF-8 string
 */
function decodeBase64Url(base64url: string): string {
  // Convert base64url to base64
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '='
  }
  
  // Use Buffer in Node.js, atob + TextDecoder in browser/edge
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf-8')
  } else {
    // Browser/edge runtime
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
  }
}

/**
 * Validate LINE LIFF ID token structure (basic validation)
 * Note: Full validation requires calling LINE's token verification API
 * 
 * @param idToken - LINE LIFF ID token
 * @returns Decoded payload (unverified)
 */
export function decodeLineIdToken(idToken: string): LineIdTokenPayload {
  try {
    // Split JWT into parts
    const parts = idToken.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    // Decode payload (base64url)
    const payload = parts[1]
    const decodedPayload = decodeBase64Url(payload)
    const parsed = JSON.parse(decodedPayload) as LineIdTokenPayload

    // Basic validation
    if (!parsed.sub || !parsed.iss || !parsed.aud) {
      throw new Error('Invalid LINE ID token: missing required fields')
    }

    // Check expiration
    if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('LINE ID token has expired')
    }

    return parsed
  } catch (error) {
    throw new Error(`Failed to decode LINE ID token: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Verify LINE ID token with LINE Platform
 * This makes an API call to LINE's token verification endpoint
 * 
 * @param idToken - LINE LIFF ID token
 * @param expectedChannelId - Expected LINE channel ID (LIFF ID)
 * @returns Verified token payload
 */
export async function verifyLineIdToken(
  idToken: string,
  expectedChannelId?: string
): Promise<LineIdTokenPayload> {
  try {
    // Verify token with LINE Platform API
    const verifyUrl = 'https://api.line.me/oauth2/v2.1/verify'
    
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_token: idToken }),
    })

    if (!response.ok) {
      throw new Error(`LINE token verification failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json() as LineIdTokenPayload

    // Validate channel ID if provided
    if (expectedChannelId && data.aud !== expectedChannelId) {
      throw new Error('LINE ID token channel ID mismatch')
    }

    // Validate issuer
    if (data.iss !== 'https://access.line.me') {
      throw new Error('Invalid LINE ID token issuer')
    }

    // Validate expiration
    if (data.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('LINE ID token has expired')
    }

    return data
  } catch (error) {
    throw new Error(`LINE token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extract LINE user ID from ID token without full verification
 * Use this for quick user ID extraction when full verification is not needed
 * 
 * @param idToken - LINE LIFF ID token
 * @returns LINE user ID
 */
export function extractLineUserId(idToken: string): string {
  const payload = decodeLineIdToken(idToken)
  return payload.sub
}
