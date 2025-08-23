import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, ChevronDown } from "lucide-react";
import { Report } from "@/types/report";
import { REPORT_COPY } from "@/copy/report";

interface ReportHeaderProps {
  report: Report;
  onExportPdf: () => void;
  onDownloadCsv: () => void;
  onCopySummary: () => void;
}

export function ReportHeader({ report, onExportPdf, onDownloadCsv, onCopySummary }: ReportHeaderProps) {
  const statusColors = {
    READY: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    PROCESSING: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{report.title}</h1>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            {report.timeframe.replace('_', ' ').toUpperCase()}
          </Badge>
          <Badge className={statusColors[report.status]}>
            {report.status}
          </Badge>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={onExportPdf}
            disabled={!report.files.pdfPath}
          >
            {REPORT_COPY.actions.exportPdf}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDownloadCsv}
            disabled={!report.files.csvPath}
          >
            {REPORT_COPY.actions.downloadCsv}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCopySummary}>
            {REPORT_COPY.actions.copySummary}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
