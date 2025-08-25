import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ message: 'Signed out successfully' })
  // Clear custom JWT token
  res.cookies.set('token', '', { path: '/', maxAge: 0 })
  // Clear NextAuth session cookies if present
  res.cookies.set('next-auth.session-token', '', { path: '/', maxAge: 0 })
  res.cookies.set('__Secure-next-auth.session-token', '', { path: '/', maxAge: 0 })
  return res
}
