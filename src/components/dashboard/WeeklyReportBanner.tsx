'use client'

import { useEffect, useState } from 'react'
import type { WeeklyReportSummary } from '@/types/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface Props {
  data: WeeklyReportSummary
}

export default function WeeklyReportBanner({ data }: Props) {
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const d = localStorage.getItem('drishti.weekly.dismissed')
      if (d === data.weekOf) setDismissed(true)
    }
  }, [data.weekOf])

  const dismiss = () => {
    localStorage.setItem('drishti.weekly.dismissed', data.weekOf)
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Weekly Insights · Week of {data.weekOf}
        </CardTitle>
        <Button size="icon" variant="ghost" onClick={dismiss} aria-label="Dismiss">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {data.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          {data.downloadUrl && (
            <Button asChild size="sm" onClick={() => window.umami?.track?.('Weekly Report Download')}>
              <a href={data.downloadUrl}>Download PDF</a>
            </Button>
          )}
          <Button asChild size="sm" variant="outline">
            <a href="/reports">Open in Reports</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
