'use client'

import { useState, useEffect } from 'react'
import { SearchForm } from './search-form'

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

export default function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get the query from URL params when component mounts
    const getQueryFromParams = async () => {
      const resolvedParams = await searchParams
      const q = (resolvedParams?.q || '').toString().trim()
      setQuery(q)
      
      // If there's a query in the URL, perform the search
      if (q) {
        performSearch(q)
      }
    }
    
    getQueryFromParams()
  }, [searchParams])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery.trim(),
          maxResults: 10
        }),
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data: SearchResponse = await response.json()
      
      if (data.error) {
        console.error('Search error:', data.error)
        return
      }

      setSearchResults(data)
      
      // Update URL with search query
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('q', searchQuery.trim())
      window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`)

    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (results: SearchResponse) => {
    setSearchResults(results)
    setQuery(results.query)
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Web Search</h1>
        <p className="text-gray-600">
          Search the web for consumer insights, market trends, and regional analysis
        </p>
      </div>
      
      <SearchForm initialQuery={query} onSearch={handleSearch} />
      
      {isLoading ? (
        <div className="mt-8 space-y-8">
          {/* Loading State */}
          <div className="rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Searching...</span>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : searchResults && searchResults.results.length > 0 ? (
        <div className="mt-8 space-y-8">
          {/* Search Results */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results for &ldquo;{searchResults.query}&rdquo;
              </h2>
              <p className="text-sm text-gray-600">
                Found {searchResults.totalResults} results
              </p>
            </div>
            
            <div className="space-y-4">
              {searchResults.results.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-blue-600 mb-2">
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {result.title}
                    </a>
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">{result.snippet}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate">{result.url}</span>
                    {result.score && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        Score: {(result.score * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : query ? (
        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or use different keywords
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to search?</h3>
            <p className="text-gray-600 mb-4">
              Try searching for consumer insights, market trends, or regional analysis
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 <strong>Example queries:</strong></p>
              <p>&ldquo;Tier-2 FMCG sentiment in Maharashtra&rdquo;</p>
              <p>&ldquo;Consumer behavior trends in Karnataka&rdquo;</p>
              <p>&ldquo;Regional market analysis Tamil Nadu&rdquo;</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
