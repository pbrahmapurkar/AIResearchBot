'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ApiStatusDashboard from '@/components/api/ApiStatusDashboard'
import { Settings, Wifi, DollarSign, Activity } from 'lucide-react'

export default function SettingsDashboard() {
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
            API Settings & Configuration
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Configure and monitor your AI provider integrations
          </p>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="providers" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="providers" className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                <span className="hidden sm:inline">Providers</span>
              </TabsTrigger>
              <TabsTrigger value="costs" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Costs</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Performance</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="providers" className="space-y-6">
              <ApiStatusDashboard />
            </TabsContent>

            <TabsContent value="costs" className="space-y-6">
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Cost Monitoring</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Real-time API cost tracking and alerts will be displayed here.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Connect your API providers to start monitoring usage costs.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="text-center py-12">
                <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Performance Metrics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  API response times, success rates, and performance analytics.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Performance data will be collected as you use the system.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="general" className="space-y-6">
              <div className="text-center py-12">
                <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">General Settings</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Application preferences and configuration options.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Feature toggles, language preferences, and export settings.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
