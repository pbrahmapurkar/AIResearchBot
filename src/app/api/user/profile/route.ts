import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // For now, return basic user info from session
  // Profile data would come from a separate profiles table
  return NextResponse.json({
    id: session.user.id,
    email: session.user.email,
    username: null, // Would come from profiles table
    name: session.user.user_metadata?.full_name || null,
    avatar_url: session.user.user_metadata?.avatar_url || null,
  })
}
