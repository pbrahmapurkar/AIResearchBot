import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { searchWeb } from '@/lib/tools/tavily'
import { checkRateLimit, getClientIP } from '@/lib/utils'

const SearchRequestSchema = z.object({
  query: z.string().min(1, 'Query is required').max(500, 'Query too long'),
  maxResults: z.number().optional().default(5)
})

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 100, // 100 search requests per window
  windowMs: 60000   // 1 minute window
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, RATE_LIMIT_CONFIG)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Too many search requests. Please try again later.',
          results: []
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
          }
        }
      )
    }

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
    }, {
      headers: {
        'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
      }
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

