'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useInsightsStore } from '@/lib/store/insights'
import type { Language } from '@/lib/nlp/sentiment'

interface SentimentTrackerProps {
  className?: string
}

const LANGUAGE_CONFIG = {
  hi: { name: 'Hindi', color: '#3b82f6', flag: '🇮🇳' },
  ta: { name: 'Tamil', color: '#10b981', flag: '🏛️' },
  te: { name: 'Telugu', color: '#f59e0b', flag: '🏮' },
  mr: { name: 'Marathi', color: '#8b5cf6', flag: '🟠' }
}

export default function SentimentTracker({ className = '' }: SentimentTrackerProps) {
  const { timeseries, getFilteredDocs } = useInsightsStore()
  const [activeLanguage, setActiveLanguage] = useState<Language>('hi')
  
  // Get sentiment data for the active language
  const getLanguageData = (lang: Language) => {
    return timeseries
      .filter(point => point.lang === lang)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(point => ({
        ...point,
        sentiment: (point.avgSentiment * 100).toFixed(1),
        formattedDate: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }))
  }

  // Get top terms for active language
  const getTopTermsForLanguage = (lang: Language) => {
    const docs = getFilteredDocs().filter(doc => doc.lang === lang)
    const termCounts = new Map<string, number>()
    
    docs.forEach(doc => {
      const words = doc.text.toLowerCase().match(/[\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\u0D00-\u0D7F\w]+/g) || []
      words.forEach(word => {
        if (word.length > 2) {
          termCounts.set(word, (termCounts.get(word) || 0) + 1)
        }
      })
    })
    
    return Array.from(termCounts.entries())
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }

  // Get recent mentions for active language
  const getRecentMentions = (lang: Language) => {
    return getFilteredDocs()
      .filter(doc => doc.lang === lang)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
      .map(doc => ({
        text: doc.text.slice(0, 100) + (doc.text.length > 100 ? '...' : ''),
        sentiment: doc.sentiment,
        source: doc.source,
        timestamp: new Date(doc.timestamp).toLocaleDateString()
      }))
  }

  const chartData = getLanguageData(activeLanguage)
  const topTerms = getTopTermsForLanguage(activeLanguage)
  const recentMentions = getRecentMentions(activeLanguage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={className}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Vernacular Sentiment Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as Language)}>
            <TabsList className="grid w-full grid-cols-4">
              {Object.entries(LANGUAGE_CONFIG).map(([langCode, langConfig]) => (
                <TabsTrigger key={langCode} value={langCode} className="flex items-center gap-1">
                  <span>{langConfig.flag}</span>
                  <span className="hidden sm:inline">{langConfig.name}</span>
                  <span className="sm:hidden">{langCode.toUpperCase()}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.keys(LANGUAGE_CONFIG).map(lang => (
              <TabsContent key={lang} value={lang} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Sentiment Chart */}
                  <div className="lg:col-span-2">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {LANGUAGE_CONFIG[lang as Language].name} Sentiment Trend
                      </h3>
                      <div className="h-64">
                        {chartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                              <XAxis 
                                dataKey="formattedDate" 
                                className="text-xs"
                                tick={{ fontSize: 10 }}
                              />
                              <YAxis 
                                domain={[-100, 100]}
                                className="text-xs"
                                tick={{ fontSize: 10 }}
                              />
                              <Tooltip 
                                formatter={(value) => [`${value}%`, 'Sentiment']}
                                labelFormatter={(label) => `Date: ${label}`}
                              />
                              <Line
                                type="monotone"
                                dataKey="sentiment"
                                stroke={LANGUAGE_CONFIG[lang as Language].color}
                                strokeWidth={3}
                                dot={{ fill: LANGUAGE_CONFIG[lang as Language].color, strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-center text-gray-500 dark:text-gray-400">
                              <div className="text-2xl mb-2">📊</div>
                              <p className="text-sm">No data available</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Side Panel */}
                  <div className="lg:col-span-1 space-y-4">
                    {/* Top Terms */}
                    <div>
                      <h4 className="font-medium mb-3">Top Terms</h4>
                      <div className="flex flex-wrap gap-1">
                        {topTerms.map((term, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {term.term} ({term.count})
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Recent Mentions */}
                    <div>
                      <h4 className="font-medium mb-3">Recent Mentions</h4>
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        {recentMentions.map((mention, idx) => (
                          <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <Badge 
                                variant={mention.sentiment > 0.2 ? "default" : mention.sentiment < -0.2 ? "destructive" : "secondary"}
                                className="text-xs"
                              >
                                {mention.sentiment > 0.2 ? '😊' : mention.sentiment < -0.2 ? '😞' : '😐'}
                              </Badge>
                              <span className="text-gray-500">{mention.source}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {mention.text}
                            </p>
                            <div className="text-gray-500 mt-1">{mention.timestamp}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
