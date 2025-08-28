import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST() {
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

  await supabase.auth.signOut()

  // Redirect to public home
  const res = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL))

  // Ensure sb-* cookies are cleared
  const all = cookieStore.getAll()
  for (const ck of all) {
    if (ck.name.startsWith('sb-')) res.cookies.set(ck.name, '', { maxAge: 0 })
  }

  return res
}

