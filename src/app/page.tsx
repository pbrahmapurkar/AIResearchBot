// src/app/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import LandingPage from './LandingPage'

export default async function Page() {
  const session = await getServerSession(authOptions)
  
  // If user is authenticated, redirect to projects
  if (session?.user) {
    redirect('/app/projects')
  }

  return <LandingPage />
}