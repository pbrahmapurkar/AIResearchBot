import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type {
  DashboardPayload,
  LanguageCode,
  TimeRangeKey,
  SentimentBucket,
  RegionKey,
  RegionalSentimentPoint,
  SentimentTrendPoint,
  PriceSignal,
  VernacularSample,
  WeeklyReportSummary,
} from '@/types/dashboard';
import { REGION_NAMES } from '@/lib/regions';

// simple string hash
function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const QuerySchema = z.object({
  industry: z.enum(['FMCG', 'Retail', 'Healthcare']),
  language: z.enum(['hi', 'ta', 'mr']),
  range: z.enum(['7d', '30d', '90d']),
});

const REGIONS: RegionKey[] = [
  'IN-MH',
  'IN-GJ',
  'IN-DL',
  'IN-KA',
  'IN-TN',
  'IN-UP',
  'IN-RJ',
  'IN-WB',
];

const SAMPLE_TEXT: Record<LanguageCode, string[]> = {
  hi: [
    'यह उत्पाद बहुत अच्छा है',
    'कीमत थोड़ी ज्यादा है',
    'मुझे यह पसंद आया',
    'गुणवत्ता ठीक है',
    'बहुत खराब अनुभव',
  ],
  ta: [
    'இந்த தயாரிப்பு நல்லது',
    'விலை அதிகமாக உள்ளது',
    'எனக்கு இது பிடித்தது',
    'தரமானது சரி',
    'மிகவும் மோசமான அனுபவம்',
  ],
  mr: [
    'हा उत्पादन खूप चांगले आहे',
    'किंमत जास्त आहे',
    'मला हे आवडले',
    'गुणवत्ता ठीक आहे',
    'खूप वाईट अनुभव',
  ],
};

const SAMPLE_TRANSLATION: Record<LanguageCode, string[]> = {
  hi: [
    'This product is very good',
    'Price is a bit high',
    'I liked it',
    'Quality is okay',
    'Very bad experience',
  ],
  ta: [
    'This product is good',
    'Price is high',
    'I like it',
    'Quality is fine',
    'Very bad experience',
  ],
  mr: [
    'This product is very good',
    'Price is high',
    'I liked it',
    'Quality is okay',
    'Very bad experience',
  ],
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    industry: url.searchParams.get('industry'),
    language: url.searchParams.get('language'),
    range: url.searchParams.get('range'),
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { field: issue.path[0] as string, message: issue.message },
      { status: 422 }
    );
  }

  const { industry, language, range } = parsed.data;
  const rand = mulberry32(hash(`${industry}-${language}-${range}`));

  const regional: RegionalSentimentPoint[] = REGIONS.map((region) => ({
    region,
    score: parseFloat((rand() * 2 - 1).toFixed(2)),
    volume: Math.floor(rand() * 1000 + 100),
    topTerms: ['price', 'quality', 'service'].map((t) => `${t}${Math.floor(rand() * 10)}`),
  }));

  const rangeDays: Record<TimeRangeKey, number> = { '7d': 7, '30d': 30, '90d': 90 };
  const today = new Date();
  const trend: SentimentTrendPoint[] = Array.from({ length: rangeDays[range] }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (rangeDays[range] - i - 1));
    return {
      ts: d.toISOString().slice(0, 10),
      score: parseFloat((rand() * 2 - 1).toFixed(2)),
      volume: Math.floor(rand() * 1000 + 50),
    };
  });

  const price: PriceSignal = {
    index: Math.floor(rand() * 100),
    keywords: Array.from({ length: 5 }).map(() => ({
      term: `term${Math.floor(rand() * 100)}`,
      count: Math.floor(rand() * 50 + 1),
    })),
    byRegion: REGIONS.slice(0, 5).map((region) => ({
      region,
      index: Math.floor(rand() * 100),
    })),
  };

  const samples: VernacularSample[] = Array.from({ length: 20 }).map((_, i) => {
    const region = REGIONS[Math.floor(rand() * REGIONS.length)];
    const textIdx = Math.floor(rand() * SAMPLE_TEXT[language].length);
    const sentiment: SentimentBucket = rand() > 0.66 ? 'positive' : rand() < 0.33 ? 'negative' : 'neutral';
    const ts = new Date(Date.now() - rand() * 1000 * 60 * 60 * 24 * rangeDays[range]);
    return {
      id: `${i}`,
      region,
      language,
      text: SAMPLE_TEXT[language][textIdx],
      translation: SAMPLE_TRANSLATION[language][textIdx],
      sentiment,
      timestamp: ts.toISOString(),
    };
  });

  const weekly: WeeklyReportSummary = {
    weekOf: trend[0].ts,
    highlights: [
      `Sentiment average ${(trend.reduce((a, b) => a + b.score, 0) / trend.length).toFixed(2)}`,
      `Top region ${REGION_NAMES[regional[0].region]}`,
    ],
    downloadUrl: '#',
  };

  const payload: DashboardPayload = {
    industry,
    language,
    timeRange: range,
    regional,
    trend,
    price,
    samples,
    weekly,
  };

  return NextResponse.json(payload, { headers: { 'Cache-Control': 'no-store' } });
}
