import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { searchWeb } from '@/lib/tools/tavily'

const SearchRequestSchema = z.object({
  query: z.string().min(1, 'Query is required').max(500, 'Query too long'),
  maxResults: z.number().optional().default(5)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, maxResults } = SearchRequestSchema.parse(body)

    // Check if Tavily API key is available
    if (!process.env.TAVILY_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Tavily API key not configured. Please add TAVILY_API_KEY to your .env.local file.',
          results: []
        },
        { status: 200 } // Return 200 but with empty results for graceful degradation
      )
    }

    const results = await searchWeb(query, maxResults)

    return NextResponse.json({
      query,
      results,
      totalResults: results.length
    })

  } catch (error) {
    console.error('Search error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request format',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: error.message || 'Search failed',
          results: []
        },
        { status: 200 } // Graceful degradation
      )
    }

    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        results: []
      },
      { status: 500 }
    )
  }
}

