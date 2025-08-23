// Test file to verify TypeScript types compile correctly
// This file is not meant to be run, just to verify type safety

import {
  getProfile,
  updateProfile,
  getUserProjects,
  getUserProjectsWithCounts,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  reorderNotes,
  isAuthenticated,
  getCurrentUserId,
  subscribeToChanges,
  unsubscribeFromChanges
} from './db'

import type {
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

// Test profile operations
async function testProfileOperations() {
  // Get profile
  const profile: Profile | null = await getProfile()
  
  // Update profile
  const profileUpdate: ProfileUpdate = {
    name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg'
  }
  const updatedProfile: Profile | null = await updateProfile(profileUpdate)
}

// Test project operations
async function testProjectOperations() {
  // Get user projects
  const projects: Project[] = await getUserProjects()
  
  // Get projects with counts
  const projectsWithCounts: UserProjectWithCount[] = await getUserProjectsWithCounts()
  
  // Get single project
  const project: Project | null = await getProject('project-id')
  
  // Create project
  const newProject: Omit<ProjectInsert, 'owner'> = {
    title: 'My Project',
    description: 'Project description'
  }
  const createdProject: Project | null = await createProject(newProject)
  
  // Update project
  const projectUpdate: ProjectUpdate = {
    title: 'Updated Project Title'
  }
  const updatedProject: Project | null = await updateProject('project-id', projectUpdate)
  
  // Delete project
  const deleted: boolean = await deleteProject('project-id')
}

// Test note operations
async function testNoteOperations() {
  // Get project notes
  const notes: Note[] = await getProjectNotes('project-id')
  
  // Get single note
  const note: Note | null = await getNote('note-id')
  
  // Create note
  const newNote: Omit<NoteInsert, 'id'> = {
    project_id: 'project-id',
    title: 'My Note',
    content: 'Note content',
    order_index: 0
  }
  const createdNote: Note | null = await createNote(newNote)
  
  // Update note
  const noteUpdate: NoteUpdate = {
    title: 'Updated Note Title',
    content: 'Updated content'
  }
  const updatedNote: Note | null = await updateNote('note-id', noteUpdate)
  
  // Delete note
  const deleted: boolean = await deleteNote('note-id')
  
  // Reorder notes
  const reordered: boolean = await reorderNotes('project-id', ['note-1', 'note-2', 'note-3'])
}

// Test utility functions
async function testUtilityFunctions() {
  // Check authentication
  const authenticated: boolean = await isAuthenticated()
  
  // Get current user ID
  const userId: string | null = await getCurrentUserId()
  
  // Subscribe to changes
  const subscription = subscribeToChanges('notes', (payload) => {
    console.log('Note changed:', payload)
  })
  
  // Unsubscribe
  unsubscribeFromChanges(subscription)
}

// Test type exports
function testTypeExports() {
  // These should all be valid types
  const profile: Profile = {
    id: 'user-id',
    email: 'user@example.com',
    name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
  
  const project: Project = {
    id: 'project-id',
    owner: 'user-id',
    title: 'My Project',
    description: 'Project description',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
  
  const note: Note = {
    id: 'note-id',
    project_id: 'project-id',
    title: 'My Note',
    content: 'Note content',
    order_index: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
  
  const projectWithCount: UserProjectWithCount = {
    id: 'project-id',
    title: 'My Project',
    description: 'Project description',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    notes_count: 5
  }
}

// Export test functions to avoid unused variable warnings
export {
  testProfileOperations,
  testProjectOperations,
  testNoteOperations,
  testUtilityFunctions,
  testTypeExports
}
