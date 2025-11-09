/**
 * MSW (Mock Service Worker) Setup for Testing
 * 
 * This file provides mock handlers for external API calls used in tests:
 * 1. LINE JWKS endpoint (https://api.line.me/oauth2/v2.1/keys)
 * 2. LINE token verification endpoint (https://api.line.me/oauth2/v2.1/verify)
 * 3. /api/auth/line-session endpoint (internal API)
 * 
 * These mocks allow tests to run without real secrets and external dependencies.
 */

import { rest } from 'msw'
import { setupServer } from 'msw/node'

/**
 * Mock JWKS response from LINE Platform
 * Used for JWT signature verification in tests
 */
const mockLineJwks = {
  keys: [
    {
      kty: 'RSA',
      use: 'sig',
      kid: 'test-key-id',
      n: 'mock-modulus',
      e: 'AQAB',
      alg: 'RS256',
    },
  ],
}

/**
 * Mock LINE ID token verification response
 */
const mockLineTokenVerifySuccess = {
  iss: 'https://access.line.me',
  sub: 'U1234567890abcdef',
  aud: 'test-liff-id',
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000),
  name: 'Test User',
  picture: 'https://profile.line-scdn.net/test.jpg',
}

/**
 * Mock session creation success response
 */
const mockSessionCreateSuccess = {
  success: true,
  sessionToken: 'mock-jwt-session-token',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

/**
 * MSW Request Handlers
 */
export const handlers = [
  // Mock LINE JWKS endpoint
  rest.get('https://api.line.me/oauth2/v2.1/keys', (_req, res, ctx) => {
    return res(ctx.json(mockLineJwks))
  }),

  // Mock LINE token verification endpoint
  rest.post('https://api.line.me/oauth2/v2.1/verify', async (req, res, ctx) => {
    const body = await req.json<{ id_token: string }>()
    
    // Simulate different scenarios based on token value
    if (!body.id_token || body.id_token === 'invalid-token') {
      return res(ctx.status(400))
    }
    
    if (body.id_token === 'expired-token') {
      return res(
        ctx.json({
          ...mockLineTokenVerifySuccess,
          exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
        })
      )
    }
    
    // Default: return success
    return res(ctx.json(mockLineTokenVerifySuccess))
  }),

  // Mock /api/auth/line-session endpoint
  rest.post('/api/auth/line-session', async (req, res, ctx) => {
    const body = await req.json<{ lineIdToken: string }>()
    
    // Validate request
    if (!body.lineIdToken) {
      return res(
        ctx.status(400),
        ctx.json({
          success: false,
          error: 'Invalid request data',
        })
      )
    }
    
    // Simulate invalid LINE token
    if (body.lineIdToken === 'invalid-line-token') {
      return res(
        ctx.status(401),
        ctx.json({
          success: false,
          error: 'Invalid or expired LINE token',
        })
      )
    }
    
    // Simulate unregistered user
    if (body.lineIdToken === 'unregistered-user-token') {
      return res(
        ctx.status(403),
        ctx.json({
          success: false,
          error: 'User is not a registered member',
        })
      )
    }
    
    // Simulate server error
    if (body.lineIdToken === 'server-error-token') {
      return res(
        ctx.status(500),
        ctx.json({
          success: false,
          error: 'Internal server error',
        })
      )
    }
    
    // Default: return success
    return res(ctx.json(mockSessionCreateSuccess))
  }),
]

/**
 * Setup MSW server for Node.js tests
 */
export const server = setupServer(...handlers)

/**
 * Start server before all tests
 */
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

/**
 * Reset handlers after each test
 */
afterEach(() => {
  server.resetHandlers()
})

/**
 * Close server after all tests
 */
afterAll(() => {
  server.close()
})

/**
 * Export mock data for use in tests
 */
export const mockData = {
  lineJwks: mockLineJwks,
  lineTokenVerify: mockLineTokenVerifySuccess,
  sessionCreate: mockSessionCreateSuccess,
}
