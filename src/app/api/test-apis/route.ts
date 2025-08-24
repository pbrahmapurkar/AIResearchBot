import { NextRequest, NextResponse } from 'next/server'
import { apiConfig } from '@/lib/config/apiConfig'
import { mockModelClient } from '@/lib/research/modelIntegration'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Test API configuration
    const config = {
      gemini: {
        configured: apiConfig.gemini.enabled,
        baseUrl: apiConfig.gemini.baseUrl
      },
      cohere: {
        configured: apiConfig.cohere.enabled,
        baseUrl: apiConfig.cohere.baseUrl
      },
      huggingface: {
        configured: apiConfig.huggingface.enabled,
        baseUrl: apiConfig.huggingface.baseUrl
      }
    }

    // Test mock model client
    const mockTest = await mockModelClient.generateText('Test prompt')

    return NextResponse.json({
      status: 'success',
      message: 'API test completed',
      config,
      mockTest
    })

  } catch (error) {
    console.error('API test error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        message: 'API test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
