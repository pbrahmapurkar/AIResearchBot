import { apiConfig } from '@/lib/config/apiConfig'

// Simplified model integration layer without OpenAI dependencies
export interface ModelProvider {
  name: string
  type: 'llm' | 'embedding' | 'sentiment' | 'translation'
  costPerToken?: number
  latencyMs?: number
  capabilities: string[]
}

export interface ModelResponse {
  result: unknown
  model: string
  usage: {
    inputTokens: number
    outputTokens: number
    cost: number
  }
  latency: number
}

// Mock implementation for all model providers
export class MockModelClient {
  async analyzeSentiment(text: string, language: string): Promise<ModelResponse> {
    const startTime = Date.now()
    const model = 'mock-sentiment-analyzer'
    
    // Return mock sentiment data
    return {
      result: { sentiment: 0.5, confidence: 0.8 },
      model,
      usage: {
        inputTokens: Math.ceil(text.length / 4),
        outputTokens: 10,
        cost: 0
      },
      latency: Date.now() - startTime
    }
  }

  async extractEntities(text: string): Promise<ModelResponse> {
    const startTime = Date.now()
    const model = 'mock-entity-extractor'
    
    return {
      result: { entities: ['product', 'price', 'brand'] },
      model,
      usage: {
        inputTokens: Math.ceil(text.length / 4),
        outputTokens: 20,
        cost: 0
      },
      latency: Date.now() - startTime
    }
  }

  async generateText(prompt: string): Promise<ModelResponse> {
    const startTime = Date.now()
    const model = 'mock-text-generator'
    
    return {
      result: `Mock response to: ${prompt.substring(0, 100)}...`,
      model,
      usage: {
        inputTokens: Math.ceil(prompt.length / 4),
        outputTokens: 100,
        cost: 0
      },
      latency: Date.now() - startTime
    }
  }
}

// Export a singleton instance
export const mockModelClient = new MockModelClient()

// Model recommendation function
export function getRecommendedModel(taskType: string): string {
  const recommendations: Record<string, string> = {
    'sentiment': 'Mock Sentiment Analyzer (local processing)',
    'extraction': 'Mock Entity Extractor (local processing)',
    'cultural': 'Mock Cultural Analyzer (local processing)',
    'synthesis': 'Mock Text Generator (local processing)',
    'search': 'Mock Search Engine (local processing)'
  }

  return recommendations[taskType] || 'Mock Model (default fallback)'
}
