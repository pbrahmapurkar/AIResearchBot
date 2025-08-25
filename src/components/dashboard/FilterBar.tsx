'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ErrorInline from '@/components/ui/ErrorInline'
import type { LanguageCode, TimeRangeKey } from '@/types/dashboard'

interface Props {
  industry: string
  language: LanguageCode
  timeRange: TimeRangeKey
  onIndustryChange: (v: string) => void
  onLanguageChange: (v: LanguageCode) => void
  onRangeChange: (v: TimeRangeKey) => void
  onRefresh: () => void
  error?: string
}

export default function FilterBar({
  industry,
  language,
  timeRange,
  onIndustryChange,
  onLanguageChange,
  onRangeChange,
  onRefresh,
  error,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <Select value={industry} onValueChange={onIndustryChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FMCG">FMCG</SelectItem>
            <SelectItem value="Retail">Retail</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
          </SelectContent>
        </Select>

        <Tabs value={language} onValueChange={(v) => onLanguageChange(v as LanguageCode)}>
          <TabsList>
            <TabsTrigger value="hi">Hindi</TabsTrigger>
            <TabsTrigger value="ta">Tamil</TabsTrigger>
            <TabsTrigger value="mr">Marathi</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={timeRange} onValueChange={(v) => onRangeChange(v as TimeRangeKey)}>
          <TabsList>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="90d">90d</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
      {error && <ErrorInline message={error} onRetry={onRefresh} />}
    </div>
  )
}
