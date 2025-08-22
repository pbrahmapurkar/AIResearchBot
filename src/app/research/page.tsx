import { Metadata } from 'next'
import ResearchDashboard from './ResearchDashboard'

export const metadata: Metadata = {
  title: 'AI Research Dashboard | Mister PB - Multi-Model Consumer Intelligence',
  description: 'Advanced AI research platform with model orchestration. Use HuggingFace, Together AI, Perplexity, and OpenAI for comprehensive Tier-2/3 market analysis.',
  keywords: 'AI research, model orchestration, vernacular NLP, HuggingFace IndicBERT, Together AI, Perplexity search, consumer intelligence',
}

export default function ResearchPage() {
  return <ResearchDashboard />
}
