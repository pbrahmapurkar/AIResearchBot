import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import jwt from 'jsonwebtoken'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  let authenticated = false

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!)
      authenticated = true
    } catch {
      authenticated = false
    }
  }

  if (!authenticated) {
    const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    authenticated = !!nextAuthToken
  }

  if (!authenticated && req.nextUrl.pathname.startsWith('/app')) {
    const url = req.nextUrl.clone()
    url.pathname = '/signin'
    url.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*'],
}
