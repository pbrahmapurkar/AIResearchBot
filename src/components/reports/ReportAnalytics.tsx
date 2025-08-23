'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ReportAnalyticsProps {
  reportId: string;
}

interface AnalyticsData {
  sentimentTrends: Array<{
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }>;
  regionalInsights: Array<{
    region: string;
    volume: number;
    sentiment: number;
    growth: number;
  }>;
  topTerms: Array<{
    term: string;
    frequency: number;
    sentiment: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  sourceBreakdown: Array<{
    source: string;
    count: number;
    percentage: number;
    credibility: number;
  }>;
  performanceMetrics: {
    totalMentions: number;
    avgSentiment: number;
    topPerformingRegion: string;
    fastestGrowingTerm: string;
    sourceDiversity: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function ReportAnalytics({ reportId }: ReportAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Mock data for now - replace with actual API call
        const mockData: AnalyticsData = {
          sentimentTrends: [
            { date: '2024-01', positive: 65, negative: 20, neutral: 15 },
            { date: '2024-02', positive: 70, negative: 18, neutral: 12 },
            { date: '2024-03', positive: 68, negative: 22, neutral: 10 },
            { date: '2024-04', positive: 72, negative: 19, neutral: 9 },
          ],
          regionalInsights: [
            { region: 'North America', volume: 1200, sentiment: 0.75, growth: 12 },
            { region: 'Europe', volume: 980, sentiment: 0.68, growth: 8 },
            { region: 'Asia Pacific', volume: 850, sentiment: 0.82, growth: 18 },
            { region: 'Latin America', volume: 420, sentiment: 0.71, growth: 15 },
          ],
          topTerms: [
            { term: 'AI Innovation', frequency: 156, sentiment: 0.85, trend: 'up' },
            { term: 'Digital Transformation', frequency: 134, sentiment: 0.72, trend: 'up' },
            { term: 'Sustainability', frequency: 98, sentiment: 0.68, trend: 'stable' },
            { term: 'Remote Work', frequency: 87, sentiment: 0.61, trend: 'down' },
          ],
          sourceBreakdown: [
            { source: 'Social Media', count: 450, percentage: 35, credibility: 0.6 },
            { source: 'News Articles', count: 320, percentage: 25, credibility: 0.85 },
            { source: 'Blog Posts', count: 280, percentage: 22, credibility: 0.7 },
            { source: 'Research Papers', count: 180, percentage: 14, credibility: 0.9 },
            { source: 'Forums', count: 80, percentage: 4, credibility: 0.4 },
          ],
          performanceMetrics: {
            totalMentions: 1310,
            avgSentiment: 0.73,
            topPerformingRegion: 'Asia Pacific',
            fastestGrowingTerm: 'AI Innovation',
            sourceDiversity: 0.78,
          },
        };
        
        setAnalyticsData(mockData);
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchAnalytics();
    }
  }, [reportId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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

  if (error || !analyticsData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-600 text-center">{error || 'No analytics data available'}</p>
        </CardContent>
      </Card>
    );
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Mentions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.performanceMetrics.totalMentions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analyticsData.performanceMetrics.avgSentiment * 100).toFixed(1)}%</div>
            <Progress value={analyticsData.performanceMetrics.avgSentiment * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.performanceMetrics.topPerformingRegion}</div>
            <p className="text-xs text-muted-foreground">Highest sentiment score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Source Diversity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analyticsData.performanceMetrics.sourceDiversity * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Variety of sources</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="sentiment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sentiment">Sentiment Trends</TabsTrigger>
          <TabsTrigger value="regional">Regional Insights</TabsTrigger>
          <TabsTrigger value="terms">Top Terms</TabsTrigger>
          <TabsTrigger value="sources">Source Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Trends Over Time</CardTitle>
              <CardDescription>Monthly sentiment distribution analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.sentimentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="neutral" stroke="#6B7280" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>Volume and sentiment by region</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.regionalInsights}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="volume" fill="#3B82F6" />
                  <Bar yAxisId="right" dataKey="sentiment" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Trending Terms</CardTitle>
              <CardDescription>Most mentioned terms with sentiment scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.topTerms.map((term, index) => (
                  <div key={term.term} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{term.term}</p>
                        <p className="text-sm text-muted-foreground">
                          {term.frequency} mentions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg ${getTrendColor(term.trend)}`}>
                        {getTrendIcon(term.trend)}
                      </span>
                      <Badge variant="outline">
                        {(term.sentiment * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Source Distribution</CardTitle>
              <CardDescription>Breakdown by source type and credibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analyticsData.sourceBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, percentage }) => `${source} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.sourceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  {analyticsData.sourceBreakdown.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{source.count}</p>
                        <p className="text-xs text-muted-foreground">
                          {(source.credibility * 100).toFixed(0)}% credible
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
