'use server'

import 'server-only'
import { headers } from 'next/headers'
import { revalidatePath, redirect } from 'next/navigation'
import { webSearchWithFallback, type SearchResult } from '@/lib/search'

export async function performSearchAction(_prevState: unknown, formData: FormData): Promise<{ ok: boolean; q: string; results: SearchResult[]; error?: string }> {
  const q = (formData.get('q') || '').toString().trim()
  if (!q) return { ok: false, q: '', results: [] as SearchResult[], error: 'Enter a query' }

  // rate key by IP (or anon cookie)
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon'
  try {
    // We redirect to enable RSC/Suspense streaming on the page load
    redirect(`/app/search?q=${encodeURIComponent(q)}`)
  } catch (e: unknown) {
    return { ok: false, q, results: [] as SearchResult[], error: e?.message || 'Search failed' }
  } finally {
    revalidatePath('/app/search')
  }
}
