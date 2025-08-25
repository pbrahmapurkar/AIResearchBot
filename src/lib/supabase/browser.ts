import { createBrowserClient } from '@supabase/ssr'

// Create a browser-side Supabase client that persists the session so the user
// remains logged in across page reloads. The helper from `@supabase/ssr` is
// safe to use inside Client Components.
export const createSupabaseBrowserClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  )
