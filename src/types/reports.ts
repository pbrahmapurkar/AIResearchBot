export type Timeframe = 
  | { type: 'last_7d' }
  | { type: 'last_30d' }
  | { type: 'last_90d' }
  | { type: 'custom'; from: string; to: string };

export type LanguageCode = 'hi' | 'ta' | 'te' | 'mr' | 'bn' | 'gu' | 'kn' | 'ml' | 'pa';
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
