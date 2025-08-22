export interface FetchedContent {
  url: string
  title: string
  content: string
  excerpt: string
  wordCount: number
  success: boolean
  error?: string
}

class UrlContentFetcher {
  async fetchContent(url: string): Promise<FetchedContent> {
    try {
      // Validate URL
      const urlObj = new URL(url)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Only HTTP and HTTPS URLs are supported')
      }

      // Check if URL is in our whitelist domains (security measure)
      const allowedDomains = [
        'docs.google.com',
        'github.com',
        'stackoverflow.com',
        'developer.mozilla.org',
        'w3schools.com',
        'npmjs.com',
        'wikipedia.org',
        'medium.com',
        'dev.to',
        'hackernoon.com'
      ]

      const domain = urlObj.hostname.toLowerCase()
      const isAllowed = allowedDomains.some(allowed => 
        domain === allowed || domain.endsWith(`.${allowed}`)
      )

      if (!isAllowed) {
        // For development, we'll allow all domains but log a warning
        console.warn(`Fetching from non-whitelisted domain: ${domain}`)
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MissionAgent/1.0; +https://missionagent.ai/bot)'
        },
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 seconds
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      
      // Extract content using simple regex (in production, consider using a proper HTML parser)
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      const title = titleMatch ? titleMatch[1].trim() : 'Untitled'

      // Remove HTML tags and extract text content
      const content = this.extractTextContent(html)
      const excerpt = this.createExcerpt(content, 300)

      return {
        url,
        title,
        content,
        excerpt,
        wordCount: content.split(/\s+/).length,
        success: true
      }
    } catch (error) {
      console.error(`Failed to fetch content from ${url}:`, error)
      
      return {
        url,
        title: 'Failed to fetch',
        content: '',
        excerpt: '',
        wordCount: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private extractTextContent(html: string): string {
    // Remove script and style elements
    let content = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    
    // Remove HTML comments
    content = content.replace(/<!--[\s\S]*?-->/g, '')
    
    // Remove HTML tags
    content = content.replace(/<[^>]*>/g, ' ')
    
    // Decode HTML entities
    content = content.replace(/&nbsp;/g, ' ')
    content = content.replace(/&amp;/g, '&')
    content = content.replace(/&lt;/g, '<')
    content = content.replace(/&gt;/g, '>')
    content = content.replace(/&quot;/g, '"')
    content = content.replace(/&#39;/g, "'")
    
    // Clean up whitespace
    content = content.replace(/\s+/g, ' ')
    content = content.trim()
    
    return content
  }

  private createExcerpt(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content
    }
    
    const excerpt = content.substring(0, maxLength)
    const lastSpace = excerpt.lastIndexOf(' ')
    
    if (lastSpace > maxLength * 0.8) {
      return excerpt.substring(0, lastSpace) + '...'
    }
    
    return excerpt + '...'
  }

  async fetchMultiple(urls: string[]): Promise<FetchedContent[]> {
    const promises = urls.map(url => this.fetchContent(url))
    return await Promise.all(promises)
  }
}

export const urlContentFetcher = new UrlContentFetcher()
