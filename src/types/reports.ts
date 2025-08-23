export type TimeframeType = 'last_7d' | 'last_30d' | 'last_90d' | 'last_6m' | 'last_1y' | 'custom';

export type Timeframe = 
  | { type: 'last_7d' }
  | { type: 'last_30d' }
  | { type: 'last_90d' }
  | { type: 'last_6m' }
  | { type: 'last_1y' }
  | { type: 'custom'; from: string; to: string };

// Alternative: More flexible Timeframe type that uses TimeframeType
export type TimeframeFlexible = {
  type: TimeframeType;
  from?: string;
  to?: string;
};

export type LanguageCode = 'hi' | 'ta' | 'te' | 'mr' | 'bn' | 'gu' | 'kn' | 'ml' | 'pa' | 'en';
export type RegionCode = 'MH' | 'TN' | 'KA' | 'AP' | 'TL' | 'UP' | 'BH' | 'GJ' | 'RJ' | 'WB';

export interface GenerateReportRequest {
  projectId: string;
  timeframe: Timeframe;
  langs: LanguageCode[];
  regions: RegionCode[];
}

export type JobStatus = 'queued' | 'running' | 'compiling' | 'done' | 'error';
export type ReportStatus = 'DRAFT' | 'READY' | 'FAILED';

export interface JobResponse {
  jobId: string;
  status: JobStatus;
  progress: number;
  reportId: string | null;
  message?: string;
}

export interface Report {
  id: string;
  projectId: string;
  title: string;
  status: ReportStatus;
  timeframe: string;
  jsonPath?: string;
  mdPath?: string;
  pdfPath?: string;
  csvPath?: string;
  createdAt: Date;
  updatedAt: Date;
}
