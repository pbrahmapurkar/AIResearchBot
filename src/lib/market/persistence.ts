import type { SupabaseClient } from '@supabase/supabase-js'
import type { SearchResult } from '@/lib/search'

export async function createRun(client: SupabaseClient, userId: string, query: string) {
  const { data, error } = await client
    .from('research_runs')
    .insert({ user_id: userId, query })
    .select('id')
    .single()
  if (error) throw error
  return data.id as string
}

export async function addCitation(client: SupabaseClient, runId: string, c: SearchResult) {
  await client.from('research_citations').insert({
    run_id: runId,
    title: c.title,
    url: c.url,
    snippet: c.snippet,
  })
}

export async function addChunk(client: SupabaseClient, runId: string, content: string) {
  await client.from('research_chunks').insert({
    run_id: runId,
    content,
  })
}
