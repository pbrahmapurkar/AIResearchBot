import 'server-only'

export type SearchResult = {
  title: string
  url: string
  snippet: string
}

type TavilyItem = { title: string; url: string; content?: string; snippet?: string }
type BraveWebItem = { title: string; url: string; description?: string; snippet?: string }

/** ----------------- Rate Limit (Dev: in-memory; swap for KV easily) ----------------- **/
type Bucket = { tokens: number; lastRefill: number }
         const RATE_BUCKETS: Map<string, Bucket> =
           (globalThis as { __RATE_BUCKETS__?: Map<string, Bucket> }).__RATE_BUCKETS__ ?? ((globalThis as { __RATE_BUCKETS__?: Map<string, Bucket> }).__RATE_BUCKETS__ = new Map())

export async function rateLimit(key: string, capacity = 30, refillPerSec = 1): Promise<boolean> {
  const now = Date.now()
  const bucket = RATE_BUCKETS.get(key) ?? { tokens: capacity, lastRefill: now }
  // refill
  const elapsedSec = (now - bucket.lastRefill) / 1000
  const refill = Math.floor(elapsedSec * refillPerSec)
  if (refill > 0) {
    bucket.tokens = Math.min(capacity, bucket.tokens + refill)
    bucket.lastRefill = now
  }
  if (bucket.tokens <= 0) {
    RATE_BUCKETS.set(key, bucket)
    return false
  }
  bucket.tokens -= 1
  RATE_BUCKETS.set(key, bucket)
  return true
}

/** ----------------- Normalization ----------------- **/
export function unifyResults(results: Array<Partial<SearchResult>>): SearchResult[] {
  const out: SearchResult[] = []
  const seen = new Set<string>()
  for (const r of results) {
    const title = (r.title || '').toString().trim()
    const url = (r.url || '').toString().trim()
    const snippet = (r.snippet || '').toString().trim()
    if (!title || !url) continue
    const key = url.replace(/^https?:\/\//, '').replace(/\/+$/, '')
    if (seen.has(key)) continue
    seen.add(key)
    out.push({
      title,
      url,
      snippet: snippet.slice(0, 320),
    })
  }
  return out
}

/** ----------------- Tavily first ----------------- **/
export async function searchTavily(query: string, opts?: { maxResults?: number }): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) throw new Error('Missing TAVILY_API_KEY')
  const resp = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Tavily accepts POST { api_key, query, search_depth, max_results }
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: 'advanced',
      max_results: opts?.maxResults ?? 8,
      include_answer: false,
      include_raw_content: false,
    }),
    // Ensure RSC fetch defaults
    cache: 'no-store',
  })
  if (!resp.ok) throw new Error(`Tavily error: ${resp.status}`)
  const data = await resp.json()
  const items: TavilyItem[] = Array.isArray(data?.results) ? data.results : []
  return unifyResults(
    items.map((i) => ({
      title: i.title,
      url: i.url,
      snippet: (i.snippet || i.content || '').toString(),
    }))
  )
}

/** ----------------- Brave backup ----------------- **/
export async function searchBrave(query: string, opts?: { count?: number }): Promise<SearchResult[]> {
  const apiKey = process.env.BRAVE_API_KEY
  if (!apiKey) throw new Error('Missing BRAVE_API_KEY')
  const u = new URL('https://api.search.brave.com/res/v1/web/search')
  u.searchParams.set('q', query)
  u.searchParams.set('count', String(opts?.count ?? 8))
  // You can set safesearch, country, freshness, etc. as needed
  const resp = await fetch(u.toString(), {
    headers: {
      'X-Subscription-Token': apiKey,
      'Accept': 'application/json',
    },
    cache: 'no-store',
  })
  if (!resp.ok) throw new Error(`Brave error: ${resp.status}`)
  const data = await resp.json()
  const items: BraveWebItem[] = data?.web?.results ?? []
  return unifyResults(
    items.map((i) => ({
      title: i.title,
      url: i.url,
      snippet: (i.description || i.snippet || '').toString(),
    }))
  )
}

/** ----------------- Composite search (Tavily → Brave fallback) ----------------- **/
export async function webSearchWithFallback(
  query: string,
  rateKey: string,
  opts?: { max?: number }
): Promise<SearchResult[]> {
  const ok = await rateLimit(rateKey)
  if (!ok) throw new Error('Rate limit exceeded. Please try again shortly.')

  try {
    const t = await searchTavily(query, { maxResults: opts?.max ?? 8 })
    if (t.length > 0) return t
             } catch {
             // swallow: fall back to Brave
           }
  // Brave fallback or supplement
  try {
    const b = await searchBrave(query, { count: opts?.max ?? 8 })
    return b
             } catch {
             // If Brave fails too, bubble a friendly error
             throw new Error('Both search providers failed. Please try again.')
           }
}
