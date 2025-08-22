import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Language } from '../nlp/sentiment'

export interface RawDoc {
  id: string
  text: string
  lang: Language
  regionId: string
  source: 'sharechat' | 'moj' | 'fb' | 'youtube' | 'news'
  url?: string
  timestamp: number
  author?: string
}

export interface ProcessedDoc extends RawDoc {
  sentiment: number
  priceSignal: boolean
  priceScore: number
  keyPhrases: string[]
}

export interface RegionInsight {
  regionId: string
  volume: number
  avgSentiment: number
  priceScore: number
  topTerms: Array<{term: string, count: number}>
}

export interface TimeseriesPoint {
  date: string
  volume: number
  avgSentiment: number
  lang: Language
}

export interface AlertEvent {
  id: string
  type: 'trend' | 'crisis' | 'price'
  regionId: string
  lang: Language
  message: string
  timestamp: number
  severity: 'low' | 'medium' | 'high'
}

export interface FiltersState {
  timeframe: 'week' | 'month' | 'quarter'
  languages: Language[]
  regions: string[]
  sources: string[]
}

export interface SettingsState {
  enabledLanguages: Language[]
  enabledSources: string[]
  festivalCalendar: boolean
  mockMode: boolean
}

interface InsightsState {
  // Data
  rawDocs: RawDoc[]
  processedDocs: ProcessedDoc[]
  regionInsights: RegionInsight[]
  timeseries: TimeseriesPoint[]
  alerts: AlertEvent[]
  
  // UI State
  filters: FiltersState
  settings: SettingsState
  isLoading: boolean
  selectedRegion: string | null
  
  // Actions
  setRawDocs: (docs: RawDoc[]) => void
  setProcessedDocs: (docs: ProcessedDoc[]) => void
  setRegionInsights: (insights: RegionInsight[]) => void
  setTimeseries: (data: TimeseriesPoint[]) => void
  addAlert: (alert: AlertEvent) => void
  clearAlerts: () => void
  
  updateFilters: (filters: Partial<FiltersState>) => void
  updateSettings: (settings: Partial<SettingsState>) => void
  setSelectedRegion: (regionId: string | null) => void
  setLoading: (loading: boolean) => void
  
  // Computed
  getFilteredDocs: () => ProcessedDoc[]
  getRegionData: (regionId: string) => RegionInsight | undefined
  getLanguageTimeseries: (lang: Language) => TimeseriesPoint[]
}

export const useInsightsStore = create<InsightsState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    rawDocs: [],
    processedDocs: [],
    regionInsights: [],
    timeseries: [],
    alerts: [],
    
    filters: {
      timeframe: 'week',
      languages: ['hi', 'ta', 'te', 'mr'],
      regions: [],
      sources: ['sharechat', 'fb', 'youtube', 'news']
    },
    
    settings: {
      enabledLanguages: ['hi', 'ta', 'te', 'mr'],
      enabledSources: ['sharechat', 'fb', 'youtube', 'news'],
      festivalCalendar: true,
      mockMode: true
    },
    
    isLoading: false,
    selectedRegion: null,
    
    // Actions
    setRawDocs: (docs) => set({ rawDocs: docs }),
    setProcessedDocs: (docs) => set({ processedDocs: docs }),
    setRegionInsights: (insights) => set({ regionInsights: insights }),
    setTimeseries: (data) => set({ timeseries: data }),
    
    addAlert: (alert) => set(state => ({ 
      alerts: [alert, ...state.alerts].slice(0, 50) // Keep last 50 alerts
    })),
    
    clearAlerts: () => set({ alerts: [] }),
    
    updateFilters: (newFilters) => set(state => ({
      filters: { ...state.filters, ...newFilters }
    })),
    
    updateSettings: (newSettings) => set(state => ({
      settings: { ...state.settings, ...newSettings }
    })),
    
    setSelectedRegion: (regionId) => set({ selectedRegion: regionId }),
    setLoading: (loading) => set({ isLoading: loading }),
    
    // Computed getters
    getFilteredDocs: () => {
      const { processedDocs, filters } = get()
      const now = Date.now()
      const timeframeDays = filters.timeframe === 'week' ? 7 : filters.timeframe === 'month' ? 30 : 90
      const cutoff = now - (timeframeDays * 24 * 60 * 60 * 1000)
      
      return processedDocs.filter(doc => {
        const matchesTime = doc.timestamp >= cutoff
        const matchesLang = filters.languages.length === 0 || filters.languages.includes(doc.lang)
        const matchesRegion = filters.regions.length === 0 || filters.regions.includes(doc.regionId)
        const matchesSource = filters.sources.length === 0 || filters.sources.includes(doc.source)
        
        return matchesTime && matchesLang && matchesRegion && matchesSource
      })
    },
    
    getRegionData: (regionId) => {
      const { regionInsights } = get()
      return regionInsights.find(insight => insight.regionId === regionId)
    },
    
    getLanguageTimeseries: (lang) => {
      const { timeseries } = get()
      return timeseries.filter(point => point.lang === lang)
    }
  }))
)
