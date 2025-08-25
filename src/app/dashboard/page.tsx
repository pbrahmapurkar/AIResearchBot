import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'
import Navbar from '@/components/nav/Navbar'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { DashboardPayload, LanguageCode, TimeRangeKey } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect('/signin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('industry, language')
    .eq('id', session.user.id)
    .single()

  const industry = profile?.industry ?? 'FMCG'
  const language: LanguageCode = profile?.language ?? 'hi'
  const timeRange: TimeRangeKey = '7d'

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/dashboard/mock?industry=${industry}&language=${language}&range=${timeRange}`,
    { cache: 'no-store' }
  )
  const data = (await res.json()) as DashboardPayload

  return (
    <>
      <Navbar />
      <main className="container mx-auto space-y-6 py-6">
        <header>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Last updated {new Date().toLocaleTimeString()}
          </p>
        </header>
        <DashboardClient initial={data} />
      </main>
    </>
  )
}
