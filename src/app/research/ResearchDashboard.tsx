'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Brain, 
  TrendingUp, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Download
} from 'lucide-react'

interface ResearchMission {
  id: string
  title: string
  prompt: string
  status: 'pending' | 'collecting' | 'analyzing' | 'synthesizing' | 'completed' | 'failed'
  targetLanguages: string[]
  focus: string
  progress: number
  subtasks: Array<{ status: string, description: string, assignedModel: string }>
  sources: Array<{ url: string, title: string }>
  report?: { summary: string }
  costs?: { total: number }
  createdAt: number
  completedAt?: number
}

export default function ResearchDashboard() {
  const [prompt, setPrompt] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['hi', 'ta'])
  const [focus, setFocus] = useState('comprehensive')
  const [timeframe, setTimeframe] = useState('month')
  const [isRunning, setIsRunning] = useState(false)
  const [currentMission, setCurrentMission] = useState<ResearchMission | null>(null)
  const [recentMissions, setRecentMissions] = useState<ResearchMission[]>([])

  const LANGUAGE_OPTIONS = [
    { value: 'hi', label: 'Hindi 🇮🇳', flag: '🇮🇳' },
    { value: 'ta', label: 'Tamil 🏛️', flag: '🏛️' },
    { value: 'te', label: 'Telugu 🏮', flag: '🏮' },
    { value: 'mr', label: 'Marathi 🟠', flag: '🟠' }
  ]

  const FOCUS_OPTIONS = [
    { value: 'comprehensive', label: 'Comprehensive Analysis', icon: '🎯' },
    { value: 'sentiment', label: 'Sentiment Focus', icon: '😊' },
    { value: 'price', label: 'Price Sensitivity', icon: '💰' },
    { value: 'cultural', label: 'Cultural Context', icon: '🎭' }
  ]

  const handleStartResearch = async () => {
    if (!prompt.trim()) return

    setIsRunning(true)
    
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          languages: selectedLanguages,
          focus,
          timeframe,
          enableRealTimeSearch: true,
          enableModelOrchestration: true
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setCurrentMission(result.mission)
        setRecentMissions(prev => [result.mission, ...prev.slice(0, 4)])
      } else {
        console.error('Research failed:', result.error)
      }
    } catch (error) {
      console.error('Failed to start research:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending': return <Clock className="w-4 h-4 text-gray-500" />
      default: return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
    }
  }

  const getModelIcon = (model: string) => {
    if (model.includes('huggingface')) return '🤗'
    if (model.includes('together')) return '⚡'
    if (model.includes('perplexity')) return '🔍'
    if (model.includes('openai')) return '🧠'
    if (model.includes('anthropic')) return '🏛️'
    return '🤖'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            AI Research Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Multi-model orchestration for comprehensive Tier-2/3 market intelligence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Research Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  New Research Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Prompt Input */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Research Query</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Analyze Hindi + Marathi discussions around FMCG snack brands in Tier-2 cities for the last 90 days. Focus on price vs quality."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Languages */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Languages</label>
                    <div className="flex flex-wrap gap-1">
                      {LANGUAGE_OPTIONS.map(lang => (
                        <Button
                          key={lang.value}
                          variant={selectedLanguages.includes(lang.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedLanguages(prev => 
                              prev.includes(lang.value)
                                ? prev.filter(l => l !== lang.value)
                                : [...prev, lang.value]
                            )
                          }}
                          className="h-8"
                        >
                          <span className="mr-1">{lang.flag}</span>
                          {lang.value.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Focus */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Focus Area</label>
                    <Select value={focus} onValueChange={setFocus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FOCUS_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="flex items-center gap-2">
                              <span>{option.icon}</span>
                              {option.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Timeframe */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Timeframe</label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                        <SelectItem value="quarter">Last 90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Start Button */}
                <Button 
                  onClick={handleStartResearch}
                  disabled={!prompt.trim() || isRunning}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Orchestrating AI Models...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Research Mission
                    </>
                  )}
                </Button>

                {/* Model Attribution */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs">
                  <div className="font-medium mb-1">Model Orchestration Pipeline:</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">🔍 Perplexity (Search)</Badge>
                    <Badge variant="secondary">🤗 IndicBERT (Sentiment)</Badge>
                    <Badge variant="secondary">⚡ Mixtral (Extraction)</Badge>
                    <Badge variant="secondary">🧠 GPT-4 (Synthesis)</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mission Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Current Mission */}
            {currentMission && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    {getStatusIcon(currentMission.status)}
                    Current Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm font-medium mb-1">{currentMission.title}</div>
                    <div className="text-xs text-gray-500">
                      {currentMission.targetLanguages.map(lang => (
                        LANGUAGE_OPTIONS.find(l => l.value === lang)?.flag
                      )).join(' ')} • {currentMission.focus}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{Math.round(currentMission.progress || 0)}%</span>
                    </div>
                    <Progress value={currentMission.progress || 0} className="h-2" />
                  </div>

                  {/* Subtasks */}
                  <div className="space-y-1">
                    {currentMission.subtasks?.map((task, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          {getStatusIcon(task.status)}
                          {task.description}
                        </span>
                        <span>{getModelIcon(task.assignedModel)}</span>
                      </div>
                    ))}
                  </div>

                  {currentMission.status === 'completed' && (
                    <div className="pt-2 border-t space-y-2">
                      <Button size="sm" variant="outline" className="w-full">
                        <FileText className="w-3 h-3 mr-1" />
                        View Report
                      </Button>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="flex-1 text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" variant="ghost" className="flex-1 text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          CSV
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Missions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Missions</CardTitle>
              </CardHeader>
              <CardContent>
                {recentMissions.length > 0 ? (
                  <div className="space-y-2">
                    {recentMissions.map((mission) => (
                      <div key={mission.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{mission.title.slice(0, 30)}...</span>
                          {getStatusIcon(mission.status)}
                        </div>
                        <div className="text-gray-500">
                          {new Date(mission.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No missions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Model Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Multi-Model Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="models" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="models">AI Models</TabsTrigger>
                  <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                  <TabsTrigger value="costs">Costs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="models" className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                      {[
                    { name: 'Perplexity Sonar', use: 'Real-time Search', cost: '$0.001/1K', icon: '🔍' },
                    { name: 'HuggingFace IndicBERT', use: 'Vernacular Sentiment', cost: 'Free', icon: '🤗' },
                    { name: 'Together AI Mixtral', use: 'Trend Extraction', cost: '$0.0002/1K', icon: '⚡' },
                    { name: 'OpenAI GPT-4', use: 'Synthesis', cost: '$0.03/1K', icon: '🧠' }
                  ].map((model) => (
                      <div key={model.name} className="p-3 border rounded-lg">
                        <div className="text-lg mb-1">{model.icon}</div>
                        <div className="text-sm font-medium">{model.name}</div>
                        <div className="text-xs text-gray-500 mb-1">{model.use}</div>
                        <Badge variant="secondary" className="text-xs">{model.cost}</Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="pipeline" className="space-y-3">
                  <div className="text-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">1</div>
                      <div>
                        <div className="font-medium">Search & Collect</div>
                        <div className="text-gray-500 text-xs">Perplexity API fetches real-time Tier-2/3 discussions</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <div className="font-medium">Vernacular Analysis</div>
                        <div className="text-gray-500 text-xs">IndicBERT processes Hindi/Marathi, Multilingual BERT handles Tamil/Telugu</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <div className="font-medium">Pattern Extraction</div>
                        <div className="text-gray-500 text-xs">Mixtral identifies trends, price signals, and cultural cues</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <div className="font-medium">Synthesis</div>
                        <div className="text-gray-500 text-xs">GPT-4 compiles insights into structured reports with citations</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="costs" className="space-y-3">
                  <div className="text-sm">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-3">
                      <div className="font-medium text-green-800 dark:text-green-300">Cost-Optimized Pipeline</div>
                      <div className="text-green-600 dark:text-green-400 text-xs">
                        Free models handle 80% of processing. Premium models only for final synthesis.
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Typical Mission Cost</span>
                        <Badge variant="secondary">$0.05 - $0.15</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Free Tier Usage</span>
                        <Badge variant="secondary">~80%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Premium Models</span>
                        <Badge variant="secondary">~20%</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
