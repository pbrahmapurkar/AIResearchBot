'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

import { ReportHeader } from "@/components/report/ReportHeader";
import { ReportTldr } from "@/components/report/ReportTldr";
import { ReportRegional } from "@/components/report/ReportRegional";
import { ReportPrice } from "@/components/report/ReportPrice";
import { ReportTermsPosts } from "@/components/report/ReportTermsPosts";
import { ReportSources } from "@/components/report/ReportSources";
import { ReportRecs } from "@/components/report/ReportRecs";
import { StickyToc } from "@/components/report/StickyToc";

import { Report } from "@/types/report";
import { REPORT_COPY } from "@/copy/report";

interface ReportPageState {
  report: Report | null;
  loading: boolean;
  // error: string | null; // Unused for now
}

export default function ReportPage() {
  const params = useParams();
  const reportId = params?.reportId as string;
  
  const [state, setState] = useState<ReportPageState>({
    report: null,
    loading: true,
    // error: null // Unused for now
  });

  const sections = [
    { id: 'tldr', title: REPORT_COPY.sections.tldr },
    { id: 'regional', title: REPORT_COPY.sections.regional },
    { id: 'price', title: REPORT_COPY.sections.price },
    { id: 'terms', title: REPORT_COPY.sections.terms },
    { id: 'sources', title: REPORT_COPY.sections.sources },
    { id: 'recommendations', title: REPORT_COPY.sections.recommendations }
  ];

  const fetchReport = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, /* error: null */ }));
      
      const response = await fetch(`/api/research/report?id=${reportId}`);
      
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Report not found' : 'Failed to load report');
      }
      
      const report = await response.json();
      setState({ report, loading: false, /* error: null */ });
    } catch (error) {
      setState({
        report: null,
        loading: false,
        // error: error instanceof Error ? error.message : 'An error occurred' // Unused for now
      });
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId, fetchReport]);

  // Export handlers
  const handleExportPdf = async () => {
    if (!state.report?.files.pdfPath) return;
    
    try {
      const response = await fetch(`/api/research/report/export?id=${reportId}&type=pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${state.report.title.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success(REPORT_COPY.toasts.pdfExported);
      }
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const handleDownloadCsv = async () => {
    if (!state.report?.files.csvPath) return;
    
    try {
      const response = await fetch(`/api/research/report/export?id=${reportId}&type=csv`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${state.report.title.replace(/\s+/g, '_')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success(REPORT_COPY.toasts.csvDownloaded);
      }
    } catch (error) {
      toast.error('Failed to download CSV');
    }
  };

  const handleCopySummary = () => {
    if (!state.report) return;
    
    const summary = [
      `## ${state.report.title}`,
      '',
      '### Key Insights:',
      ...state.report.summary.map(point => `• ${point}`),
      '',
      '### Top Recommendations:',
      ...state.report.recommendations.slice(0, 3).map(rec => 
        `• ${typeof rec === 'string' ? rec : rec.text}`
      ),
      '',
      `View full report: ${window.location.href}`
    ].join('\n');
    
    navigator.clipboard.writeText(summary);
    toast.success(REPORT_COPY.toasts.summarycopied);
  };

  const handleCopyTldr = () => {
    if (!state.report) return;
    
    const tldr = state.report.summary.join('\n• ');
    navigator.clipboard.writeText(`• ${tldr}`);
    toast.success(REPORT_COPY.toasts.copied);
  };

  const handleCopyTerms = () => {
    if (!state.report) return;
    
    const terms = state.report.topTerms
      .map(term => `${term.term} (${term.frequency})`)
      .join(', ');
    navigator.clipboard.writeText(terms);
    toast.success(REPORT_COPY.toasts.copied);
  };

  // Loading state
  if (state.loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-96" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Content skeletons */}
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-2xl">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="rounded-2xl">
          <CardContent className="py-16 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to load report
            </h2>
            <p className="text-gray-600 mb-6">{state.error}</p>
            <Button onClick={fetchReport} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              {REPORT_COPY.actions.retry}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No report found
  if (!state.report) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="rounded-2xl">
          <CardContent className="py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Report not found
            </h2>
            <p className="text-gray-600">
              The requested report could not be found or may have been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 space-y-8">
          <ReportHeader
            report={state.report}
            onExportPdf={handleExportPdf}
            onDownloadCsv={handleDownloadCsv}
            onCopySummary={handleCopySummary}
          />

          <section id="tldr">
            <ReportTldr
              summary={state.report.summary}
              onCopy={handleCopyTldr}
            />
          </section>

          <section id="regional">
            <ReportRegional
              regions={state.report.regions}
              sentimentSeries={state.report.sentimentSeries}
            />
          </section>

          <section id="price">
            <ReportPrice price={state.report.price} />
          </section>

          <section id="terms">
            <ReportTermsPosts
              topTerms={state.report.topTerms}
              topPosts={state.report.topPosts}
              onCopyTerms={handleCopyTerms}
            />
          </section>

          <section id="sources">
            <ReportSources
              sources={state.report.sources}
              onExportCsv={handleDownloadCsv}
            />
          </section>

          <section id="recommendations">
            <ReportRecs recommendations={state.report.recommendations} />
          </section>
        </div>

        {/* Sticky TOC */}
        <StickyToc sections={sections} />
      </div>
    </div>
  );
}
