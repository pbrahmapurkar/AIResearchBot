import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { signInSchema } from '@/lib/validation'
import { checkRouteRateLimit } from '@/lib/utils/rate-limit'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const rate = checkRouteRateLimit(`signin:${ip}`, 10, 60_000)
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json()
  const parsed = signInSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { emailOrUsername, password, remember } = parsed.data

  let email = emailOrUsername
  if (!emailOrUsername.includes('@')) {
    const admin = createAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select('id')
      .eq('username', emailOrUsername)
      .maybeSingle()
    if (!profile?.id) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }
    const { data: user } = await admin.auth.admin.getUserById(profile.id)
    if (!user?.user?.email) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }
    email = user.user.email
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
  }

  // Adjust cookie max age
  const response = NextResponse.json({ ok: true })
  if (data.session) {
    const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24
    response.cookies.set('sb-access-token', data.session.access_token, {
      httpOnly: true,
      maxAge,
      sameSite: 'lax',
      path: '/',
    })
    response.cookies.set('sb-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      maxAge,
      sameSite: 'lax',
      path: '/',
    })
  }

  return response
}
