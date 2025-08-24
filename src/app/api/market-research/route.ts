import { NextRequest, NextResponse } from 'next/server'
import { MarketResearchRequestSchema } from '@/types/market-research'
import { marketResearchAI } from '@/lib/ai/market-research'
import { checkMarketResearchRateLimit, getClientIdentifier } from '@/lib/utils/rate-limit'
import { searchWeb } from '@/lib/tools/tavily'
import { getServerSession } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Rate limiting check
    const clientId = getClientIdentifier(request, session.user.id)
    const rateLimit = checkMarketResearchRateLimit(clientId, true)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Too many market research requests.',
          retryAfter: rateLimit.retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '300',
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
          }
        }
      )
    }

    // Parse and validate request
    const body = await request.json()
    const validatedRequest = MarketResearchRequestSchema.parse(body)

    // Perform web search
    const searchResults = await searchWeb(
      validatedRequest.topic,
      validatedRequest.maxResults
    )

    if (searchResults.length === 0) {
      return NextResponse.json(
        { error: 'No search results found for the given topic' },
        { status: 400 }
      )
    }

    // Create streaming response using ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send search results first
          const searchData = JSON.stringify({
            type: 'search_results',
            data: searchResults
          })
          controller.enqueue(new TextEncoder().encode(`data: ${searchData}\n\n`))

          // Generate AI summary
          await marketResearchAI.generateSummary(
            validatedRequest,
            searchResults,
            (chunk) => {
              const chunkData = JSON.stringify(chunk)
              controller.enqueue(new TextEncoder().encode(`data: ${chunkData}\n\n`))
            }
          )

          // Send completion signal
          const completionData = JSON.stringify({ type: 'complete', progress: 100 })
          controller.enqueue(new TextEncoder().encode(`data: ${completionData}\n\n`))
          
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          const errorData = JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'AI generation failed'
          })
          controller.enqueue(new TextEncoder().encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      }
    })

    // Return streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
      }
    })

  } catch (error) {
    console.error('Market research error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Return AI provider status
    const providerStatus = marketResearchAI.getProviderStatus()
    
    return NextResponse.json({
      providers: providerStatus,
      rateLimit: {
        maxRequests: 10,
        windowMs: 300000 // 5 minutes
      }
    })

  } catch (error) {
    console.error('Market research status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
