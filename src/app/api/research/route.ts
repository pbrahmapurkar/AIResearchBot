import { NextRequest, NextResponse } from 'next/server'
import { MissionOrchestrator } from '@/lib/research/missionOrchestrator'
// import { ModelOrchestrator } from '@/lib/research/modelIntegration' // TODO: Use for advanced model routing
import { z } from 'zod'

const ResearchRequestSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  languages: z.array(z.enum(['hi', 'ta', 'te', 'mr'])).optional(),
  timeframe: z.enum(['week', 'month', 'quarter']).optional(),
  focus: z.enum(['sentiment', 'price', 'cultural', 'comprehensive']).optional(),
  enableRealTimeSearch: z.boolean().default(false),
  enableModelOrchestration: z.boolean().default(true)
})

const missionOrchestrator = new MissionOrchestrator()
// const modelOrchestrator = new ModelOrchestrator() // TODO: Implement when needed

// POST /api/research - Start new research mission
export async function POST(request: NextRequest) {
  try {
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
    const completedMission = await missionOrchestrator.executeMission(mission)

    return NextResponse.json({
      success: true,
      mission: completedMission,
      modelAttribution: completedMission.report?.modelAttribution || {},
      costs: calculateMissionCosts(completedMission),
      insights: {
        totalSources: completedMission.sources.length,
        languagesProcessed: mission.targetLanguages,
        executionTime: completedMission.completedAt ? 
          completedMission.completedAt - completedMission.createdAt : 0,
        modelsUsed: completedMission.subtasks.map(t => t.assignedModel)
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

    const filteredMissions = status 
      ? mockMissions.filter(m => m.status === status)
      : mockMissions

    return NextResponse.json({
      success: true,
      missions: filteredMissions.slice(0, limit),
      total: filteredMissions.length
    })

  } catch (error) {
    console.error('Failed to fetch missions:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch research missions'
    }, { status: 500 })
  }
}

interface CostBreakdown {
  model: string
  cost: number
  duration: number
}

interface MissionCosts {
  total: number
  breakdown: CostBreakdown[]
}

function calculateMissionCosts(mission: { subtasks?: Array<{ assignedModel: string, cost?: number, duration?: number }> }): MissionCosts {
  const totalCost = mission.subtasks?.reduce((sum: number, task) => {
    return sum + (task.cost || 0)
  }, 0) || 0

  return {
    total: totalCost,
    breakdown: mission.subtasks?.map((task) => ({
      model: task.assignedModel,
      cost: task.cost || 0,
      duration: task.duration || 0
    })) || []
  }
}
