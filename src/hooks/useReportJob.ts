'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { JobResponse } from '@/types/reports';

export function useReportJob() {
  const [activeJob, setActiveJob] = useState<JobResponse | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const router = useRouter();

  const startPolling = useCallback((jobId: string) => {
    setIsPolling(true);
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/research/job?id=${jobId}`);
        if (!response.ok) throw new Error('Failed to fetch job status');
        
        const jobData: JobResponse = await response.json();
        setActiveJob(jobData);

        if (jobData.status === 'done' && jobData.reportId) {
          clearInterval(pollInterval);
          setIsPolling(false);
          router.push(`/app/reports/${jobData.reportId}`);
        } else if (jobData.status === 'error') {
          clearInterval(pollInterval);
          setIsPolling(false);
        }
      } catch (error) {
        console.error('Error polling job status:', error);
        clearInterval(pollInterval);
        setIsPolling(false);
      }
    }, 1200);

    return () => clearInterval(pollInterval);
  }, [router]);

  const clearActiveJob = useCallback(() => {
    setActiveJob(null);
    setIsPolling(false);
  }, []);

  return {
    activeJob,
    isPolling,
    startPolling,
    clearActiveJob
  };
}
