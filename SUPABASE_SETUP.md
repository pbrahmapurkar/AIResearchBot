# Supabase Setup with RLS Policies and TypeScript Types

This document describes the complete Supabase database setup for the notes/projects app, including Row Level Security (RLS) policies and TypeScript integration.

## 🗄️ Database Schema

### Tables Created

#### 1. **profiles**
- **Purpose**: User profile information
- **Key Features**: 
  - Auto-created on user signup via trigger
  - RLS policies ensure users can only access their own profile
  - References `auth.users` table

```sql
profiles(
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text UNIQUE,
  name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

#### 2. **projects**
- **Purpose**: User projects/workspaces
- **Key Features**:
  - RLS policies ensure users can only access their own projects
  - Status field for project lifecycle management
  - Cascading delete to notes

```sql
projects(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid REFERENCES auth.users,
  title text,
  description text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

#### 3. **notes**
- **Purpose**: Notes within projects
- **Key Features**:
  - RLS policies ensure users can only access notes from their own projects
  - Order index for note positioning
  - Cascading delete when project is deleted

```sql
notes(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects,
  title text,
  content text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

## 🔒 Row Level Security (RLS) Policies

### Profiles Table Policies
- **SELECT**: Users can only view their own profile
- **UPDATE**: Users can only update their own profile
- **INSERT**: Handled automatically by signup trigger
- **DELETE**: Not allowed (profiles are permanent)

### Projects Table Policies
- **SELECT**: Users can only view their own projects
- **INSERT**: Users can only create projects for themselves
- **UPDATE**: Users can only update their own projects
- **DELETE**: Users can only delete their own projects

### Notes Table Policies
- **SELECT**: Users can only view notes from their own projects
- **INSERT**: Users can only create notes in their own projects
- **UPDATE**: Users can only update notes in their own projects
- **DELETE**: Users can only delete notes in their own projects

## 🚀 TypeScript Integration

### Type Generation

#### Automatic Type Generation
```bash
# Generate types from your Supabase project
npm run types:generate

# Or use the local project ID
npm run types:generate:local
```

#### Manual Type Generation
```bash
# Using Supabase CLI directly
supabase gen types typescript --project-id rlioqsbxlfboczfrsmrr --schema public > src/types/supabase.ts
```

### Type Files

#### `src/types/supabase.ts`
- **Auto-generated** from Supabase schema
- **Database types** for all tables, views, and functions
- **Helper types** for better developer experience

#### `src/lib/db.ts`
- **Typed helper functions** for all database operations
- **Full TypeScript support** with proper return types
- **Error handling** and logging
- **Real-time subscriptions** support

## 🛠️ Database Operations

### Profile Operations
```typescript
import { getProfile, updateProfile } from '@/lib/db'

// Get current user's profile
const profile = await getProfile()

// Update profile
const updatedProfile = await updateProfile({
  name: 'John Doe',
  avatar_url: 'https://example.com/avatar.jpg'
})
```

### Project Operations
```typescript
import { 
  getUserProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from '@/lib/db'

// Get all user projects
const projects = await getUserProjects()

// Create new project
const newProject = await createProject({
  title: 'My Project',
  description: 'Project description'
})

// Update project
const updatedProject = await updateProject(projectId, {
  title: 'Updated Title'
})

// Delete project
const deleted = await deleteProject(projectId)
```

### Note Operations
```typescript
import { 
  getProjectNotes, 
  createNote, 
  updateNote, 
  deleteNote,
  reorderNotes 
} from '@/lib/db'

// Get project notes
const notes = await getProjectNotes(projectId)

// Create note
const newNote = await createNote({
  project_id: projectId,
  title: 'My Note',
  content: 'Note content'
})

// Update note
const updatedNote = await updateNote(noteId, {
  title: 'Updated Title',
  content: 'Updated content'
})

// Reorder notes
const reordered = await reorderNotes(projectId, ['note1', 'note2', 'note3'])
```

## 🔧 Setup Instructions

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link Your Project
```bash
supabase link --project-ref rlioqsbxlfboczfrsmrr
```

### 4. Apply Database Schema
```bash
# Push the migration to your Supabase project
npm run db:push

# Or reset the database (⚠️ WARNING: This will delete all data)
npm run db:reset
```

### 5. Generate Types
```bash
npm run types:generate:local
```

## 🧪 Testing

### Verify Type Safety
```bash
# Check if TypeScript compiles without errors
npm run build
```

### Test RLS Policies
1. **Create a test user** and sign in
2. **Create a project** and verify it's accessible
3. **Create notes** in the project
4. **Sign in with different user** and verify they cannot access the data
5. **Check that users can only see their own data**

### Test Database Operations
```typescript
// All these operations should compile without TypeScript errors
import { testProfileOperations, testProjectOperations, testNoteOperations } from '@/lib/db.test'

// Run the tests to verify type safety
await testProfileOperations()
await testProjectOperations()
await testNoteOperations()
```

## 📊 Database Functions

### `get_user_projects(user_id UUID)`
- **Purpose**: Get projects with note counts for a user
- **Returns**: Projects with aggregated note counts
- **Security**: Only accessible to the authenticated user

## 🔐 Security Features

### Row Level Security (RLS)
- **Automatic data isolation** between users
- **No cross-user data access** possible
- **Database-level security** enforcement

### Authentication Integration
- **Automatic profile creation** on signup
- **User context** in all database operations
- **Session-based access control**

### Data Validation
- **Check constraints** on project status
- **Foreign key relationships** with cascade delete
- **Required fields** enforcement

## 🚨 Important Notes

### Environment Variables
Ensure these are set in your `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://rlioqsbxlfboczfrsmrr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Supabase Dashboard Configuration
1. **Enable RLS** on all tables (done automatically in migration)
2. **Configure auth settings** for your domain
3. **Set up OAuth providers** if using social login
4. **Configure email templates** for magic links

### Local Development
```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset local database
supabase db reset
```

## 🎯 Acceptance Criteria Checklist

- [x] **All tables created** with correct schema and relationships
- [x] **RLS policies properly restrict** access based on ownership
- [x] **TypeScript types generated** and integrated
- [x] **Typed queries compile** successfully
- [x] **RLS policies test green** with authenticated users
- [x] **Users can only CRUD** their own projects and notes
- [x] **Profile creation works** automatically on user signup

## 🔍 Troubleshooting

### Common Issues

#### Type Generation Fails
```bash
# Check if Supabase CLI is installed
supabase --version

# Verify project ID
echo $PROJECT_ID

# Check authentication
supabase status
```

#### RLS Policies Not Working
1. **Verify RLS is enabled** on tables
2. **Check policy definitions** in Supabase dashboard
3. **Ensure user is authenticated** before database operations
4. **Verify policy conditions** match your requirements

#### TypeScript Compilation Errors
1. **Regenerate types** after schema changes
2. **Check import paths** in your components
3. **Verify type definitions** match your schema
4. **Clear TypeScript cache** and restart development server

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [RLS Policy Examples](https://supabase.com/docs/guides/auth/row-level-security)
- [TypeScript Integration](https://supabase.com/docs/guides/api/typescript-support)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
