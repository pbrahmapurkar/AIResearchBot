'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  ExternalLink,
  DollarSign,
  Clock
} from 'lucide-react'
import { getProviderStatus, isRealAPIsEnabled, isDebugMode } from '@/lib/config/apiConfig'

interface ApiStatusDashboardProps {
  className?: string
}

export default function ApiStatusDashboard({ className = '' }: ApiStatusDashboardProps) {
  const [providerStatus, setProviderStatus] = useState<ReturnType<typeof getProviderStatus> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date>(new Date())

  const loadProviderStatus = () => {
    setIsLoading(true)
    try {
      const status = getProviderStatus()
      setProviderStatus(status)
      setLastChecked(new Date())
    } catch (error) {
      console.error('Failed to load provider status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProviderStatus()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'disabled':
        return <XCircle className="w-4 h-4 text-gray-400" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <WifiOff className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'disabled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const apiSetupLinks = {
    huggingface: 'https://huggingface.co/settings/tokens',
    together: 'https://api.together.xyz/settings/api-keys',
    perplexity: 'https://www.perplexity.ai/settings/api',
    openai: 'https://platform.openai.com/api-keys',
    anthropic: 'https://console.anthropic.com/',
    tavily: 'https://tavily.com/'
  }

  if (isLoading || !providerStatus) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              API Integration Status
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadProviderStatus}>
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
              <Badge variant={isRealAPIsEnabled() ? 'default' : 'secondary'}>
                {isRealAPIsEnabled() ? 'Real APIs' : 'Mock Mode'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {providerStatus.overall.enabledCount}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Providers Connected
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {providerStatus.overall.isValid ? '✓' : '✗'}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Configuration Valid
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {isDebugMode() ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Debug Mode
              </div>
            </div>
          </div>

          {/* Configuration Errors */}
          {!providerStatus.overall.isValid && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Configuration Issues:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {providerStatus.overall.errors.map((error: string, idx: number) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Provider Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(providerStatus.providers).map(([key, provider]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(provider.status)}
                        <span className="font-medium">{provider.name}</span>
                      </div>
                      <Badge className={getStatusColor(provider.status)}>
                        {provider.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {provider.description}
                    </p>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{provider.cost}</span>
                    </div>
                    
                    {provider.status === 'disabled' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        asChild
                      >
                        <a 
                          href={apiSetupLinks[key as keyof typeof apiSetupLinks]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Get API Key
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Setup Instructions */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-2">Quick Setup:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Copy <code>env.example</code> to <code>.env.local</code></li>
              <li>Add your API keys from the providers above</li>
              <li>Set <code>NEXT_PUBLIC_ENABLE_REAL_APIS=true</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>

          {/* Last Checked */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
