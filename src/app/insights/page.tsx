import { Metadata } from 'next'
import InsightsDashboard from './InsightsDashboard'

export const metadata: Metadata = {
  title: 'Regional Insights Dashboard | Mister PB - Tier-2/3 Market Intelligence',
  description: 'Real-time vernacular consumer insights from Tier-2/3 markets. Track sentiment, price sensitivity, and regional trends across Hindi, Tamil, Telugu, and Marathi.',
  keywords: 'regional insights, vernacular sentiment, Tier-2 markets, price sensitivity, consumer behavior dashboard',
}

export default function InsightsPage() {
  return <InsightsDashboard />
}
