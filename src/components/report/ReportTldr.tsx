import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy } from "lucide-react";
import { REPORT_COPY } from "@/copy/report";

interface ReportTldrProps {
  summary: string[];
  onCopy: () => void;
}

export function ReportTldr({ summary, onCopy }: ReportTldrProps) {
  return (
    <Card className="rounded-2xl border border-white/10 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          {REPORT_COPY.sections.tldr}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className="gap-2"
          aria-label="Copy TL;DR summary"
        >
          <Copy className="h-4 w-4" />
          {REPORT_COPY.actions.copy}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {summary.map((point, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
            <p className="text-gray-700 leading-relaxed">{point}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
