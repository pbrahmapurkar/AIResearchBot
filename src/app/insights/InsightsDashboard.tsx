'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import FiltersBar from '@/components/insights/FiltersBar'
import RegionalHeatmap from '@/components/insights/RegionalHeatmap'
import SentimentTracker from '@/components/insights/SentimentTracker'
import PriceSensitivityMeter from '@/components/insights/PriceSensitivityMeter'
import ExecPulseCard from '@/components/insights/ExecPulseCard'
import ExportBar from '@/components/insights/ExportBar'
import { useInsightsStore } from '@/lib/store/insights'
import { analyzeSentiment, extractTopTerms } from '@/lib/nlp/sentiment'
import { detectPriceSignals } from '@/lib/nlp/price'
import type { RawDoc, ProcessedDoc, RegionInsight, TimeseriesPoint } from '@/lib/store/insights'

// Import mock data
import sharechtData from '@/data/samples.sharechat.json'

export default function InsightsDashboard() {
  const { 
    setRawDocs, 
    setProcessedDocs, 
    setRegionInsights, 
    setTimeseries,
    rawDocs,
    isLoading,
    setLoading
  } = useInsightsStore()

  // Initialize dashboard with mock data
  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true)
      
      try {
        // Load raw documents
        const docs: RawDoc[] = sharechtData as RawDoc[]
        setRawDocs(docs)
        
        // Process documents with NLP
        const processedDocs: ProcessedDoc[] = docs.map(doc => {
          const sentiment = analyzeSentiment(doc.text, doc.lang)
          const priceSignal = detectPriceSignals(doc.text)
          
          return {
            ...doc,
            sentiment,
            priceSignal: priceSignal.hasPriceKeyword,
            priceScore: priceSignal.priceScore,
            keyPhrases: priceSignal.keyPhrases
          }
        })
        
        setProcessedDocs(processedDocs)
        
        // Generate region insights
        const regionMap = new Map<string, ProcessedDoc[]>()
        processedDocs.forEach(doc => {
          if (!regionMap.has(doc.regionId)) {
            regionMap.set(doc.regionId, [])
          }
          regionMap.get(doc.regionId)!.push(doc)
        })
        
        const regionInsights: RegionInsight[] = Array.from(regionMap.entries()).map(([regionId, docs]) => {
          const avgSentiment = docs.reduce((sum, doc) => sum + doc.sentiment, 0) / docs.length
          const priceScore = docs.filter(doc => doc.priceSignal).length / docs.length
          const topTerms = extractTopTerms(docs.map(doc => doc.text), docs[0].lang, 5)
          
          return {
            regionId,
            volume: docs.length,
            avgSentiment,
            priceScore,
            topTerms
          }
        })
        
        setRegionInsights(regionInsights)
        
        // Generate timeseries data (mock daily data for last 7 days)
        const timeseriesData: TimeseriesPoint[] = []
        const languages = ['hi', 'ta', 'te', 'mr'] as const
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          
          languages.forEach(lang => {
            const langDocs = processedDocs.filter(doc => doc.lang === lang)
            if (langDocs.length > 0) {
              // Simulate daily variation
              const baseVolume = langDocs.length / 7
              const variation = Math.random() * 0.4 + 0.8 // 80-120% of base
              const volume = Math.round(baseVolume * variation)
              
              const avgSentiment = langDocs.reduce((sum, doc) => sum + doc.sentiment, 0) / langDocs.length
              const sentimentVariation = (Math.random() - 0.5) * 0.3 // ±15% variation
              
              timeseriesData.push({
                date: date.toISOString().split('T')[0],
                volume,
                avgSentiment: Math.max(-1, Math.min(1, avgSentiment + sentimentVariation)),
                lang
              })
            }
          })
        }
        
        setTimeseries(timeseriesData)
        
      } catch (error) {
        console.error('Failed to initialize dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    if (rawDocs.length === 0) {
      initializeDashboard()
    }
  }, [rawDocs.length, setRawDocs, setProcessedDocs, setRegionInsights, setTimeseries, setLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading regional insights...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            Regional Insights Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Real-time vernacular consumer insights from Tier-2/3 markets
          </p>
        </motion.div>

        {/* Filters */}
        <FiltersBar />

        {/* Row 1: Regional Heatmap (Hero) */}
        <RegionalHeatmap className="w-full" />

        {/* Row 2: Sentiment Tracker */}
        <SentimentTracker className="w-full" />

        {/* Row 3: Price Sensitivity + Executive Pulse */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PriceSensitivityMeter />
          <ExecPulseCard />
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center py-8 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🇮🇳 Mister PB - Decoding Bharat&apos;s Consumer Voice in Real-Time
          </p>
        </motion.div>

        {/* Export Bar */}
        <ExportBar />
      </div>
    </div>
  )
}
