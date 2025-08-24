'use server'

import 'server-only'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { SearchResult } from '@/lib/search'

export async function performSearchAction(_prevState: unknown, formData: FormData): Promise<{ ok: boolean; q: string; results: SearchResult[]; error?: string }> {
  const q = (formData.get('q') || '').toString().trim()
  if (!q) return { ok: false, q: '', results: [] as SearchResult[], error: 'Enter a query' }

  // rate key by IP (or anon cookie) - currently unused but kept for future rate limiting
  // const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon'
  try {
    // We redirect to enable RSC/Suspense streaming on the page load
    redirect(`/app/search?q=${encodeURIComponent(q)}`)
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Search failed';
    return { ok: false, q, results: [] as SearchResult[], error: errorMessage }
  } finally {
    revalidatePath('/app/search')
  }
}
