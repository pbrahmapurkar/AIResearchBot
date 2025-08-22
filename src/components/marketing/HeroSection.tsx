'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Play, TrendingUp, Users, MapPin } from 'lucide-react'
import SampleReportModal from '@/components/marketing/SampleReportModal'

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-16 pb-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-teal-600/5" />
        <div className="absolute -top-4 -right-4 h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/20 to-teal-200/20 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-96 w-96 rounded-full bg-gradient-to-br from-teal-200/20 to-blue-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Content */}
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left lg:flex lg:items-center">
              <div>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 mb-6"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Now analyzing 4 regional languages
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
                >
                  <span className="block">Mister PB</span>
                  <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    Consumer Insights
                  </span>
                  <span className="block text-3xl sm:text-4xl md:text-5xl text-gray-600 mt-2">
                    for Bharat&apos;s Markets
                  </span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl"
                >
                  Decode vernacular behavior, price sensitivity, and purchase patterns across 
                  <span className="font-semibold text-blue-600"> Hindi, Tamil, Telugu, and Marathi</span> audiences 
                  in Tier-2 & Tier-3 markets.
                </motion.p>

                {/* Key Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600"
                >
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-blue-600" />
                    Real vernacular insights
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-teal-600" />
                    Tier-2/3 market focus
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-blue-600" />
                    AI-powered analysis
                  </div>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-10 flex flex-col sm:flex-row gap-4"
                >
                  <Link href="/signin">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold">
                      Start Free
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 text-lg font-semibold border-gray-300"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    View Sample Insights
                  </Button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-8 text-sm text-gray-500"
                >
                  <p>Trusted by regional businesses across India</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">✓ No credit card required</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">✓ 14-day free trial</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">✓ Cancel anytime</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Visual */}
            <div className="mt-16 sm:mt-24 lg:col-span-6 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
              >
                {/* Mock Dashboard */}
                <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-white/20 rounded-full"></div>
                    <div className="h-3 w-3 bg-white/20 rounded-full"></div>
                    <div className="h-3 w-3 bg-white/20 rounded-full"></div>
                    <span className="text-white text-sm font-medium ml-4">Mister PB Dashboard</span>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Regional Insights Cards */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">89%</div>
                      <div className="text-xs text-blue-800">Hindi Sentiment</div>
                      <div className="text-xs text-gray-600">↗ Uttar Pradesh</div>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-teal-600">₹127</div>
                      <div className="text-xs text-teal-800">Avg. Deal Size</div>
                      <div className="text-xs text-gray-600">↗ Tamil Nadu</div>
                    </div>
                  </div>

                  {/* Language Bars */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Hindi</span>
                      <span className="text-gray-500">42%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Tamil</span>
                      <span className="text-gray-500">28%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-teal-600 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Telugu</span>
                      <span className="text-gray-500">20%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-purple-600 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Marathi</span>
                      <span className="text-gray-500">10%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-orange-600 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <SampleReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
