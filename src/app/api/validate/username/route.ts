import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { usernameSchema } from '@/lib/validation'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('u')
  if (!username || !usernameSchema.safeParse(username).success) {
    return NextResponse.json({ available: false })
  }

  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle()

  return NextResponse.json({ available: !data })
}
