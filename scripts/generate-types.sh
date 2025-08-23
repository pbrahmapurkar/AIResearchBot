#!/bin/bash

# Generate TypeScript types from Supabase
# This script generates types from your Supabase project

echo "🔧 Generating TypeScript types from Supabase..."

# Check if PROJECT_ID is provided
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: PROJECT_ID environment variable is required"
    echo "Please set PROJECT_ID to your Supabase project ID"
    echo "You can find this in your Supabase dashboard URL: https://supabase.com/dashboard/project/[PROJECT_ID]"
    exit 1
fi

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI is not installed"
    echo "Please install it first: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Generate types
echo "📝 Generating types for project: $PROJECT_ID"
supabase gen types typescript --project-id "$PROJECT_ID" --schema public > src/types/supabase.ts

if [ $? -eq 0 ]; then
    echo "✅ Types generated successfully!"
    echo "📁 Types saved to: src/types/supabase.ts"
    
    # Count the number of types generated
    type_count=$(grep -c "export type" src/types/supabase.ts || echo "0")
    echo "📊 Generated $type_count TypeScript types"
else
    echo "❌ Error: Failed to generate types"
    exit 1
fi

echo "🎉 Type generation complete!"
