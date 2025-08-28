# Vercel Deployment Guide

## Prerequisites

- GitHub repository with the code
- Supabase project set up
- Vercel account

## Step 1: Import Git Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Select the repository: `TestingAISite/mission-agent`

## Step 2: Configure Project Settings

### Framework Preset
- **Framework Preset**: Next.js
- **Root Directory**: `mission-agent` (if deploying from monorepo)

### Build & Development Settings
- **Build Command**: `pnpm build`
- **Install Command**: `pnpm install --prefer-offline`
- **Output Directory**: `.next` (default)
- **Node.js Version**: 18.20.3 (auto-detected from .nvmrc)

## Step 3: Environment Variables

Add the following environment variables in Vercel:

### Required Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Optional Variables (for advanced features)
```
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
COHERE_API_KEY=your_cohere_api_key
HF_API_KEY=your_huggingface_api_key
TAVILY_API_KEY=your_tavily_api_key
```

## Step 4: Supabase Configuration

### Auth Provider Setup
1. Go to your Supabase project dashboard
2. Navigate to Authentication > URL Configuration
3. Set the following URLs:
   - **Site URL**: `https://your-domain.vercel.app`
   - **Redirect URLs**: 
     - `https://your-domain.vercel.app/auth/callback`
     - `https://your-domain.vercel.app/signin`

### Google OAuth (if using)
1. In Supabase Auth > Providers > Google
2. Set **Redirect URL**: `https://your-domain.vercel.app/auth/callback`

### Storage Bucket Setup
1. Go to Storage in Supabase dashboard
2. Create a new bucket called `avatars`
3. Set bucket as public
4. Add storage policy for avatars:

```sql
-- Allow users to read all avatars
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow users to upload their own avatar
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatar
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 5: Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Verify deployment at your domain

## Step 6: Post-Deployment Verification

### Test Authentication Flow
1. Visit `/signin` page
2. Create a test account
3. Verify redirect to `/app` (dashboard)
4. Test protected routes access

### Test Protected Routes
- `/app` - Dashboard (should work when authenticated)
- `/app/projects` - Projects page
- `/app/reports` - Reports page
- `/settings` - Settings page

### Verify Middleware
- Unauthenticated users should be redirected to `/signin?next=...`
- API routes should be accessible
- Static files should load properly

## Troubleshooting

### Build Failures
- Check environment variables are set correctly
- Verify Node.js version (18.20.3)
- Check for TypeScript errors locally first

### Authentication Issues
- Verify Supabase environment variables
- Check redirect URLs in Supabase
- Ensure middleware is working correctly

### Runtime Errors
- Check Vercel function logs
- Verify database connections
- Check Supabase service status

## Performance Optimization

### Vercel Settings
- **Edge Functions**: Disabled (using Node.js runtime)
- **Image Optimization**: Enabled
- **Analytics**: Optional

### Monitoring
- Set up Vercel Analytics
- Monitor function execution times
- Track build performance

## Security Notes

- All environment variables are encrypted in Vercel
- Supabase service role key is server-only
- Middleware protects all protected routes
- Rate limiting is implemented on API routes

## Support

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test locally with `pnpm build`
4. Check Supabase project status
