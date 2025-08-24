'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  TrendingUp, 
  Users, 
  MapPin, 
  Brain, 
  Zap, 
  Search, 
  FileText, 
  BarChart, 
  Lightbulb,
  Target,
  CheckCircle,
  ArrowRight,
  Menu,
  X
} from 'lucide-react'
import SampleReportModal from '@/components/marketing/SampleReportModal'

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Navigation Header */}
      <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold text-lg">
                PB
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Mister PB</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* Product Links */}
              <div className="relative group">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Products
                  <ArrowRight className="ml-1 h-4 w-4 rotate-90 transition-transform group-hover:rotate-0" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-4 space-y-3">
                    <Link href="/planning" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Brain className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">AI Mission Planning</div>
                        <div className="text-sm text-gray-500">Break down complex missions</div>
                      </div>
                    </Link>
                    <Link href="/research" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Search className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Research Tools</div>
                        <div className="text-sm text-gray-500">Web research & citations</div>
                      </div>
                    </Link>
                    <Link href="/insights" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <BarChart className="h-5 w-5 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Insights Dashboard</div>
                        <div className="text-sm text-gray-500">Real-time analytics</div>
                      </div>
                    </Link>
                    <Link href="/reports" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <FileText className="h-5 w-5 text-orange-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Report Generation</div>
                        <div className="text-sm text-gray-500">Comprehensive insights</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Solutions Links */}
              <div className="relative group">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Solutions
                  <ArrowRight className="ml-1 h-4 w-4 rotate-90 transition-transform group-hover:rotate-0" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-4 space-y-3">
                    <Link href="/solutions/market-research" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <TrendingUp className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Market Research</div>
                        <div className="text-sm text-gray-500">Competitive analysis</div>
                      </div>
                    </Link>
                    <Link href="/solutions/content-strategy" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Lightbulb className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Content Strategy</div>
                        <div className="text-sm text-gray-500">Topic research & planning</div>
                      </div>
                    </Link>
                    <Link href="/solutions/technical-analysis" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Zap className="h-5 w-5 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Technical Analysis</div>
                        <div className="text-sm text-gray-500">Tool comparisons</div>
                      </div>
                    </Link>
                    <Link href="/solutions/strategic-planning" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Target className="h-5 w-5 text-orange-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Strategic Planning</div>
                        <div className="text-sm text-gray-500">Business strategy</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Regional Focus */}
              <div className="relative group">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Regional Focus
                  <ArrowRight className="ml-1 h-4 w-4 rotate-90 transition-transform group-hover:rotate-0" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-4 space-y-3">
                    <Link href="/regions/hindi" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Hindi Markets</div>
                        <div className="text-sm text-gray-500">UP, Bihar, Rajasthan</div>
                      </div>
                    </Link>
                    <Link href="/regions/tamil" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <MapPin className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Tamil Markets</div>
                        <div className="text-sm text-gray-500">Tamil Nadu, Karnataka</div>
                      </div>
                    </Link>
                    <Link href="/regions/telugu" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Telugu Markets</div>
                        <div className="text-sm text-gray-500">Andhra Pradesh, Telangana</div>
                      </div>
                    </Link>
                    <Link href="/regions/marathi" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <MapPin className="h-5 w-5 text-orange-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Marathi Markets</div>
                        <div className="text-sm text-gray-500">Maharashtra, Goa</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Resources */}
              <Link href="/resources" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Resources
              </Link>

              {/* Pricing */}
              <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Pricing
              </Link>

              {/* About */}
              <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                About
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="space-y-4">
                {/* Mobile Product Links */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Products</h3>
                  <div className="space-y-2 pl-4">
                    <Link href="/planning" className="block text-sm text-gray-600 hover:text-blue-600">AI Mission Planning</Link>
                    <Link href="/research" className="block text-sm text-gray-600 hover:text-blue-600">Research Tools</Link>
                    <Link href="/insights" className="block text-sm text-gray-600 hover:text-blue-600">Insights Dashboard</Link>
                    <Link href="/reports" className="block text-sm text-gray-600 hover:text-blue-600">Report Generation</Link>
                  </div>
                </div>

                {/* Mobile Solutions Links */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Solutions</h3>
                  <div className="space-y-2 pl-4">
                    <Link href="/solutions/market-research" className="block text-sm text-gray-600 hover:text-blue-600">Market Research</Link>
                    <Link href="/solutions/content-strategy" className="block text-sm text-gray-600 hover:text-blue-600">Content Strategy</Link>
                    <Link href="/solutions/technical-analysis" className="block text-sm text-gray-600 hover:text-blue-600">Technical Analysis</Link>
                    <Link href="/solutions/strategic-planning" className="block text-sm text-gray-600 hover:text-blue-600">Strategic Planning</Link>
                  </div>
                </div>

                {/* Mobile Regional Links */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Regional Focus</h3>
                  <div className="space-y-2 pl-4">
                    <Link href="/regions/hindi" className="block text-sm text-gray-600 hover:text-blue-600">Hindi Markets</Link>
                    <Link href="/regions/tamil" className="block text-sm text-gray-600 hover:text-blue-600">Tamil Markets</Link>
                    <Link href="/regions/telugu" className="block text-sm text-gray-600 hover:text-blue-600">Telugu Markets</Link>
                    <Link href="/regions/marathi" className="block text-sm text-gray-600 hover:text-blue-600">Marathi Markets</Link>
                  </div>
                </div>

                {/* Mobile Other Links */}
                <div className="space-y-2">
                  <Link href="/resources" className="block text-sm text-gray-600 hover:text-blue-600">Resources</Link>
                  <Link href="/pricing" className="block text-sm text-gray-600 hover:text-blue-600">Pricing</Link>
                  <Link href="/about" className="block text-sm text-gray-600 hover:text-blue-600">About</Link>
                </div>

                {/* Mobile CTA Buttons */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link href="/signin" className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Sign In
                  </Link>
                  <Link href="/signup" className="block w-full text-center py-2 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-md text-sm font-medium hover:from-blue-700 hover:to-teal-700">
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </header>

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

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Complete AI-Powered Research Platform
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From mission planning to insights delivery, we provide everything you need for comprehensive market research
            </p>
          </motion.div>

          {/* Core Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* AI Mission Planning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
            >
              <div className="flex items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">AI Mission Planning</h3>
              </div>
              <p className="text-gray-700">
                Break down complex research missions into logical, executable steps with AI-powered orchestration
              </p>
            </motion.div>

            {/* Multi-LLM Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200"
            >
              <div className="flex items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">Multi-LLM Support</h3>
              </div>
              <p className="text-gray-700">
                Access OpenAI, Gemini, Cohere, and Mistral with intelligent provider selection and fallback
              </p>
            </motion.div>

            {/* Web Research & Citations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200"
            >
              <div className="flex items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">Web Research & Citations</h3>
              </div>
              <p className="text-gray-700">
                Conduct actual web research with proper citations, sources, and verifiable data
              </p>
            </motion.div>

            {/* Report Generation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200"
            >
              <div className="flex items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600 text-white">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">Report Generation</h3>
              </div>
              <p className="text-gray-700">
                Generate comprehensive reports with executive summaries, key findings, and actionable insights
              </p>
            </motion.div>

            {/* Strategic Planning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200"
            >
              <div className="flex items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-600 text-white">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">Strategic Planning</h3>
              </div>
              <p className="text-gray-700">
                Develop business strategies with market analysis, competitive intelligence, and trend forecasting
              </p>
            </motion.div>

            {/* Real-time Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200"
            >
              <div className="flex items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <BarChart className="h-6 w-6" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">Real-time Analytics</h3>
              </div>
              <p className="text-gray-700">
                Monitor insights in real-time with interactive dashboards and performance metrics
              </p>
            </motion.div>
          </div>

          {/* Additional Capabilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Advanced Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Content Strategy Analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Technical Comparisons</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Market Trend Analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Competitive Intelligence</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Regional Language Support</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Project Management</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Export & Sharing</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">API Integration</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Research?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of researchers and businesses using AI to uncover insights faster
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signin">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold">
                  <Target className="mr-2 h-5 w-5" />
                  Start Your First Mission
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg font-semibold border-gray-300"
                onClick={() => setIsModalOpen(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                See It In Action
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <SampleReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
