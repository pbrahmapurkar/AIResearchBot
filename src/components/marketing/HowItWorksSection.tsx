'use client'

import { motion } from 'framer-motion'
import { Database, Brain, FileText, ArrowRight } from 'lucide-react'

const steps = [
  {
    id: 1,
    icon: Database,
    title: 'Connect',
    description: 'Link your data sources',
    detail: 'Integrate with social media, review platforms, and regional forums to collect vernacular consumer conversations.',
    note: 'Phase 1: Mock data for testing'
  },
  {
    id: 2,
    icon: Brain,
    title: 'Analyze',
    description: 'Our AI processes vernacular consumer behavior',
    detail: 'Advanced NLP models understand Hindi, Tamil, Telugu, and Marathi sentiment while detecting price sensitivity patterns.',
    note: 'Real-time analysis'
  },
  {
    id: 3,
    icon: FileText,
    title: 'Act',
    description: 'Get actionable insights in your Bharat Pulse report',
    detail: 'Receive comprehensive analytics dashboards, trend reports, and strategic recommendations for regional market success.',
    note: 'Export-ready formats'
  }
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How Mister PB
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> transforms data</span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            From raw vernacular conversations to strategic business insights in three simple steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center space-x-8">
              <div className="h-0.5 w-32 bg-gradient-to-r from-blue-600 to-teal-600"></div>
              <ArrowRight className="h-6 w-6 text-blue-600" />
              <div className="h-0.5 w-32 bg-gradient-to-r from-blue-600 to-teal-600"></div>
              <ArrowRight className="h-6 w-6 text-teal-600" />
              <div className="h-0.5 w-32 bg-gradient-to-r from-teal-600 to-purple-600"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative text-center"
                >
                  {/* Step Number */}
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-600 text-white text-xl font-bold">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                    <Icon className="h-6 w-6 text-gray-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {step.description}
                  </p>
                  <p className="text-sm text-gray-500 leading-6 mb-4">
                    {step.detail}
                  </p>
                  
                  {/* Note Badge */}
                  <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                    {step.note}
                  </div>

                  {/* Mobile Arrow */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden mt-8 flex justify-center">
                      <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ready to decode your market?
            </h3>
            <p className="text-gray-600 mb-6">
              Start analyzing vernacular consumer behavior in minutes, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  Setup in 5 minutes
                </span>
                <span className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  No technical skills needed
                </span>
                <span className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  Instant insights
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
