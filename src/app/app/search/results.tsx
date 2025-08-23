import { searchTavily, searchBrave, type SearchResult } from '@/lib/search'
import { ExternalLink, Globe, Shield } from 'lucide-react'

export async function Results({ query, primary }: { query: string; primary: 'tavily' | 'brave' }) {
  let results: SearchResult[] = []
  let error: string | null = null
  
  if (primary === 'tavily') {
    try {
      results = await searchTavily(query, { maxResults: 8 })
      // If Tavily empty, silently return nothing (Brave block will appear below)
    } catch (e) {
      error = e instanceof Error ? e.message : 'Tavily search failed'
    }
  } else {
    try {
      results = await searchBrave(query, { count: 8 })
    } catch (e) {
      error = e instanceof Error ? e.message : 'Brave search failed'
    }
  }

  // Handle errors
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-5 w-5 text-red-500" />
          <span className="text-sm font-medium text-red-700 uppercase tracking-wide">
            {primary === 'tavily' ? 'Tavily' : 'Brave'} Search Error
          </span>
        </div>
        <p className="text-sm text-red-600">{error}</p>
        <p className="text-xs text-red-500 mt-2">
          {primary === 'tavily' ? 'Brave results may still appear below.' : 'Try refreshing the page.'}
        </p>
      </div>
    )
  }

  // Handle no results
  if (!results.length) {
    return (
      <div className="rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          {primary === 'tavily' ? (
            <Globe className="h-5 w-5 text-blue-500" />
          ) : (
            <Shield className="h-5 w-5 text-orange-500" />
          )}
          <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
            {primary === 'tavily' ? 'Tavily' : 'Brave'}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {primary === 'tavily' ? 'No Tavily results found.' : 'No Brave results found.'}
        </div>
        {primary === 'tavily' && (
          <p className="text-xs text-gray-400 mt-2">
            Brave backup results may appear below.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {primary === 'tavily' ? (
              <Globe className="h-5 w-5 text-blue-500" />
            ) : (
              <Shield className="h-5 w-5 text-orange-500" />
            )}
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              {primary === 'tavily' ? 'Tavily' : 'Brave'} Results
            </span>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {primary === 'tavily' ? 'Primary search provider' : 'Backup search provider'}
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="divide-y divide-gray-200">
        {results.map((result, index) => (
          <div key={`${primary}-${index}-${result.url}`} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {result.title}
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                
                <div className="mt-1 text-sm text-gray-500 truncate">
                  {result.url}
                </div>
                
                {result.snippet && (
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {result.snippet}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          {primary === 'tavily' ? (
            <span>Powered by Tavily AI Search • Advanced web crawling and analysis</span>
          ) : (
            <span>Powered by Brave Search • Privacy-focused web search</span>
          )}
        </div>
      </div>
    </div>
  )
}
