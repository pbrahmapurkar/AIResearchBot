'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Filter } from 'lucide-react'
import { useInsightsStore } from '@/lib/store/insights'
import type { Language } from '@/lib/nlp/sentiment'
import regionsData from '@/data/regions.json'

interface FiltersBarProps {
  className?: string
}

const LANGUAGE_CONFIG = {
  hi: { name: 'Hindi', flag: '🇮🇳' },
  ta: { name: 'Tamil', flag: '🏛️' },
  te: { name: 'Telugu', flag: '🏮' },
  mr: { name: 'Marathi', flag: '🟠' }
}

const SOURCE_CONFIG = {
  sharechat: { name: 'ShareChat', icon: '💬' },
  fb: { name: 'Facebook Groups', icon: '📘' },
  youtube: { name: 'YouTube Comments', icon: '📺' },
  news: { name: 'Regional News', icon: '📰' }
}

export default function FiltersBar({ className = '' }: FiltersBarProps) {
  const { filters, updateFilters } = useInsightsStore()

  const handleTimeframeChange = (timeframe: 'week' | 'month' | 'quarter') => {
    updateFilters({ timeframe })
  }

  const handleLanguageToggle = (lang: Language) => {
    const newLanguages = filters.languages.includes(lang)
      ? filters.languages.filter(l => l !== lang)
      : [...filters.languages, lang]
    updateFilters({ languages: newLanguages })
  }

  const handleRegionToggle = (regionId: string) => {
    const newRegions = filters.regions.includes(regionId)
      ? filters.regions.filter(r => r !== regionId)
      : [...filters.regions, regionId]
    updateFilters({ regions: newRegions })
  }

  const handleSourceToggle = (source: string) => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source]
    updateFilters({ sources: newSources })
  }

  const clearAllFilters = () => {
    updateFilters({
      languages: ['hi', 'ta', 'te', 'mr'],
      regions: [],
      sources: ['sharechat', 'fb', 'youtube', 'news']
    })
  }

  const hasActiveFilters = filters.regions.length > 0 || 
    filters.languages.length !== 4 || 
    filters.sources.length !== 4

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Icon */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            {/* Timeframe Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Time:</span>
              <Select value={filters.timeframe} onValueChange={handleTimeframeChange}>
                <SelectTrigger className="w-28 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language Filters */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Languages:</span>
              <div className="flex gap-1">
                {Object.entries(LANGUAGE_CONFIG).map(([lang, config]) => (
                  <Button
                    key={lang}
                    variant={filters.languages.includes(lang as Language) ? "default" : "outline"}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handleLanguageToggle(lang as Language)}
                  >
                    <span className="mr-1">{config.flag}</span>
                    <span className="text-xs">{lang.toUpperCase()}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Region Filters */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Regions:</span>
              <Select 
                value="" 
                onValueChange={handleRegionToggle}
              >
                <SelectTrigger className="w-40 h-8">
                  <SelectValue placeholder="Add Region" />
                </SelectTrigger>
                <SelectContent>
                  {regionsData.map(region => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Source Filters */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sources:</span>
              <div className="flex gap-1">
                {Object.entries(SOURCE_CONFIG).map(([source, config]) => (
                  <Button
                    key={source}
                    variant={filters.sources.includes(source) ? "default" : "outline"}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handleSourceToggle(source)}
                  >
                    <span className="mr-1 text-xs">{config.icon}</span>
                    <span className="text-xs hidden sm:inline">{config.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={clearAllFilters}
              >
                <X className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {(filters.regions.length > 0) && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500">Active:</span>
                
                {/* Selected Regions */}
                {filters.regions.map(regionId => {
                  const region = regionsData.find(r => r.id === regionId)
                  return (
                    <Badge key={regionId} variant="secondary" className="text-xs">
                      {region?.name || regionId}
                      <button
                        onClick={() => handleRegionToggle(regionId)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
