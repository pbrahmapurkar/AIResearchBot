import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type {
  Database, 
  Profile, 
  Project, 
  Note, 
  ProfileInsert, 
  ProjectInsert, 
  NoteInsert,
  ProfileUpdate,
  ProjectUpdate,
  NoteUpdate,
  UserProjectWithCount
} from '@/types/supabase'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

// Type-safe Supabase client types
export type SupabaseClient = ReturnType<typeof createSupabaseBrowserClient>
export type SupabaseServerClient = ReturnType<typeof createServerClient<Database>>

// Type for realtime payload based on table
type RealtimePayload<T extends keyof Database['public']['Tables']> = RealtimePostgresChangesPayload<Database['public']['Tables'][T]['Row']>

// ============================================================================
// CLIENT-SIDE DATABASE OPERATIONS
// ============================================================================

/**
 * Get typed Supabase client for client-side operations
 */
export function getSupabaseClient(): SupabaseClient {
  return createSupabaseBrowserClient()
}

// ============================================================================
// SERVER-SIDE DATABASE OPERATIONS
// ============================================================================

/**
 * Get typed Supabase client for server-side operations
 */
export async function getSupabaseServerClient(): Promise<SupabaseServerClient> {
  const cookieStore = await cookies()
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name)
          return cookie?.value
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
}

// ============================================================================
// PROFILE OPERATIONS
// ============================================================================

/**
 * Get current user's profile
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return data
}

/**
 * Update current user's profile
 */
export async function updateProfile(updates: ProfileUpdate): Promise<Profile | null> {
  const supabase = getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()
    
  if (error) {
    console.error('Error updating profile:', error)
    return null
  }
  
  return data
}

// ============================================================================
// PROJECT OPERATIONS
// ============================================================================

/**
 * Get all projects for current user
 */
export async function getUserProjects(): Promise<Project[]> {
  const supabase = getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner', user.id)
    .order('updated_at', { ascending: false })
    
  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  
  return data || []
}

/**
 * Get projects with note counts for current user
 */
export async function getUserProjectsWithCounts(): Promise<UserProjectWithCount[]> {
  const supabase = getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []
  
  const { data, error } = await supabase
    .rpc('get_user_projects', { user_id: user.id })
    
  if (error) {
    console.error('Error fetching projects with counts:', error)
    return []
  }
  
  return data || []
}

/**
 * Get a single project by ID
 */
export async function getProject(projectId: string): Promise<Project | null> {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()
    
  if (error) {
    console.error('Error fetching project:', error)
    return null
  }
  
  return data
}

/**
 * Create a new project
 */
export async function createProject(project: Omit<ProjectInsert, 'owner'>): Promise<Project | null> {
  const supabase = getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...project, owner: user.id })
    .select()
    .single()
    
  if (error) {
    console.error('Error creating project:', error)
    return null
  }
  
  return data
}

/**
 * Update a project
 */
export async function updateProject(projectId: string, updates: ProjectUpdate): Promise<Project | null> {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single()
    
  if (error) {
    console.error('Error updating project:', error)
    return null
  }
  
  return data
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    
  if (error) {
    console.error('Error deleting project:', error)
    return false
  }
  
  return true
}

// ============================================================================
// NOTE OPERATIONS
// ============================================================================

/**
 * Get all notes for a project
 */
export async function getProjectNotes(projectId: string): Promise<Note[]> {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true })
    
  if (error) {
    console.error('Error fetching notes:', error)
    return []
  }
  
  return data || []
}

/**
 * Get a single note by ID
 */
export async function getNote(noteId: string): Promise<Note | null> {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', noteId)
    .single()
    
  if (error) {
    console.error('Error fetching note:', error)
    return null
  }
  
  return data
}

/**
 * Create a new note
 */
export async function createNote(note: Omit<NoteInsert, 'id'>): Promise<Note | null> {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('notes')
    .insert(note)
    .select()
    .single()
    
  if (error) {
    console.error('Error creating note:', error)
    return null
  }
  
  return data
}

/**
 * Update a note
 */
export async function updateNote(noteId: string, updates: NoteUpdate): Promise<Note | null> {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', noteId)
    .select()
    .single()
    
  if (error) {
    console.error('Error updating note:', error)
    return null
  }
  
  return data
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    
  if (error) {
    console.error('Error deleting note:', error)
    return false
  }
  
  return true
}

/**
 * Reorder notes within a project
 */
export async function reorderNotes(projectId: string, noteIds: string[]): Promise<boolean> {
  const supabase = getSupabaseClient()
  
  // Update order_index for each note
  const updates = noteIds.map((noteId, index) => ({
    id: noteId,
    order_index: index
  }))
  
  const { error } = await supabase
    .from('notes')
    .upsert(updates, { onConflict: 'id' })
    
  if (error) {
    console.error('Error reordering notes:', error)
    return false
  }
  
  return true
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id || null
}

/**
 * Subscribe to real-time changes
 */
export function subscribeToChanges<T extends 'profiles' | 'projects' | 'notes'>(
  table: T,
  callback: (payload: RealtimePayload<T>) => void
) {
  const supabase = getSupabaseClient()
  
  return supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      callback
    )
    .subscribe()
}

/**
 * Unsubscribe from real-time changes
 */
export function unsubscribeFromChanges(subscription: { unsubscribe: () => void } | null | undefined) {
  if (subscription) {
    subscription.unsubscribe()
  }
}
