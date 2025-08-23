import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Recommendation } from "@/types/report";
import { REPORT_COPY } from "@/copy/report";

interface ReportRecsProps {
  recommendations: (string | Recommendation)[];
}

export function ReportRecs({ recommendations }: ReportRecsProps) {
  const getImpactColor = (impact?: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Med': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">{REPORT_COPY.sections.recommendations}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => {
          const isStringRec = typeof rec === 'string';
          const text = isStringRec ? rec : rec.text;
          const impact = isStringRec ? undefined : rec.impact;

          return (
            <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-gray-700 leading-relaxed">{text}</p>
                  {impact && (
                    <Badge className={getImpactColor(impact)}>
                      {impact} Impact
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 flex-shrink-0"
                disabled
              >
                <Plus className="h-4 w-4" />
                {REPORT_COPY.actions.addToPlan}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
