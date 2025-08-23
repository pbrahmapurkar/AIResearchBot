import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get('id');
  const type = searchParams.get('type');

  if (!reportId || !type) {
    return NextResponse.json(
      { error: 'Report ID and type are required' },
      { status: 400 }
    );
  }

  if (!['pdf', 'csv'].includes(type)) {
    return NextResponse.json(
      { error: 'Invalid export type' },
      { status: 400 }
    );
  }

  // In production, implement actual file generation/retrieval
  // For now, return a simple response
  if (type === 'pdf') {
    return new NextResponse('PDF content would be here', {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report_${reportId}.pdf"`
      }
    });
  }

  if (type === 'csv') {
    const csvContent = `Title,Domain,Language,Region,URL
"Sample Report","example.com","en","MH","https://example.com"
"Another Source","news.com","hi","TN","https://news.com"`;
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="report_${reportId}.csv"`
      }
    });
  }

  return NextResponse.json(
    { error: 'Export type not supported' },
    { status: 400 }
  );
}
