'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, Search, ExternalLink, AlertCircle } from 'lucide-react'

interface SearchResult {
  title: string
  url: string
  snippet: string
}

interface SearchResponse {
  query: string
  results: SearchResult[]
  totalResults: number
  error?: string
}

export default function TestSearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastQuery, setLastQuery] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) {
      setError('Please enter a search query')
      return
    }

    setIsLoading(true)
    setError(null)
    setResults([])

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: query.trim(),
          maxResults: 8
        }),
      })

      const data: SearchResponse = await response.json()

      if (data.error) {
        setError(data.error)
      }

      setResults(data.results || [])
      setLastQuery(data.query)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-blue-600">
                <Search className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tavily Web Search Test
            </h1>
            <p className="text-lg text-gray-600">
              Test the integrated web search functionality
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search the Web
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="e.g., latest AI trends, React best practices, market research..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="min-w-[100px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50 mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Search Error</span>
                </div>
                <p className="text-red-600 mt-2">{error}</p>
                {error.includes('TAVILY_API_KEY') && (
                  <div className="mt-3 p-3 bg-red-100 rounded-lg">
                    <p className="text-sm text-red-700">
                      <strong>Setup Instructions:</strong>
                    </p>
                    <ol className="text-sm text-red-700 mt-1 list-decimal list-inside space-y-1">
                      <li>Get a free API key from <a href="https://app.tavily.com/" target="_blank" rel="noopener noreferrer" className="underline">app.tavily.com</a></li>
                      <li>Add <code>TAVILY_API_KEY=your_key_here</code> to your <code>.env.local</code> file</li>
                      <li>Restart your development server</li>
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {lastQuery && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                                        <span>Search Results for &ldquo;{lastQuery}&rdquo;</span>
                  <Badge variant="secondary">
                    {results.length} results
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No results found</p>
                    <p className="text-sm">Try a different search query</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-blue-700 mb-2">
                              <a 
                                href={result.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {result.title}
                              </a>
                            </h3>
                            <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                              {result.snippet}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {new URL(result.url).hostname}
                              </Badge>
                              <a 
                                href={result.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 text-xs hover:underline flex items-center gap-1"
                              >
                                Visit <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
