// src/lib/llm/index.ts
export type Provider = 'auto' | 'gemini' | 'cohere' | 'mistral'
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
    const response = await callLLM({ provider: chosen, system: SYS_SCHEMA, user: mission })
    const raw = response.content

    // robust JSON extraction
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    
    if (start === -1 || end === -1) {
      // one retry with stricter instruction
      const retryResponse = await callLLM({
        provider: chosen,
        system: SYS_SCHEMA + '\nReturn ONLY JSON. No markdown, no commentary.',
        user: mission
      })
      const retry = retryResponse.content
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

export interface LLMOptions {
  system?: string
  user: string
  provider?: Provider
  temperature?: number
  maxTokens?: number
}

export interface LLMResponse {
  content: string
  provider: Provider
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// Mock implementations for providers
async function callGemini(opts: LLMOptions): Promise<LLMResponse> {
  // Mock implementation
  return {
    content: `Mock Gemini response: ${opts.user.substring(0, 100)}...`,
    provider: 'gemini',
    usage: { promptTokens: 50, completionTokens: 100, totalTokens: 150 }
  }
}

async function callCohere(opts: LLMOptions): Promise<LLMResponse> {
  // Mock implementation
  return {
    content: `Mock Cohere response: ${opts.user.substring(0, 100)}...`,
    provider: 'cohere',
    usage: { promptTokens: 50, completionTokens: 100, totalTokens: 150 }
  }
}

async function callMistral(opts: LLMOptions): Promise<LLMResponse> {
  // Mock implementation
  return {
    content: `Mock Mistral response: ${opts.user.substring(0, 100)}...`,
    provider: 'mistral',
    usage: { promptTokens: 50, completionTokens: 100, totalTokens: 150 }
  }
}

export async function callLLM(opts: LLMOptions): Promise<LLMResponse> {
  const provider = opts.provider || 'auto'
  
  if (provider === 'auto') {
    // Try providers in order of preference
    try {
      return await callGemini(opts)
    } catch {
      try {
        return await callCohere(opts)
      } catch {
        return await callMistral(opts)
      }
    }
  }
  
  switch (provider) {
    case 'gemini':
      return await callGemini(opts)
    case 'cohere':
      return await callCohere(opts)
    case 'mistral':
      return await callMistral(opts)
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

// Auto-select best available provider
export function getBestProvider(): Provider {
  // In mock mode, always return gemini
  return 'gemini'
}

// Fallback provider selection
export function getFallbackProvider(): Provider {
  // In mock mode, always return gemini
  return 'gemini'
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
  // - Default: Gemini (reliable, free tier available)
  return 'gemini'
}
