'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  BarChart3, 
  Globe, 
  Users, 
  Bell,
  BellOff,
  Calendar,
  ArrowRight,
  Settings
} from 'lucide-react'
import { INDUSTRY_LABELS, LANGUAGE_LABELS } from '@/types/mister-pb'

interface Project {
  id: string
  name: string
  industry: string
  languages: string[]
  regions: string[]
  alertsEnabled: boolean
  createdAt: string
  _count: {
    reports: number
  }
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Projects</h1>
            <p className="text-gray-600 mt-2">
              Manage your consumer insights projects across different markets
            </p>
          </div>
          <Button 
            onClick={() => router.push('/app/onboarding')}
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="h-24 w-24 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Mister PB!
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first project to start analyzing consumer insights across 
              Tier-2 and Tier-3 markets in India.
            </p>
            <Button 
              onClick={() => router.push('/app/onboarding')}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => router.push(`/app/projects/${project.id}`)}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle settings click
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {INDUSTRY_LABELS[project.industry as keyof typeof INDUSTRY_LABELS]}
                    </Badge>
                    {project.alertsEnabled ? (
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        <Bell className="h-3 w-3 mr-1" />
                        Alerts On
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-gray-200 text-gray-500">
                        <BellOff className="h-3 w-3 mr-1" />
                        Alerts Off
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Languages */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {project.languages.slice(0, 3).map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {LANGUAGE_LABELS[lang as keyof typeof LANGUAGE_LABELS]}
                        </Badge>
                      ))}
                      {project.languages.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.languages.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Regions */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">Regions</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {project.regions.slice(0, 2).map((region) => (
                        <Badge key={region} variant="outline" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                      {project.regions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.regions.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Created {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <BarChart3 className="h-4 w-4" />
                      <span>{project._count.reports} reports</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-2">
                    <Link href={`/app/projects/${project.id}`}>
                      <Button 
                        variant="ghost" 
                        className="w-full group-hover:bg-blue-50 group-hover:text-blue-600"
                      >
                        View Dashboard
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
