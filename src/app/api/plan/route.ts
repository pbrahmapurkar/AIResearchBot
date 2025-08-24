import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { planMissionJSON } from '@/lib/llm/index'
import { checkRateLimit, getClientIP } from '@/lib/utils'

// Request validation schema
const RequestSchema = z.object({
  mission: z.string().min(1, 'Mission is required').max(1000, 'Mission too long')
})

// Response validation schema - updated to match new format
const PlanStepSchema = z.object({
  index: z.number(),
  title: z.string(),
  objective: z.string(),
  queries: z.array(z.string()),
  deliverable: z.string(),
  estimatedTime: z.string(),
  tools: z.array(z.string()),
  status: z.enum(["pending", "in-progress", "completed", "error"]).optional(),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    snippet: z.string().optional()
  })).optional()
})

const MissionPlanSchema = z.object({
  planTitle: z.string(),
  totalSteps: z.number(),
  estimatedTime: z.string(),
  steps: z.array(PlanStepSchema)
})

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 50, // 50 plan requests per window
  windowMs: 300000  // 5 minute window (planning is resource-intensive)
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, RATE_LIMIT_CONFIG)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Too many planning requests. Please try again later.'
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

    // Parse and validate request body
    const body = await request.json()
    const { mission } = RequestSchema.parse(body)

    // Check if at least one LLM provider is available
    const hasProvider = process.env.GEMINI_API_KEY || 
                       process.env.COHERE_API_KEY || 
                       process.env.HF_API_KEY
    
    if (!hasProvider) {
      return NextResponse.json(
        { 
          error: 'No LLM provider configured. Please add at least one API key (GEMINI_API_KEY, COHERE_API_KEY, or HF_API_KEY) to your .env.local file.' 
        }, { status: 500 }
      )
    }

    // Get plan from the selected LLM provider
    const plan = await planMissionJSON(mission)

    // Validate the response shape
    const validatedPlan = MissionPlanSchema.parse(plan)

    return NextResponse.json(validatedPlan, {
      headers: {
        'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
      }
    })

  } catch (error) {
    console.error('Planning error:', error)

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
      if (error.message.includes('API_KEY')) {
        return NextResponse.json(
          { 
            error: 'LLM provider not configured. Please check your API keys in .env.local file.' 
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { 
          error: error.message || 'Failed to generate plan'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}
