'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, AlertCircle } from 'lucide-react'

interface SearchResult {
  title: string
  url: string
  snippet: string
  score?: number
}

interface SearchResponse {
  query: string
  results: SearchResult[]
  totalResults: number
  error?: string
}

export function SearchForm({ initialQuery, onSearch }: { 
  initialQuery?: string
  onSearch?: (results: SearchResponse) => void 
}) {
  const [query, setQuery] = useState(initialQuery || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) {
      setError('Please enter a search query')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          maxResults: 10
        }),
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data: SearchResponse = await response.json()
      
      if (data.error) {
        setError(data.error)
        return
      }

      // If parent component provided onSearch callback, use it
      if (onSearch) {
        onSearch(data)
      } else {
        // Otherwise, update the URL to show results
        const searchParams = new URLSearchParams(window.location.search)
        searchParams.set('q', query.trim())
        window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`)
        // Trigger a page refresh to show results
        window.location.reload()
      }

    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            name="q"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for consumer insights, market trends, regional analysis..."
            className="pl-10 pr-4 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Searching...
            </>
          ) : (
            'Search'
          )}
        </Button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div className="text-sm text-red-700">
            <strong>Search failed:</strong> {error}
          </div>
        </div>
      )}

      {/* Search Tips */}
      {!initialQuery && (
        <div className="text-sm text-gray-500">
          <p className="font-medium mb-2">💡 Search tips:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Use specific regions: &ldquo;Maharashtra&rdquo;, &ldquo;Karnataka&rdquo;, &ldquo;Tamil Nadu&rdquo;</li>
            <li>Include industry terms: &ldquo;FMCG&rdquo;, &ldquo;e-commerce&rdquo;, &ldquo;retail&rdquo;</li>
            <li>Add consumer behavior keywords: &ldquo;sentiment&rdquo;, &ldquo;trends&rdquo;, &ldquo;preferences&rdquo;</li>
            <li>Combine multiple terms: &ldquo;Tier-2 FMCG sentiment Maharashtra&rdquo;</li>
          </ul>
        </div>
      )}
    </div>
  )
}
