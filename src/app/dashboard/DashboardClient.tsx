'use client'

import { useState } from 'react'
import type { DashboardPayload, LanguageCode, TimeRangeKey, RegionKey } from '@/types/dashboard'
import FilterBar from '@/components/dashboard/FilterBar'
import IndiaSentimentMap from '@/components/dashboard/IndiaSentimentMap'
import SentimentTrendChart from '@/components/dashboard/SentimentTrendChart'
import PriceSensitivityCard from '@/components/dashboard/PriceSensitivityCard'
import SamplesFeed from '@/components/dashboard/SamplesFeed'
import WeeklyReportBanner from '@/components/dashboard/WeeklyReportBanner'
import LoadingState from '@/components/ui/LoadingState'
import { fetcher, ApiError } from '@/lib/fetcher'

interface Props {
  initial: DashboardPayload
}

export default function DashboardClient({ initial }: Props) {
  const [industry, setIndustry] = useState(initial.industry)
  const [language, setLanguage] = useState<LanguageCode>(initial.language)
  const [timeRange, setTimeRange] = useState<TimeRangeKey>(initial.timeRange)
  const [data, setData] = useState(initial)
  const [region, setRegion] = useState<RegionKey | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const refresh = async () => {
    setLoading(true)
    try {
      const payload = await fetcher<DashboardPayload>(
        `/api/dashboard/mock?industry=${industry}&language=${language}&range=${timeRange}`
      )
      setData(payload)
      setError(undefined)
      window.umami?.track?.('Dashboard Filter Changed')
    } catch (e) {
      const err = e as ApiError
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  const samples = region
    ? data.samples.filter((s) => s.region === region)
    : data.samples

  return (
    <div className="space-y-6">
      <FilterBar
        industry={industry}
        language={language}
        timeRange={timeRange}
        onIndustryChange={setIndustry}
        onLanguageChange={(l) => {
          setLanguage(l)
        }}
        onRangeChange={(r) => {
          setTimeRange(r)
        }}
        onRefresh={refresh}
        error={error}
      />
      {loading && <LoadingState />}
      {!loading && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <IndiaSentimentMap data={data.regional} onRegionSelect={setRegion} selected={region} />
            <div className="space-y-4">
              <SentimentTrendChart data={data.trend} />
              <PriceSensitivityCard data={data.price} />
            </div>
          </div>
          <SamplesFeed samples={samples} selectedRegion={region} />
          {data.weekly && <WeeklyReportBanner data={data.weekly} />}
        </>
      )}
    </div>
  )
}
