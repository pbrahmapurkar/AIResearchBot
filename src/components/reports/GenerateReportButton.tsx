'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GenerateReportDialog } from './GenerateReportDialog';
import { useReportJob } from '@/hooks/useReportJob';
import { ReportJobCard } from './ReportJobCard';
import { Timeframe, TimeframeFlexible, LanguageCode, RegionCode } from '@/types/reports';
import { toast } from 'sonner';

interface GenerateReportButtonProps {
  projectId: string;
  defaultLanguages: LanguageCode[];
  defaultRegions: RegionCode[];
}

export function GenerateReportButton({
  projectId,
  defaultLanguages,
  defaultRegions
}: GenerateReportButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { activeJob, isPolling, startPolling, clearActiveJob } = useReportJob();


  const handleGenerate = async (data: {
    timeframe: TimeframeFlexible;
    langs: LanguageCode[];
    regions: RegionCode[];
    advancedOptions: { exportFormats: string[] };
  }) => {
    try {
      const response = await fetch('/api/research/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          ...data
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start report generation');
      }

      const job = await response.json();
      startPolling(job.jobId);
      
      toast('Your report is being generated. This may take a few minutes.');
    } catch (error) {
      console.error('Error generating report:', error);
      toast('Failed to start report generation. Please try again.');
    }
  };

  const handleRetry = () => {
    clearActiveJob();
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        Generate New Report
      </Button>

      <GenerateReportDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        projectId={projectId}
        defaultLanguages={defaultLanguages}
        defaultRegions={defaultRegions}
        onGenerate={handleGenerate}
      />

      {activeJob && (
        <div className="mt-6">
          <ReportJobCard
            job={activeJob}
            onRetry={handleRetry}
            onCancel={() => clearActiveJob()}
          />
        </div>
      )}
    </>
  );
}
