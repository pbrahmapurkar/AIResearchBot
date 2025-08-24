// Main Orchestrator - Routes tasks to appropriate AI providers with validation
import { providerValidator, ProviderValidator } from './providerValidator'

interface OrchestratorConfig {
  primaryProvider: string | null
  searchProvider: string | null
  healthyProviders: string[]
  isValid: boolean
}

interface TaskRequest {
  type: 'completion' | 'search' | 'analysis' | 'synthesis'
  prompt: string
  requiresRealTime?: boolean
  maxTokens?: number
  temperature?: number
}

interface TaskResponse {
  success: boolean
  result?: string
  provider?: string
  citations?: string[]
  error?: string
  latency?: number
}

export class Orchestrator {
  private validator: ProviderValidator
  private config: OrchestratorConfig | null = null
  private lastValidation: number = 0
  private validationTTL = 300000 // 5 minutes

  constructor() {
    this.validator = providerValidator
  }

  // REQUIRED: Validate providers before handling any user task
  async validateAndInitialize(): Promise<{ isValid: boolean; errors: string[] }> {
    const now = Date.now()
    
    // Use cached validation if recent
    if (this.config && (now - this.lastValidation) < this.validationTTL) {
      return { isValid: this.config.isValid, errors: [] }
    }

    console.log('🔍 Orchestrator: Validating providers...')
    const validation = await this.validator.validateProviders()
    
    this.config = {
      primaryProvider: validation.primaryProvider,
      searchProvider: validation.searchProvider,
      healthyProviders: validation.healthyProviders,
      isValid: validation.isValid
    }
    this.lastValidation = now

    if (!validation.isValid) {
      console.error('❌ Orchestrator: Provider validation failed')
      return { isValid: false, errors: validation.errors }
    }

    console.log(`✅ Orchestrator: Initialized with primary=${validation.primaryProvider}, search=${validation.searchProvider}`)
    return { isValid: true, errors: [] }
  }

  // Main task routing method
  async processTask(request: TaskRequest): Promise<TaskResponse> {
    // ENFORCE: Must validate before processing
    const validation = await this.validateAndInitialize()
    if (!validation.isValid) {
      return {
        success: false,
        error: `CONFIG ERROR → ${validation.errors.join('; ')}\nSet env and retry.`
      }
    }

    const startTime = Date.now()

    try {
      // Route based on task type and requirements
      if (request.requiresRealTime || request.type === 'search') {
        return await this.handleSearchTask(request, startTime)
      } else {
        return await this.handleCompletionTask(request, startTime)
      }
    } catch (error) {
      return {
        success: false,
        error: `Task execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        latency: Date.now() - startTime
      }
    }
  }

  private async handleSearchTask(request: TaskRequest, startTime: number): Promise<TaskResponse> {
    if (!this.config?.searchProvider) {
      return {
        success: false,
        error: 'CONFIG ERROR → Tavily search provider unavailable. Real-time data cannot be retrieved.',
        latency: Date.now() - startTime
      }
    }

    try {
      // Step 1: Get real-time data from Tavily
      const searchResults = await this.searchWithTavily(request.prompt)
      
      // Step 2: Synthesize with AI provider
      const synthesisPrompt = `Based on this real-time search data, provide a comprehensive answer:

SEARCH RESULTS:
${searchResults.results}

USER QUESTION: ${request.prompt}

Provide a detailed response with proper citations. Format citations as [1], [2], etc.`

      const synthesis = await this.completeWithAI(synthesisPrompt, request)
      
      return {
        success: true,
        result: synthesis.result,
        provider: `${this.config.searchProvider} + ${synthesis.provider}`,
        citations: searchResults.citations,
        latency: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        error: `Search task failed: ${error instanceof Error ? error.message : 'Unknown error'}. Real-time data unavailable.`,
        latency: Date.now() - startTime
      }
    }
  }

  private async handleCompletionTask(request: TaskRequest, startTime: number): Promise<TaskResponse> {
    try {
      const result = await this.completeWithAI(request.prompt, request)
      return {
        success: true,
        result: result.result,
        provider: result.provider,
        latency: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        error: `Completion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        latency: Date.now() - startTime
      }
    }
  }

