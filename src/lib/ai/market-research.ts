import { Groq } from 'groq-sdk'
import Anthropic from '@anthropic-ai/sdk'
import { MarketResearchRequest, SearchResult, StreamingChunk, AIProvider } from '@/types/market-research'

// Type for Anthropic stream delta
interface AnthropicDelta {
  text?: string
  type?: string
}

// AI Provider Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

// Initialize AI clients
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null
const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null

export class MarketResearchAI {
  private provider: AIProvider = 'groq'

  constructor(provider?: AIProvider) {
    if (provider) {
      this.provider = provider
    }
  }

  /**
   * Generate market research summary using AI
   */
  async generateSummary(
    request: MarketResearchRequest,
    searchResults: SearchResult[],
    onChunk: (chunk: StreamingChunk) => void
  ): Promise<void> {
    try {
      // Validate AI providers
      if (!this.isProviderAvailable(this.provider)) {
        // Fallback to available provider
        const availableProvider = this.getAvailableProvider()
        if (!availableProvider) {
          throw new Error('No AI providers available')
        }
        this.provider = availableProvider
      }

      // Prepare context for AI
      const context = this.prepareContext(request, searchResults)
      
      // Generate summary based on provider
      if (this.provider === 'groq') {
        await this.generateWithGroq(context, onChunk)
      } else {
        await this.generateWithAnthropic(context, onChunk)
      }

      // Send completion signal
      onChunk({ type: 'complete', progress: 100 })
    } catch (error) {
      console.error('AI generation error:', error)
      onChunk({ 
        type: 'error', 
        error: error instanceof Error ? error.message : 'AI generation failed' 
      })
    }
  }

  /**
   * Generate summary using Groq
   */
  private async generateWithGroq(
    context: string,
    onChunk: (chunk: StreamingChunk) => void
  ): Promise<void> {
    if (!groq) throw new Error('Groq not available')

    const prompt = this.buildPrompt(context)
    
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert market research analyst specializing in consumer insights for Indian markets. Provide clear, actionable insights with proper citations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.3,
      max_tokens: 2000,
      stream: true
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        onChunk({ type: 'content', content })
        
        // Extract citations from content
        const citationMatch = content.match(/\[([^\]]+)\]/g)
        if (citationMatch) {
          citationMatch.forEach(citation => {
            onChunk({ type: 'citation', citation: citation.slice(1, -1) })
          })
        }
      }
    }
  }

  /**
   * Generate summary using Anthropic
   */
  private async generateWithAnthropic(
    context: string,
    onChunk: (chunk: StreamingChunk) => void
  ): Promise<void> {
    if (!anthropic) throw new Error('Anthropic not available')

    const prompt = this.buildPrompt(context)
    
    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.3,
      system: 'You are an expert market research analyst specializing in consumer insights for Indian markets. Provide clear, actionable insights with proper citations.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      stream: true
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && 'delta' in chunk) {
        const delta = chunk.delta as AnthropicDelta
        if (delta.text) {
          onChunk({ type: 'content', content: delta.text })
          
          // Extract citations from content
          const citationMatch = delta.text.match(/\[([^\]]+)\]/g)
          if (citationMatch) {
            citationMatch.forEach((citation: string) => {
              onChunk({ type: 'citation', citation: citation.slice(1, -1) })
            })
          }
        }
      }
    }
  }

  /**
   * Build AI prompt for market research
   */
  private buildPrompt(context: string): string {
    return `Please analyze the following market research data and provide a comprehensive summary:

${context}

Please provide:
1. Executive Summary (2-3 sentences)
2. Key Market Insights (3-5 bullet points)
3. Regional Analysis (focus on the specified regions)
4. Language-Specific Insights (consider cultural nuances)
5. Recommendations (3-5 actionable items)
6. Citations for all claims using [Source Name] format

Focus on consumer behavior, market trends, and actionable insights for the specified timeframe.`
  }

  /**
   * Prepare context for AI analysis
   */
  private prepareContext(request: MarketResearchRequest, searchResults: SearchResult[]): string {
    const context = `
Research Topic: ${request.topic}
Target Regions: ${request.regions.join(', ')}
Languages: ${request.languages.join(', ')}
Timeframe: ${request.timeframe}

Search Results:
${searchResults.map((result, index) => `
${index + 1}. ${result.title}
   URL: ${result.url}
   Summary: ${result.snippet}
`).join('\n')}
`
    return context
  }

  /**
   * Check if a provider is available
   */
  private isProviderAvailable(provider: AIProvider): boolean {
    if (provider === 'groq') return !!GROQ_API_KEY
    if (provider === 'anthropic') return !!ANTHROPIC_API_KEY
    return false
  }

  /**
   * Get available AI provider
   */
  private getAvailableProvider(): AIProvider | null {
    if (GROQ_API_KEY) return 'groq'
    if (ANTHROPIC_API_KEY) return 'anthropic'
    return null
  }

  /**
   * Get provider status
   */
  getProviderStatus(): { groq: boolean; anthropic: boolean } {
    return {
      groq: !!GROQ_API_KEY,
      anthropic: !!ANTHROPIC_API_KEY
    }
  }
}

// Export singleton instance
export const marketResearchAI = new MarketResearchAI()
