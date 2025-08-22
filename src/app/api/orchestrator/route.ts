import { NextRequest, NextResponse } from 'next/server'
import { orchestrator } from '@/lib/orchestrator'

// GET endpoint - Check orchestrator status and provider health
export async function GET() {
  try {
    const validation = await orchestrator.validateAndInitialize()
    const status = orchestrator.getStatus()

    return NextResponse.json({
      success: true,
      validation,
      status,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to validate orchestrator',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST endpoint - Process task through orchestrator
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, type = 'completion', requiresRealTime = false, maxTokens = 1000, temperature = 0.7 } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Valid prompt is required'
      }, { status: 400 })
    }

    // Process task through orchestrator (includes automatic validation)
    const result = await orchestrator.processTask({
      type,
      prompt,
      requiresRealTime,
      maxTokens,
      temperature
    })

    return NextResponse.json({
      success: result.success,
      result: result.result,
      provider: result.provider,
      citations: result.citations,
      error: result.error,
      latency: result.latency,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Task processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
