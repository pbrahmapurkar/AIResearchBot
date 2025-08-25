'use client'

import type { PriceSignal } from '@/types/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { regionName } from '@/lib/regions'
import Link from 'next/link'
import { Info } from 'lucide-react'

interface Props {
  data: PriceSignal
}

export default function PriceSensitivityCard({ data }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Price Sensitivity</CardTitle>
        <Info className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{data.index}</div>
        <div className="mt-4 space-y-1">
          {data.keywords.map((k) => (
            <div key={k.term} className="flex items-center justify-between text-sm">
              <span>{k.term}</span>
              <div className="flex-1 mx-2 h-2 bg-blue-100">
                <div
                  className="h-2 bg-blue-500"
                  style={{ width: `${(k.count / data.keywords[0].count) * 100}%` }}
                />
              </div>
              <span>{k.count}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {data.byRegion.map((r) => (
            <Badge key={r.region} variant="secondary">
              {regionName(r.region)}: {r.index}
            </Badge>
          ))}
        </div>
        <Link href="/insights/pricing" className="mt-4 inline-block text-sm text-blue-600">
          View details
        </Link>
      </CardContent>
    </Card>
  )
}
