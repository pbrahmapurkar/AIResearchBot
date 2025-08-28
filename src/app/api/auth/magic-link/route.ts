import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { checkRateLimit, getClientIP } from '@/lib/utils'

const BodySchema = z.object({
  email: z.string().email('Invalid email address'),
  redirectTo: z.string().default('/auth/callback'),
})

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request)
    // Basic rate limits: 3/min and 10/hour
    const short = checkRateLimit(`magic:${ip}:1m`, { maxRequests: 3, windowMs: 60_000 })
    const long = checkRateLimit(`magic:${ip}:1h`, { maxRequests: 10, windowMs: 3_600_000 })
    if (!short.allowed || !long.allowed) {
      return NextResponse.json({ error: 'Too many attempts, try later' }, { status: 429 })
    }

    const json = await request.json().catch(() => ({}))
    const { email, redirectTo } = BodySchema.parse(json)

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          },
        },
      }
    )

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${redirectTo}`,
      },
    })

    if (error) {
      if (process.env.NODE_ENV !== 'production') console.error('Magic link error:', error)
      return NextResponse.json({ error: 'Unable to send magic link' }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('Magic link route error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

