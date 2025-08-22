'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Calendar, Lightbulb } from 'lucide-react'
import { useInsightsStore } from '@/lib/store/insights'
import regionsData from '@/data/regions.json'
import festivalsData from '@/data/festivals.json'

interface ExecPulseCardProps {
  className?: string
}

export default function ExecPulseCard({ className = '' }: ExecPulseCardProps) {
  const { regionInsights, getFilteredDocs } = useInsightsStore()
  
  // Calculate top 3 regions by opportunity score (sentiment * volume)
  const getTopRegions = () => {
    return regionInsights
      .map(insight => {
        const region = regionsData.find(r => r.id === insight.regionId)
        const opportunityScore = Math.abs(insight.avgSentiment) * Math.log(insight.volume + 1)
        const trend = insight.avgSentiment > 0 ? 'up' : 'down'
        
        return {
          ...insight,
          regionName: region?.name || insight.regionId,
          opportunityScore,
          trend,
          // Mock week-over-week delta
          deltaWoW: (Math.random() * 20 - 10).toFixed(1)
        }
      })
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 3)
  }

  // Get price watch summary
  const getPriceWatch = () => {
    const docs = getFilteredDocs()
    const priceSignals = docs.filter(doc => doc.priceSignal)
    const avgPriceScore = priceSignals.length > 0 
      ? priceSignals.reduce((sum, doc) => sum + doc.priceScore, 0) / priceSignals.length 
      : 0
    
    // Mock comparison with last week
    const lastWeekScore = avgPriceScore - (Math.random() * 0.2 - 0.1)
    const trend = avgPriceScore > lastWeekScore ? 'up' : 'down'
    const change = Math.abs((avgPriceScore - lastWeekScore) * 100).toFixed(1)
    
    return {
      currentScore: Math.round(avgPriceScore * 100),
      trend,
      change: `${change}%`
    }
  }

  // Get upcoming festivals in next 30 days
  const getUpcomingFestivals = () => {
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    return festivalsData
      .filter(festival => {
        const festivalDate = new Date(festival.date)
        return festivalDate >= now && festivalDate <= thirtyDaysFromNow
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 2)
  }

  // Generate actionable recommendations
  const getRecommendations = () => {
    const topRegions = getTopRegions()
    const priceWatch = getPriceWatch()
    const festivals = getUpcomingFestivals()
    
    const recommendations = []
    
    // Regional recommendations
    if (topRegions.length > 0) {
      const topRegion = topRegions[0]
      if (topRegion.avgSentiment > 0.3) {
        recommendations.push(`Launch premium campaigns in ${topRegion.regionName} - high positive sentiment detected`)
      } else if (topRegion.avgSentiment < -0.3) {
        recommendations.push(`Address concerns in ${topRegion.regionName} - negative sentiment rising`)
      }
    }
    
    // Price recommendations
    if (priceWatch.currentScore > 70) {
      recommendations.push('Consider discount campaigns - high price sensitivity detected')
    } else if (priceWatch.currentScore < 30) {
      recommendations.push('Opportunity for premium positioning - low price sensitivity')
    }
    
    // Festival recommendations
    if (festivals.length > 0) {
      recommendations.push(`Prepare for ${festivals[0].name} surge - ${festivals[0].categories.slice(0, 2).join(', ')} categories`)
    }
    
    return recommendations.slice(0, 3)
  }

  const topRegions = getTopRegions()
  const priceWatch = getPriceWatch()
  const upcomingFestivals = getUpcomingFestivals()
  const recommendations = getRecommendations()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className={className}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span>Bharat Pulse</span>
            <Badge variant="default" className="text-xs bg-gradient-to-r from-blue-500 to-teal-500">
              Executive Summary
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Top 3 Regions by Opportunity */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Top 3 Regions by Opportunity
            </h4>
            <div className="space-y-2">
              {topRegions.map((region, idx) => (
                <div key={region.regionId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      #{idx + 1}
                    </Badge>
                    <span className="text-sm font-medium">{region.regionName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {region.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={region.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {region.deltaWoW}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Watch */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              💰 Price Watch
            </h4>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {priceWatch.currentScore}/100
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    Price Sensitivity Index
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {priceWatch.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  )}
                  <span className={priceWatch.trend === 'up' ? 'text-red-600' : 'text-green-600'}>
                    {priceWatch.change} vs last week
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Festival Watch */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Festival Watch (Next 30 Days)
            </h4>
            {upcomingFestivals.length > 0 ? (
              <div className="space-y-2">
                {upcomingFestivals.map((festival) => (
                  <div key={festival.id} className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <div>
                      <div className="text-sm font-medium">{festival.name}</div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">
                        {new Date(festival.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <Badge 
                      variant={festival.impact === 'high' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {festival.impact} impact
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No major festivals in next 30 days</p>
              </div>
            )}
          </div>

          {/* What to Do Next */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              What to Do Next
            </h4>
            <div className="space-y-2">
              {recommendations.map((rec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm"
                >
                  <Badge variant="default" className="text-xs mt-0.5">
                    {idx + 1}
                  </Badge>
                  <span className="text-blue-700 dark:text-blue-300">{rec}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
