'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { JobResponse } from '@/types/reports';
import { AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';

interface ReportJobCardProps {
  job: JobResponse;
  onRetry?: () => void;
  onCancel?: () => void;
}

const STATUS_CONFIG = {
  queued: { label: 'Queued', color: 'bg-blue-500', icon: Clock },
  running: { label: 'Running', color: 'bg-amber-500', icon: Loader2 },
  compiling: { label: 'Compiling', color: 'bg-purple-500', icon: Loader2 },
  done: { label: 'Done', color: 'bg-green-500', icon: CheckCircle },
  error: { label: 'Error', color: 'bg-red-500', icon: AlertCircle }
};

export function ReportJobCard({ job, onRetry, onCancel }: ReportJobCardProps) {
  const statusConfig = STATUS_CONFIG[job.status];
  const StatusIcon = statusConfig.icon;

  const getStepProgress = () => {
    switch (job.status) {
      case 'queued': return 0;
      case 'running': return 33;
      case 'compiling': return 66;
      case 'done': return 100;
      case 'error': return job.progress;
      default: return 0;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <StatusIcon className={`h-4 w-4 ${statusConfig.color.replace('bg-', 'text-')}`} />
          <CardTitle className="text-sm font-medium">Generating your report</CardTitle>
        </div>
        <Badge variant={job.status === 'error' ? 'destructive' : 'secondary'}>
          {statusConfig.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Progress value={job.progress} className="h-2" />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Queued</span>
            <span>Fetching sources</span>
            <span>Analyzing</span>
            <span>Compiling</span>
            <span>Ready</span>
          </div>

          {job.message && (
            <p className="text-sm text-muted-foreground">{job.message}</p>
          )}

          {job.status === 'error' && onRetry && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-destructive">Report generation failed</span>
              <Button variant="outline" size="sm" onClick={onRetry}>
                Retry
              </Button>
            </div>
          )}

          {(job.status === 'queued' || job.status === 'running') && onCancel && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            You can continue exploring your dashboard while we work.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
