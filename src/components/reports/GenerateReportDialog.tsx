'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Timeframe, TimeframeType, TimeframeFlexible, LanguageCode, RegionCode } from '@/types/reports';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GenerateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  defaultLanguages: LanguageCode[];
  defaultRegions: RegionCode[];
  onGenerate: (data: {
    timeframe: TimeframeFlexible;
    langs: LanguageCode[];
    regions: RegionCode[];
    advancedOptions: AdvancedOptions;
  }) => Promise<void>;
}

interface AdvancedOptions {
  dataSources: string[];
  analysisDepth: 'basic' | 'standard' | 'comprehensive';
  sentimentThreshold: number;
  includeCompetitorAnalysis: boolean;
  customFilters: string[];
  exportFormats: string[];
  priority: 'low' | 'medium' | 'high';
}

const LANGUAGE_OPTIONS: { id: LanguageCode; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'Hindi' },
  { id: 'ta', label: 'Tamil' },
  { id: 'te', label: 'Telugu' },
  { id: 'mr', label: 'Marathi' },
  { id: 'bn', label: 'Bengali' },
  { id: 'gu', label: 'Gujarati' },
  { id: 'kn', label: 'Kannada' },
  { id: 'ml', label: 'Malayalam' },
  { id: 'pa', label: 'Punjabi' }
];

const REGION_OPTIONS: { id: RegionCode; label: string }[] = [
  { id: 'MH', label: 'Maharashtra' },
  { id: 'TN', label: 'Tamil Nadu' },
  { id: 'KA', label: 'Karnataka' },
  { id: 'AP', label: 'Andhra Pradesh' },
  { id: 'TL', label: 'Telangana' },
  { id: 'UP', label: 'Uttar Pradesh' },
  { id: 'BH', label: 'Bihar' },
  { id: 'GJ', label: 'Gujarat' },
  { id: 'RJ', label: 'Rajasthan' },
  { id: 'WB', label: 'West Bengal' }
];

const DATA_SOURCE_OPTIONS = [
  { id: 'social_media', label: 'Social Media', description: 'Twitter, Facebook, Instagram, LinkedIn' },
  { id: 'news_articles', label: 'News Articles', description: 'Online news sources and publications' },
  { id: 'blog_posts', label: 'Blog Posts', description: 'Industry blogs and personal blogs' },
  { id: 'research_papers', label: 'Research Papers', description: 'Academic and industry research' },
  { id: 'forums', label: 'Forums & Communities', description: 'Reddit, Quora, Stack Overflow' },
  { id: 'reviews', label: 'Product Reviews', description: 'Customer reviews and ratings' },
  { id: 'government_data', label: 'Government Data', description: 'Official statistics and reports' }
];

const EXPORT_FORMAT_OPTIONS = [
  { id: 'pdf', label: 'PDF Report', description: 'Professional PDF with charts and insights' },
  { id: 'csv', label: 'CSV Data', description: 'Raw data for further analysis' },
  { id: 'excel', label: 'Excel Spreadsheet', description: 'Interactive Excel with pivot tables' },
  { id: 'json', label: 'JSON API', description: 'Machine-readable data format' },
  { id: 'powerpoint', label: 'PowerPoint', description: 'Presentation-ready slides' }
];

