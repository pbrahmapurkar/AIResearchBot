import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone()
  const callback = url.searchParams.get('redirect') || '/app'
  // Redirect to NextAuth's Google provider sign-in
  const signInUrl = new URL('/api/auth/signin/google', url.origin)
  signInUrl.searchParams.set('callbackUrl', callback)
  return NextResponse.redirect(signInUrl)
}
