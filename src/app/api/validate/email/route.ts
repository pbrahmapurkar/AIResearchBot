import { NextResponse } from 'next/server'
import { emailSchema } from '@/lib/validation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('e')
  if (!email || !emailSchema.safeParse(email).success) {
    return NextResponse.json({ available: false })
  }

  const admin = createAdminClient()
  const { data } = await admin
    .from('auth.users')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  return NextResponse.json({ available: !data })
}
