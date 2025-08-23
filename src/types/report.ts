export interface Report {
  reportId: string;
  title: string;
  timeframe: string;
  status: 'READY' | 'FAILED' | 'PROCESSING';
  summary: string[];
  regions: Region[];
  sentimentSeries: SentimentDataPoint[];
  price: PriceAnalysis;
  topTerms: TopTerm[];
  topPosts: TopPost[];
  sources: Source[];
  recommendations: Recommendation[];
  files: {
    jsonPath?: string;
    mdPath?: string;
    pdfPath?: string;
    csvPath?: string;
  };
}

export interface Region {
  id: string;
  name: string;
  lang: string;
  volume: number;
  avgSentiment: number;
}

export interface SentimentDataPoint {
  date: string;
  regionId: string;
  avgSentiment: number;
  volume: number;
}

export interface PriceAnalysis {
  score: number;
  drivers: PriceDriver[];
}

export interface PriceDriver {
  quote: string;
  url: string;
  regionId: string;
  lang: string;
}

export interface TopTerm {
  term: string;
  lang: string;
  frequency: number;
  regionId: string;
}

export interface TopPost {
  title: string;
  snippet: string;
  url: string;
  lang: string;
  regionId: string;
  timestamp: number;
}

export interface Source {
  url: string;
  title: string;
  domain: string;
  lang: string;
  regionId: string;
}

export interface Recommendation {
  text: string;
  impact?: 'High' | 'Med' | 'Low';
}
