import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const report = await prisma.report.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            industry: true,
            languages: true,
            regions: true
          }
        },
        sources: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('Failed to fetch report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}
