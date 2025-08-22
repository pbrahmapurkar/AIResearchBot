'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Send, 
  RefreshCw,
  Clock,
  Zap,
  Search,
  MessageSquare
} from 'lucide-react'

interface OrchestratorStatus {
  isInitialized: boolean
  isValid: boolean
  primaryProvider: string | null
  searchProvider: string | null
  healthyProviders: string[]
  lastValidation: string
}

interface TaskResult {
  success: boolean
  result?: string
  provider?: string
  citations?: string[]
  error?: string
  latency?: number
}

export default function OrchestratorTest() {
  const [status, setStatus] = useState<OrchestratorStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<TaskResult | null>(null)
  const [taskType, setTaskType] = useState<'completion' | 'search'>('completion')

  const loadStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/orchestrator')
      const data = await response.json()
      setStatus(data.status)
    } catch (error) {
      console.error('Failed to load orchestrator status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const processTask = async () => {
    if (!prompt.trim()) return

    setIsProcessing(true)
    setResult(null)

    try {
      const response = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          type: taskType,
          requiresRealTime: taskType === 'search',
          maxTokens: 1000,
          temperature: 0.7
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  const getStatusColor = (isHealthy: boolean) => {
    return isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Orchestrator Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Orchestrator Status
            </CardTitle>
            <Button variant="outline" size="sm" onClick={loadStatus}>
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {status ? (
            <>
              {/* Overall Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    {status.isValid ? 
                      <CheckCircle className="w-6 h-6 text-green-500" /> : 
                      <XCircle className="w-6 h-6 text-red-500" />
                    }
                  </div>
                  <div className="text-sm font-medium">
                    {status.isValid ? 'Ready' : 'Not Ready'}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {status.healthyProviders.length}
                  </div>
                  <div className="text-sm text-green-600">Healthy Providers</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {status.primaryProvider || 'None'}
                  </div>
                  <div className="text-sm text-purple-600">Primary AI</div>
                </div>
              </div>

              {/* Provider Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['openai', 'gemini', 'cohere', 'huggingface'].map(provider => {
                  const isHealthy = status.healthyProviders.includes(provider)
                  const isPrimary = status.primaryProvider === provider
                  return (
                    <Badge 
                      key={provider} 
                      className={`${getStatusColor(isHealthy)} justify-center ${isPrimary ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      {provider.toUpperCase()} {isPrimary && '👑'}
                    </Badge>
                  )
                })}
              </div>

              {/* Search Provider */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Search Provider:</span>
                <Badge className={getStatusColor(!!status.searchProvider)}>
                  {status.searchProvider?.toUpperCase() || 'NONE'}
                </Badge>
              </div>

              {/* Validation Info */}
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Last validation: {new Date(status.lastValidation).toLocaleString()}
              </div>
            </>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to load orchestrator status. Check API endpoint.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Task Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Test Orchestrator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Task Type Selection */}
          <div className="flex gap-2">
            <Button
              variant={taskType === 'completion' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTaskType('completion')}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              AI Completion
            </Button>
            <Button
              variant={taskType === 'search' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTaskType('search')}
            >
              <Search className="w-3 h-3 mr-1" />
              Real-time Search
            </Button>
          </div>

          {/* Prompt Input */}
          <Textarea
            placeholder={taskType === 'search' ? 
              'Ask a question requiring real-time data (e.g., "What are the latest trends in AI?")'  :
              'Enter your prompt (e.g., "Explain quantum computing in simple terms")'
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />

          {/* Submit Button */}
          <Button 
            onClick={processTask} 
            disabled={!prompt.trim() || isProcessing || !status?.isValid}
            className="w-full"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {isProcessing ? 'Processing...' : `Test ${taskType === 'search' ? 'Search' : 'Completion'}`}
          </Button>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Result:</span>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  {result.latency && (
                    <Badge variant="secondary" className="text-xs">
                      {result.latency}ms
                    </Badge>
                  )}
                  {result.provider && (
                    <Badge variant="outline" className="text-xs">
                      {result.provider}
                    </Badge>
                  )}
                </div>
              </div>

              {result.success ? (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{result.result}</p>
                  {result.citations && result.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-xs font-medium text-green-700 mb-1">Sources:</p>
                      {result.citations.map((citation, idx) => (
                        <p key={idx} className="text-xs text-green-600">{citation}</p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Error:</strong> {result.error}
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
