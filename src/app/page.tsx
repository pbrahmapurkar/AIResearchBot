'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, Eye, Download, Search, Globe, Target, BarChart3, Plus, Brain } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Report {
  id: string
  title: string
  summary: string
  status: string
  createdAt: string
  updatedAt: string
  projectName: string
  insights: string[]
  recommendations: string[]
}

export default function HomePage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Mister PB
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
          AI-Powered Consumer Insights for Bharat&apos;s Tier-2 & Tier-3 Markets
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Badge className="px-4 py-2 text-lg bg-blue-100 text-blue-800">
            🗣️ Real vernacular insights
          </Badge>
          <Badge className="px-4 py-2 text-lg bg-green-100 text-green-800">
            🎯 Tier-2/3 market focus
          </Badge>
          <Badge className="px-4 py-2 text-lg bg-purple-100 text-purple-800">
            🤖 AI-powered analysis
          </Badge>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Search Insights
              </CardTitle>
              <CardDescription>
                Search for consumer insights, market trends, and regional analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/search-page">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                Market Research
              </CardTitle>
              <CardDescription>
                AI-powered market research with web search and intelligent analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/market-research">Start Research</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Regional Setup
              </CardTitle>
              <CardDescription>
                Configure your target regions and languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/onboarding-page">Configure</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                View Reports
              </CardTitle>
              <CardDescription>
                Access your completed reports and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/reports-page">View Reports</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Generate Report
              </CardTitle>
              <CardDescription>
                Create a new AI-powered consumer insights report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/reports-page">Start Analysis</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-600" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Manage your account and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/onboarding-page">Manage Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-teal-600" />
                About Creator
              </CardTitle>
              <CardDescription>
                Learn more about the creator behind Mister PB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/about">Learn More</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Recent Reports</h2>
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
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Insights</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {report.insights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {report.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Full Report
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Link href={`/reports-page/${report.id}`}>
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
      </div>
    </div>
  )
}