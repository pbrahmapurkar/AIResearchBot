import { Metadata } from 'next'
import SettingsDashboard from './SettingsDashboard'

export const metadata: Metadata = {
  title: 'API Settings | Mister PB - Configure AI Providers',
  description: 'Configure and test your AI API integrations for HuggingFace, Together AI, Perplexity, and OpenAI. Monitor costs and performance.',
  keywords: 'API settings, AI providers, HuggingFace, Together AI, Perplexity, OpenAI, configuration',
}

export default function SettingsPage() {
  return <SettingsDashboard />
}
