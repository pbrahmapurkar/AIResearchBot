'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
// import Link from 'next/link' // Commented out as it's not used
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft,
  BarChart3, 
  TrendingUp,
  TrendingDown,
  // Globe, // Commented out as it's not used
  Users,
  Calendar,
  FileText,
  Download,
  RefreshCw,
  Settings,
  AlertCircle,
  MapPin,
  Languages
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

export default function ProjectDashboard() {
  const params = useParams()
  const router = useRouter()
  const projectId = params?.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else if (response.status === 404) {
        router.push('/app/projects')
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
    } finally {
      setLoading(false)
    }
  }, [projectId, router])

  useEffect(() => {
    fetchProject()
  }, [projectId, fetchProject])

  const handleGenerateReport = async () => {
    setGenerating(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/reports/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period: new Date().toISOString().slice(0, 7) // Current month YYYY-MM
        })
      })

      if (response.ok) {
        const report = await response.json()
        router.push(`/app/reports/${report.id}`)
      } else {
        console.error('Failed to generate report')
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-300 rounded-lg"></div>
                <div className="h-64 bg-gray-300 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-300 rounded-lg"></div>
                <div className="h-48 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/app/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/app/projects')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {INDUSTRY_LABELS[project.industry as keyof typeof INDUSTRY_LABELS]}
                </Badge>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-600">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => {}}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              onClick={handleGenerateReport}
              disabled={generating}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Reports</p>
                      <p className="text-2xl font-bold text-gray-900">{project._count.reports}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Sentiment</p>
                      <p className="text-2xl font-bold text-gray-900">+0.2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <TrendingDown className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Price Sensitivity</p>
                      <p className="text-2xl font-bold text-gray-900">23%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Recent Reports</span>
                </CardTitle>
                <CardDescription>
                  Your latest consumer insights reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project._count.reports === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports yet</h3>
                    <p className="text-gray-600 mb-4">
                      Generate your first report to start analyzing consumer insights for this project.
                    </p>
                    <Button 
                      onClick={handleGenerateReport}
                      disabled={generating}
                      className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                    >
                      {generating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Generate First Report
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Report history will appear here once generated.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Regional Heatmap Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Regional Insights</span>
                </CardTitle>
                <CardDescription>
                  Consumer sentiment across your target regions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive regional heatmap</p>
                    <p className="text-sm text-gray-500">Coming soon after first report generation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Languages */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Languages className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {LANGUAGE_LABELS[lang as keyof typeof LANGUAGE_LABELS]}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Regions */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Target Regions</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.regions.slice(0, 4).map((region) => (
                      <Badge key={region} variant="outline" className="text-xs">
                        {region}
                      </Badge>
                    ))}
                    {project.regions.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.regions.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Alerts */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Alerts</span>
                    <Badge 
                      variant={project.alertsEnabled ? "default" : "secondary"}
                      className={project.alertsEnabled ? "bg-green-600" : ""}
                    >
                      {project.alertsEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Summary</CardTitle>
                <CardDescription>Current month usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Reports Generated</span>
                    <span>{project._count.reports}/3</span>
                  </div>
                  <Progress 
                    value={(project._count.reports / 3) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Free plan includes 3 reports per month
                  </p>
                </div>
                
                <div className="pt-2 border-t">
                  <Button variant="outline" className="w-full">
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Project Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
