'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Bell, TrendingDown, TrendingUp, AlertTriangle, Info } from 'lucide-react'

interface AlertsStepProps {
  alertsEnabled: boolean
  alertThresholds: {
    sentimentThreshold: number
    priceAlertThreshold: number
  }
  onUpdate: (
    alertsEnabled: boolean,
    alertThresholds: { sentimentThreshold: number; priceAlertThreshold: number }
  ) => void
}

export default function AlertsStep({ 
  alertsEnabled, 
  alertThresholds, 
  onUpdate 
}: AlertsStepProps) {
  const [localThresholds, setLocalThresholds] = useState(alertThresholds)

  const handleToggleAlerts = (enabled: boolean) => {
    onUpdate(enabled, localThresholds)
  }

  const handleThresholdChange = (
    type: 'sentimentThreshold' | 'priceAlertThreshold',
    value: number[]
  ) => {
    const newThresholds = {
      ...localThresholds,
      [type]: value[0]
    }
    setLocalThresholds(newThresholds)
    onUpdate(alertsEnabled, newThresholds)
  }

  const getSentimentLabel = (value: number) => {
    if (value >= 0.3) return 'Very Positive'
    if (value >= 0.1) return 'Positive'
    if (value >= -0.1) return 'Neutral'
    if (value >= -0.3) return 'Negative'
    return 'Very Negative'
  }

  const getSentimentColor = (value: number) => {
    if (value >= 0.1) return 'text-green-600'
    if (value >= -0.1) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto">
          <Bell className="h-6 w-6 text-white" />
        </div>
        <p className="text-sm text-gray-600">
          Get notified when important changes happen in your target markets.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Enable Smart Alerts</h3>
              <p className="text-sm text-gray-600">
                Receive notifications for significant market changes
              </p>
            </div>
            <Switch
              checked={alertsEnabled}
              onCheckedChange={handleToggleAlerts}
            />
          </div>

          {alertsEnabled && (
            <div className="space-y-6 border-t pt-4">
              {/* Sentiment Threshold */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <label className="font-medium text-gray-900">
                    Negative Sentiment Alert
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Alert me when sentiment drops below this threshold
                </p>
                <div className="space-y-3">
                  <Slider
                    value={[localThresholds.sentimentThreshold]}
                    onValueChange={(value) => handleThresholdChange('sentimentThreshold', value)}
                    min={-1}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Very Negative (-1.0)</span>
                    <span>Neutral (0.0)</span>
                    <span>Very Positive (1.0)</span>
                  </div>
                  <div className="text-center">
                    <span className={`text-sm font-medium ${getSentimentColor(localThresholds.sentimentThreshold)}`}>
                      Current threshold: {localThresholds.sentimentThreshold.toFixed(1)} 
                      ({getSentimentLabel(localThresholds.sentimentThreshold)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Sensitivity Threshold */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <label className="font-medium text-gray-900">
                    Price Sensitivity Alert
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Alert me when price sensitivity changes by more than this percentage
                </p>
                <div className="space-y-3">
                  <Slider
                    value={[localThresholds.priceAlertThreshold]}
                    onValueChange={(value) => handleThresholdChange('priceAlertThreshold', value)}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low sensitivity (5%)</span>
                    <span>Medium (25%)</span>
                    <span>High sensitivity (50%)</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-orange-600">
                      Current threshold: {localThresholds.priceAlertThreshold}% change
                    </span>
                  </div>
                </div>
              </div>

              {/* Alert Types Preview */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-gray-900">Alert Types</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span>Sentiment drops below {localThresholds.sentimentThreshold.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                    <span>Price sensitivity changes by ±{localThresholds.priceAlertThreshold}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span>Unusual activity spikes in your regions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span>Weekly summary reports</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!alertsEnabled && (
            <div className="border-t pt-4">
              <div className="text-center space-y-2">
                <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-500">
                  Alerts are disabled. You can enable them later in your project settings.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Smart Alert Features</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Real-time notifications via email</li>
              <li>• AI-powered anomaly detection</li>
              <li>• Customizable alert thresholds</li>
              <li>• Regional and language-specific alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
