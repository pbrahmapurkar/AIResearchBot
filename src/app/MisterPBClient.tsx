'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  TrendingUp, 
  MapPin, 
  Users, 
  Globe, 
  IndianRupee,
  ShoppingBasket,
  Target,
  Languages,
  BarChart3,
  Zap,

  Sparkles,
  Moon,
  Sun
} from 'lucide-react'
import { toast } from 'sonner'

interface RegionalInsight {
  id: string
  title: string
  market: string
  language: string
  insight: string
  confidence: number
  category: 'price' | 'behavior' | 'demand' | 'competitive'
}

const sampleInsights: RegionalInsight[] = [
  {
    id: '1',
    title: 'Price Sensitivity in Tier-2 Electronics',
    market: 'Tier-2 Cities',
    language: 'Hindi + English',
    insight: 'Consumers in Tier-2 cities show 40% higher price sensitivity for electronics, with optimal price points 25% below metro market rates.',
    confidence: 92,
    category: 'price'
  },
  {
    id: '2', 
    title: 'Fashion Purchase Behavior - Tamil Markets',
    market: 'Tamil Nadu Semi-Urban',
    language: 'Tamil',
    insight: 'Festival-driven purchasing peaks 3 weeks before major Tamil festivals, with 60% preference for traditional designs mixed with modern cuts.',
    confidence: 87,
    category: 'behavior'
  },
  {
    id: '3',
    title: 'Emerging Demand: Health & Wellness',
    market: 'Marathi-speaking Regions', 
    language: 'Marathi',
    insight: 'Growing demand for organic products in semi-urban Maharashtra, driven by health consciousness and local sourcing preferences.',
    confidence: 84,
    category: 'demand'
  }
]

export default function MisterPBClient() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const [researchQuery, setResearchQuery] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored) {
      const dark = JSON.parse(stored)
      setIsDarkMode(dark)
      document.documentElement.classList.toggle('dark', dark)
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('darkMode', JSON.stringify(newMode))
    document.documentElement.classList.toggle('dark', newMode)
  }

  const handleAnalyzeMarket = async () => {
    if (!researchQuery.trim()) {
      toast.error('Please enter a research question about regional markets')
      return
    }

    setIsAnalyzing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsAnalyzing(false)
    toast.success('Market analysis complete! Check your insights dashboard.')
    setResearchQuery('')
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'price': return IndianRupee
      case 'behavior': return Users  
      case 'demand': return TrendingUp
      case 'competitive': return Target
      default: return BarChart3
    }
  }

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'price': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
      case 'behavior': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300'
      case 'demand': return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300' 
      case 'competitive': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-orange-100/20 dark:from-blue-900/10 dark:to-orange-900/10"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-blue-200/30 to-transparent dark:from-blue-800/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-orange-200/30 to-transparent dark:from-orange-800/20 rounded-full blur-3xl"></div>

      {/* Dark Mode Toggle */}
      <motion.button
        onClick={toggleDarkMode}
        className="fixed top-20 right-6 z-50 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-orange-600" />
        ) : (
          <Moon className="w-5 h-5 text-blue-600" />
        )}
      </motion.button>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-orange-100 dark:from-blue-900/30 dark:to-orange-900/30 rounded-full mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              AI-Powered Regional Market Intelligence
            </span>
          </motion.div>

          <motion.h1
            className="font-bold text-4xl md:text-6xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Mister PB
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            AI-Powered Consumer Insights for Bharat&apos;s Tier-2 & Tier-3 Markets
          </motion.p>

          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Decode vernacular consumer behavior, price sensitivity, and purchase patterns 
            across regional Indian markets that traditional tools ignore.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Decode Tier-2/3 Demand
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold px-8 py-3"
            >
              <Globe className="w-5 h-5 mr-2" />
              See Sample Insights
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* Regional Consumer Insights */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Regional Consumer Insights
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Deep-dive into Tier-2/3 consumer behavior with vernacular language processing
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full">
                  <Languages className="w-4 h-4 mr-2" />
                  Get Vernacular Insights
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Price Sensitivity Analysis */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full border-2 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <IndianRupee className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Price Sensitivity Mapping
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Understand value perception and affordability thresholds across regional markets
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analyze Price Sensitivity
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Purchase Behavior Intelligence */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <ShoppingBasket className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Purchase Pattern Discovery
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Identify emerging demand categories and consumer journey insights
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Understand Regional Consumers
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Competitive Intelligence */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full border-2 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Regional Competitive Analysis
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Track competitor performance in Tier-2/3 markets with local context
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  Get Competitive Intel
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Comparison Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Why Mister PB vs. Generic Social Listening Tools
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                We specialize in actionable consumer behavior insights, not just brand monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="py-4 px-6 font-semibold text-gray-900 dark:text-gray-100">Feature</th>
                      <th className="py-4 px-6 font-semibold text-gray-500 dark:text-gray-400">Generic Tools</th>
                      <th className="py-4 px-6 font-semibold text-blue-600 dark:text-blue-400">Mister PB</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">Market Focus</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Metro/Urban</td>
                      <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-semibold">Tier-2/3/Rural</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">Language Support</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">English Only</td>
                      <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-semibold">8+ Indian Languages</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">Analysis Depth</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Brand Sentiment</td>
                      <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-semibold">Purchase Behavior</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">Price Intelligence</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Basic Mentions</td>
                      <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-semibold">Deep Affordability Analysis</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">Regional Context</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Limited</td>
                      <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-semibold">Native Understanding</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">Consumer Intent</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Surface Level</td>
                      <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-semibold">Deep Behavioral Insights</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Research Query Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Try Regional Market Analysis
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Enter your research question about Tier-2/3 consumer behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-2xl mx-auto">
                <Textarea
                  placeholder="e.g., How do semi-urban consumers in Hindi-speaking regions perceive premium skincare brands? What drives their purchase decisions?"
                  value={researchQuery}
                  onChange={(e) => setResearchQuery(e.target.value)}
                  className="min-h-[100px] text-base border-2 focus:border-blue-500 dark:focus:border-blue-400"
                  maxLength={300}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm ${researchQuery.length > 250 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {researchQuery.length}/300 characters
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleAnalyzeMarket}
                  disabled={isAnalyzing || !researchQuery.trim()}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing Regional Markets...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Analyze Consumer Behavior
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sample Insights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Sample Regional Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Real examples of consumer behavior patterns from Tier-2/3 markets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleInsights.map((insight, index) => {
              const IconComponent = getCategoryIcon(insight.category)
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${getCategoryColor(insight.category)}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                        {insight.title}
                      </CardTitle>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{insight.market}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Languages className="w-4 h-4" />
                          <span>{insight.language}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {insight.insight}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
