"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function SigninRedirect() {
  const router = useRouter()
  const search = useSearchParams()

  useEffect(() => {
    let isMounted = true
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      if (data.session) {
        const next = search.get('redirect') || search.get('next') || '/app/projects'
        // Avoid client flicker by replacing rather than pushing
        router.replace(next)
      }
    })
    return () => { isMounted = false }
  }, [router, search])

  return null
}

