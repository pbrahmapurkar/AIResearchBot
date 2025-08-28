// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Add security headers
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // CORS headers for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    res.headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '*')
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    res.headers.set('Access-Control-Max-Age', '86400')
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: res.headers })
  }

  // Create Supabase client for authentication
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options })
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )

  // Redirect authenticated users from home to projects dashboard
  if (req.nextUrl.pathname === '/') {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const url = req.nextUrl.clone()
      url.pathname = '/app/projects'
      return NextResponse.redirect(url)
    }
  }

  // Check authentication for protected routes
  const protectedPrefixes = ['/app', '/insights', '/research', '/settings']
  if (protectedPrefixes.some((p) => req.nextUrl.pathname.startsWith(p))) {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      const url = req.nextUrl.clone()
      url.pathname = '/signin'
      url.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search)
      return NextResponse.redirect(url)
    }

    // Additional security check for sensitive routes
    if (req.nextUrl.pathname.startsWith('/app/admin') || req.nextUrl.pathname.startsWith('/app/settings')) {
      // Check if user has admin role (you can implement this based on your user roles)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // You can add role-based access control here
        // For now, we'll allow authenticated users
        console.log(`User ${user.email} accessing protected route: ${req.nextUrl.pathname}`)
      }
    }
  }

  // Redirect signed-in users away from auth pages
  if (req.nextUrl.pathname === '/signin' || req.nextUrl.pathname === '/signup') {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const url = req.nextUrl.clone()
      url.pathname = '/app/projects'
      return NextResponse.redirect(url)
    }
  }

  // Block access to sensitive files, but allow common public assets
  const publicWhitelist = new Set([
    '/manifest.json',
    '/site.webmanifest',
    '/robots.txt',
    '/sitemap.xml',
    '/favicon.ico',
  ])
  if (
    req.nextUrl.pathname.match(/\.(env|config|json|md|txt)$/) &&
    !publicWhitelist.has(req.nextUrl.pathname)
  ) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Block access to internal API routes from external sources
  if (req.nextUrl.pathname.startsWith('/api/internal/')) {
    const origin = req.headers.get('origin')
    if (origin && !origin.includes('yourdomain.com')) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
