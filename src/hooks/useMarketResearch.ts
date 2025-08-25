import { useCallback, useState } from 'react'
import type { SearchResult } from '@/lib/search'

export function useMarketResearch() {
  const [analysis, setAnalysis] = useState('')
  const [citations, setCitations] = useState<SearchResult[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>('idle')
  const [error, setError] = useState<string>()

  const run = useCallback(async (query: string) => {
    setStatus('loading')
    setAnalysis('')
    setCitations([])
    setError(undefined)

    const res = await fetch('/api/market-research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    if (!res.body) {
      setStatus('error')
      setError('No stream')
      return
    }

    const reader = res.body.getReader()
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
            const evt = JSON.parse(line.slice(6))
            if (evt.type === 'step_progress' && evt.data.citation) {
              setCitations((c) => [...c, evt.data.citation])
            }
            if (evt.type === 'mission_complete') {
              setAnalysis(evt.data.analysis)
              setStatus('done')
            }
          } catch (e) {
            console.error('parse error', e)
          }
        }
      }
    }
  }, [])

  return { run, status, analysis, citations, error, 'data-testid': 'use-market-research' as const }
}
