import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ExternalLink } from "lucide-react";
import { PriceAnalysis } from "@/types/report";
import { REPORT_COPY } from "@/copy/report";

interface ReportPriceProps {
  price: PriceAnalysis;
}

export function ReportPrice({ price }: ReportPriceProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">{REPORT_COPY.sections.price}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Price Sensitivity Score</span>
            <span className="text-2xl font-bold text-blue-600">{price.score}/100</span>
          </div>
          <Progress value={price.score} className="h-3" />
        </div>

        {price.drivers.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Key Drivers</h4>
            <div className="space-y-3">
              {price.drivers.map((driver, index) => (
                <div key={index} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1">
                      <blockquote className="text-gray-700 italic">
                        &ldquo;{driver.quote}&rdquo;
                      </blockquote>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {driver.regionId}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {driver.lang}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="gap-2 flex-shrink-0"
                    >
                      <a
                        href={driver.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open source link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            {REPORT_COPY.messages.noPriceDrivers}
          </p>
        )}

        <p className="text-xs text-gray-500 italic">
          {REPORT_COPY.messages.priceNote}
        </p>
      </CardContent>
    </Card>
  );
}
