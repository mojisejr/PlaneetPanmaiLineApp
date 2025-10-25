import { NextRequest, NextResponse } from 'next/server'
import { createAuthMiddleware } from '@/lib/auth/middleware'

/**
 * Next.js Middleware for Authentication
 * 
 * This middleware runs on the Edge runtime and provides:
 * - Route protection for authenticated pages
 * - Redirect logic for auth pages when user is logged in
 * - LIFF authentication state validation
 * - Protocol-aware redirects (HTTP/HTTPS)
 * 
 * Note: This middleware works in conjunction with the client-side
 * AuthGuard component for comprehensive authentication protection.
 */

// Create the authentication middleware with custom configuration
const authMiddleware = createAuthMiddleware({
  protectedRoutes: ['/calculator', '/calculator/*'],
  authRoutes: ['/login'],
  publicRoutes: ['/'],
  loginPath: '/login',
  defaultAuthenticatedPath: '/calculator',
})

/**
 * Main middleware function
 * Runs on every request matching the matcher configuration
 */
export function middleware(request: NextRequest): NextResponse | Promise<NextResponse> {
  // Run authentication middleware
  return authMiddleware(request)
}

/**
 * Middleware Configuration
 * Specifies which routes this middleware should run on
 * 
 * Matches:
 * - All calculator routes
 * - Login route
 * - Root route
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
