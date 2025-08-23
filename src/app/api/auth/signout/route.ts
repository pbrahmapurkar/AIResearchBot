import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    // Create Supabase server client
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

    // Sign out the user
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Supabase sign out error:', error)
      return NextResponse.json(
        { error: 'Failed to sign out' },
        { status: 500 }
      )
    }

    // Clear any additional cookies if needed
    const response = NextResponse.json(
      { message: 'Signed out successfully' },
      { status: 200 }
    )

    // Clear authentication cookies
    response.cookies.set('sb-access-token', '', { maxAge: 0 })
    response.cookies.set('sb-refresh-token', '', { maxAge: 0 })
    
    // Clear any other Supabase-related cookies
    const cookieNames = cookieStore.getAll()
    cookieNames.forEach(cookie => {
      if (cookie.name.startsWith('sb-')) {
        response.cookies.set(cookie.name, '', { maxAge: 0 })
      }
    })

    return response

  } catch (error) {
    console.error('Sign out route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
