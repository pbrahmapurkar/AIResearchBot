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
    apiKey: process.env.GEMINI_API_KEY || '',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    enabled: !!process.env.GEMINI_API_KEY
  },
  cohere: {
    apiKey: process.env.COHERE_API_KEY || '',
    baseUrl: 'https://api.cohere.ai/v1',
    enabled: !!process.env.COHERE_API_KEY
  },
  huggingface: {
    apiKey: process.env.HF_API_KEY || '',
    baseUrl: 'https://api-inference.huggingface.co',
    enabled: !!process.env.HF_API_KEY
  }
}

export const rateLimits: RateLimits = {
  gemini: parseInt(process.env.DAILY_GEMINI_LIMIT || '50'),
  cohere: parseInt(process.env.DAILY_COHERE_LIMIT || '50'),
  huggingface: parseInt(process.env.DAILY_HF_LIMIT || '50')
}

export function validateAPIConfig(): string[] {
  const errors: string[] = []
  
  // Check if at least one provider is enabled
  const hasProvider = apiConfig.gemini.enabled || 
                     apiConfig.cohere.enabled || 
                     apiConfig.huggingface.enabled
  
  if (!hasProvider) {
    errors.push('At least one AI provider (Gemini, Cohere, or HuggingFace) must be configured')
  }
  
  // Validate API keys format
  if (apiConfig.gemini.enabled && !apiConfig.gemini.apiKey.startsWith('AIza')) {
    errors.push('Gemini API key should start with "AIza"')
  }
  
  if (apiConfig.cohere.enabled && !apiConfig.cohere.apiKey.startsWith('cohere_')) {
    errors.push('Cohere API key should start with "cohere_"')
  }
  
  if (apiConfig.huggingface.enabled && !apiConfig.huggingface.apiKey.startsWith('hf_')) {
    errors.push('HuggingFace API key should start with "hf_"')
  }
  
  return errors
}

export function getProviderStatus() {
  return {
    gemini: {
      name: 'Gemini',
      status: apiConfig.gemini.enabled ? 'connected' : 'disabled',
      baseUrl: apiConfig.gemini.baseUrl
    },
    cohere: {
      name: 'Cohere',
      status: apiConfig.cohere.enabled ? 'connected' : 'disabled',
      baseUrl: apiConfig.cohere.baseUrl
    },
    huggingface: {
      name: 'HuggingFace',
      status: apiConfig.huggingface.enabled ? 'connected' : 'disabled',
      baseUrl: apiConfig.huggingface.baseUrl
    }
  }
}
