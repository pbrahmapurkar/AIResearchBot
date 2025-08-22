export type Language = 'hi' | 'ta' | 'te' | 'mr'
export type SentimentScore = number // -1 to 1

interface SentimentLexicon {
  positive: string[]
  negative: string[]
}

// Vernacular sentiment lexicons with transliteration
const SENTIMENT_LEXICONS: Record<Language, SentimentLexicon> = {
  hi: {
    positive: [
      'अच्छा', 'achha', 'good', 'बढ़िया', 'badhiya', 'excellent', 'शानदार', 'shandar',
      'बेहतरीन', 'behtarin', 'मस्त', 'mast', 'जबरदस्त', 'jabardast', 'लाजवाब', 'lajawab',
      'खुश', 'khush', 'happy', 'प्रसन्न', 'prasann', 'सुंदर', 'sundar', 'beautiful',
      'पसंद', 'pasand', 'like', 'प्यार', 'pyar', 'love', 'discount', 'offer', 'deal',
      'सस्ता', 'sasta', 'cheap', 'फायदा', 'fayda', 'benefit', 'लाभ', 'labh'
    ],
    negative: [
      'बुरा', 'bura', 'bad', 'खराब', 'kharab', 'terrible', 'गंदा', 'ganda', 'गलत', 'galat',
      'महंगा', 'mehenga', 'expensive', 'costly', 'दुखी', 'dukhi', 'sad', 'परेशान', 'pareshan',
      'गुस्सा', 'gussa', 'angry', 'नफरत', 'nafrat', 'hate', 'गलती', 'galti', 'mistake',
      'धोखा', 'dhokha', 'cheat', 'झूठ', 'jhooth', 'lie', 'waste', 'बेकार', 'bekaar'
    ]
  },
  ta: {
    positive: [
      'நல்ல', 'nalla', 'good', 'அருமை', 'arumai', 'excellent', 'சூப்பர்', 'super',
      'அழகு', 'azhagu', 'beautiful', 'பிடிக்கும்', 'pidikkum', 'like', 'சந்தோஷம்', 'santhosham',
      'happy', 'offer', 'discount', 'தள்ளுபடி', 'thallupadi', 'இலவசம்', 'ilavasam', 'free',
      'மலிவு', 'malivu', 'cheap', 'லாபம்', 'laabam', 'profit', 'பயன்', 'payan', 'use'
    ],
    negative: [
      'கெட்ட', 'ketta', 'bad', 'மோசம்', 'mosam', 'terrible', 'வெறுப்பு', 'veruppu', 'hate',
      'கோபம்', 'kopam', 'angry', 'விலை', 'vilai', 'expensive', 'அதிகம்', 'adhigam', 'high',
      'கஷ்டம்', 'kashtam', 'difficult', 'தவறு', 'thavaru', 'wrong', 'பொய்', 'poi', 'lie',
      'ஏமாற்று', 'emaatru', 'cheat', 'வேஸ்ட்', 'waste'
    ]
  },
  te: {
    positive: [
      'మంచి', 'manchi', 'good', 'బాగుంది', 'bagundi', 'excellent', 'అద్భుతం', 'adbhutam',
      'సుందరం', 'sundaram', 'beautiful', 'ఇష్టం', 'ishtam', 'like', 'సంతోషం', 'santhosham',
      'happy', 'offer', 'discount', 'తక్కువ', 'thakkuva', 'less', 'చౌక', 'chouka', 'cheap',
      'లాభం', 'laabham', 'profit', 'ఉపయోగం', 'upayogam', 'useful'
    ],
    negative: [
      'చెడ్డ', 'chedda', 'bad', 'దారుణం', 'daarunam', 'terrible', 'కోపం', 'kopam', 'angry',
      'ద్వేషం', 'dvesham', 'hate', 'ఖరీదు', 'khareeku', 'expensive', 'అధికం', 'adhikam',
      'కష్టం', 'kashtam', 'difficult', 'తప్పు', 'thappu', 'wrong', 'అబద్ధం', 'abaddham', 'lie',
      'మోసం', 'mosam', 'cheat', 'వేస్ట్', 'waste'
    ]
  },
  mr: {
    positive: [
      'चांगला', 'changla', 'good', 'उत्तम', 'uttam', 'excellent', 'सुंदर', 'sundar',
      'आवडणारा', 'aavadnara', 'favorite', 'आनंद', 'anand', 'happiness', 'खुश', 'khush',
      'offer', 'discount', 'स्वस्त', 'swast', 'cheap', 'फायदा', 'fayada', 'benefit',
      'लाभ', 'laabh', 'profit', 'उपयोग', 'upyog', 'useful'
    ],
    negative: [
      'वाईट', 'vaait', 'bad', 'भयंकर', 'bhayankar', 'terrible', 'राग', 'raag', 'angry',
      'द्वेष', 'dvesh', 'hate', 'महाग', 'mahaag', 'expensive', 'जास्त', 'jaast', 'more',
      'कष्ट', 'kasht', 'difficult', 'चूक', 'chook', 'mistake', 'खोटा', 'khota', 'false',
      'फसवणूक', 'fasavnook', 'cheat', 'व्यर्थ', 'vyarth', 'waste'
    ]
  }
}

export function analyzeSentiment(text: string, language: Language): SentimentScore {
  const lexicon = SENTIMENT_LEXICONS[language]
  if (!lexicon) return 0

  const words = text.toLowerCase().split(/\s+/)
  let positiveCount = 0
  let negativeCount = 0

  for (const word of words) {
    if (lexicon.positive.some(pos => word.includes(pos) || pos.includes(word))) {
      positiveCount++
    }
    if (lexicon.negative.some(neg => word.includes(neg) || neg.includes(word))) {
      negativeCount++
    }
  }

  const totalSentimentWords = positiveCount + negativeCount
  if (totalSentimentWords === 0) return 0

  // Return score between -1 and 1
  return (positiveCount - negativeCount) / Math.max(totalSentimentWords, 1)
}

export function extractTopTerms(texts: string[], language: Language, limit = 10): Array<{term: string, count: number}> {
  const termCounts = new Map<string, number>()
  
  const stopWords = new Set([
    'का', 'के', 'की', 'में', 'से', 'को', 'है', 'हैं', 'था', 'थे', 'की', 'का', 'के',
    'அவர்', 'என்', 'அந்த', 'இந்த', 'ஒரு', 'மற்றும்', 'அல்லது', 'என்று',
    'ఆ', 'ఈ', 'ఒక', 'మరియు', 'లేదా', 'అని', 'కూడా', 'అయినా',
    'त्या', 'ह्या', 'एक', 'आणि', 'किंवा', 'म्हणून', 'सुद्धा', 'पण',
    'and', 'or', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for'
  ])

  for (const text of texts) {
    const words = text.toLowerCase().match(/[\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\u0D00-\u0D7F\w]+/g) || []
    
    for (const word of words) {
      if (word.length > 2 && !stopWords.has(word) && !/^\d+$/.test(word)) {
        termCounts.set(word, (termCounts.get(word) || 0) + 1)
      }
    }
  }

  return Array.from(termCounts.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
