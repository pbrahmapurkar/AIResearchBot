import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateConsumerInsightsReport } from '@/lib/ai/report-generator'
import { z } from 'zod'

type RouteParams = {
  params: Promise<{ id: string }>
}

const GenerateReportSchema = z.object({
  period: z.string().optional().default(new Date().toISOString().slice(0, 7))
})

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const body = await request.json()
    const { period } = GenerateReportSchema.parse(body)

    // Get project with user verification
    const project = await prisma.project.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      },
      include: {
        organization: {
          include: {
            planSubscription: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check usage quota
    const subscription = project.organization.planSubscription
    if (subscription) {
      const quotaExceeded = subscription.plan !== 'PRO' && 
                           subscription.usedThisMonth >= subscription.monthlyQuota

      if (quotaExceeded) {
        return NextResponse.json(
          { 
            error: 'Monthly quota exceeded',
            quota: subscription.monthlyQuota,
            used: subscription.usedThisMonth
          }, 
          { status: 429 }
        )
      }
    }

    // Check if report already exists for this period
    const existingReport = await prisma.report.findFirst({
      where: {
        projectId: project.id,
        period: period
      }
    })

    if (existingReport) {
      return NextResponse.json(existingReport)
    }

    // Create initial report record
    const report = await prisma.report.create({
      data: {
        title: `${project.name} - Consumer Insights Report`,
        summaryMd: '',
        jsonData: {},
        period: period,
        status: 'GENERATING',
        projectId: project.id,
        userId: session.user.id
      }
    })

    // Start background generation
    generateConsumerInsightsReport(project, report.id).catch(error => {
      console.error('Report generation failed:', error)
      prisma.report.update({
        where: { id: report.id },
        data: { status: 'FAILED' }
      }).catch(console.error)
    })

    // Update usage quota
    if (subscription) {
      await prisma.planSubscription.update({
        where: { id: subscription.id },
        data: { usedThisMonth: subscription.usedThisMonth + 1 }
      })

      // Track usage
      await prisma.usage.create({
        data: {
          userId: session.user.id,
          orgId: project.orgId,
          kind: 'REPORT_GENERATION',
          costUnits: 1,
          metadata: {
            projectId: project.id,
            reportId: report.id,
            period: period
          }
        }
      })
    }

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Failed to generate report:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
