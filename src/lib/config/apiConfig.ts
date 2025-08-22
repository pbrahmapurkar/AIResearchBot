// API Configuration Manager for Mister PB
export interface APIConfig {
  huggingface: {
    apiKey: string
    baseUrl: string
    enabled: boolean
  }
  together: {
    apiKey: string
    baseUrl: string
    enabled: boolean
  }
  perplexity: {
    apiKey: string
    baseUrl: string
    enabled: boolean
  }
  openai: {
    apiKey: string
    baseUrl: string
    enabled: boolean
  }
  anthropic: {
    apiKey: string
    baseUrl: string
    enabled: boolean
  }
  tavily: {
    apiKey: string
    baseUrl: string
    enabled: boolean
  }
}

export interface RateLimits {
  daily: {
    huggingface: number
    together: number
    perplexity: number
    openai: number
  }
  costThresholds: {
    daily: number
    monthly: number
  }
}

// Get API configuration from environment variables
export function getAPIConfig(): APIConfig {
  return {
    huggingface: {
      apiKey: process.env.HUGGINGFACE_API_KEY || '',
      baseUrl: 'https://api-inference.huggingface.co/models',
      enabled: !!process.env.HUGGINGFACE_API_KEY
    },
    together: {
      apiKey: process.env.TOGETHER_API_KEY || '',
      baseUrl: 'https://api.together.xyz/v1',
      enabled: !!process.env.TOGETHER_API_KEY
    },
    perplexity: {
      apiKey: process.env.PERPLEXITY_API_KEY || '',
      baseUrl: 'https://api.perplexity.ai',
      enabled: !!process.env.PERPLEXITY_API_KEY
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      baseUrl: 'https://api.openai.com/v1',
      enabled: !!process.env.OPENAI_API_KEY
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      baseUrl: 'https://api.anthropic.com',
      enabled: !!process.env.ANTHROPIC_API_KEY
    },
    tavily: {
      apiKey: process.env.TAVILY_API_KEY || '',
      baseUrl: 'https://api.tavily.com',
      enabled: !!process.env.TAVILY_API_KEY
    }
  }
}

// Get rate limits configuration
export function getRateLimits(): RateLimits {
  return {
    daily: {
      huggingface: parseInt(process.env.DAILY_HUGGINGFACE_LIMIT || '1000'),
      together: parseInt(process.env.DAILY_TOGETHER_LIMIT || '500'),
      perplexity: parseInt(process.env.DAILY_PERPLEXITY_LIMIT || '100'),
      openai: parseInt(process.env.DAILY_OPENAI_LIMIT || '50')
    },
    costThresholds: {
      daily: parseFloat(process.env.DAILY_COST_ALERT_THRESHOLD || '10.00'),
      monthly: parseFloat(process.env.MONTHLY_COST_ALERT_THRESHOLD || '100.00')
    }
  }
}

// Check if real APIs are enabled
export function isRealAPIsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_REAL_APIS === 'true'
}

// Check if debug mode is enabled
export function isDebugMode(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true'
}

// Validate API configuration
export function validateAPIConfig(): { isValid: boolean, errors: string[] } {
  const config = getAPIConfig()
  const errors: string[] = []

  // Check if at least one AI provider is configured
  const hasAnyProvider = config.huggingface.enabled || 
                        config.together.enabled || 
                        config.openai.enabled

  if (!hasAnyProvider) {
    errors.push('At least one AI provider (HuggingFace, Together AI, or OpenAI) must be configured')
  }

  // Check if search provider is configured
  if (!config.perplexity.enabled && !config.tavily.enabled) {
    errors.push('At least one search provider (Perplexity or Tavily) must be configured for real-time data')
  }

  // Validate API key formats (basic check)
  if (config.openai.enabled && !config.openai.apiKey.startsWith('sk-')) {
    errors.push('OpenAI API key should start with "sk-"')
  }

  if (config.anthropic.enabled && !config.anthropic.apiKey.startsWith('sk-ant-')) {
    errors.push('Anthropic API key should start with "sk-ant-"')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Get provider status for dashboard
export function getProviderStatus() {
  const config = getAPIConfig()
  const validation = validateAPIConfig()

  return {
    providers: {
      huggingface: {
        name: 'HuggingFace',
        status: config.huggingface.enabled ? 'connected' : 'disabled',
        description: 'Vernacular sentiment analysis (IndicBERT)',
        cost: 'Free tier available'
      },
      together: {
        name: 'Together AI',
        status: config.together.enabled ? 'connected' : 'disabled',
        description: 'Fast trend extraction (Mixtral/LLaMA)',
        cost: '$0.0002/1K tokens'
      },
      perplexity: {
        name: 'Perplexity',
        status: config.perplexity.enabled ? 'connected' : 'disabled',
        description: 'Real-time web search with citations',
        cost: '$0.001/1K tokens'
      },
      openai: {
        name: 'OpenAI',
        status: config.openai.enabled ? 'connected' : 'disabled',
        description: 'Premium synthesis (GPT-4)',
        cost: '$0.03/1K tokens'
      },
      anthropic: {
        name: 'Anthropic',
        status: config.anthropic.enabled ? 'connected' : 'disabled',
        description: 'Cross-validation (Claude)',
        cost: '$0.015/1K tokens'
      },
      tavily: {
        name: 'Tavily',
        status: config.tavily.enabled ? 'connected' : 'disabled',
        description: 'Alternative search provider',
        cost: 'Usage-based pricing'
      }
    },
    overall: {
      isValid: validation.isValid,
      errors: validation.errors,
      enabledCount: Object.values(config).filter(p => p.enabled).length,
      totalProviders: Object.keys(config).length
    }
  }
}
