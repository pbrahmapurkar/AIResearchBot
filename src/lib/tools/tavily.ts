// src/lib/tools/tavily.ts
const TAVILY_API_KEY = process.env.NEXT_PUBLIC_TAVILY_API_KEY || process.env.TAVILY_API_KEY

type TavilyResult = { title: string; url: string; snippet: string }

export async function searchWeb(query: string, k = 6): Promise<TavilyResult[]> {
  if (!TAVILY_API_KEY) {
    // Return empty but do not throw — app should still work
    if (process.env.NODE_ENV !== 'production') {
      console.warn('TAVILY_API_KEY not found. Search will be disabled.')
    }
    return []
  }

  try {
    // Correct Tavily API endpoint and format
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query,
        search_depth: 'basic',
        include_answer: false,
        include_raw_content: false,
        max_results: k,
        include_domains: [],
        exclude_domains: []
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Tavily search failed:', res.status, errorText)
      return []
    }

    const data = await res.json()
    
    // Tavily returns results in a different format
    return (data.results || []).map((r: Record<string, unknown>) => ({
      title: String(r.title || 'Untitled'),
      url: String(r.url || ''),
      snippet: String(r.content || r.snippet || ''),
    }))
  } catch (error) {
    console.error('Tavily search error:', error)
    return []
  }
}

export interface SearchResult {
  title: string
  url: string
  snippet: string
  score: number
}

export interface SearchResponse {
  query: string
  results: SearchResult[]
  totalResults: number
}

class TavilySearch {
  async search(query: string, maxResults: number = 8): Promise<SearchResponse> {
    const results = await searchWeb(query, maxResults)
    
    return {
      query,
      results: results.map((r, index) => ({
        ...r,
        score: 1 - (index * 0.1) // Simple scoring based on order
      })),
      totalResults: results.length
    }
  }

  private getMockResults(query: string, maxResults: number): SearchResponse {
    const mockResults: SearchResult[] = [
      {
        title: `${query} - Official Documentation`,
        url: `https://docs.example.com/${query.toLowerCase().replace(/\s+/g, '-')}`,
        snippet: `Official documentation and guides for ${query}. Comprehensive information about features, usage, and best practices.`,
        score: 0.95
      },
      {
        title: `${query} Tutorial and Examples`,
        url: `https://tutorial.example.com/${query.toLowerCase().replace(/\s+/g, '-')}`,
        snippet: `Learn ${query} with step-by-step tutorials, code examples, and practical use cases.`,
        score: 0.88
      },
      {
        title: `${query} - GitHub Repository`,
        url: `https://github.com/example/${query.toLowerCase().replace(/\s+/g, '-')}`,
        snippet: `Open source implementation and community-driven development of ${query}. Issues, discussions, and contributions.`,
        score: 0.82
      },
      {
        title: `${query} Community Forum`,
        url: `https://community.example.com/topic/${query.toLowerCase().replace(/\s+/g, '-')}`,
        snippet: `Community discussions, questions, and answers about ${query}. Get help from experts and share knowledge.`,
        score: 0.75
      }
    ]

    return {
      query,
      results: mockResults.slice(0, maxResults),
      totalResults: Math.min(mockResults.length, maxResults)
    }
  }
}

export const tavilySearch = new TavilySearch()

// Create Tavily client for advanced usage
import { TavilyClient } from 'tavily'
export const tavily = new TavilyClient({ 
  apiKey: process.env.TAVILY_API_KEY || process.env.NEXT_PUBLIC_TAVILY_API_KEY 
})
