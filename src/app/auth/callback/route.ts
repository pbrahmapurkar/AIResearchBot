// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { getEnv } from '@/env'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  // Default destination after successful auth
  const next = url.searchParams.get('redirect') || url.searchParams.get('next') || '/app/projects'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = cookieStore.get(name)
            return cookie?.value
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

    // Exchanges the code for a session and sets cookies
    await supabase.auth.exchangeCodeForSession(code)

    // Optional: check for profile row to decide onboarding vs projects
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()
        if (error || !profile) {
          // No profile yet; route to onboarding unless a redirect is explicitly provided
          if (!url.searchParams.get('redirect') && !url.searchParams.get('next')) {
            const { NEXT_PUBLIC_APP_URL } = getEnv()
            return NextResponse.redirect(new URL('/app/onboarding', NEXT_PUBLIC_APP_URL))
          }
        }
      }
    } catch {
      // Silently ignore onboarding check failures
    }
  }

  // Always redirect to app (or provided "next/redirect")
  const { NEXT_PUBLIC_APP_URL } = getEnv()
  const redirectBase = NEXT_PUBLIC_APP_URL
  return NextResponse.redirect(new URL(next, redirectBase))
}
