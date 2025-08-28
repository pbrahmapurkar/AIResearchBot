import { NextRequest, NextResponse } from 'next/server'
import { mockModelClient } from '@/lib/research/modelIntegration'

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Test API configuration - all providers in mock mode
    const config = {
      gemini: {
        configured: false,
        baseUrl: 'Mock Mode'
      },
      cohere: {
        configured: false,
        baseUrl: 'Mock Mode'
      },
      huggingface: {
        configured: false,
        baseUrl: 'Mock Mode'
      }
    }

    // Test mock model client
    const mockTest = await mockModelClient.generateText('Test prompt')

    return NextResponse.json({
      status: 'success',
      message: 'API test completed - Running in Mock Mode',
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
