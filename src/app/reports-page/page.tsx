'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, User, TrendingUp, Eye, Download } from 'lucide-react'
import Link from 'next/link'

interface Report {
  id: string
  title: string
  summary: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  createdAt: string
  updatedAt: string
  projectName: string
  insights: string[]
  recommendations: string[]
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demonstration
    const mockReports: Report[] = [
      {
        id: '1',
        title: 'Q4 Consumer Insights Report',
        summary: 'Comprehensive analysis of consumer behavior and market trends for Q4 2024',
        status: 'COMPLETED',
        createdAt: '2024-12-01T10:00:00Z',
        updatedAt: '2024-12-15T14:30:00Z',
        projectName: 'Consumer Insights Q4',
        insights: [
          'Increased preference for digital payments',
          'Growing demand for sustainable products',
          'Regional variations in purchasing behavior'
        ],
        recommendations: [
          'Enhance digital payment infrastructure',
          'Develop sustainable product lines',
          'Implement region-specific marketing strategies'
        ]
      },
      {
        id: '2',
        title: 'Regional Market Analysis',
        summary: 'Deep dive into regional market dynamics and consumer preferences',
        status: 'IN_PROGRESS',
        createdAt: '2024-12-10T09:00:00Z',
        updatedAt: '2024-12-20T11:15:00Z',
        projectName: 'Regional Analysis',
        insights: [
          'Southern markets show higher growth potential',
          'Urban vs rural consumption patterns',
          'Language-specific marketing effectiveness'
        ],
        recommendations: [
          'Focus expansion efforts in southern regions',
          'Develop rural market strategies',
          'Create multilingual marketing campaigns'
        ]
      }
    ]

    setReports(mockReports)
    setLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports Dashboard</h1>
        <p className="text-gray-600">
          View and manage your consumer insights reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              All time reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'COMPLETED').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully generated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'IN_PROGRESS').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'FAILED').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{report.title}</CardTitle>
                  <CardDescription className="text-base mb-3">
                    {report.summary}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {report.projectName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created: {formatDate(report.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Updated: {formatDate(report.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Key Insights */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Key Insights</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {report.insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {report.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Full Report
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Link href={`/reports/${report.id}`}>
                  <Button size="sm" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Detailed Analysis
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {reports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
          <p className="text-gray-600 mb-6">
            Generate your first consumer insights report to get started
          </p>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      )}
    </div>
  )
}
