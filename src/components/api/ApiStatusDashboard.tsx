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
import { apiConfig } from '@/lib/config/apiConfig'

interface ApiStatusDashboardProps {
  className?: string
}

export default function ApiStatusDashboard() {
  const providers = [
    {
      name: 'Gemini',
      status: apiConfig.gemini.enabled ? 'connected' : 'disabled',
      description: 'Google Gemini Pro for text generation',
      cost: 'Free tier available'
    },
    {
      name: 'Cohere',
      status: apiConfig.cohere.enabled ? 'connected' : 'disabled',
      description: 'Cohere for text generation and analysis',
      cost: 'Usage-based pricing'
    },
    {
      name: 'HuggingFace',
      status: apiConfig.huggingface.enabled ? 'connected' : 'disabled',
      description: 'Open source models for NLP tasks',
      cost: 'Free tier available'
    }
  ]

  const enabledCount = providers.filter(p => p.status === 'connected').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">API Status Dashboard</h2>
        <div className="text-sm text-gray-500">
          {enabledCount} of {providers.length} providers active
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <div
            key={provider.name}
            className={`p-4 rounded-lg border ${
              provider.status === 'connected'
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{provider.name}</h3>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  provider.status === 'connected'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {provider.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{provider.description}</p>
            <p className="text-xs text-gray-500">{provider.cost}</p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Configuration Note</h3>
        <p className="text-sm text-blue-800">
          This application is currently using mock implementations for AI functionality. 
          To enable real AI providers, configure the appropriate API keys in your environment variables.
        </p>
      </div>
    </div>
  )
}
