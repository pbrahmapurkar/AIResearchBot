import { NextRequest, NextResponse } from 'next/server';
import { GenerateReportRequest, JobResponse } from '@/types/reports';
import { createReportJob } from '@/lib/jobs/mockReportJob';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateReportRequest = await request.json();
    
    // Validate request
    if (!body.projectId || !body.langs.length || !body.regions.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create job and report
    const job = await createReportJob(body);
    
    const response: JobResponse = {
      jobId: job.id,
      status: 'queued',
      progress: 0,
      reportId: job.reportId,
      message: 'Job queued successfully'
    };

    return NextResponse.json(response, { status: 202 });
  } catch (error) {
    console.error('Error creating report job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
