// Provider Validation and Health Check System
// Ensures all required AI and search providers are live before processing

interface ProviderConfig {
  openai: { apiKey: string; enabled: boolean }
  gemini: { apiKey: string; enabled: boolean }
  cohere: { apiKey: string; enabled: boolean }
  huggingface: { apiKey: string; enabled: boolean }
  tavily: { apiKey: string; enabled: boolean }
}

interface HealthCheckResult {
  provider: string
  status: 'healthy' | 'unhealthy' | 'not_configured'
  latency?: number
  error?: string
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  healthyProviders: string[]
  primaryProvider: string | null
  searchProvider: string | null
}

export class ProviderValidator {
  private config: ProviderConfig

  constructor() {
    this.config = {
      openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        enabled: !!process.env.OPENAI_API_KEY?.startsWith('sk-')
      },
      gemini: {
        apiKey: process.env.GEMINI_API_KEY || '',
        enabled: !!process.env.GEMINI_API_KEY
      },
      cohere: {
        apiKey: process.env.COHERE_API_KEY || '',
        enabled: !!process.env.COHERE_API_KEY
      },
      huggingface: {
        apiKey: process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY || '',
        enabled: !!(process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY)?.startsWith('hf_')
      },
      tavily: {
        apiKey: process.env.TAVILY_API_KEY || '',
        enabled: !!process.env.TAVILY_API_KEY?.startsWith('tvly-')
      }
    }
  }

  // Main validation method - MUST be called before any user task
  async validateProviders(): Promise<ValidationResult> {
    const errors: string[] = []
    const healthyProviders: string[] = []

    // Check if at least one AI provider is configured
    const aiProviders = ['openai', 'gemini', 'cohere', 'huggingface'] as const
    const configuredAIProviders = aiProviders.filter(p => this.config[p].enabled)

    if (configuredAIProviders.length === 0) {
      errors.push('CONFIG ERROR → No AI providers configured. Set at least one: OPENAI_API_KEY, GEMINI_API_KEY, COHERE_API_KEY, or HF_API_KEY')
    }

    // Check if Tavily is configured (required for real-time data)
    if (!this.config.tavily.enabled) {
      errors.push('CONFIG ERROR → Tavily search provider not configured. Set TAVILY_API_KEY for real-time data.')
    }

    // If basic config fails, return early
    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
        healthyProviders: [],
        primaryProvider: null,
        searchProvider: null
      }
    }

    // Run health checks for configured providers
    const healthChecks = await Promise.all([
      this.healthCheckOpenAI(),
      this.healthCheckGemini(),
      this.healthCheckCohere(),
      this.healthCheckHuggingFace(),
      this.healthCheckTavily()
    ])

    // Process health check results
    for (const result of healthChecks) {
      if (result.status === 'healthy') {
        healthyProviders.push(result.provider)
      } else if (result.status === 'unhealthy') {
        errors.push(`CONFIG ERROR → ${result.provider} failed health check: ${result.error}`)
      }
    }

    // Determine primary AI provider (fallback sequence: OpenAI → Gemini → Cohere → HF)
    const providerPriority = ['openai', 'gemini', 'cohere', 'huggingface']
    const primaryProvider = providerPriority.find(p => healthyProviders.includes(p)) || null

    // Check if Tavily is healthy (required)
    const searchProvider = healthyProviders.includes('tavily') ? 'tavily' : null
    if (!searchProvider) {
      errors.push('CONFIG ERROR → Tavily search provider unhealthy. Real-time data unavailable.')
    }

    // Final validation
    const isValid = healthyProviders.length > 0 && 
                   primaryProvider !== null && 
                   searchProvider !== null &&
                   errors.length === 0

    return {
      isValid,
      errors,
      healthyProviders,
      primaryProvider,
      searchProvider
    }
  }

  // Health check implementations
  private async healthCheckOpenAI(): Promise<HealthCheckResult> {
    if (!this.config.openai.enabled) {
      return { provider: 'openai', status: 'not_configured' }
    }

    try {
      const startTime = Date.now()
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.config.openai.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return {
        provider: 'openai',
        status: 'healthy',
        latency: Date.now() - startTime
      }
    } catch (error) {
      return {
        provider: 'openai',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async healthCheckGemini(): Promise<HealthCheckResult> {
    if (!this.config.gemini.enabled) {
      return { provider: 'gemini', status: 'not_configured' }
    }

    try {
      const startTime = Date.now()
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.config.gemini.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'ping' }] }]
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return {
        provider: 'gemini',
        status: 'healthy',
        latency: Date.now() - startTime
      }
    } catch (error) {
      return {
        provider: 'gemini',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async healthCheckCohere(): Promise<HealthCheckResult> {
    if (!this.config.cohere.enabled) {
      return { provider: 'cohere', status: 'not_configured' }
    }

    try {
      const startTime = Date.now()
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.cohere.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'command',
          prompt: 'ping',
          max_tokens: 5
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return {
        provider: 'cohere',
        status: 'healthy',
        latency: Date.now() - startTime
      }
    } catch (error) {
      return {
        provider: 'cohere',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async healthCheckHuggingFace(): Promise<HealthCheckResult> {
    if (!this.config.huggingface.enabled) {
      return { provider: 'huggingface', status: 'not_configured' }
    }

    try {
      const startTime = Date.now()
      const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.huggingface.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: 'ping' })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return {
        provider: 'huggingface',
        status: 'healthy',
        latency: Date.now() - startTime
      }
    } catch (error) {
      return {
        provider: 'huggingface',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async healthCheckTavily(): Promise<HealthCheckResult> {
    if (!this.config.tavily.enabled) {
      return { provider: 'tavily', status: 'not_configured' }
    }

    try {
      const startTime = Date.now()
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: this.config.tavily.apiKey,
          query: 'ping',
          max_results: 1
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return {
        provider: 'tavily',
        status: 'healthy',
        latency: Date.now() - startTime
      }
    } catch (error) {
      return {
        provider: 'tavily',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get current configuration status
  getConfigStatus() {
    return {
      providers: Object.entries(this.config).map(([name, config]) => ({
        name,
        configured: config.enabled,
        keyFormat: config.apiKey ? this.maskApiKey(config.apiKey) : 'Not set'
      }))
    }
  }

  private maskApiKey(key: string): string {
    if (key.length <= 8) return '***'
    return key.substring(0, 4) + '***' + key.substring(key.length - 4)
  }
}

// Singleton instance
export const providerValidator = new ProviderValidator()
