import { GenerateReportRequest, JobResponse, JobStatus } from '@/types/reports';

// In-memory storage for demo (replace with database in production)
const jobs = new Map<string, JobResponse & { interval?: NodeJS.Timeout }>();

export async function createReportJob(request: GenerateReportRequest): Promise<{ id: string; reportId: string }> {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const reportId = `rep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const job: JobResponse = {
    jobId,
    status: 'queued',
    progress: 0,
    reportId,
    message: 'Job queued successfully'
  };

  jobs.set(jobId, job);

  // Simulate background job processing
  setTimeout(() => startJobProcessing(jobId, request), 1000);

  return { id: jobId, reportId };
}

async function startJobProcessing(jobId: string, request: GenerateReportRequest) {
  const job = jobs.get(jobId);
  if (!job) return;

  // Update to running state
  job.status = 'running';
  job.progress = 10;
  job.message = 'Fetching sources from vernacular platforms...';
  jobs.set(jobId, job);

  // Simulate fetching phase (3 seconds)
  await simulateWork(3000, jobId, 40, 'Analyzing consumer sentiment and price sensitivity...');

  // Update to compiling state
  job.status = 'compiling';
  job.progress = 70;
  job.message = 'Compiling insights into report format...';
  jobs.set(jobId, job);

  // Simulate compiling phase (2 seconds)
  await simulateWork(2000, jobId, 95, 'Finalizing report...');

  // Complete the job
  job.status = 'done';
  job.progress = 100;
  job.message = 'Report generated successfully!';
  jobs.set(jobId, job);
}

async function simulateWork(
  duration: number,
  jobId: string,
  targetProgress: number,
  message: string
) {
  const job = jobs.get(jobId);
  if (!job) return;

  job.message = message;
  jobs.set(jobId, job);

  return new Promise(resolve => {
    const interval = setInterval(() => {
      const job = jobs.get(jobId);
      if (!job) {
        clearInterval(interval);
        resolve(null);
        return;
      }

      if (job.progress < targetProgress) {
        job.progress += 5;
        jobs.set(jobId, job);
      } else {
        clearInterval(interval);
        resolve(null);
      }
    }, duration / ((targetProgress - job.progress) / 5));
  });
}

export async function getJobStatus(jobId: string): Promise<JobResponse | null> {
  return jobs.get(jobId) || null;
}

export function cleanupJob(jobId: string) {
  const job = jobs.get(jobId);
  if (job?.interval) {
    clearInterval(job.interval);
  }
  jobs.delete(jobId);
}
