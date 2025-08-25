'use client'

import { useMemo, useState } from 'react'
import type { VernacularSample, RegionKey, SentimentBucket } from '@/types/dashboard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatRelative } from '@/lib/format'
import { regionName } from '@/lib/regions'
import { toast } from 'sonner'

interface Props {
  samples: VernacularSample[]
  selectedRegion?: RegionKey | null
}

const PER_PAGE = 5

export default function SamplesFeed({ samples, selectedRegion }: Props) {
  const [page, setPage] = useState(0)
  const [sentiment, setSentiment] = useState<SentimentBucket | 'all'>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return samples.filter((s) => {
      if (selectedRegion && s.region !== selectedRegion) return false
      if (sentiment !== 'all' && s.sentiment !== sentiment) return false
      if (query && !s.text.includes(query) && !s.translation.includes(query)) return false
      return true
    })
  }, [samples, selectedRegion, sentiment, query])

  const paginated = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text)
    toast('Copied')
    window.umami?.track?.('Samples Search')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={sentiment === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSentiment('all')}
        >
          All
        </Button>
        <Button
          variant={sentiment === 'positive' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSentiment('positive')}
        >
          +
        </Button>
        <Button
          variant={sentiment === 'neutral' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSentiment('neutral')}
        >
          0
        </Button>
        <Button
          variant={sentiment === 'negative' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSentiment('negative')}
        >
          -
        </Button>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="ml-auto w-48"
        />
      </div>
      <div className="divide-y rounded border">
        {paginated.map((s) => (
          <article key={s.id} className="p-3" aria-labelledby={`sample-${s.id}`}>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary">{s.language}</Badge>
              <Badge>{regionName(s.region)}</Badge>
              <span className="ml-auto text-muted-foreground">
                {formatRelative(s.timestamp)}
              </span>
            </div>
            <p id={`sample-${s.id}`} className="mt-2 line-clamp-2">
              {s.text}
            </p>
            <p className="text-sm text-muted-foreground">{s.translation}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copy(s.translation)}
              className="mt-1"
            >
              Copy translation
            </Button>
          </article>
        ))}
        {paginated.length === 0 && (
          <p className="p-4 text-center text-sm text-muted-foreground">
            No samples
          </p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={(page + 1) * PER_PAGE >= filtered.length}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
