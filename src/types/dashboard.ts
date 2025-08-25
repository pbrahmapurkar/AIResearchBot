export type LanguageCode = "hi" | "ta" | "mr";
export type TimeRangeKey = "7d" | "30d" | "90d";

export type SentimentBucket = "positive" | "neutral" | "negative";
export type RegionKey = string; // ISO-3166-2:IN state code (e.g., "IN-MH")

export interface RegionalSentimentPoint {
  region: RegionKey;
  score: number;          // -1..+1
  volume: number;         // post count
  topTerms: string[];     // keywords
}

export interface SentimentTrendPoint {
  ts: string;             // ISO date
  score: number;          // -1..+1
  volume: number;
}

export interface PriceSignal {
  index: number;          // 0..100
  keywords: { term: string; count: number }[];
  byRegion: { region: RegionKey; index: number }[];
}

export interface VernacularSample {
  id: string;
  region: RegionKey;
  language: LanguageCode;
  text: string;           // native
  translation: string;    // English
  sentiment: SentimentBucket;
  timestamp: string;
}

export interface WeeklyReportSummary {
  weekOf: string;         // ISO date (monday)
  highlights: string[];
  downloadUrl?: string;   // mocked
}

export interface DashboardPayload {
  industry: string;
  language: LanguageCode;
  timeRange: TimeRangeKey;
  regional: RegionalSentimentPoint[];
  trend: SentimentTrendPoint[];
  price: PriceSignal;
  samples: VernacularSample[];
  weekly?: WeeklyReportSummary;
}
