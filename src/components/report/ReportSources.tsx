"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Search, Download } from "lucide-react";
import { Source } from "@/types/report";
import { REPORT_COPY } from "@/copy/report";

interface ReportSourcesProps {
  sources: Source[];
  onExportCsv: () => void;
}

export function ReportSources({ sources, onExportCsv }: ReportSourcesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  const domains = useMemo(() => 
    Array.from(new Set(sources.map(s => s.domain))).sort(),
    [sources]
  );

  const filteredSources = useMemo(() => {
    return sources.filter(source => {
      const matchesSearch = source.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           source.domain.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = selectedDomain === "all" || source.domain === selectedDomain;
      return matchesSearch && matchesDomain;
    });
  }, [sources, searchTerm, selectedDomain]);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-xl">{REPORT_COPY.sections.sources}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              {domains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500">
          {REPORT_COPY.messages.sourcesCount(filteredSources.length, sources.length)}
        </p>

        {/* Sources Table */}
        <div className="space-y-3">
          {filteredSources.map((source, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1 space-y-2">
                  <h5 className="font-medium text-gray-900 leading-tight">
                    {source.title}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {source.domain}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {source.lang.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {source.regionId}
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
                    href={source.url}
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

        {filteredSources.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No sources found matching your criteria.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
