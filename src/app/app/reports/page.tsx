'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Download, 
  Search, 
  // Filter, // Unused for now
  Plus,
  Calendar,
  Globe,
  Languages
} from 'lucide-react';
import { GenerateReportDialog } from '@/components/reports/GenerateReportDialog';
import { ReportAnalytics } from '@/components/reports/ReportAnalytics';
import { ReportComparison } from '@/components/reports/ReportComparison';
import { Timeframe, LanguageCode, RegionCode } from '@/types/reports';

interface ReportSummary {
  id: string;
  title: string;
  status: 'completed' | 'processing' | 'failed' | 'queued';
  createdAt: string;
  completedAt?: string;
  timeframe: Timeframe;
  languages: LanguageCode[];
  regions: RegionCode[];
  totalMentions: number;
  avgSentiment: number;
  topRegion: string;
  topTerm: string;
  sourceCount: number;
  exportFormats: string[];
}

export default function ReportsDashboard() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeframeFilter, setTimeframeFilter] = useState<string>('all');
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockReports: ReportSummary[] = [
          {
            id: 'report-1',
            title: 'Q1 2024 Market Analysis - AI & Tech',
            status: 'completed',
            createdAt: '2024-03-31T10:00:00Z',
            completedAt: '2024-03-31T10:45:00Z',
            timeframe: { type: 'last_90d' },
            languages: ['hi', 'en'],
            regions: ['MH', 'KA', 'TN'],
            totalMentions: 1250,
            avgSentiment: 0.72,
            topRegion: 'Maharashtra',
            topTerm: 'AI Innovation',
            sourceCount: 45,
            exportFormats: ['pdf', 'excel']
          },
          {
            id: 'report-2',
            title: 'Q4 2023 Consumer Sentiment Analysis',
            status: 'completed',
            createdAt: '2023-12-31T14:00:00Z',
            completedAt: '2023-12-31T14:30:00Z',
            timeframe: { type: 'last_90d' },
            languages: ['hi', 'mr', 'gu'],
            regions: ['MH', 'GJ', 'RJ'],
            totalMentions: 1180,
            avgSentiment: 0.68,
            topRegion: 'Gujarat',
            topTerm: 'Digital Transformation',
            sourceCount: 42,
            exportFormats: ['pdf', 'csv']
          },
          {
            id: 'report-3',
            title: 'Q3 2023 Regional Market Trends',
            status: 'completed',
            createdAt: '2023-09-30T09:00:00Z',
            completedAt: '2023-09-30T09:25:00Z',
            timeframe: { type: 'last_90d' },
            languages: ['ta', 'te', 'ml'],
            regions: ['TN', 'AP', 'TL', 'KA'],
            totalMentions: 1120,
            avgSentiment: 0.65,
            topRegion: 'Tamil Nadu',
            topTerm: 'Sustainability',
            sourceCount: 38,
            exportFormats: ['pdf', 'powerpoint']
          },
          {
            id: 'report-4',
            title: 'Q2 2023 Startup Ecosystem Analysis',
            status: 'processing',
            createdAt: '2024-01-15T11:00:00Z',
            timeframe: { type: 'last_90d' },
            languages: ['hi', 'en', 'bn'],
            regions: ['WB', 'BH', 'UP'],
            totalMentions: 0,
            avgSentiment: 0,
            topRegion: '',
            topTerm: '',
            sourceCount: 0,
            exportFormats: ['pdf']
          },
          {
            id: 'report-5',
            title: 'Q1 2023 E-commerce Trends',
            status: 'queued',
            createdAt: '2024-01-20T15:00:00Z',
            timeframe: { type: 'last_90d' },
            languages: ['hi', 'en', 'ta'],
            regions: ['MH', 'KA', 'TN'],
            totalMentions: 0,
            avgSentiment: 0,
            topRegion: '',
            topTerm: '',
            sourceCount: 0,
            exportFormats: ['pdf', 'excel', 'csv']
          }
        ];
        
        setReports(mockReports);
        setFilteredReports(mockReports);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    let filtered = reports;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.topTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.topRegion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Apply timeframe filter
    if (timeframeFilter !== 'all') {
      filtered = filtered.filter(report => report.timeframe.type === timeframeFilter);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, statusFilter, timeframeFilter]);

  const handleGenerateReport = async (data: {
    timeframe: Timeframe;
    langs: LanguageCode[];
    regions: RegionCode[];
    advancedOptions: any;
  }) => {
    try {
      // Mock report generation - replace with actual API call
      const newReport: ReportSummary = {
        id: `report-${Date.now()}`,
        title: `New Report - ${new Date().toLocaleDateString()}`,
        status: 'queued',
        createdAt: new Date().toISOString(),
        timeframe: data.timeframe,
        languages: data.langs,
        regions: data.regions,
        totalMentions: 0,
        avgSentiment: 0,
        topRegion: '',
        topTerm: '',
        sourceCount: 0,
        exportFormats: data.advancedOptions.exportFormats
      };

      setReports(prev => [newReport, ...prev]);
      setShowGenerateDialog(false);
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'queued': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'processing': return '⏳';
      case 'failed': return '❌';
      case 'queued': return '⏰';
      default: return '❓';
    }
  };

  const getTimeframeLabel = (timeframe: Timeframe) => {
    switch (timeframe.type) {
      case 'last_7d': return 'Last 7 days';
      case 'last_30d': return 'Last 30 days';
      case 'last_90d': return 'Last 90 days';
      case 'last_6m': return 'Last 6 months';
      case 'last_1y': return 'Last 1 year';
      default: return 'Custom';
    }
  };

  const getLanguageLabels = (languages: LanguageCode[]) => {
    const languageMap: Record<LanguageCode, string> = {
      hi: 'Hindi', ta: 'Tamil', te: 'Telugu', mr: 'Marathi',
      bn: 'Bengali', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi'
    };
    return languages.map(lang => languageMap[lang]).join(', ');
  };

  // const getRegionLabels = (regions: RegionCode[]) => {
  //   const regionMap: Record<RegionCode, string> = {
  //     MH: 'Maharashtra', TN: 'Tamil Nadu', KA: 'Karnataka', AP: 'Andhra Pradesh',
  //     TL: 'Telangana', UP: 'Uttar Pradesh', BH: 'Bihar', GJ: 'Gujarat',
  //     RJ: 'Rajasthan', WB: 'West Bengal'
  //   };
  //   return regions.map(region => regionMap[region]).join(', ');
  // };

  const exportReport = (reportId: string, format: string) => {
    // Mock export - replace with actual API call
    console.log(`Exporting report ${reportId} in ${format} format`);
    // Trigger download or show export dialog
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports Dashboard</h1>
          <p className="text-muted-foreground">
            Generate, view, and analyze consumer insights reports
          </p>
        </div>
        <Button onClick={() => setShowGenerateDialog(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Generate Report</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for analysis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {reports.filter(r => r.status === 'processing' || r.status === 'queued').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Mentions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.reduce((sum, r) => sum + r.totalMentions, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all reports</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">All Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="comparison">Compare Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search reports by title, terms, or regions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="queued">Queued</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Timeframes</SelectItem>
                    <SelectItem value="last_7d">Last 7 days</SelectItem>
                    <SelectItem value="last_30d">Last 30 days</SelectItem>
                    <SelectItem value="last_90d">Last 90 days</SelectItem>
                    <SelectItem value="last_6m">Last 6 months</SelectItem>
                    <SelectItem value="last_1y">Last 1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Report Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{report.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                            {report.completedAt && (
                              <>
                                <span>•</span>
                                <span>Completed: {new Date(report.completedAt).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusIcon(report.status)} {report.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span>{getTimeframeLabel(report.timeframe)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Languages className="w-4 h-4 text-muted-foreground" />
                          <span>{getLanguageLabels(report.languages)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 text-muted-foreground" />
                          <span>{report.totalMentions.toLocaleString()} mentions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span>{(report.avgSentiment * 100).toFixed(1)}% sentiment</span>
                        </div>
                      </div>

                      {report.status === 'completed' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Top Region: </span>
                            <span className="font-medium">{report.topRegion}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Top Term: </span>
                            <span className="font-medium">{report.topTerm}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sources: </span>
                            <span className="font-medium">{report.sourceCount}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 min-w-fit">
                      {report.status === 'completed' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReport(report.id)}
                            className="w-full"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Report
                          </Button>
                          <div className="space-y-1">
                            {report.exportFormats.map((format) => (
                              <Button
                                key={format}
                                variant="ghost"
                                size="sm"
                                onClick={() => exportReport(report.id, format)}
                                className="w-full text-xs"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Export {format.toUpperCase()}
                              </Button>
                            ))}
                          </div>
                        </>
                      )}
                      {report.status === 'failed' && (
                        <Button variant="outline" size="sm" className="w-full">
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredReports.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No reports found matching your criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {selectedReport ? (
            <ReportAnalytics reportId={selectedReport} />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  Select a report from the &ldquo;All Reports&rdquo; tab to view analytics.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <ReportComparison projectId="current-project" />
        </TabsContent>
      </Tabs>

      {/* Generate Report Dialog */}
      <GenerateReportDialog
        open={showGenerateDialog}
        onOpenChange={setShowGenerateDialog}
        projectId="current-project"
        defaultLanguages={['hi', 'en']}
        defaultRegions={['MH', 'KA']}
        onGenerate={handleGenerateReport}
      />
    </div>
  );
}
