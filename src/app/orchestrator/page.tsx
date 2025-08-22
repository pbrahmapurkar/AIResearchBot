import { Metadata } from 'next'
import OrchestratorTest from '@/components/orchestrator/OrchestratorTest'

export const metadata: Metadata = {
  title: 'AI Orchestrator | Mister PB - Multi-Provider AI Testing',
  description: 'Test and validate the AI orchestrator system with multi-provider fallbacks and real-time search capabilities.',
  keywords: 'AI orchestrator, OpenAI, Gemini, Cohere, HuggingFace, Tavily, provider testing',
}

export default function OrchestratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            AI Orchestrator Testing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Test the multi-provider AI orchestration system with automatic fallbacks and real-time search integration.
          </p>
        </div>

        <OrchestratorTest />
      </div>
    </div>
  )
}
