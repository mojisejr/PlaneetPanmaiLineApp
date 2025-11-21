import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

/**
 * Next.js Middleware for Authentication
 *
 * This middleware uses BetterAuth for authentication:
 * - Route protection for authenticated pages
 * - Redirect logic for auth pages when user is logged in
 * - LIFF authentication state validation
 * - Protocol-aware redirects (HTTP/HTTPS)
 *
 * Note: This middleware works in conjunction with the client-side
 * AuthGuard component for comprehensive authentication protection.
 */

/**
 * Main middleware function
 * Runs on every request matching the matcher configuration
 */
export function middleware(request: NextRequest): NextResponse | Promise<NextResponse> {
  // For now, use BetterAuth's middleware with minimal configuration
  // The main authentication logic is handled client-side by the useLiff hook
  // and AuthGuard components

  // Note: BetterAuth middleware will be configured in future iterations
  // For now, this middleware primarily serves to maintain existing routing

  return NextResponse.next()
}

/**
 * Middleware Configuration
 * Specifies which routes this middleware should run on
 * 
 * Note: Server-side route protection is disabled (protectedRoutes: [])
 * Authentication is handled client-side by the AuthGuard component
 * 
 * Matches:
 * - Login route (for authenticated user redirects)
 * - Root route
 * - All application routes (for auth state awareness)
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
