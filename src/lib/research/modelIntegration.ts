import { getAPIConfig, isRealAPIsEnabled, isDebugMode } from '@/lib/config/apiConfig'

// Model integration layer for multi-provider AI orchestration
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

// HuggingFace integration for vernacular NLP
export class HuggingFaceClient {
  private apiKey: string
  private baseUrl: string
  private enabled: boolean

  constructor() {
    const config = getAPIConfig()
    this.apiKey = config.huggingface.apiKey
    this.baseUrl = config.huggingface.baseUrl
    this.enabled = config.huggingface.enabled && isRealAPIsEnabled()
  }

  // IndicBERT for Hindi/Marathi sentiment
  async analyzeSentimentIndicBERT(text: string, language: 'hi' | 'mr'): Promise<ModelResponse> {
    const startTime = Date.now()
    const model = 'ai4bharat/indic-bert'
    
    // Return mock data if APIs are disabled or not configured
    if (!this.enabled) {
      if (isDebugMode()) {
        console.log('HuggingFace API disabled, returning mock sentiment data')
      }
      return this.getMockSentimentResponse(text, model, startTime)
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            task: 'sentiment-analysis',
            language: language
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        result: this.normalizeIndicBERTSentiment(result),
        model,
        usage: {
          inputTokens: Math.ceil(text.length / 4), // Approximate
          outputTokens: 10,
          cost: 0 // Free tier
        },
        latency: Date.now() - startTime
      }
    } catch (error) {
      console.error('IndicBERT analysis failed:', error)
      if (isDebugMode()) {
        console.log('Falling back to mock data due to API error')
      }
      return this.getMockSentimentResponse(text, model, startTime)
    }
  }

  // Multilingual BERT for Tamil/Telugu
  async analyzeSentimentMultilingual(text: string, _language: 'ta' | 'te'): Promise<ModelResponse> {
    const startTime = Date.now()
    const model = 'nlptown/bert-base-multilingual-uncased-sentiment'
    
    try {
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text
        })
      })

      const result = await response.json()
      
      return {
        result: this.normalizeMultilingualSentiment(result),
        model,
        usage: {
          inputTokens: Math.ceil(text.length / 4),
          outputTokens: 10,
          cost: 0
        },
        latency: Date.now() - startTime
      }
    } catch (error) {
      console.error('Multilingual sentiment analysis failed:', error)
      throw error
    }
  }

  // Translation for vernacular preprocessing
  async translateToEnglish(text: string, _sourceLanguage: string): Promise<ModelResponse> {
    const startTime = Date.now()
    const model = 'Helsinki-NLP/opus-mt-mul-en'
    
    try {
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            src_lang: _sourceLanguage,
            tgt_lang: 'en'
          }
        })
      })

      const result = await response.json()
      
      return {
        result: result[0]?.translation_text || text,
        model,
        usage: {
          inputTokens: Math.ceil(text.length / 4),
          outputTokens: Math.ceil((result[0]?.translation_text?.length || 0) / 4),
          cost: 0
        },
        latency: Date.now() - startTime
      }
    } catch (error) {
      console.error('Translation failed:', error)
      return {
        result: text, // Fallback to original
        model: 'fallback',
        usage: { inputTokens: 0, outputTokens: 0, cost: 0 },
        latency: Date.now() - startTime
      }
    }
  }

  private normalizeIndicBERTSentiment(result: unknown): { label: string, score: number } {
    // Normalize IndicBERT output to standard format
    if (Array.isArray(result) && result[0]) {
      return {
        label: result[0].label,
        score: result[0].score
      }
    }
    return { label: 'neutral', score: 0.5 }
  }

  private normalizeMultilingualSentiment(result: unknown): { label: string, score: number } {
    // Convert 1-5 star rating to positive/negative/neutral
    if (Array.isArray(result) && result[0]) {
      const stars = parseInt(result[0].label.split(' ')[0])
      let label = 'neutral'
      let score = 0.5
      
      if (stars >= 4) {
        label = 'positive'
        score = (stars - 3) / 2 + 0.5 // 0.5-1.0
      } else if (stars <= 2) {
        label = 'negative' 
        score = stars / 4 // 0.25-0.5
      }
      
      return { label, score }
    }
    return { label: 'neutral', score: 0.5 }
  }

  // Mock response for development/fallback
  private getMockSentimentResponse(text: string, model: string, startTime: number): ModelResponse {
    // Generate a mock sentiment based on simple keyword analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'अच्छा', 'बढ़िया', 'शानदार']
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'बुरा', 'खराब', 'गंदा']
    
    const lowerText = text.toLowerCase()
    const hasPositive = positiveWords.some(word => lowerText.includes(word))
    const hasNegative = negativeWords.some(word => lowerText.includes(word))
    
    let label = 'neutral'
    let score = 0.5
    
    if (hasPositive && !hasNegative) {
      label = 'positive'
      score = 0.7 + Math.random() * 0.3
    } else if (hasNegative && !hasPositive) {
      label = 'negative'
      score = Math.random() * 0.3
    }
    
    return {
      result: { label, score },
      model: `${model} (mock)`,
      usage: {
        inputTokens: Math.ceil(text.length / 4),
        outputTokens: 10,
        cost: 0
      },
      latency: Date.now() - startTime
    }
  }
}

