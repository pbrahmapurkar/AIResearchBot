'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            Mister PB
          </h1>
          <p className="text-xl font-semibold text-blue-700 mb-4">
            AI-Powered Consumer Insights for Bharat&apos;s Tier-2 & Tier-3 Markets
          </p>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
            Decode vernacular consumer behavior, price sensitivity, and purchase patterns 
            across regional Indian markets that traditional tools ignore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
              Decode Tier-2/3 Demand
            </Button>
            <Button size="lg" variant="outline">
              See Sample Insights
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Regional Consumer Insights</CardTitle>
              <CardDescription>
                Deep-dive into Tier-2/3 consumer behavior with vernacular language processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Get Vernacular Insights
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle>Price Sensitivity Mapping</CardTitle>
              <CardDescription>
                Understand value perception and affordability thresholds across regional markets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Analyze Price Sensitivity
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle>Purchase Pattern Discovery</CardTitle>
              <CardDescription>
                Identify emerging demand categories and consumer journey insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Understand Regional Consumers
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle>Regional Competitive Analysis</CardTitle>
              <CardDescription>
                Track competitor performance in Tier-2/3 markets with local context
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Get Competitive Intel
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status Message */}
        <div className="mt-16 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🎉 Mister PB Rebranding Complete!
            </h3>
            <p className="text-green-700">
              The platform has been successfully transformed from AI Mission Planner to Mister PB - 
              your specialized regional consumer insights platform for India&apos;s Tier-2/3 markets.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
