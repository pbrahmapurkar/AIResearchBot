// src/lib/llm/index.ts
export type Provider = 'auto' | 'openai' | 'gemini' | 'cohere' | 'mistral'
export type Step = { 
  index: number
  title: string
  objective: string
  queries: string[]
  deliverable: string
  estimatedTime: string
  tools: ["Web Search (Tavily)", "Summarization"]
  status?: "pending" | "in-progress" | "completed" | "error"
  sources?: {
    title: string
    url: string
    snippet?: string
  }[]
}
export type Plan = { 
  planTitle: string
  totalSteps: number
  estimatedTime: string
  steps: Step[]
}

const SYS_SCHEMA = `You are an AI Mission Planner specializing in web-based research using Tavily Search API.

CORE CONSTRAINTS:
- You can ONLY use Tavily Web Search and built-in summarization
- Never suggest unavailable tools (surveys, interviews, social media monitoring, etc.)
- All research must be web-accessible through Tavily search queries

OUTPUT REQUIREMENTS for each step:
1. OBJECTIVE: Clear, specific goal for this step
2. QUERIES: 2-4 specific Tavily search queries (exact query strings)  
3. DELIVERABLE: Specific artifact to be produced (with citations)

DELIVERABLE EXAMPLES:
- "Market analysis summary with 5 key trends and source URLs"
- "Competitor comparison table with pricing and features (cited)"
- "Industry report with statistics and expert quotes (linked sources)"

QUERY EXAMPLES:
- "B2B SaaS market trends 2024 growth statistics"
- "enterprise software pricing models comparison"
- "SaaS customer acquisition strategies case studies"

Return ONLY valid JSON:
{"planTitle":string,"totalSteps":number,"estimatedTime":string,"steps":[{"index":number,"title":string,"objective":string,"queries":string[],"deliverable":string,"estimatedTime":string,"tools":["Web Search (Tavily)","Summarization"]}]}

Always ensure queries are specific, searchable, and will yield actionable results through web search.
- Steps must be atomic, ordered, concise.
- No prose outside JSON.`

export async function planMissionJSON(mission: string): Promise<Plan> {
  const provider = (process.env.LLM_PROVIDER || 'auto') as Provider
  const chosen = provider === 'auto' ? autoSelectProvider(mission) : provider
  
  try {
    const raw = await runLLM({ provider: chosen, system: SYS_SCHEMA, user: mission })

    // robust JSON extraction
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    
    if (start === -1 || end === -1) {
      // one retry with stricter instruction
      const retry = await runLLM({
        provider: chosen,
        system: SYS_SCHEMA + '\nReturn ONLY JSON. No markdown, no commentary.',
        user: mission
      })
      const s2 = retry.indexOf('{')
      const e2 = retry.lastIndexOf('}')
      if (s2 === -1 || e2 === -1) throw new Error('Planner did not return JSON')
      return JSON.parse(retry.slice(s2, e2 + 1))
    }
    return JSON.parse(raw.slice(start, end + 1))
  } catch (error) {
    console.error(`Failed with provider ${chosen}:`, error)
    throw error
  }
}

// Import and export OpenAI client
import { OpenAI } from 'openai'

export { OpenAI }

// Only create OpenAI client if API key is available
export const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

export async function runLLM(opts: { provider: Provider, system?: string, user: string }): Promise<string> {
  const p = opts.provider
  
  if (p === 'openai') return (await import('./providers/openai')).callOpenAI(opts)
  if (p === 'gemini') return (await import('./providers/gemini')).callGemini(opts)
  if (p === 'cohere') return (await import('./providers/cohere')).callCohere(opts)
  if (p === 'mistral') return (await import('./providers/huggingface')).callHF(opts)
  
  // auto fallback chain if somehow hit here
  const fallbackOrder = ['gemini', 'openai', 'cohere', 'mistral'] as const
  
  for (const provider of fallbackOrder) {
    try {
      console.log(`Trying fallback provider: ${provider}`)
      if (provider === 'gemini') return await (await import('./providers/gemini')).callGemini(opts)
      if (provider === 'openai') return await (await import('./providers/openai')).callOpenAI(opts)
      if (provider === 'cohere') return await (await import('./providers/cohere')).callCohere(opts)
      if (provider === 'mistral') return await (await import('./providers/huggingface')).callHF(opts)
    } catch (error) {
      console.warn(`Fallback provider ${provider} failed:`, error)
      continue
    }
  }
  
  throw new Error('All LLM providers failed')
}

/** Simple, practical router */
export function autoSelectProvider(mission: string): Exclude<Provider, 'auto'> {
  const lower = mission.toLowerCase()
  const long = mission.length > 800
  const needsWebSynthesis = /\bcompare|benchmark|market|research|collect|summari[sz]e|sources?\b/.test(lower)
  const structured = /\bjson|schema|steps|plan|checklist|outline\b/.test(lower)

  // Heuristics:
  // - Long or researchy → Gemini (fast, generous free tier, good JSON discipline)
  if (long || needsWebSynthesis || structured) return 'gemini'
  // - Complex reasoning / enterprise planning → Cohere Command R+
  if (/\bstrategy|roadmap|enterprise|requirements|trade[- ]?offs?\b/.test(lower)) return 'cohere'
  // - Cost sensitive / simple planning → Mistral via HF
  if (/\bquick|cheap|lightweight|draft\b/.test(lower)) return 'mistral'
  // - Default: OpenAI mini (if key present), else Gemini
  return process.env.OPENAI_API_KEY ? 'openai' : 'gemini'
}