  // AI completion with fallback sequence: Gemini → Cohere → HF
  private async completeWithAI(prompt: string, request: TaskRequest): Promise<{ result: string; provider: string }> {
    const fallbackSequence = ['gemini', 'cohere', 'huggingface']
    const availableProviders = fallbackSequence.filter(p => this.config?.healthyProviders.includes(p))

    for (const provider of availableProviders) {
      try {
        console.log(`🤖 Trying completion with ${provider}...`)
        const result = await this.callProvider(provider, prompt, request)
        console.log(`✅ Success with ${provider}`)
        return { result, provider }
      } catch (error) {
        console.warn(`⚠️ ${provider} failed: ${error}`)
        continue
      }
    }

    throw new Error('All AI providers failed')
  }

  private async getAICompletion(prompt: string, maxTokens: number, temperature: number): Promise<string> {
    const fallbackSequence = ['gemini', 'cohere', 'huggingface']
    
    for (const provider of fallbackSequence) {
      try {
        switch (provider) {
          case 'gemini':
            return await this.callGemini(prompt, maxTokens, temperature)
          case 'cohere':
            return await this.callCohere(prompt, maxTokens, temperature)
          case 'huggingface':
            return await this.callHuggingFace(prompt, maxTokens, temperature)
          default:
            continue
        }
      } catch (error) {
        console.warn(`Provider ${provider} failed:`, error)
        continue
      }
    }
    
    throw new Error('All AI providers failed')
  }

  private async callProvider(provider: string, prompt: string, request: TaskRequest): Promise<string> {
    const maxTokens = request.maxTokens || 1000
    const temperature = request.temperature || 0.7

    switch (provider) {
      case 'gemini':
        return await this.callGemini(prompt, maxTokens, temperature)
      case 'cohere':
        return await this.callCohere(prompt, maxTokens, temperature)
      case 'huggingface':
        return await this.callHuggingFace(prompt, maxTokens, temperature)
      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  }

  private async callGemini(prompt: string, maxTokens: number, temperature: number): Promise<string> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates[0]?.content?.parts[0]?.text || 'No response generated'
  }

  private async callCohere(prompt: string, maxTokens: number, temperature: number): Promise<string> {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'command',
        prompt,
        max_tokens: maxTokens,
        temperature
      })
    })

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status}`)
    }

    const data = await response.json()
    return data.generations[0]?.text || 'No response generated'
  }

  private async callHuggingFace(prompt: string, maxTokens: number, _temperature: number): Promise<string> {
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          return_full_text: false
        }
      })
    })

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status}`)
    }

    const data = await response.json()
    return data[0]?.generated_text || 'No response generated'
  }

  private async searchWithTavily(query: string): Promise<{ results: string; citations: string[] }> {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        max_results: 5,
        include_answer: true
      })
    })

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`)
    }

    const data = await response.json()
    const results = data.results || []
    const citations = results.map((r: { url: string }, i: number) => `[${i + 1}] ${r.url}`)
    const content = results.map((r: { title: string; content: string }, i: number) => `[${i + 1}] ${r.title}: ${r.content}`).join('\n\n')

    return { results: content, citations }
  }

  // Get current orchestrator status
  getStatus() {
    return {
      isInitialized: !!this.config,
      isValid: this.config?.isValid || false,
      primaryProvider: this.config?.primaryProvider || null,
      searchProvider: this.config?.searchProvider || null,
      healthyProviders: this.config?.healthyProviders || [],
      lastValidation: new Date(this.lastValidation).toISOString()
    }
  }
}

// Singleton instance
export const orchestrator = new Orchestrator()
export default orchestrator
