// Mock implementation without OpenAI dependency
import { tavily } from '@/lib/tools/tavily'
import { prisma } from '@/lib/prisma'
import { Language, Industry, ReportData } from '@/types/mister-pb'

interface Project {
  id: string
  name: string
  industry: Industry
  languages: Language[]
  regions: string[]
}

interface SearchResult {
  title: string
  url: string
  content: string
  snippet: string
  language?: Language
  region?: string
}

export async function generateConsumerInsightsReport(project: Project, reportId: string) {
  try {
    console.log(`Starting report generation for project: ${project.name}`)

    // 1. Build search queries for vernacular content
    const searchQueries = buildSearchQueries(project)
    
    // 2. Search for vernacular consumer content
    const searchResults = await searchVernacularContent(searchQueries)
    
    // 3. Analyze content with mock implementation
    const analysisResults = await analyzeConsumerContent(searchResults, project)
    
    // 4. Generate structured insights
    const reportData = await generateStructuredInsights(analysisResults, project)
    
    // 5. Generate markdown summary
    const markdownSummary = await generateMarkdownSummary(reportData, searchResults)
    
    // 6. Save source citations
    await saveSourceCitations(reportId, searchResults)
    
    // 7. Update report with results
    await prisma.report.update({
      where: { id: reportId },
      data: {
        summaryMd: markdownSummary,
        jsonData: JSON.stringify(reportData),
        status: 'COMPLETED'
      }
    })

    console.log(`Report generation completed for project: ${project.name}`)
    return reportData

  } catch (error) {
    console.error('Report generation error:', error)
    
    // Update report status to failed
    await prisma.report.update({
      where: { id: reportId },
      data: { 
        status: 'FAILED',
        summaryMd: 'Report generation failed. Please try again.',
        jsonData: JSON.stringify({ error: error instanceof Error ? error.message : String(error) })
      }
    })
    
    throw error
  }
}

function buildSearchQueries(project: Project): Array<{query: string, language: Language, region?: string}> {
  const queries: Array<{query: string, language: Language, region?: string}> = []
  
  // Industry-specific keywords
  const industryKeywords = getIndustryKeywords(project.industry)
  
  // Language-specific search terms
  const languageTerms = {
    HINDI: ['उपभोक्ता', 'ग्राहक', 'कीमत', 'बाजार', 'खरीदारी', 'समीक्षा'],
    TAMIL: ['வாடிக்கையாளர்', 'விலை', 'சந்தை', 'வாங்குதல்', 'மதிப்பாய்வு'],
    TELUGU: ['వినియోగదారు', 'కస్టమర్', 'ధర', 'మార్కెట్', 'కొనుగోలు'],
    MARATHI: ['ग्राहक', 'किंमत', 'बाजार', 'खरेदी', 'पुनरावलोकन'],
    BENGALI: ['গ্রাহক', 'দাম', 'বাজার', 'কেনাকাটা', 'পর্যালোচনা'],
    GUJARATI: ['ગ્રાહક', 'કિંમત', 'બજાર', 'ખરીદી', 'સમીક્ષા'],
    KANNADA: ['ಗ್ರಾಹಕ', 'ಬೆಲೆ', 'ಮಾರುಕಟ್ಟೆ', 'ಖರೀದಿ', 'ಪರಿಶೀಲನೆ'],
    MALAYALAM: ['ഉപഭോക്താവ്', 'വില', 'കമ്പോളം', 'വാങ്ങൽ', 'അവലോകനം'],
    PUNJABI: ['ਗਾਹਕ', 'ਕੀਮਤ', 'ਬਾਜ਼ਾਰ', 'ਖਰੀਦਦਾਰੀ', 'ਸਮੀਖਿਆ'],
    ODIA: ['ଗ୍ରାହକ', 'ମୂଲ୍ୟ', 'ବଜାର', 'କିଣିବା', 'ସମୀକ୍ଷା']
  }

  // Build queries for each language and region combination
  project.languages.forEach(language => {
    const terms = languageTerms[language] || []
    
    project.regions.forEach(region => {
      // Consumer sentiment queries
      terms.forEach(term => {
        industryKeywords.forEach(keyword => {
          queries.push({
            query: `${term} ${keyword} ${region}`,
            language,
            region
          })
        })
      })
      
      // Price-related queries
      queries.push({
        query: `price increase ${region} ${project.industry.toLowerCase()}`,
        language,
        region
      })
      
      // Review and opinion queries
      queries.push({
        query: `review opinion ${region} ${project.industry.toLowerCase()}`,
        language,
        region
      })
    })
  })

  // Limit to top 20 most relevant queries
  return queries.slice(0, 20)
}

