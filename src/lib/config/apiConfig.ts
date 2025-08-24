// API Configuration Manager for Mister PB
interface APIProvider {
  gemini: {
    apiKey: string
    baseUrl: string
    enabled: boolean
  }
  cohere: {
    apiKey: string
    baseUrl: string
    enabled: boolean
  }
  huggingface: {
    apiKey: string
    baseUrl: string
    enabled: boolean
  }
}

interface RateLimits {
  gemini: number
  cohere: number
  huggingface: number
}

export const apiConfig: APIProvider = {
  gemini: {
    apiKey: '',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    enabled: false
  },
  cohere: {
    apiKey: '',
    baseUrl: 'https://api.cohere.ai/v1',
    enabled: false
  },
  huggingface: {
    apiKey: '',
    baseUrl: 'https://api-inference.huggingface.co',
    enabled: false
  }
}

export const rateLimits: RateLimits = {
  gemini: 0,
  cohere: 0,
  huggingface: 0
}

export function validateAPIConfig(): string[] {
  // No validation needed in mock mode
  return []
}

export function getProviderStatus() {
  return {
    gemini: {
      name: 'Gemini',
      status: 'disabled',
      baseUrl: 'Mock Mode'
    },
    cohere: {
      name: 'Cohere',
      status: 'disabled',
      baseUrl: 'Mock Mode'
    },
    huggingface: {
      name: 'HuggingFace',
      status: 'disabled',
      baseUrl: 'Mock Mode'
    }
  }
}
