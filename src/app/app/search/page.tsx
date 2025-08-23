import { Suspense } from 'react'
import { SearchForm } from './search-form'
import { Results } from './results'

export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams?.q || '').toString().trim()
  
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Web Search</h1>
        <p className="text-gray-600">
          Search the web for consumer insights, market trends, and regional analysis
        </p>
      </div>
      
      <SearchForm initialQuery={q} />
      
      {q ? (
        <div className="mt-8 space-y-8">
          {/* Tavily Results - Primary */}
          <div>
            <Suspense fallback={
              <div className="rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Searching with Tavily...</span>
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
            }>
              <Results query={q} primary="tavily" />
            </Suspense>
          </div>

          {/* Brave Results - Backup */}
          <div>
            <Suspense fallback={
              <div className="rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Preparing Brave backup...</span>
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
            }>
              <Results query={q} primary="brave" />
            </Suspense>
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
