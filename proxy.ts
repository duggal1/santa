import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'


// Define protected routes (require authentication) - optimized for performance
const isProtectedRoute = createRouteMatcher([
  '/get-started(.*)',
  '/~/',
  '/dashboard(.*)',
  '/profile(.*)',
  '/settings(.*)',
])

// Define auth routes - for redirecting already signed-in users
const isAuthRoute = createRouteMatcher([
  '/auth/signin(.*)',
  '/auth/signup(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Public OAuth routes - no auth required, completely bypass middleware logic
  // These routes handle their own authentication internally
  const isPublicOauthRoute = createRouteMatcher([
    '/api/oauth/zendesk/start(.*)',  // Added path wildcard for consistency
    '/api/oauth/zendesk/callback(.*)'  // Added path wildcard for consistency
  ])
  if (isPublicOauthRoute(req)) {
    return // Completely bypass auth for OAuth endpoints
  }

  // Fast protection check for authenticated routes (non-blocking)
  if (isProtectedRoute(req)) {
    await auth.protect()
    return // Early return for protected routes
  }

  // Minimal auth check for auth pages only
  if (isAuthRoute(req)) {
    const { userId } = await auth()
    if (userId) {
      return Response.redirect(new URL('/dashboard', req.url))
    }
  }

  // Continue normally for all other routes (public pages)
}, {
  // Optimized configuration for faster redirects
  signInUrl: '/auth/signin',
  signUpUrl: '/auth/signup',
  clockSkewInMs: 2000, // Reduced from 5000ms default for faster validation
  debug: false, // Disable debug logging in production for speed
})

export const config = {
  matcher: [
    // Optimized: Only run middleware on specific dynamic routes
    '/get-started/:path*',
    '/~/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/auth/signin/:path*',
    '/auth/signup/:path*',
    // API routes still need middleware for auth
    '/(api|trpc)(.*)',
    // Exclude static assets and Next.js internals for better performance
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
