import { NextRequest, NextResponse } from 'next/server'

/**
 * Configuration for middleware route protection
 */
export interface MiddlewareConfig {
  /**
   * Routes that require authentication
   */
  protectedRoutes: string[]
  
  /**
   * Routes that should redirect authenticated users away
   */
  authRoutes: string[]
  
  /**
   * Public routes that don't require authentication
   */
  publicRoutes: string[]
  
  /**
   * Default redirect path for unauthenticated users
   */
  loginPath: string
  
  /**
   * Default redirect path for authenticated users
   */
  defaultAuthenticatedPath: string
}

/**
 * Default middleware configuration
 */
export const defaultMiddlewareConfig: MiddlewareConfig = {
  protectedRoutes: ['/calculator'],
  authRoutes: ['/login'],
  publicRoutes: ['/'],
  loginPath: '/login',
  defaultAuthenticatedPath: '/calculator',
}

/**
 * Check if a path matches any pattern in the array
 */
export function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    // Exact match
    if (pathname === route) return true
    
    // Pattern match with wildcard
    if (route.endsWith('/*')) {
      const baseRoute = route.slice(0, -2)
      return pathname.startsWith(baseRoute)
    }
    
    // Pattern match for dynamic segments
    if (route.includes(':')) {
      const pattern = new RegExp('^' + route.replace(/:[^/]+/g, '[^/]+') + '$')
      return pattern.test(pathname)
    }
    
    return false
  })
}

/**
 * Get authentication state from LIFF token in cookies or headers
 * Since LIFF uses client-side authentication, we check for presence of LIFF session indicators
 */
export function getAuthenticationState(request: NextRequest): {
  isAuthenticated: boolean
  accessToken: string | null
} {
  // Check for LIFF access token in cookies
  const liffAccessToken = request.cookies.get('liff.access_token')?.value || null
  
  // Check for custom auth cookie (if set by the application)
  const authCookie = request.cookies.get('auth.session')?.value || null
  
  // User is considered authenticated if they have a LIFF access token or auth session
  const isAuthenticated = !!(liffAccessToken || authCookie)
  
  return {
    isAuthenticated,
    accessToken: liffAccessToken,
  }
}

/**
 * Create a redirect response with proper protocol handling
 */
export function createRedirect(
  request: NextRequest,
  path: string,
  status: 307 | 308 = 307
): NextResponse {
  // Get the base URL from the request
  const url = request.nextUrl.clone()
  
  // Handle absolute URLs
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return NextResponse.redirect(path, status)
  }
  
  // Handle relative paths
  url.pathname = path
  url.search = ''
  
  return NextResponse.redirect(url, status)
}

/**
 * Create a redirect to login with return URL
 */
export function redirectToLogin(
  request: NextRequest,
  loginPath: string = '/login'
): NextResponse {
  const url = request.nextUrl.clone()
  
  // Store the original path as a return URL parameter
  const returnUrl = encodeURIComponent(url.pathname + url.search)
  
  url.pathname = loginPath
  url.search = `?returnUrl=${returnUrl}`
  
  return NextResponse.redirect(url, 307)
}

/**
 * Main middleware handler for authentication
 */
export function createAuthMiddleware(
  config: Partial<MiddlewareConfig> = {}
): (request: NextRequest) => NextResponse | Promise<NextResponse> {
  const finalConfig: MiddlewareConfig = {
    ...defaultMiddlewareConfig,
    ...config,
  }
  
  return function authMiddleware(request: NextRequest): NextResponse {
    const { pathname } = request.nextUrl
    
    // Get authentication state
    const { isAuthenticated } = getAuthenticationState(request)
    
    // Check if route is protected
    const isProtectedRoute = matchesRoute(pathname, finalConfig.protectedRoutes)
    const isAuthRoute = matchesRoute(pathname, finalConfig.authRoutes)
    const isPublicRoute = matchesRoute(pathname, finalConfig.publicRoutes)
    
    // Protected routes require authentication
    if (isProtectedRoute && !isAuthenticated) {
      return redirectToLogin(request, finalConfig.loginPath)
    }
    
    // Auth routes (like login) should redirect authenticated users
    if (isAuthRoute && isAuthenticated) {
      return createRedirect(request, finalConfig.defaultAuthenticatedPath)
    }
    
    // Allow public routes and authenticated protected routes
    return NextResponse.next()
  }
}

/**
 * Middleware matcher configuration helper
 * Returns the config object for Next.js middleware matcher
 */
export function createMiddlewareMatcher(
  routes: string[]
): { matcher: string[] } {
  return {
    matcher: routes,
  }
}
