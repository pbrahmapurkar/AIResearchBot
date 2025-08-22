'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
// import Link from 'next/link' // Commented out as not used
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft,
  Download,
  Share2,
  TrendingUp,
  TrendingDown,
  Globe,
  // Users, // Commented out as not used
  // Calendar, // Commented out as not used
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  MapPin,
  BarChart3
} from 'lucide-react'
import { INDUSTRY_LABELS, LANGUAGE_LABELS, ReportData } from '@/types/mister-pb'

interface Report {
  id: string
  title: string
  summaryMd: string
  jsonData: ReportData
  period: string
  status: 'GENERATING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  project: {
    id: string
    name: string
    industry: string
    languages: string[]
    regions: string[]
  }
  sources: Array<{
    id: string
    title: string
    url: string
    snippet: string
    language: string
    region: string
    sentiment: number
  }>
}

export default function ReportViewer() {
  const params = useParams()
  const router = useRouter()
  const reportId = params?.id as string
  
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchReport = useCallback(async () => {
    try {
      const response = await fetch(`/api/reports/${reportId}`)
      if (response.ok) {
        const data = await response.json()
        setReport(data)
      } else if (response.status === 404) {
        router.push('/app/projects')
      }
    } catch (error) {
      console.error('Failed to fetch report:', error)
    } finally {
      setLoading(false)
    }
  }, [reportId, router])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const handleExport = async (format: 'pdf' | 'csv' | 'markdown') => {
    try {
      const response = await fetch(`/api/reports/${reportId}/export?format=${format}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${report?.title}-${report?.period}.${format}`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.2) return 'text-green-600 bg-green-100'
    if (sentiment >= -0.2) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment >= 0.2) return 'Positive'
    if (sentiment >= -0.2) return 'Neutral'
    return 'Negative'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-64 bg-gray-300 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-4">The report you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/app/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  const data = report.jsonData

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/app/projects/${report.project.id}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{report.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {INDUSTRY_LABELS[report.project.industry as keyof typeof INDUSTRY_LABELS]}
                </Badge>
                <div className="flex items-center space-x-2">
                  {report.status === 'COMPLETED' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {report.status === 'GENERATING' && <Clock className="h-4 w-4 text-yellow-600" />}
                  {report.status === 'FAILED' && <AlertCircle className="h-4 w-4 text-red-600" />}
                  <span className="text-sm text-gray-600">
                    {report.status === 'COMPLETED' && 'Completed'}
                    {report.status === 'GENERATING' && 'Generating...'}
                    {report.status === 'FAILED' && 'Failed'}
                  </span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-600">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => {}}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <div className="relative group">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <div className="py-1">
                  <button 
                    onClick={() => handleExport('pdf')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Export as PDF
                  </button>
                  <button 
                    onClick={() => handleExport('csv')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Export as CSV
                  </button>
                  <button 
                    onClick={() => handleExport('markdown')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Export as Markdown
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {report.status === 'GENERATING' && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900">Report Generation in Progress</h3>
                  <p className="text-yellow-700 text-sm">
                    We&apos;re analyzing consumer insights across your target markets. This typically takes 2-3 minutes.
                  </p>
                  <div className="mt-3">
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {report.status === 'FAILED' && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Report Generation Failed</h3>
                  <p className="text-red-700 text-sm">
                    There was an error generating this report. Please try again.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {report.status === 'COMPLETED' && data && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getSentimentColor(data.summary.overallSentiment)}`}>
                      {data.summary.overallSentiment >= 0 ? (
                        <TrendingUp className="h-6 w-6" />
                      ) : (
                        <TrendingDown className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Overall Sentiment</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {getSentimentLabel(data.summary.overallSentiment)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Score: {data.summary.overallSentiment.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Price Sensitivity</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {data.summary.avgPriceSensitivity}%
                      </p>
                      <p className="text-xs text-gray-500">Average across regions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sources Analyzed</p>
                      <p className="text-2xl font-bold text-gray-900">{report.sources.length}</p>
                      <p className="text-xs text-gray-500">Vernacular content</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Regions Covered</p>
                      <p className="text-2xl font-bold text-gray-900">{data.regionalInsights.length}</p>
                      <p className="text-xs text-gray-500">Target markets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Executive Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                    <CardDescription>Key insights and findings</CardDescription>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <ReactMarkdown>{report.summaryMd}</ReactMarkdown>
                  </CardContent>
                </Card>

                {/* Regional Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>Regional Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.regionalInsights.map((insight, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{insight.region}</h4>
                          <Badge className={getSentimentColor(insight.sentiment)}>
                            {getSentimentLabel(insight.sentiment)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Sentiment Score</p>
                            <p className="font-semibold">{insight.sentiment.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Price Sensitivity</p>
                            <p className="font-semibold">{insight.pricesensitivity}%</p>
                          </div>
                        </div>
                        {insight.topKeywords.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-2">Key Topics</p>
                            <div className="flex flex-wrap gap-1">
                              {insight.topKeywords.slice(0, 3).map((keyword, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Trending Topics */}
                {data.trendingTopics.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Trending Topics</CardTitle>
                      <CardDescription>Most discussed topics in your markets</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {data.trendingTopics.map((topic, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{topic.topic}</p>
                            <p className="text-sm text-gray-600">{topic.mentions} mentions</p>
                          </div>
                          <Badge className={getSentimentColor(topic.sentiment)}>
                            {getSentimentLabel(topic.sentiment)}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Language Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Language Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.languageInsights.map((insight, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {LANGUAGE_LABELS[insight.language as keyof typeof LANGUAGE_LABELS]}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {insight.sourceCount} sources
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{insight.culturalContext}</p>
                        {insight.priceTerms.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {insight.priceTerms.slice(0, 2).map((term, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {term}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Sources */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sources</CardTitle>
                    <CardDescription>Content analyzed for this report</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {report.sources.slice(0, 10).map((source, _index) => (
                      <div key={source.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-sm text-gray-900 line-clamp-2">
                            {source.title}
                          </h5>
                          <Badge className={`ml-2 ${getSentimentColor(source.sentiment)}`}>
                            {getSentimentLabel(source.sentiment)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-3">
                          {source.snippet}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{source.region}</span>
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 hover:text-blue-600"
                          >
                            <span>View Source</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                    {report.sources.length > 10 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{report.sources.length - 10} more sources
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
