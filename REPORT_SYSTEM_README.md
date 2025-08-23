# Report Generation System

This document describes the comprehensive report generation system implemented in the mission-agent project.

## Overview

The system provides a complete workflow for generating consumer insights reports with:
- Modal form for configuring report parameters
- Job queueing and status tracking
- Real-time progress updates via polling
- Mock AI pipeline simulation
- Error handling and retry functionality

## Architecture

### 1. Data Models (`src/types/reports.ts`)
- **Timeframe**: Last 7 days, last 30 days, or custom range
- **Languages**: Support for 9 Indian languages (Hindi, Tamil, Telugu, etc.)
- **Regions**: Support for 10 Indian states (Maharashtra, Tamil Nadu, etc.)
- **Job Status**: queued → running → compiling → done/error
- **Report Status**: DRAFT, READY, FAILED

### 2. API Routes
- **`/api/research/run`** (POST): Creates new report generation jobs
- **`/api/research/job`** (GET): Retrieves job status by ID

### 3. Mock Job System (`src/lib/jobs/mockReportJob.ts`)
- In-memory job storage (replace with database in production)
- Simulated AI pipeline processing:
  - Fetching phase (3 seconds): Collects data from vernacular platforms
  - Analysis phase: Processes sentiment and price sensitivity
  - Compiling phase (2 seconds): Generates final report
- Real-time progress updates every 1.2 seconds

### 4. React Components
- **`GenerateReportButton`**: Main entry point for report generation
- **`GenerateReportDialog`**: Configuration modal with language/region selection
- **`ReportJobCard`**: Real-time job status display with progress bar

### 5. Custom Hook (`src/hooks/useReportJob.ts`)
- Manages job polling and state
- Automatic navigation to report viewer when complete
- Error handling and cleanup

## Usage

### Basic Integration

```tsx
import { GenerateReportButton } from '@/components/reports/GenerateReportButton';

function ProjectDashboard() {
  return (
    <div>
      <GenerateReportButton
        projectId="project-123"
        defaultLanguages={['hi', 'mr', 'ta']}
        defaultRegions={['MH', 'TN', 'UP']}
      />
    </div>
  );
}
```

### Custom Configuration

The system supports:
- **Timeframes**: 7 days, 30 days, or custom ranges
- **Languages**: Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, Kannada, Malayalam, Punjabi
- **Regions**: Maharashtra, Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, Uttar Pradesh, Bihar, Gujarat, Rajasthan, West Bengal

### Job Lifecycle

1. **Queued**: Job is submitted and waiting to start
2. **Running**: Fetching data from vernacular platforms
3. **Compiling**: Analyzing data and generating insights
4. **Done**: Report ready for viewing/download
5. **Error**: Something went wrong (with retry option)

## Features

### ✅ Implemented
- [x] Type-safe TypeScript implementation
- [x] Responsive UI with shadcn/ui components
- [x] Real-time job status polling
- [x] Progress tracking with visual indicators
- [x] Error handling and retry functionality
- [x] Mock AI pipeline simulation
- [x] Toast notifications for user feedback
- [x] Automatic navigation to completed reports

### 🔄 Mock System (Replace with Real Implementation)
- [x] In-memory job storage
- [x] Simulated processing delays
- [x] Realistic progress updates
- [x] Status transitions

### 🚀 Production Ready Features
- [x] Proper error boundaries
- [x] Loading states
- [x] Form validation
- [x] Accessibility support
- [x] Mobile-responsive design

## File Structure

```
src/
├── types/
│   └── reports.ts                 # Type definitions
├── lib/
│   └── jobs/
│       └── mockReportJob.ts       # Mock job system
├── hooks/
│   └── useReportJob.ts            # Job management hook
├── components/
│   └── reports/
│       ├── GenerateReportButton.tsx    # Main button
│       ├── GenerateReportDialog.tsx    # Configuration modal
│       └── ReportJobCard.tsx           # Status display
├── app/
│   ├── api/
│   │   └── research/
│   │       ├── run/route.ts            # Job creation API
│   │       └── job/route.ts            # Job status API
│   ├── app/
│   │   ├── projects/[id]/page.tsx      # Project dashboard
│   │   └── reports/[id]/page.tsx       # Report viewer
```

## Configuration

### Environment Variables
No additional environment variables required for the mock system.

### Dependencies
- Next.js 14+ with App Router
- shadcn/ui components
- Lucide React icons
- TypeScript 5+

## Testing

### Manual Testing
1. Navigate to a project dashboard (`/app/projects/[id]`)
2. Click "Generate New Report"
3. Configure parameters and submit
4. Watch real-time progress updates
5. Navigate to completed report

### API Testing
```bash
# Create a new report job
curl -X POST /api/research/run \
  -H "Content-Type: application/json" \
  -d '{"projectId":"123","timeframe":{"type":"last_7d"},"langs":["hi"],"regions":["MH"]}'

# Check job status
curl /api/research/job?id=job_123
```

## Production Deployment

### Replace Mock System
1. **Database**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Job Queue**: Integrate with Redis/BullMQ for job management
3. **AI Pipeline**: Connect to actual AI services (OpenAI, Cohere, etc.)
4. **File Storage**: Implement S3/MinIO for report file storage
5. **Monitoring**: Add logging, metrics, and alerting

### Scaling Considerations
- **Job Workers**: Implement background job processors
- **Rate Limiting**: Add API rate limiting
- **Caching**: Cache frequently accessed reports
- **CDN**: Serve static report files via CDN

## Troubleshooting

### Common Issues
1. **Job not starting**: Check API route permissions and request format
2. **Progress not updating**: Verify polling interval and API responses
3. **Navigation not working**: Ensure report viewer route exists
4. **Toast not showing**: Check if Toaster component is in layout

### Debug Mode
Enable console logging in the mock job system for detailed debugging.

## Contributing

When extending the system:
1. Maintain type safety with TypeScript
2. Follow the existing component patterns
3. Add proper error handling
4. Include loading states
5. Test on mobile devices
6. Update this documentation

## License

This system is part of the mission-agent project.
