import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import AuthCard from '@/components/auth/AuthCard'
import { redirect } from 'next/navigation'
import SigninRedirect from '@/components/auth/SigninRedirect'

export const dynamic = 'force-dynamic'

export default async function SignUpPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )
  const { data: { session } } = await supabase.auth.getSession()

  if (session) redirect('/app/projects')

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md">
        <SigninRedirect />
        <AuthCard />
      </div>
    </main>
  )
}
