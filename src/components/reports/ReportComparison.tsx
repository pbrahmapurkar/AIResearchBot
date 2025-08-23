'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

interface ReportComparisonProps {
  projectId: string;
}

interface ReportSummary {
  id: string;
  title: string;
  createdAt: string;
  timeframe: string;
  totalMentions: number;
  avgSentiment: number;
  topRegion: string;
  topTerm: string;
  sourceCount: number;
}

interface ComparisonData {
  reports: ReportSummary[];
  metrics: {
    sentimentComparison: Array<{
      report: string;
      positive: number;
      negative: number;
      neutral: number;
    }>;
    regionalComparison: Array<{
      region: string;
      [key: string]: string | number;
    }>;
    termComparison: Array<{
      term: string;
      [key: string]: string | number;
    }>;
  };
}

export function ReportComparison({ projectId }: ReportComparisonProps) {
  const [availableReports, setAvailableReports] = useState<ReportSummary[]>([]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailableReports = async () => {
      try {
        // Mock data - replace with actual API call
        const mockReports: ReportSummary[] = [
          {
            id: 'report-1',
            title: 'Q1 2024 Market Analysis',
            createdAt: '2024-03-31',
            timeframe: 'Jan-Mar 2024',
            totalMentions: 1250,
            avgSentiment: 0.72,
            topRegion: 'North America',
            topTerm: 'AI Innovation',
            sourceCount: 45
          },
          {
            id: 'report-2',
            title: 'Q4 2023 Market Analysis',
            createdAt: '2023-12-31',
            timeframe: 'Oct-Dec 2023',
            totalMentions: 1180,
            avgSentiment: 0.68,
            topRegion: 'Europe',
            topTerm: 'Digital Transformation',
            sourceCount: 42
          },
          {
            id: 'report-3',
            title: 'Q3 2023 Market Analysis',
            createdAt: '2023-09-30',
            timeframe: 'Jul-Sep 2023',
            totalMentions: 1120,
            avgSentiment: 0.65,
            topRegion: 'Asia Pacific',
            topTerm: 'Sustainability',
            sourceCount: 38
          },
          {
            id: 'report-4',
            title: 'Q2 2023 Market Analysis',
            createdAt: '2023-06-30',
            timeframe: 'Apr-Jun 2023',
            totalMentions: 1080,
            avgSentiment: 0.63,
            topRegion: 'North America',
            topTerm: 'Remote Work',
            sourceCount: 35
          }
        ];
        
        setAvailableReports(mockReports);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };

    fetchAvailableReports();
  }, [projectId]);

  const handleReportSelection = (reportId: string) => {
    setSelectedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      } else if (prev.length < 3) {
        return [...prev, reportId];
      }
      return prev;
    });
  };

  const generateComparison = async () => {
    if (selectedReports.length < 2) return;

    setLoading(true);
    try {
      // Mock comparison data - replace with actual API call
      const selectedReportData = availableReports.filter(r => selectedReports.includes(r.id));
      
      const mockComparisonData: ComparisonData = {
        reports: selectedReportData,
        metrics: {
          sentimentComparison: selectedReportData.map(report => ({
            report: report.title,
            positive: Math.round(report.avgSentiment * 70),
            negative: Math.round((1 - report.avgSentiment) * 20),
            neutral: Math.round((1 - report.avgSentiment) * 10)
          })),
          regionalComparison: [
            { region: 'North America', ...selectedReportData.reduce((acc, report) => ({ ...acc, [report.title]: report.topRegion === 'North America' ? 1 : 0 }), {}) },
            { region: 'Europe', ...selectedReportData.reduce((acc, report) => ({ ...acc, [report.title]: report.topRegion === 'Europe' ? 1 : 0 }), {}) },
            { region: 'Asia Pacific', ...selectedReportData.reduce((acc, report) => ({ ...acc, [report.title]: report.topRegion === 'Asia Pacific' ? 1 : 0 }), {}) },
            { region: 'Latin America', ...selectedReportData.reduce((acc, report) => ({ ...acc, [report.title]: report.topRegion === 'Latin America' ? 1 : 0 }), {}) }
          ],
          termComparison: [
            { term: 'AI Innovation', ...selectedReportData.reduce((acc, report) => ({ ...acc, [report.title]: report.topTerm === 'AI Innovation' ? 1 : 0 }), {}) },
            { term: 'Digital Transformation', ...selectedReportData.reduce((acc, report) => ({ ...acc, [report.title]: report.topTerm === 'Digital Transformation' ? 1 : 0 }), {}) },
            { term: 'Sustainability', ...selectedReportData.reduce((acc, report) => ({ ...acc, [report.title]: report.topTerm === 'Sustainability' ? 1 : 0 }), {}) },
            { term: 'Remote Work', ...selectedReportData.reduce((acc, report) => ({ ...acc, [report.title]: report.topTerm === 'Remote Work' ? 1 : 0 }), {}) }
          ]
        }
      };

      setComparisonData(mockComparisonData);
    } catch (error) {
      console.error('Failed to generate comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.7) return 'text-green-600';
    if (sentiment >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Report Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Reports to Compare</CardTitle>
          <CardDescription>
            Choose up to 3 reports to compare side by side
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {availableReports.map((report) => (
              <Card 
                key={report.id}
                className={`cursor-pointer transition-all ${
                  selectedReports.includes(report.id)
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleReportSelection(report.id)}
              >
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {report.timeframe}
                      </Badge>
                      {selectedReports.includes(report.id) && (
                        <Badge variant="default" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-sm line-clamp-2">{report.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    <div className="text-xs space-y-1">
                      <p>📊 {report.totalMentions} mentions</p>
                      <p>🌍 {report.topRegion}</p>
                      <p>🏷️ {report.topTerm}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedReports.length} of 3 reports selected
            </p>
            <Button 
              onClick={generateComparison}
              disabled={selectedReports.length < 2 || loading}
              className="ml-auto"
            >
              {loading ? 'Generating...' : 'Generate Comparison'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparisonData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisonData.reports.map((report) => (
              <Card key={report.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{report.title}</CardTitle>
                  <CardDescription>{report.timeframe}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Mentions</span>
                    <span className="font-medium">{report.totalMentions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Sentiment</span>
                    <span className={`font-medium ${getSentimentColor(report.avgSentiment)}`}>
                      {(report.avgSentiment * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Top Region</span>
                    <span className="font-medium">{report.topRegion}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Top Term</span>
                    <span className="font-medium">{report.topTerm}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Comparison Charts */}
          <Tabs defaultValue="sentiment" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
              <TabsTrigger value="regional">Regional Distribution</TabsTrigger>
              <TabsTrigger value="terms">Top Terms</TabsTrigger>
            </TabsList>

            <TabsContent value="sentiment">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Comparison</CardTitle>
                  <CardDescription>Sentiment distribution across selected reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData.metrics.sentimentComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="report" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="positive" fill="#10B981" stackId="a" />
                      <Bar dataKey="neutral" fill="#6B7280" stackId="a" />
                      <Bar dataKey="negative" fill="#EF4444" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regional">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Performance</CardTitle>
                  <CardDescription>Top performing regions by report</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData.metrics.regionalComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {comparisonData.reports.map((report, index) => (
                        <Bar 
                          key={report.id} 
                          dataKey={report.title} 
                          fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} 
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms">
              <Card>
                <CardHeader>
                  <CardTitle>Top Terms Analysis</CardTitle>
                  <CardDescription>Most mentioned terms across reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData.metrics.termComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="term" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {comparisonData.reports.map((report, index) => (
                        <Bar 
                          key={report.id} 
                          dataKey={report.title} 
                          fill={['#8B5CF6', '#06B6D4', '#84CC16', '#F97316'][index % 4]} 
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
