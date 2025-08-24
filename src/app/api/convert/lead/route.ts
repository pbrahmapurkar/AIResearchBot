import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const LeadSchema = z.object({
  email: z.string().email('Invalid email address'),
  utm: z.object({
    source: z.string().nullable(),
    medium: z.string().nullable(),
    campaign: z.string().nullable(),
    term: z.string().nullable(),
    content: z.string().nullable(),
  }).optional(),
  source: z.string().optional(),
})

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)
  
  if (!limit || now > limit.resetTime) {
    // Reset or create new limit (10 requests per minute)
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 })
    return false
  }
  
  if (limit.count >= 10) {
    return true
  }
  
  limit.count++
  return false
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = LeadSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { email, utm, source } = validationResult.data

    // Check if lead already exists
    const existingLead = await prisma.lead.findUnique({
      where: { email }
    })

    if (existingLead) {
      // Update existing lead with new UTM data if provided
      const updatedLead = await prisma.lead.update({
        where: { email },
        data: {
          utm: utm ? {
            source: utm.source,
            medium: utm.medium,
            campaign: utm.campaign,
            term: utm.term,
            content: utm.content,
          } : undefined,
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Lead updated successfully',
        leadId: updatedLead.id,
        isNewLead: false
      })
    }

    // Create new lead
    const newLead = await prisma.lead.create({
      data: {
        email,
        utm: utm ? JSON.stringify({
          source: utm.source,
          medium: utm.medium,
          campaign: utm.campaign,
          term: utm.term,
          content: utm.content,
          captureSource: source,
          ipAddress: ip,
          userAgent: request.headers.get('user-agent'),
          referrer: request.headers.get('referer'),
        }) : JSON.stringify({
          captureSource: source,
          ipAddress: ip,
          userAgent: request.headers.get('user-agent'),
          referrer: request.headers.get('referer'),
        })
      }
    })

    // TODO: In production, trigger email sending here
    // - Generate personalized sample report
    // - Send welcome email with report
    // - Add to email marketing sequence

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully',
      leadId: newLead.id,
      isNewLead: true
    }, { status: 201 })

  } catch (error) {
    console.error('Lead capture error:', error)
    
    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for lead analytics (protected route)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '7d'
    
    // Calculate date range
    const now = new Date()
    let startDate: Date
    
    switch (timeframe) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    // Get lead analytics
    const [totalLeads, recentLeads, leadsByDay] = await Promise.all([
      // Total leads count
      prisma.lead.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Recent leads
      prisma.lead.findMany({
        where: {
          createdAt: {
            gte: startDate
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10,
        select: {
          id: true,
          email: true,
          createdAt: true,
          utm: true
        }
      }),
      
      // Leads by day for chart
      prisma.$queryRaw`
        SELECT DATE(createdAt) as date, COUNT(*) as count
        FROM Lead
        WHERE createdAt >= ${startDate.toISOString()}
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `
    ])

    return NextResponse.json({
      success: true,
      analytics: {
        totalLeads,
        recentLeads,
        leadsByDay,
        timeframe
      }
    })

  } catch (error) {
    console.error('Lead analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
