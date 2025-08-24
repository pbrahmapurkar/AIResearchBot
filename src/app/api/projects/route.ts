import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CreateProjectSchema } from '@/types/mister-pb'
import { z } from 'zod'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        _count: {
          select: {
            reports: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate request body
    const validatedData = CreateProjectSchema.parse(body)

    // Get or create user's organization
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organization: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let orgId = user.orgId

    // Create organization if user doesn't have one
    if (!orgId) {
      const organization = await prisma.organization.create({
        data: {
          name: `${user.name || user.email}'s Organization`,
          users: {
            connect: { id: user.id }
          },
          planSubscription: {
            create: {
              plan: 'FREE',
              monthlyQuota: 3,
              usedThisMonth: 0,
              resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
            }
          }
        }
      })

      // Update user with organization
      await prisma.user.update({
        where: { id: user.id },
        data: { orgId: organization.id }
      })

      orgId = organization.id
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        industry: validatedData.industry,
        languages: validatedData.languages,
        regions: validatedData.regions,
        alertsEnabled: validatedData.alertsEnabled,
        alertThresholds: validatedData.alertThresholds,
        userId: session.user.id,
        orgId: orgId!
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        organization: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Failed to create project:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid project data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
