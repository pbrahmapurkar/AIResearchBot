'use client'

import { useActionState, useEffect, useRef } from 'react'
import { performSearchAction } from '../../search/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, AlertCircle } from 'lucide-react'

export function SearchForm({ initialQuery }: { initialQuery?: string }) {
  const [state, formAction, pending] = useActionState(performSearchAction, null as { ok: boolean; q: string; results: { title: string; url: string; snippet: string }[]; error?: string } | null)
  const inputRef = useRef<HTMLInputElement>(null)
           // const sp = useSearchParams() // Unused for now

  useEffect(() => {
    if (state?.error && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [state])

  return (
    <div className="space-y-4">
      <form action={formAction} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            name="q"
            type="text"
            defaultValue={initialQuery}
            placeholder="Search for consumer insights, market trends, regional analysis..."
            className="pl-10 pr-4 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? (
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
      {state?.error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div className="text-sm text-red-700">
            <strong>Search failed:</strong> {state.error}
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
