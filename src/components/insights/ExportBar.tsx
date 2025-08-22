'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Download, FileText, Copy, Check } from 'lucide-react'
import { useInsightsStore } from '@/lib/store/insights'
import { 
  generatePDFReport, 
  generateCSVReport, 
  generateBharatPulseSummary,
  downloadFile,
  copyToClipboard,
  type ExportData 
} from '@/lib/exports/reportGenerator'
import regionsData from '@/data/regions.json'

interface ExportBarProps {
  className?: string
}

export default function ExportBar({ className = '' }: ExportBarProps) {
  const { regionInsights, getFilteredDocs, filters } = useInsightsStore()
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)

  // Prepare export data
  const prepareExportData = (): ExportData => {
    const docs = getFilteredDocs()
    // const timestamp = new Date().toISOString() // Unused for now

    return {
      title: 'Mister PB Regional Intelligence Report',
      summary: `Comprehensive analysis of ${docs.length} consumer discussions across ${filters.languages.join(', ')} languages in Tier-2/3 Indian markets. Key insights include sentiment patterns, price sensitivity analysis, and regional opportunities for the ${filters.timeframe} timeframe.`,
      insights: regionInsights.map(insight => {
        const region = regionsData.find(r => r.id === insight.regionId)
        return {
          region: region?.name || insight.regionId,
          sentiment: insight.avgSentiment,
          volume: insight.volume,
          priceScore: insight.priceScore,
          topTerms: insight.topTerms.map(t => t.term)
        }
      }),
      sources: docs.slice(0, 50).map(doc => ({
        url: doc.url || '#',
        title: `${doc.source} discussion`,
        snippet: doc.text.slice(0, 150),
        language: doc.lang,
        timestamp: new Date(doc.timestamp).toLocaleDateString()
      })),
      recommendations: [
        'Focus marketing efforts on high-sentiment regions with growing volume',
        'Adjust pricing strategy based on regional price sensitivity patterns',
        'Leverage vernacular content for better regional engagement',
        'Monitor upcoming festivals for seasonal opportunity windows'
      ],
      metadata: {
        generatedAt: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        timeframe: filters.timeframe,
        languages: filters.languages,
        totalSources: docs.length
      }
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const data = prepareExportData()
      const pdfBlob = generatePDFReport(data)
      downloadFile(pdfBlob, `mister-pb-report-${Date.now()}.pdf`)
      
      toast({
        title: "PDF Report Generated",
        description: "Your regional intelligence report has been downloaded.",
      })
    } catch (error) {
      console.error('PDF export failed:', error)
      toast({
        title: "Export Failed",
        description: "Unable to generate PDF report. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const data = prepareExportData()
      const csvBlob = generateCSVReport(data)
      downloadFile(csvBlob, `mister-pb-data-${Date.now()}.csv`)
      
      toast({
        title: "CSV Data Exported",
        description: "Your insights data has been downloaded.",
      })
    } catch (error) {
      console.error('CSV export failed:', error)
      toast({
        title: "Export Failed", 
        description: "Unable to generate CSV file. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopySummary = async () => {
    try {
      const data = prepareExportData()
      const summary = generateBharatPulseSummary(data)
      const success = await copyToClipboard(summary)
      
      if (success) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast({
          title: "Summary Copied",
          description: "Bharat Pulse summary copied to clipboard.",
        })
      } else {
        throw new Error('Clipboard API failed')
      }
    } catch (error) {
      console.error('Copy failed:', error)
      toast({
        title: "Copy Failed",
        description: "Unable to copy summary. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
    >
      <Card className="shadow-2xl border-2 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Download className="w-4 h-4" />
              <span>Export Insights:</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                PDF Report
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={isExporting}
                className="flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                CSV Data
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySummary}
                disabled={isExporting}
                className="flex items-center gap-1"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied ? 'Copied!' : 'Copy Summary'}
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 ml-2">
              {regionInsights.length} regions • {getFilteredDocs().length} sources
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