export function GenerateReportDialog({
  open,
  onOpenChange,
  projectId,
  defaultLanguages,
  defaultRegions,
  onGenerate
}: GenerateReportDialogProps) {
  const [timeframe, setTimeframe] = useState<TimeframeFlexible>({ type: 'last_7d' });
  const [selectedLangs, setSelectedLangs] = useState<LanguageCode[]>(defaultLanguages);
  const [selectedRegions, setSelectedRegions] = useState<RegionCode[]>(defaultRegions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Advanced options state
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    dataSources: ['social_media', 'news_articles'],
    analysisDepth: 'standard',
    sentimentThreshold: 0.5,
    includeCompetitorAnalysis: false,
    customFilters: [],
    exportFormats: ['pdf'],
    priority: 'medium'
  });

  const [customFilterInput, setCustomFilterInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLangs.length === 0 || selectedRegions.length === 0) return;

    setIsSubmitting(true);
    try {
      await onGenerate({
        timeframe,
        langs: selectedLangs,
        regions: selectedRegions,
        advancedOptions
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLanguage = (lang: LanguageCode) => {
    setSelectedLangs(prev =>
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  const toggleRegion = (region: RegionCode) => {
    setSelectedRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const toggleDataSource = (sourceId: string) => {
    setAdvancedOptions(prev => ({
      ...prev,
      dataSources: prev.dataSources.includes(sourceId)
        ? prev.dataSources.filter(s => s !== sourceId)
        : [...prev.dataSources, sourceId]
    }));
  };

  const toggleExportFormat = (formatId: string) => {
    setAdvancedOptions(prev => ({
      ...prev,
      exportFormats: prev.exportFormats.includes(formatId)
        ? prev.exportFormats.filter(f => f !== formatId)
        : [...prev.exportFormats, formatId]
    }));
  };

  const addCustomFilter = () => {
    if (customFilterInput.trim() && !advancedOptions.customFilters.includes(customFilterInput.trim())) {
      setAdvancedOptions(prev => ({
        ...prev,
        customFilters: [...prev.customFilters, customFilterInput.trim()]
      }));
      setCustomFilterInput('');
    }
  };

  const removeCustomFilter = (filter: string) => {
    setAdvancedOptions(prev => ({
      ...prev,
      customFilters: prev.customFilters.filter(f => f !== filter)
    }));
  };

  const getEstimatedTime = () => {
    const baseTime = advancedOptions.analysisDepth === 'basic' ? 15 : 
                    advancedOptions.analysisDepth === 'standard' ? 30 : 60;
    const sourceMultiplier = advancedOptions.dataSources.length * 0.3;
    const regionMultiplier = selectedRegions.length * 0.2;
    return Math.round(baseTime * (1 + sourceMultiplier + regionMultiplier));
  };

  const getEstimatedCost = () => {
    const baseCost = advancedOptions.analysisDepth === 'basic' ? 50 : 
                    advancedOptions.analysisDepth === 'standard' ? 100 : 200;
    const sourceMultiplier = advancedOptions.dataSources.length * 0.1;
    const regionMultiplier = selectedRegions.length * 0.05;
    return Math.round(baseCost * (1 + sourceMultiplier + regionMultiplier));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate New Report</DialogTitle>
          <DialogDescription>
            Configure your report parameters and advanced options
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
              <TabsTrigger value="preview">Preview & Cost</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* Timeframe Selection */}
              <div className="space-y-2">
                <Label>Timeframe</Label>
                <Select 
                  value={timeframe.type} 
                  onValueChange={(value) => setTimeframe({ type: value as TimeframeType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_7d">Last 7 days</SelectItem>
                    <SelectItem value="last_30d">Last 30 days</SelectItem>
                    <SelectItem value="last_90d">Last 90 days</SelectItem>
                    <SelectItem value="last_6m">Last 6 months</SelectItem>
                    <SelectItem value="last_1y">Last 1 year</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <Label>Languages</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <div key={lang.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={lang.id}
                        checked={selectedLangs.includes(lang.id)}
                        onCheckedChange={() => toggleLanguage(lang.id)}
                      />
                      <Label htmlFor={lang.id} className="text-sm">{lang.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regions */}
              <div className="space-y-2">
                <Label>Regions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {REGION_OPTIONS.map((region) => (
                    <div key={region.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={region.id}
                        checked={selectedRegions.includes(region.id)}
                        onCheckedChange={() => toggleRegion(region.id)}
                      />
                      <Label htmlFor={region.id} className="text-sm">{region.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              {/* Data Sources */}
              <div className="space-y-2">
                <Label>Data Sources</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {DATA_SOURCE_OPTIONS.map((source) => (
                    <div key={source.id} className="flex items-start space-x-2 p-3 border rounded-lg">
                      <Checkbox
                        id={source.id}
                        checked={advancedOptions.dataSources.includes(source.id)}
                        onCheckedChange={() => toggleDataSource(source.id)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor={source.id} className="text-sm font-medium">{source.label}</Label>
                        <p className="text-xs text-muted-foreground">{source.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Depth */}
              <div className="space-y-2">
                <Label>Analysis Depth</Label>
                <Select 
                  value={advancedOptions.analysisDepth} 
                  onValueChange={(value) => setAdvancedOptions(prev => ({ ...prev, analysisDepth: value as AdvancedOptions['analysisDepth'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic - Key insights and trends</SelectItem>
                    <SelectItem value="standard">Standard - Comprehensive analysis with charts</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive - Deep dive with recommendations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sentiment Threshold */}
              <div className="space-y-2">
                <Label>Sentiment Threshold: {(advancedOptions.sentimentThreshold * 100).toFixed(0)}%</Label>
                <Slider
                  value={[advancedOptions.sentimentThreshold]}
                  onValueChange={([value]) => setAdvancedOptions(prev => ({ ...prev, sentimentThreshold: value }))}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Only include content with sentiment above this threshold
                </p>
              </div>

              {/* Competitor Analysis */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="competitor-analysis"
                  checked={advancedOptions.includeCompetitorAnalysis}
                  onCheckedChange={(checked) => setAdvancedOptions(prev => ({ 
                    ...prev, 
                    includeCompetitorAnalysis: checked as boolean 
                  }))}
                />
                <Label htmlFor="competitor-analysis">Include competitor analysis</Label>
              </div>

              {/* Custom Filters */}
              <div className="space-y-2">
                <Label>Custom Filters</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter custom filter (e.g., 'AI companies', 'startups')"
                    value={customFilterInput}
                    onChange={(e) => setCustomFilterInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFilter())}
                  />
                  <Button type="button" onClick={addCustomFilter} variant="outline">
                    Add
                  </Button>
                </div>
                {advancedOptions.customFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {advancedOptions.customFilters.map((filter, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{filter}</span>
                        <button
                          type="button"
                          onClick={() => removeCustomFilter(filter)}
                          className="ml-1 text-xs hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Export Formats */}
              <div className="space-y-2">
                <Label>Export Formats</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {EXPORT_FORMAT_OPTIONS.map((format) => (
                    <div key={format.id} className="flex items-start space-x-2 p-3 border rounded-lg">
                      <Checkbox
                        id={format.id}
                        checked={advancedOptions.exportFormats.includes(format.id)}
                        onCheckedChange={() => toggleExportFormat(format.id)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor={format.id} className="text-sm font-medium">{format.label}</Label>
                        <p className="text-xs text-muted-foreground">{format.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label>Processing Priority</Label>
                <Select 
                  value={advancedOptions.priority} 
                  onValueChange={(value) => setAdvancedOptions(prev => ({ ...prev, priority: value as AdvancedOptions['priority'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Process when resources available</SelectItem>
                    <SelectItem value="medium">Medium - Standard processing</SelectItem>
                    <SelectItem value="high">High - Expedited processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Report Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Timeframe</p>
                      <p className="text-sm text-muted-foreground">{timeframe.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Languages</p>
                      <p className="text-sm text-muted-foreground">{selectedLangs.length} selected</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Regions</p>
                      <p className="text-sm text-muted-foreground">{selectedRegions.length} selected</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Data Sources</p>
                      <p className="text-sm text-muted-foreground">{advancedOptions.dataSources.length} sources</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost & Time Estimates */}
              <Card>
                <CardHeader>
                  <CardTitle>Estimates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Estimated Time</p>
                      <p className="text-2xl font-bold text-blue-600">{getEstimatedTime()} min</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Estimated Cost</p>
                      <p className="text-2xl font-bold text-green-600">${getEstimatedCost()}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    *Estimates are based on current configuration and may vary
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || selectedLangs.length === 0 || selectedRegions.length === 0}>
              {isSubmitting ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
