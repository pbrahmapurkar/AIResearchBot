// src/app/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import LandingPage from './LandingPage'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const session = await getServerSession()
  
  if (session?.user) {
    redirect('/app')
  }

  return <LandingPage />
}