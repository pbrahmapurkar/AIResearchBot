// src/app/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { cookies, headers } from 'next/headers'
import { authOptions } from '@/lib/auth'
import SimplePage from './SimplePage'

export default async function Page() {
  const cookieStore = await cookies()
  const headersList = await headers()
  const session = await getServerSession(authOptions)
  
  // If user is authenticated, redirect to projects
  if (session?.user) {
    redirect('/app/projects')
  }

  return <SimplePage />
}