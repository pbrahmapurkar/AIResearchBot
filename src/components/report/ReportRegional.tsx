"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Region, SentimentDataPoint } from "@/types/report";
import { REPORT_COPY } from "@/copy/report";

interface ReportRegionalProps {
  regions: Region[];
  sentimentSeries: SentimentDataPoint[];
}

export function ReportRegional({ regions, sentimentSeries }: ReportRegionalProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  if (regions.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="py-12 text-center text-gray-500">
          {REPORT_COPY.messages.noRegionalData}
        </CardContent>
      </Card>
    );
  }

  const filteredData = selectedRegion === "all" 
    ? sentimentSeries 
    : sentimentSeries.filter(d => d.regionId === selectedRegion);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.1) return "#10B981"; // Positive
    if (sentiment < -0.1) return "#EF4444"; // Negative
    return "#9CA3AF"; // Neutral
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">{REPORT_COPY.sections.regional}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="map" className="space-y-6">
          <TabsList>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="space-y-4">
            {/* Fallback region chips when map not available */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {regions.map((region) => (
                <div
                  key={region.id}
                  className="p-4 rounded-lg border bg-card"
                  style={{
                    borderColor: getSentimentColor(region.avgSentiment),
                    borderWidth: '2px'
                  }}
                >
                  <div className="font-medium">{region.name}</div>
                  <div className="text-sm text-gray-500">
                    Vol {region.volume} • Sent {region.avgSentiment > 0 ? '+' : ''}{region.avgSentiment.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">{REPORT_COPY.messages.scoresNote}</p>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis domain={[-1, 1]} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value: number) => [value.toFixed(3), 'Sentiment']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgSentiment" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
