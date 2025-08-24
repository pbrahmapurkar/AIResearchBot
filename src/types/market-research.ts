import { z } from 'zod'

// Market Research Request Schema
export const MarketResearchRequestSchema = z.object({
  topic: z.string().min(10, 'Topic must be at least 10 characters').max(500, 'Topic too long'),
  regions: z.array(z.string()).min(1, 'At least one region must be selected').max(10, 'Too many regions'),
  languages: z.array(z.string()).min(1, 'At least one language must be selected').max(5, 'Too many languages'),
  timeframe: z.enum(['1W', '1M', '3M', '6M', '1Y'], {
    errorMap: () => ({ message: 'Invalid timeframe selected' })
  }),
  maxResults: z.number().min(5).max(20)
})

export type MarketResearchRequest = z.infer<typeof MarketResearchRequestSchema>

// Search Result Schema
export const SearchResultSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  snippet: z.string(),
  score: z.number().optional()
})

export type SearchResult = z.infer<typeof SearchResultSchema>

// Market Research Response Schema
export const MarketResearchResponseSchema = z.object({
  id: z.string(),
  topic: z.string(),
  regions: z.array(z.string()),
  languages: z.array(z.string()),
  timeframe: z.string(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']),
  searchResults: z.array(SearchResultSchema),
  summary: z.string().optional(),
  citations: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type MarketResearchResponse = z.infer<typeof MarketResearchResponseSchema>

// AI Provider Configuration
export const AIProviderSchema = z.enum(['groq', 'anthropic'])
export type AIProvider = z.infer<typeof AIProviderSchema>

// Rate Limiting
export interface RateLimitInfo {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

// Streaming Response
export interface StreamingChunk {
  type: 'content' | 'citation' | 'search_result' | 'error' | 'complete'
  content?: string
  citation?: string
  searchResult?: SearchResult
  error?: string
  progress?: number
}
