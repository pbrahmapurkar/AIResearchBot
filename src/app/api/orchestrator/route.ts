import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { orchestrator } from '@/lib/orchestrator'
import { checkRateLimit, getClientIP } from '@/lib/utils'
import { getRateLimitConfig } from '@/lib/config/security'

// Input validation schema for orchestrator requests
const OrchestratorRequestSchema = z.object({
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(10000, 'Prompt too long (max 10000 characters)')
    .refine((val) => !val.includes('<script>') && !val.includes('javascript:'), {
      message: 'Prompt contains potentially dangerous content'
    }),
  type: z.enum(['completion', 'search', 'analysis', 'synthesis'])
    .default('completion'),
  requiresRealTime: z.boolean().default(false),
  maxTokens: z.number()
    .min(1, 'Max tokens must be at least 1')
    .max(8000, 'Max tokens cannot exceed 8000')
    .default(1000),
  temperature: z.number()
    .min(0, 'Temperature must be at least 0')
    .max(2, 'Temperature cannot exceed 2')
    .default(0.7)
})

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
    // Rate limiting check using centralized config
    const clientIP = getClientIP(request)
    const rateLimitConfig = getRateLimitConfig('orchestrator')
    const rateLimit = checkRateLimit(clientIP, rateLimitConfig)
    
    if (!rateLimit.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded',
        details: {
          message: 'Too many requests. Please try again later.',
          resetTime: new Date(rateLimit.resetTime).toISOString(),
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        }
      }, { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
        }
      })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedInput = OrchestratorRequestSchema.parse(body)

    // Process task through orchestrator (includes automatic validation)
    const result = await orchestrator.processTask({
      type: validatedInput.type,
      prompt: validatedInput.prompt,
      requiresRealTime: validatedInput.requiresRealTime,
      maxTokens: validatedInput.maxTokens,
      temperature: validatedInput.temperature
    })

    return NextResponse.json({
      success: result.success,
      result: result.result,
      provider: result.provider,
      citations: result.citations,
      error: result.error,
      latency: result.latency,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
      }
    })
  } catch (error) {
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request parameters',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      }, { status: 400 })
    }

    // Handle other errors
    return NextResponse.json({
      success: false,
      error: 'Task processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
