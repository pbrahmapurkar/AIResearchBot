'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { Progress } from '@/components/ui/progress' // Not used in this component
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'
import { useInsightsStore } from '@/lib/store/insights'
import { aggregatePriceSensitivity } from '@/lib/nlp/price'

interface PriceSensitivityMeterProps {
  className?: string
}

export default function PriceSensitivityMeter({ className = '' }: PriceSensitivityMeterProps) {
  const { getFilteredDocs } = useInsightsStore()
  
  const filteredDocs = getFilteredDocs()
  const priceSensitivity = aggregatePriceSensitivity(filteredDocs.map(doc => doc.text))
  
  // Get price-related documents with their context
  const priceDrivers = filteredDocs
    .filter(doc => doc.priceSignal)
    .sort((a, b) => b.priceScore - a.priceScore)
    .slice(0, 5)
    .map(doc => ({
      text: doc.text,
      score: Math.round(doc.priceScore * 100),
      source: doc.source,
      url: doc.url,
      lang: doc.lang,
      region: doc.regionId
    }))

  // Calculate trend (mock - in real app would compare with previous period)
  const getTrendDirection = (score: number) => {
    // Mock trend calculation
    const previousScore = score - (Math.random() * 20 - 10) // Simulate previous period
    return score > previousScore ? 'up' : 'down'
  }

  const trendDirection = getTrendDirection(priceSensitivity.overallScore)
  const trendIcon = trendDirection === 'up' ? TrendingUp : TrendingDown
  const trendColor = trendDirection === 'up' ? 'text-red-500' : 'text-green-500'

  // Get score level and color
  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: 'Very High', color: 'bg-red-500', textColor: 'text-red-600' }
    if (score >= 60) return { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-600' }
    if (score >= 40) return { level: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-600' }
    if (score >= 20) return { level: 'Low', color: 'bg-blue-500', textColor: 'text-blue-600' }
    return { level: 'Very Low', color: 'bg-gray-500', textColor: 'text-gray-600' }
  }

  const scoreData = getScoreLevel(priceSensitivity.overallScore)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={className}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Price Sensitivity Meter</span>
            <div className="flex items-center gap-2">
              {React.createElement(trendIcon, { className: `w-4 h-4 ${trendColor}` })}
              <Badge variant={trendDirection === 'up' ? 'destructive' : 'default'} className="text-xs">
                {trendDirection === 'up' ? '↑' : '↓'} vs Last Week
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Score Display */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
              {/* Circular progress background */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - priceSensitivity.overallScore / 100)}`}
                  className={scoreData.textColor}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Score text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">{priceSensitivity.overallScore}</div>
                <div className="text-xs text-gray-500">out of 100</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Badge className={`${scoreData.color} text-white`}>
                {scoreData.level}
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {priceSensitivity.totalPriceSignals} of {filteredDocs.length} conversations mention price
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {priceSensitivity.totalPriceSignals}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Price Signals</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {priceSensitivity.topPhrases.length}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">Key Phrases</div>
            </div>
          </div>

          {/* Top Price Drivers */}
          <div>
            <h4 className="font-medium mb-3">Top Price Drivers</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {priceDrivers.length > 0 ? (
                priceDrivers.map((driver, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {driver.lang.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Score: {driver.score}%
                        </Badge>
                      </div>
                      {driver.url && (
                        <ExternalLink className="w-3 h-3 text-gray-400 hover:text-blue-500 cursor-pointer" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      {driver.text.slice(0, 150)}{driver.text.length > 150 ? '...' : ''}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Source: {driver.source}</span>
                      <span>Region: {driver.region.replace(/_/g, ' ')}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <div className="text-2xl mb-2">💰</div>
                  <p className="text-sm">No price-related discussions found</p>
                </div>
              )}
            </div>
          </div>

          {/* Insights Summary */}
          {priceSensitivity.topPhrases.length > 0 && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">
                Key Price Themes
              </h4>
              <div className="flex flex-wrap gap-1">
                {priceSensitivity.topPhrases.slice(0, 3).map((phrase, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {phrase.slice(0, 30)}{phrase.length > 30 ? '...' : ''}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
