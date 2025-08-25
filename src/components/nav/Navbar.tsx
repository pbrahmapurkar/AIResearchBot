'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import AvatarMenu from './AvatarMenu'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ avatar_url?: string | null }>({})
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url, full_name')
          .eq('id', user.id)
          .single()
        if (data) setProfile(data)
      }
    }
    load()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <nav className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          Drishti.report
        </Link>
        {user ? (
          <AvatarMenu
            user={{
              email: user.email ?? null,
              name: user.user_metadata?.full_name,
              avatar_url: profile.avatar_url ?? undefined,
            }}
          />
        ) : (
          <Button asChild size="sm">
            <Link href="/signin">Sign In</Link>
          </Button>
        )}
      </div>
    </nav>
  )
}
