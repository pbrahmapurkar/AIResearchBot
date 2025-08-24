'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ExternalLink, 
  Copy, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Globe,
  Target
} from 'lucide-react'
import { SearchResult } from '@/types/market-research'

interface MarketResearchResultsProps {
  searchResults: SearchResult[]
  streamingContent: string
  citations: string[]
  isLoading: boolean
  isComplete: boolean
  error?: string
  onReset: () => void
}

export function MarketResearchResults({
  searchResults,
  streamingContent,
  citations,
  isLoading,
  isComplete,
  error,
  onReset
}: MarketResearchResultsProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(streamingContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadReport = () => {
    const blob = new Blob([streamingContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'market-research-report.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Research Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={onReset} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Search Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Search Results ({searchResults.length})
          </CardTitle>
          <CardDescription>
            Curated web sources used for analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-600 mb-1">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {result.title}
                        </a>
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{result.snippet}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="truncate">{result.url}</span>
                        {result.score && (
                          <Badge variant="outline" className="text-xs">
                            Score: {(result.score * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="ml-2"
                    >
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Generated Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                AI Generated Summary
              </CardTitle>
              <CardDescription>
                {isComplete ? 'Analysis complete' : 'Generating insights...'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </div>
              )}
              {isComplete && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Complete
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Content */}
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {streamingContent || 'Starting analysis...'}
              </div>
            </div>

            {/* Citations */}
            {citations.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Citations</h4>
                <div className="flex flex-wrap gap-2">
                  {citations.map((citation, index) => (
                    <Badge key={index} variant="secondary">
                      {citation}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {isComplete && (
              <div className="flex items-center gap-3 pt-4 border-t">
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy Report'}
                </Button>
                <Button onClick={downloadReport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={onReset} variant="outline" size="sm">
                  New Research
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
