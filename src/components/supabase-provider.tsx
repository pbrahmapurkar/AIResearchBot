// components/supabase-provider.tsx
'use client'

import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'

export function SupabaseProvider({
  children,
  initialSession,
}: PropsWithChildren<{ initialSession: Session | null }>) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [session, setSession] = useState<Session | null>(initialSession)
  const router = useRouter()
  const search = useSearchParams()

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s)
      // ensure server components revalidate where needed
      router.refresh()
    })
    return () => sub.subscription.unsubscribe()
  }, [supabase, router])

  // Optional: if signed in and on /signin, redirect to ?redirect or /app
  useEffect(() => {
    const path = window.location.pathname
    if (path === '/signin' && session) {
      const next = search?.get('redirect') || '/app'
      router.push(next)
    }
  }, [session, router, search])

  return <>{children}</>
}
