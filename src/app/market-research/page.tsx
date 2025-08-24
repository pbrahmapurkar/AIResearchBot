'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MarketResearchForm } from '@/components/market-research/MarketResearchForm'
import { MarketResearchResults } from '@/components/market-research/MarketResearchResults'
import { MarketResearchRequest, SearchResult } from '@/types/market-research'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Target, 
  TrendingUp, 
  Globe, 
  Languages,
  Zap
} from 'lucide-react'

export default function MarketResearchPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [streamingContent, setStreamingContent] = useState('')
  const [citations, setCitations] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [currentRequest, setCurrentRequest] = useState<MarketResearchRequest | null>(null)

  const handleSubmit = useCallback(async (data: MarketResearchRequest) => {
    setIsLoading(true)
    setError(undefined)
    setStreamingContent('')
    setCitations([])
    setIsComplete(false)
    setCurrentRequest(data)

    try {
      const response = await fetch('/api/market-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Market research failed')
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response stream available')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'search_results') {
                setSearchResults(data.data || [])
              } else if (data.type === 'content') {
                setStreamingContent(prev => prev + (data.content || ''))
              } else if (data.type === 'citation') {
                setCitations(prev => [...new Set([...prev, data.citation])])
              } else if (data.type === 'complete') {
                setIsComplete(true)
                setIsLoading(false)
              } else if (data.type === 'error') {
                throw new Error(data.error || 'AI generation failed')
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming data:', parseError)
            }
          }
        }
      }

      setIsLoading(false)
      setIsComplete(true)

    } catch (err) {
      console.error('Market research error:', err)
      setError(err instanceof Error ? err.message : 'Market research failed')
      setIsLoading(false)
    }
  }, [])

  const handleReset = useCallback(() => {
    setSearchResults([])
    setStreamingContent('')
    setCitations([])
    setIsComplete(false)
    setError(undefined)
    setCurrentRequest(null)
  }, [])

  const handleBack = useCallback(() => {
    router.push('/')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Market Research</h1>
                <p className="text-sm text-gray-600">AI-powered consumer insights for Bharat&apos;s markets</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Zap className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!currentRequest ? (
          // Show form initially
          <div className="space-y-6">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Target className="h-5 w-5" />
                    Smart Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-600">
                    AI analyzes web sources to extract key insights, trends, and actionable recommendations
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Globe className="h-5 w-5" />
                    Regional Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-green-600">
                    Specialized analysis for Tier-2 & Tier-3 cities across multiple Indian states
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Languages className="h-5 w-5" />
                    Vernacular Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-green-600">
                    Cultural and language-specific consumer behavior analysis
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <MarketResearchForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : (
          // Show results
          <div className="space-y-6">
            {/* Current Request Summary */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <TrendingUp className="h-5 w-5" />
                  Research in Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Topic:</span>
                    <p className="text-gray-800 mt-1">{currentRequest.topic}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Regions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentRequest.regions.map((region) => (
                        <Badge key={region} variant="secondary" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Languages:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentRequest.languages.map((language) => (
                        <Badge key={language} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Timeframe:</span>
                    <p className="text-gray-800 mt-1">{currentRequest.timeframe}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <MarketResearchResults
              searchResults={searchResults}
              streamingContent={streamingContent}
              citations={citations}
              isLoading={isLoading}
              isComplete={isComplete}
              error={error}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  )
}
