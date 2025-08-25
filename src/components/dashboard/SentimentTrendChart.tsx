'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SentimentTrendPoint } from '@/types/dashboard'

interface Props {
  data: SentimentTrendPoint[]
}

export default function SentimentTrendChart({ data }: Props) {
  return (
    <div className="h-64 w-full" aria-label="Sentiment trend over time">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="ts" />
          <YAxis yAxisId="left" domain={[-1, 1]} hide />
          <YAxis yAxisId="right" orientation="right" />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#16a34a"
            fillOpacity={1}
            fill="url(#colorScore)"
            yAxisId="left"
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#0ea5e9"
            fill="#bae6fd"
            yAxisId="right"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
