import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

export interface AuthenticatedUser {
  id: string
  email: string
  name?: string | null
  avatar_url?: string | null
  role?: string
  orgId?: string | null
}

export interface AuthResult {
  user: AuthenticatedUser | null
  error?: string
}

// NextAuth compatible session type for API routes
export interface NextAuthSession {
  user: {
    id: string
    email: string
    name?: string
    image?: string
  }
}

/**
 * Get authenticated user from server-side context
 * This replaces the mock authentication with proper Supabase auth
 */
export async function getAuthenticatedUser(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = cookieStore.get(name)
            return cookie?.value
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: Record<string, unknown>) {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return { user: null, error: error?.message || 'User not authenticated' }
    }

    // Get user profile from profiles table with explicit typing
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      // Return basic user info if profile fetch fails
      return {
        user: {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        }
      }
    }

    // Explicitly type the profile data
    const profile = profileData as Profile | null

    if (!profile) {
      // Return basic user info if profile is null
      return {
        user: {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        }
      }
    }

    return {
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar_url: profile.avatar_url,
        role: 'USER', // Default role, can be enhanced with role-based system
        orgId: null // Can be enhanced with organization system
      }
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return { 
      user: null, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    }
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const result = await getAuthenticatedUser()
  return !!result.user
}

/**
 * Get user role for authorization checks
 */
export async function getUserRole(): Promise<string | null> {
  const result = await getAuthenticatedUser()
  return result.user?.role || null
}

/**
 * Verify user has required role
 */
export async function hasRole(requiredRole: string): Promise<boolean> {
  const userRole = await getUserRole()
  return userRole === requiredRole
}

/**
 * Verify user has admin privileges
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole('ADMIN')
}

/**
 * Get session for API routes (NextAuth compatible)
 * This function provides a NextAuth-like session interface for existing code
 */
export async function getServerSession(): Promise<NextAuthSession | null> {
  const result = await getAuthenticatedUser()
  if (!result.user) {
    return null
  }
  
  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name || undefined,
      image: result.user.avatar_url || undefined
    }
  }
}

// Legacy NextAuth compatibility (for existing code)
export const authOptions = {
  providers: [],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async session() {
      // This will be used when migrating to NextAuth
      // For now, redirect to Supabase auth
      throw new Error('NextAuth not implemented. Use Supabase authentication.')
    }
  }
}

export const auth = async () => {
  // Redirect to proper Supabase auth
  const result = await getAuthenticatedUser()
  if (!result.user) {
    throw new Error('Authentication required')
  }
  return { user: result.user }
}