function getIndustryKeywords(industry: Industry): string[] {
  const keywords = {
    FMCG: ['FMCG', 'consumer goods', 'packaged food', 'beverages', 'household products'],
    FINTECH: ['fintech', 'digital payment', 'mobile banking', 'UPI', 'financial services'],
    ECOMMERCE: ['ecommerce', 'online shopping', 'delivery', 'marketplace', 'retail'],
    HEALTHCARE: ['healthcare', 'medicine', 'hospital', 'doctor', 'health services'],
    EDUCATION: ['education', 'online learning', 'school', 'course', 'edtech'],
    AUTOMOTIVE: ['automotive', 'car', 'vehicle', 'automobile', 'bike'],
    RETAIL: ['retail', 'shopping', 'store', 'mall', 'fashion'],
    TRAVEL: ['travel', 'tourism', 'hotel', 'booking', 'vacation'],
    REAL_ESTATE: ['real estate', 'property', 'house', 'apartment', 'rent'],
    OTHER: ['business', 'service', 'product', 'customer']
  }
  
  return keywords[industry] || keywords.OTHER
}

async function searchVernacularContent(queries: Array<{query: string, language: Language, region?: string}>): Promise<SearchResult[]> {
  const results: SearchResult[] = []
  
  for (const queryObj of queries) {
    try {
      const searchResponse = await tavily.search({
        query: queryObj.query,
        search_depth: "basic",
        include_answer: false,
        include_raw_content: false,
        max_results: 3,
        include_domains: [], // Could add specific Indian domains
        exclude_domains: ["wikipedia.org", "github.com"] // Exclude non-consumer content
      })

      searchResponse.results?.forEach(result => {
        results.push({
          title: result.title,
          url: result.url,
          content: result.content,
          snippet: result.content.slice(0, 500),
          language: queryObj.language,
          region: queryObj.region
        })
      })

      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Search failed for query: ${queryObj.query}`, error)
    }
  }

  return results
}

async function analyzeConsumerContent(searchResults: SearchResult[], project: Project) {
  const analysisPrompt = `
You are an expert consumer insights analyst specializing in Indian Tier-2 and Tier-3 markets. 

Analyze the following consumer content and extract insights for the ${project.industry} industry across these regions: ${project.regions.join(', ')}.

Focus on:
1. Consumer sentiment (positive/negative/neutral)
2. Price sensitivity indicators
3. Regional preferences and behavior patterns
4. Language-specific cultural nuances
5. Purchase decision factors

Content to analyze:
${searchResults.map(result => `
Title: ${result.title}
Region: ${result.region}
Language: ${result.language}
Content: ${result.snippet}
---
`).join('\n')}

Provide your analysis in JSON format with the following structure:
{
  "overall_sentiment": number, // -1 to 1 scale
  "price_sensitivity": number, // 0 to 100 scale
  "regional_insights": [
    {
      "region": "string",
      "sentiment": number,
      "key_findings": ["string"],
      "price_indicators": ["string"]
    }
  ],
  "language_insights": [
    {
      "language": "string", 
      "cultural_context": "string",
      "sentiment_patterns": "string"
    }
  ],
  "trending_topics": [
    {
      "topic": "string",
      "mentions": number,
      "sentiment": number
    }
  ]
}
`

  try {
    // Mock implementation: return a dummy analysis
    return {
      overall_sentiment: 0.5, // Neutral
      price_sensitivity: 70, // Moderate sensitivity
      regional_insights: [
        {
          region: "Mumbai",
          sentiment: 0.6, // Positive
          key_findings: ["Consumers are optimistic about job prospects", "Price increases are a concern"],
          price_indicators: ["FMCG prices up 5%", "Transport costs up 10%"]
        },
        {
          region: "Bangalore",
          sentiment: 0.4, // Negative
          key_findings: ["Consumers are cautious about spending", "Price increases are a major concern"],
          price_indicators: ["FMCG prices up 10%", "Transport costs up 20%"]
        }
      ],
      language_insights: [
        {
          language: "HINDI",
          cultural_context: "Consumers in rural areas are more price-sensitive",
          sentiment_patterns: "Negative sentiment towards price increases"
        },
        {
          language: "TAMIL",
          cultural_context: "Consumers in urban areas are more price-insensitive",
          sentiment_patterns: "Neutral sentiment towards price increases"
        }
      ],
      trending_topics: [
        {
          topic: "Online Shopping",
          mentions: 150,
          sentiment: 0.7
        },
        {
          topic: "FMCG Prices",
          mentions: 100,
          sentiment: 0.6
        }
      ]
    }
  } catch (error) {
    console.error('Mock analysis failed:', error)
    throw error
  }
}

async function generateStructuredInsights(analysisResults: unknown, _project: Project): Promise<ReportData> {
  const analysisData = analysisResults as {
    overall_sentiment?: number;
    price_sensitivity?: number;
    regional_insights?: Array<{
      region: string;
      sentiment: number;
      price_sensitivity?: number;
      key_findings?: string[];
    }>;
    language_insights?: Array<{
      language: string;
      sentiment?: number;
      price_indicators?: string[];
      cultural_context?: string;
    }>;
    trending_topics?: Array<{
      topic: string;
      mentions: number;
      sentiment: number;
    }>;
  };

  return {
    summary: {
      overallSentiment: analysisData.overall_sentiment || 0,
      avgPriceSensitivity: analysisData.price_sensitivity || 0,
      totalSources: analysisData.regional_insights?.length || 0,
      timeframe: new Date().toISOString().slice(0, 7)
    },
    regionalInsights: analysisData.regional_insights?.map((insight) => ({
      region: insight.region,
      sentiment: insight.sentiment,
      pricesensitivity: insight.price_sensitivity || 0,
      topKeywords: insight.key_findings || [],
      sourceCount: 1
    })) || [],
    languageInsights: analysisData.language_insights?.map((insight) => ({
      language: insight.language as Language,
      sentiment: insight.sentiment || 0,
      priceTerms: insight.price_indicators || [],
      culturalContext: insight.cultural_context || '',
      sourceCount: 1
    })) || [],
    trendingTopics: analysisData.trending_topics?.map(topic => ({
      ...topic,
      languages: [] as Language[] // Will be populated when we have better analysis
    })) || [],
    priceAlerts: [] // Will be populated based on thresholds
  }
}

async function generateMarkdownSummary(reportData: ReportData, _searchResults: SearchResult[]): Promise<string> {
  const summaryPrompt = `
Generate a comprehensive consumer insights report summary in markdown format based on this analysis:

Overall Sentiment: ${reportData.summary.overallSentiment}
Price Sensitivity: ${reportData.summary.avgPriceSensitivity}%
Total Sources: ${reportData.summary.totalSources}

Regional Insights: ${JSON.stringify(reportData.regionalInsights, null, 2)}
Language Insights: ${JSON.stringify(reportData.languageInsights, null, 2)}
Trending Topics: ${JSON.stringify(reportData.trendingTopics, null, 2)}

Include:
1. Executive Summary
2. Key Findings by Region
3. Language-specific Insights
4. Price Sensitivity Analysis
5. Trending Topics
6. Recommendations

Use proper markdown formatting with headers, bullet points, and emphasis.
Cite sources using [n] format where n is the source number.
`

  try {
    // Mock implementation: return a dummy summary
    return `
# Consumer Insights Report for ${_searchResults[0]?.region || 'Unknown Region'}

## Executive Summary
Overall Sentiment: ${reportData.summary.overallSentiment}
Price Sensitivity: ${reportData.summary.avgPriceSensitivity}%
Total Sources: ${reportData.summary.totalSources}

## Key Findings by Region
- **${_searchResults[0]?.region || 'Unknown Region'}**:
  - Sentiment: ${reportData.regionalInsights[0]?.sentiment || 0}
  - Price Sensitivity: ${reportData.regionalInsights[0]?.pricesensitivity || 0}%
  - Top Keywords: ${reportData.regionalInsights[0]?.topKeywords?.join(', ')}

- **${_searchResults[1]?.region || 'Unknown Region'}**:
  - Sentiment: ${reportData.regionalInsights[1]?.sentiment || 0}
  - Price Sensitivity: ${reportData.regionalInsights[1]?.pricesensitivity || 0}%
  - Top Keywords: ${reportData.regionalInsights[1]?.topKeywords?.join(', ')}

## Language-specific Insights
- **HINDI**:
  - Cultural Context: ${reportData.languageInsights[0]?.culturalContext || 'N/A'}
  - Price Terms: ${reportData.languageInsights[0]?.priceTerms?.join(', ') || 'N/A'}

- **TAMIL**:
  - Cultural Context: ${reportData.languageInsights[1]?.culturalContext || 'N/A'}
  - Price Terms: ${reportData.languageInsights[1]?.priceTerms?.join(', ') || 'N/A'}

## Price Sensitivity Analysis
- Overall Price Sensitivity: ${reportData.summary.avgPriceSensitivity}%
- Regional Variation: ${reportData.regionalInsights.map(ri => `${ri.region}: ${ri.pricesensitivity}%`).join(', ')}

## Trending Topics
- **${reportData.trendingTopics[0]?.topic || 'N/A'}**: Mentions: ${reportData.trendingTopics[0]?.mentions || 0}, Sentiment: ${reportData.trendingTopics[0]?.sentiment || 0}
- **${reportData.trendingTopics[1]?.topic || 'N/A'}**: Mentions: ${reportData.trendingTopics[1]?.mentions || 0}, Sentiment: ${reportData.trendingTopics[1]?.sentiment || 0}

## Recommendations
1. Monitor price trends across regions.
2. Focus on rural markets for FMCG products.
3. Consider language-specific marketing strategies.
4. Keep an eye on online shopping trends.
`
  } catch (error) {
    console.error('Summary generation failed:', error)
    return 'Report summary generation failed. Please try again.'
  }
}

async function saveSourceCitations(reportId: string, searchResults: SearchResult[]) {
  const citations = searchResults.map(result => ({
    reportId,
    title: result.title,
    url: result.url,
    content: result.content,
    snippet: result.snippet,
    language: result.language || 'HINDI',
    region: result.region || 'Unknown'
  }))

  await prisma.source.createMany({
    data: citations
  })
}
