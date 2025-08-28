import { NextRequest, NextResponse } from 'next/server'
import { MissionOrchestrator, type ResearchMission } from '@/lib/research/missionOrchestrator'
// import { ModelOrchestrator } from '@/lib/research/modelIntegration' // TODO: Use for advanced model routing
import { z } from 'zod'
import { checkRateLimit, getClientIP } from '@/lib/utils'

export const runtime = 'nodejs'

const ResearchRequestSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  languages: z.array(z.enum(['hi', 'ta', 'te', 'mr'])).optional(),
  timeframe: z.enum(['week', 'month', 'quarter']).optional(),
  focus: z.enum(['sentiment', 'price', 'cultural', 'comprehensive']).optional(),
  enableRealTimeSearch: z.boolean().default(false),
  enableModelOrchestration: z.boolean().default(true)
})

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 30, // 30 research requests per window
  windowMs: 300000  // 5 minute window (research is resource-intensive)
}

const missionOrchestrator = new MissionOrchestrator()
// const modelOrchestrator = new ModelOrchestrator() // TODO: Implement when needed

// Helper function to calculate mission costs
function calculateMissionCosts(completedMission: ResearchMission) {
  // TODO: Implement proper cost calculation
  return {
    estimatedCost: 0.05,
    currency: 'USD',
    breakdown: {
      search: 0.02,
      analysis: 0.02,
      synthesis: 0.01
    }
  }
}

// POST /api/research - Start new research mission
export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, RATE_LIMIT_CONFIG)
    
    if (!rateLimit.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded',
        details: {
          message: 'Too many research requests. Please try again later.',
          resetTime: new Date(rateLimit.resetTime).toISOString(),
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        }
      }, { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
        }
      })
    }

    const body = await request.json()
    const validatedInput = ResearchRequestSchema.parse(body)

    // Parse the mission prompt
    const mission = missionOrchestrator.parseMissionPrompt(validatedInput.prompt)

    // Override with explicit parameters if provided
    if (validatedInput.languages) {
      mission.targetLanguages = validatedInput.languages
    }
    if (validatedInput.timeframe) {
      mission.timeframe = validatedInput.timeframe
    }
    if (validatedInput.focus) {
      mission.focus = validatedInput.focus
    }

    // Execute the mission with model orchestration
    const _completedMission = await missionOrchestrator.executeMission(mission)

    return NextResponse.json({
      success: true,
      mission: _completedMission,
      modelAttribution: _completedMission.report?.modelAttribution || {},
      costs: calculateMissionCosts(_completedMission),
      insights: {
        totalSources: _completedMission.sources.length,
        languagesProcessed: mission.targetLanguages,
        executionTime: _completedMission.completedAt ? 
          _completedMission.completedAt - _completedMission.createdAt : 0,
        modelsUsed: _completedMission.subtasks.map((t: { assignedModel: string }) => t.assignedModel)
      }
    }, {
      headers: {
        'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
      }
    })

  } catch (error) {
    console.error('Research mission failed:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request parameters',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Research mission execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET /api/research - List recent research missions
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const status = url.searchParams.get('status')

    // TODO: Implement mission storage/retrieval from database
    // For now, return mock data
    const mockMissions = [
      {
        id: 'mission_1',
        title: 'FMCG Snack Brand Analysis - Hindi/Marathi Markets',
        status: 'completed',
        createdAt: Date.now() - 86400000,
        completedAt: Date.now() - 86300000,
        targetLanguages: ['hi', 'mr'],
        focus: 'comprehensive'
      },
      {
        id: 'mission_2', 
        title: 'Food Delivery Discount Discussions - Tamil Nadu',
        status: 'running',
        createdAt: Date.now() - 3600000,
        targetLanguages: ['ta'],
        focus: 'price'
      }
    ]

    return NextResponse.json({
      success: true,
      missions: mockMissions.slice(0, limit),
      total: mockMissions.length,
      limit,
      status
    })

  } catch (error) {
    console.error('Failed to fetch research missions:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch research missions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
