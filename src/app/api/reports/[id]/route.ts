import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { cookies, headers } from 'next/headers'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = await cookies()
    const headersList = await headers()
    const session = await getServerSession(authOptions)
    
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
