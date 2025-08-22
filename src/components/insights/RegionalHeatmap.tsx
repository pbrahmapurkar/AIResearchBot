'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useInsightsStore } from '@/lib/store/insights'
import regionsData from '@/data/regions.json'

interface HeatmapProps {
  className?: string
}

// Simple India map representation using SVG paths (simplified)
const INDIA_SVG_PATH = "M300,100 L350,120 L380,150 L390,200 L370,250 L340,280 L300,290 L250,280 L220,250 L200,200 L210,150 L240,120 Z"

export default function RegionalHeatmap({ className = '' }: HeatmapProps) {
  const { regionInsights, selectedRegion, setSelectedRegion } = useInsightsStore()

  // Helper to get color based on sentiment intensity
  const getSentimentColor = (avgSentiment: number, volume: number) => {
    const intensity = Math.abs(avgSentiment) * Math.min(volume / 100, 1)
    
    if (avgSentiment > 0.2) {
      return `rgba(34, 197, 94, ${Math.min(intensity + 0.3, 1)})` // Green for positive
    } else if (avgSentiment < -0.2) {
      return `rgba(239, 68, 68, ${Math.min(intensity + 0.3, 1)})` // Red for negative
    } else {
      return `rgba(156, 163, 175, ${Math.min(intensity + 0.3, 1)})` // Gray for neutral
    }
  }

  // Get insight data for a region
  const getRegionInsight = (regionId: string) => {
    return regionInsights.find(insight => insight.regionId === regionId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Regional Sentiment Heatmap</span>
            <Badge variant="secondary" className="text-xs">
              Live Data
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
            {/* Map Visualization */}
            <div className="lg:col-span-2 relative">
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 500 400" 
                className="border rounded-lg bg-slate-50 dark:bg-slate-900"
              >
                {/* Background India outline */}
                <path
                  d={INDIA_SVG_PATH}
                  fill="rgba(148, 163, 184, 0.1)"
                  stroke="rgba(148, 163, 184, 0.3)"
                  strokeWidth="2"
                />
                
                {/* Regional markers */}
                {regionsData.map((region) => {
                  const insight = getRegionInsight(region.id)
                  const [x, y] = region.centroid
                  
                  // Convert lat/lng to SVG coordinates (simplified)
                  const svgX = ((x - 68) / (97 - 68)) * 400 + 50
                  const svgY = ((28 - y) / (28 - 8)) * 300 + 50
                  
                  const isSelected = selectedRegion === region.id
                  const baseRadius = isSelected ? 16 : 12
                  const radius = insight ? baseRadius + (insight.volume / 10) : baseRadius
                  
                  return (
                    <g key={region.id}>
                      {/* Region circle */}
                      <circle
                        cx={svgX}
                        cy={svgY}
                        r={radius}
                        fill={insight ? getSentimentColor(insight.avgSentiment, insight.volume) : '#94a3b8'}
                        stroke={isSelected ? '#3b82f6' : '#fff'}
                        strokeWidth={isSelected ? 3 : 2}
                        className="cursor-pointer transition-all duration-200 hover:stroke-blue-500"
                        onClick={() => setSelectedRegion(region.id)}
                      />
                      
                      {/* Region label */}
                      <text
                        x={svgX}
                        y={svgY + radius + 16}
                        textAnchor="middle"
                        className="text-xs fill-gray-700 dark:fill-gray-300 font-medium pointer-events-none"
                      >
                        {region.name.split(' ')[0]}
                      </text>
                      
                      {/* Tooltip on hover */}
                      {insight && (
                        <title>
                          {region.name}
                          {'\n'}Volume: {insight.volume}
                          {'\n'}Sentiment: {(insight.avgSentiment * 100).toFixed(1)}%
                          {'\n'}Price Score: {insight.priceScore}
                        </title>
                      )}
                    </g>
                  )
                })}
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
                <div className="text-xs font-medium mb-2">Sentiment Scale</div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded bg-red-500"></div>
                  <span>Negative</span>
                  <div className="w-3 h-3 rounded bg-gray-400"></div>
                  <span>Neutral</span>
                  <div className="w-3 h-3 rounded bg-green-500"></div>
                  <span>Positive</span>
                </div>
              </div>
            </div>
            
            {/* Region Details Panel */}
            <div className="lg:col-span-1">
              {selectedRegion ? (
                <motion.div
                  key={selectedRegion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {(() => {
                    const region = regionsData.find(r => r.id === selectedRegion)
                    const insight = getRegionInsight(selectedRegion)
                    
                    if (!region) return null
                    
                    return (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{region.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {region.cities.slice(0, 2).join(', ')}
                            {region.cities.length > 2 && ` +${region.cities.length - 2} more`}
                          </p>
                        </div>
                        
                        {insight ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Volume</div>
                                <div className="text-lg font-bold">{insight.volume}</div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                <div className="text-xs text-green-600 dark:text-green-400 font-medium">Sentiment</div>
                                <div className="text-lg font-bold">
                                  {(insight.avgSentiment * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                              <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-2">
                                Price Sensitivity
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${insight.priceScore * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">
                                  {(insight.priceScore * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                            
                            {insight.topTerms.length > 0 && (
                              <div>
                                <div className="text-xs font-medium mb-2">Top Terms</div>
                                <div className="flex flex-wrap gap-1">
                                  {insight.topTerms.slice(0, 5).map((term, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {term.term} ({term.count})
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            No data available for this region
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-sm">Click on a region to see details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
