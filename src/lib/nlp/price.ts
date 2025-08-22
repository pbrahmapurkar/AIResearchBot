export interface PriceSignal {
  hasPriceKeyword: boolean
  priceScore: number // 0-1, higher = more price-sensitive
  keyPhrases: string[]
}

// Multilingual price keywords
const PRICE_KEYWORDS = {
  hi: [
    'महंगा', 'mehenga', 'expensive', 'costly', 'सस्ता', 'sasta', 'cheap', 'discount',
    'offer', 'sale', 'कम', 'kam', 'less', 'ज्यादा', 'jyada', 'more', 'पैसा', 'paisa',
    'रुपया', 'rupaya', 'price', 'दाम', 'daam', 'cost', 'deal', 'free', 'मुफ्त', 'muft',
    'छूट', 'chhoot', 'बचत', 'bachat', 'saving', 'फायदा', 'fayda', 'benefit'
  ],
  ta: [
    'விலை', 'vilai', 'price', 'தள்ளுபடி', 'thallupadi', 'discount', 'offer', 'sale',
    'இலவசம்', 'ilavasam', 'free', 'மலிவு', 'malivu', 'cheap', 'அதிகம்', 'adhigam', 'expensive',
    'குறைவு', 'kuraivu', 'less', 'பணம்', 'panam', 'money', 'cost', 'deal', 'சேமிப்பு', 'saemippu',
    'saving', 'லாபம்', 'laabam', 'profit', 'நஷ்டம்', 'nashtam', 'loss'
  ],
  te: [
    'ధర', 'dhara', 'price', 'తక్కువ', 'thakkuva', 'less', 'అధికం', 'adhikam', 'expensive',
    'చౌక', 'chouka', 'cheap', 'ఉచిత', 'uchitha', 'free', 'offer', 'discount', 'sale',
    'డీల్', 'deal', 'పైసా', 'paisa', 'money', 'cost', 'సేవింగ్', 'saving', 'లాభం', 'laabham',
    'నష్టం', 'nashtam', 'loss', 'బజెట్', 'budget'
  ],
  mr: [
    'दाम', 'daam', 'price', 'महाग', 'mahaag', 'expensive', 'स्वस्त', 'swast', 'cheap',
    'कमी', 'kami', 'less', 'जास्त', 'jaast', 'more', 'offer', 'discount', 'sale',
    'मोफत', 'mofat', 'free', 'पैसा', 'paisa', 'money', 'deal', 'cost', 'बचत', 'bachat',
    'saving', 'फायदा', 'fayada', 'benefit', 'तोटा', 'tota', 'loss'
  ]
}

const ALL_PRICE_KEYWORDS = Object.values(PRICE_KEYWORDS).flat()

export function detectPriceSignals(text: string): PriceSignal {
  const lowerText = text.toLowerCase()
  const words = lowerText.split(/\s+/)
  
  // Find price-related keywords
  const foundKeywords = ALL_PRICE_KEYWORDS.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  )
  
  if (foundKeywords.length === 0) {
    return {
      hasPriceKeyword: false,
      priceScore: 0,
      keyPhrases: []
    }
  }

  // Extract key phrases containing price keywords
  const sentences = text.split(/[।.!?।]/).filter(s => s.trim().length > 0)
  const keyPhrases = sentences.filter(sentence => 
    foundKeywords.some(keyword => 
      sentence.toLowerCase().includes(keyword.toLowerCase())
    )
  ).map(phrase => phrase.trim())

  // Calculate price sensitivity score based on keyword density and context
  let priceScore = Math.min(foundKeywords.length / words.length * 10, 1)
  
  // Boost score for specific high-value keywords
  const highValueKeywords = ['महंगा', 'expensive', 'costly', 'मुफ्त', 'free', 'discount', 'offer']
  const hasHighValueKeyword = highValueKeywords.some(hvk => 
    lowerText.includes(hvk.toLowerCase())
  )
  
  if (hasHighValueKeyword) {
    priceScore = Math.min(priceScore * 1.5, 1)
  }

  return {
    hasPriceKeyword: true,
    priceScore,
    keyPhrases: keyPhrases.slice(0, 3) // Top 3 relevant phrases
  }
}

export function aggregatePriceSensitivity(texts: string[]): {
  overallScore: number // 0-100
  totalPriceSignals: number
  topPhrases: string[]
} {
  if (texts.length === 0) {
    return { overallScore: 0, totalPriceSignals: 0, topPhrases: [] }
  }

  const signals = texts.map(detectPriceSignals)
  const priceSignals = signals.filter(s => s.hasPriceKeyword)
  
  if (priceSignals.length === 0) {
    return { overallScore: 0, totalPriceSignals: 0, topPhrases: [] }
  }

  // Calculate overall score as percentage of texts with price signals
  const overallScore = Math.round((priceSignals.length / texts.length) * 100)
  
  // Collect top phrases
  const allPhrases = priceSignals.flatMap(s => s.keyPhrases)
  const uniquePhrases = [...new Set(allPhrases)]
  const topPhrases = uniquePhrases
    .sort((a, b) => b.length - a.length) // Prefer longer, more descriptive phrases
    .slice(0, 5)

  return {
    overallScore,
    totalPriceSignals: priceSignals.length,
    topPhrases
  }
}
