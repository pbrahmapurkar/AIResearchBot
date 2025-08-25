import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { signUpSchema } from '@/lib/validation'
import { checkRouteRateLimit } from '@/lib/utils/rate-limit'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const rate = checkRouteRateLimit(`signup:${ip}`, 5, 60_000)
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json()
  const parsed = signUpSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { username, email, password } = parsed.data

  // Check username uniqueness
  const admin = createAdminClient()
  const { data: existing } = await admin
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle()
  if (existing) {
    return NextResponse.json({ errors: { username: ['Taken'] } }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (data.session) {
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  return NextResponse.json({ ok: true, requiresEmailConfirm: true }, { status: 201 })
}