// Together AI integration for fast extraction models
export class TogetherAIClient {
  private apiKey: string
  private baseUrl: string
  private enabled: boolean

  constructor() {
    const config = getAPIConfig()
    this.apiKey = config.together.apiKey
    this.baseUrl = config.together.baseUrl
    this.enabled = config.together.enabled && isRealAPIsEnabled()
  }

  // Mixtral for trend extraction and numeric analysis
  async extractTrends(text: string, focusArea: string): Promise<ModelResponse> {
    const startTime = Date.now()
    const model = 'mistralai/Mixtral-8x7B-Instruct-v0.1'
    
    // Return mock data if APIs are disabled
    if (!this.enabled) {
      if (isDebugMode()) {
        console.log('Together AI disabled, returning mock trend data')
      }
      return this.getMockTrendsResponse(text, focusArea, model, startTime)
    }
    
    const prompt = `Extract key trends and numeric signals from this consumer discussion about ${focusArea}:

Text: ${text}

Extract:
1. Top mentioned terms (frequency)
2. Price-related keywords
3. Sentiment indicators 
4. Cultural references

Format as JSON with counts and scores.`

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.1
        })
      })

      if (!response.ok) {
        throw new Error(`Together AI API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        result: this.parseExtractedTrends(result.choices[0]?.message?.content || '{}'),
        model,
        usage: {
          inputTokens: result.usage?.prompt_tokens || 0,
          outputTokens: result.usage?.completion_tokens || 0,
          cost: this.calculateTogetherCost(result.usage)
        },
        latency: Date.now() - startTime
      }
    } catch (error) {
      console.error('Trend extraction failed:', error)
      if (isDebugMode()) {
        console.log('Falling back to mock data due to API error')
      }
      return this.getMockTrendsResponse(text, focusArea, model, startTime)
    }
  }

  // LLaMA for cultural context analysis
  async analyzeCulturalContext(text: string, region: string): Promise<ModelResponse> {
    const startTime = Date.now()
    const model = 'meta-llama/Llama-3-8b-chat-hf'
    
    const prompt = `Analyze cultural context in this ${region} consumer discussion:

Text: ${text}

Identify:
1. Festival/seasonal references
2. Regional preferences
3. Cultural triggers for purchasing
4. Local language patterns

Provide insights relevant to Tier-2/3 Indian markets.`

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
          temperature: 0.2
        })
      })

      const result = await response.json()
      
      return {
        result: result.choices[0]?.message?.content || '',
        model,
        usage: {
          inputTokens: result.usage?.prompt_tokens || 0,
          outputTokens: result.usage?.completion_tokens || 0,
          cost: this.calculateTogetherCost(result.usage)
        },
        latency: Date.now() - startTime
      }
    } catch (error) {
      console.error('Cultural analysis failed:', error)
      throw error
    }
  }

  private parseExtractedTrends(content: string): { terms: string[], priceKeywords: string[], sentimentIndicators: string[], culturalReferences: string[] } {
    try {
      return JSON.parse(content)
    } catch {
      // Fallback parsing if JSON is malformed
      return {
        terms: [],
        priceKeywords: [],
        sentimentIndicators: [],
        culturalReferences: []
      }
    }
  }

  private calculateTogetherCost(usage: { prompt_tokens?: number, completion_tokens?: number }): number {
    // Together AI pricing (approximate)
    const inputCost = (usage?.prompt_tokens || 0) * 0.0002 / 1000
    const outputCost = (usage?.completion_tokens || 0) * 0.0002 / 1000
    return inputCost + outputCost
  }

  // Mock response for trend extraction
  private getMockTrendsResponse(text: string, focusArea: string, model: string, startTime: number): ModelResponse {
    const words = text.toLowerCase().split(/\s+/)
    const mockTerms = words
      .filter(word => word.length > 3)
      .reduce((acc: Record<string, number>, word) => {
        acc[word] = (acc[word] || 0) + 1
        return acc
      }, {})

    const priceKeywords = ['price', 'cost', 'expensive', 'cheap', 'discount', 'offer', 'deal']
    const foundPriceKeywords = priceKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    )

    const mockResult = {
      terms: Object.entries(mockTerms).slice(0, 5).map(([term, count]) => ({ term, count })),
      priceKeywords: foundPriceKeywords,
      sentimentIndicators: ['good', 'bad', 'great'].filter(word => text.toLowerCase().includes(word)),
      culturalReferences: ['festival', 'celebration', 'tradition'].filter(word => text.toLowerCase().includes(word))
    }

    return {
      result: mockResult,
      model: `${model} (mock)`,
      usage: {
        inputTokens: Math.ceil(text.length / 4),
        outputTokens: 100,
        cost: 0.02
      },
      latency: Date.now() - startTime
    }
  }
}

// Perplexity integration for real-time search
export class PerplexityClient {
  private apiKey: string
  private baseUrl: string
  private enabled: boolean

  constructor() {
    const config = getAPIConfig()
    this.apiKey = config.perplexity.apiKey
    this.baseUrl = config.perplexity.baseUrl
    this.enabled = config.perplexity.enabled && isRealAPIsEnabled()
  }

  async searchRealtimeData(query: string, languages: string[]): Promise<ModelResponse> {
    const startTime = Date.now()
    
    // Enhance query for Indian Tier-2/3 focus
    const enhancedQuery = `${query} India Tier-2 Tier-3 cities ${languages.join(' ')} vernacular consumer behavior`
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'user',
              content: `Search for recent discussions about: ${enhancedQuery}. Focus on social media, forums, and regional news sources. Provide source URLs and relevant quotes.`
            }
          ],
          max_tokens: 1000,
          temperature: 0.1,
          return_citations: true
        })
      })

      const result = await response.json()
      
      return {
        result: this.parsePerplexityResponse(result),
        model: 'perplexity-sonar',
        usage: {
          inputTokens: result.usage?.prompt_tokens || 0,
          outputTokens: result.usage?.completion_tokens || 0,
          cost: this.calculatePerplexityCost(result.usage)
        },
        latency: Date.now() - startTime
      }
    } catch (error) {
      console.error('Perplexity search failed:', error)
      throw error
    }
  }

  private parsePerplexityResponse(result: { choices?: Array<{ message?: { content?: string } }>, citations?: unknown[] }): { content: string, citations: unknown[], sources: Array<{url: string, title: string, snippet: string}> } {
    const content = result.choices?.[0]?.message?.content || ''
    return {
      content,
      citations: result.citations || [],
      sources: this.extractSources(content)
    }
  }

  private extractSources(content: string): Array<{url: string, title: string, snippet: string}> {
    // Extract source information from Perplexity response
    const sources = []
    const urlRegex = /\[(\d+)\]\s*([^\n]+)\s*-\s*(https?:\/\/[^\s]+)/g
    let match

    while ((match = urlRegex.exec(content)) !== null) {
      sources.push({
        url: match[3],
        title: match[2].trim(),
        snippet: ''
      })
    }

    return sources
  }

  private calculatePerplexityCost(usage: { prompt_tokens?: number, completion_tokens?: number }): number {
    // Perplexity pricing (approximate)
    const inputCost = (usage?.prompt_tokens || 0) * 0.001 / 1000
    const outputCost = (usage?.completion_tokens || 0) * 0.001 / 1000
    return inputCost + outputCost
  }
}

// Model orchestration manager
export class ModelOrchestrator {
  private huggingFace: HuggingFaceClient
  private togetherAI: TogetherAIClient
  private perplexity: PerplexityClient

  constructor() {
    this.huggingFace = new HuggingFaceClient()
    this.togetherAI = new TogetherAIClient()
    this.perplexity = new PerplexityClient()
  }

  // Route tasks to optimal models
  async routeTask(taskType: string, input: { text?: string, language?: string, focusArea?: string, region?: string, query?: string, languages?: string[] }): Promise<ModelResponse> {
    switch (taskType) {
      case 'vernacular-sentiment':
        return this.analyzeVernacularSentiment(input.text, input.language)
      case 'trend-extraction':
        return this.togetherAI.extractTrends(input.text || '', input.focusArea || '')
      case 'cultural-analysis':
        return this.togetherAI.analyzeCulturalContext(input.text || '', input.region || '')
      case 'realtime-search':
        return this.perplexity.searchRealtimeData(input.query || '', input.languages || [])
      default:
        throw new Error(`Unknown task type: ${taskType}`)
    }
  }

  private async analyzeVernacularSentiment(text?: string, language?: string): Promise<ModelResponse> {
    // Route to appropriate model based on language
    switch (language) {
      case 'hi':
      case 'mr':
        return this.huggingFace.analyzeSentimentIndicBERT(text || '', language as 'hi' | 'mr')
      case 'ta':
      case 'te':
        return this.huggingFace.analyzeSentimentMultilingual(text || '', language as 'ta' | 'te')
      default:
        throw new Error(`Unsupported language: ${language}`)
    }
  }

  // Get model recommendations for task
  getModelRecommendation(taskType: string, _constraints: Record<string, unknown>): string {
    const recommendations: Record<string, string> = {
      'sentiment': 'HuggingFace IndicBERT (free, optimized for Indian languages)',
      'extraction': 'Together AI Mixtral (fast, cost-efficient for structured data)',
      'cultural': 'Together AI LLaMA-3 (strong reasoning for cultural context)',
      'synthesis': 'OpenAI GPT-4 (premium quality for final reports)',
      'search': 'Perplexity Sonar (real-time web data with citations)'
    }

    return recommendations[taskType] || 'OpenAI GPT-4 (default fallback)'
  }
}
