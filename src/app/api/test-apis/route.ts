import { NextRequest, NextResponse } from 'next/server'
import { HuggingFaceClient, TogetherAIClient, PerplexityClient } from '@/lib/research/modelIntegration'
import { getAPIConfig, isRealAPIsEnabled } from '@/lib/config/apiConfig'

export async function POST(request: NextRequest) {
  try {
    const { provider, testType } = await request.json()

    if (!isRealAPIsEnabled()) {
      return NextResponse.json({
        success: false,
        error: 'Real APIs are disabled. Set NEXT_PUBLIC_ENABLE_REAL_APIS=true to test APIs.'
      }, { status: 400 })
    }

    const config = getAPIConfig()
    const results: Record<string, unknown> = {}

    switch (provider) {
      case 'huggingface':
        if (!config.huggingface.enabled) {
          return NextResponse.json({
            success: false,
            error: 'HuggingFace API key not configured'
          }, { status: 400 })
        }
        
        try {
          const client = new HuggingFaceClient()
          const testText = testType === 'sentiment' ? 
            'This product is absolutely amazing! I love it.' : 
            'इस उत्पाद का गुणवत्ता बहुत अच्छा है।' // Hindi text

          const result = await client.analyzeSentimentIndicBERT(testText, 'hi')
          results.huggingface = {
            success: true,
            result: result.result,
            latency: result.latency,
            cost: result.usage.cost
          }
        } catch (error) {
          results.huggingface = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
        break

      case 'together':
        if (!config.together.enabled) {
          return NextResponse.json({
            success: false,
            error: 'Together AI API key not configured'
          }, { status: 400 })
        }
        
        try {
          const client = new TogetherAIClient()
          const testText = 'The new iPhone is expensive but has great features. Many people are discussing the price vs value.'
          const result = await client.extractTrends(testText, 'smartphones')
          
          results.together = {
            success: true,
            result: result.result,
            latency: result.latency,
            cost: result.usage.cost
          }
        } catch (error) {
          results.together = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
        break

      case 'perplexity':
        if (!config.perplexity.enabled) {
          return NextResponse.json({
            success: false,
            error: 'Perplexity API key not configured'
          }, { status: 400 })
        }
        
        try {
          const client = new PerplexityClient()
          const result = await client.searchRealtimeData(
            'consumer behavior India Tier 2 cities smartphones',
            ['hi', 'ta']
          )
          
          results.perplexity = {
            success: true,
            result: result.result,
            latency: result.latency,
            cost: result.usage.cost
          }
        } catch (error) {
          results.perplexity = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
        break

      case 'all':
        // Test all providers
        const providers = ['huggingface', 'together', 'perplexity']
        for (const p of providers) {
          try {
            const response = await fetch(request.url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ provider: p, testType })
            })
            const result = await response.json()
            results[p] = result
          } catch (error) {
            results[p] = {
              success: false,
              error: `Failed to test ${p}: ${error}`
            }
          }
        }
        break

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown provider: ${provider}`
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      provider,
      testType,
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('API test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'API test execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to check API configuration
export async function GET() {
  try {
    const config = getAPIConfig()
    const status = {
      realAPIsEnabled: isRealAPIsEnabled(),
      providers: {
        huggingface: {
          configured: config.huggingface.enabled,
          baseUrl: config.huggingface.baseUrl
        },
        together: {
          configured: config.together.enabled,
          baseUrl: config.together.baseUrl
        },
        perplexity: {
          configured: config.perplexity.enabled,
          baseUrl: config.perplexity.baseUrl
        },
        openai: {
          configured: config.openai.enabled,
          baseUrl: config.openai.baseUrl
        }
      }
    }

    return NextResponse.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Failed to get API status:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get API configuration status'
    }, { status: 500 })
  }
}
