'use client'

import { motion } from 'framer-motion'
import { 
  MapPin, 
  MessageSquare, 
  DollarSign, 
  Calendar,
  Users,
  Brain,
  Target
} from 'lucide-react'

const features = [
  {
    id: 'regional-heatmaps',
    icon: MapPin,
    title: 'Regional Heatmaps',
    description: 'Spot demand hot-zones across Tier-2 & Tier-3 markets with interactive geographic visualization.',
    highlight: 'Visual Intelligence',
    color: 'blue'
  },
  {
    id: 'vernacular-sentiment',
    icon: MessageSquare,
    title: 'Vernacular Sentiment Analysis',
    description: 'Process Hindi, Tamil, Telugu, and Marathi consumer feedback with AI-powered language understanding.',
    highlight: '4 Languages',
    color: 'teal'
  },
  {
    id: 'price-intelligence',
    icon: DollarSign,
    title: 'Price Intelligence',
    description: 'Detect deal sensitivity and discount patterns to optimize pricing strategies for regional markets.',
    highlight: 'Smart Pricing',
    color: 'purple'
  },
  {
    id: 'cultural-calendar',
    icon: Calendar,
    title: 'Cultural Calendar',
    description: 'Plan campaigns around regional festivals and cultural events that drive purchase behavior.',
    highlight: 'Coming Soon',
    color: 'orange',
    comingSoon: true
  }
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 bg-gray-50">
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
            Powerful insights for
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> regional markets</span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Transform vernacular consumer behavior into actionable business intelligence 
            with our comprehensive analytics platform.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            const colorClasses = {
              blue: 'bg-blue-50 border-blue-200 text-blue-600',
              teal: 'bg-teal-50 border-teal-200 text-teal-600',
              purple: 'bg-purple-50 border-purple-200 text-purple-600',
              orange: 'bg-orange-50 border-orange-200 text-orange-600'
            }

            return (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                className={`relative group bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  feature.comingSoon ? 'opacity-75' : ''
                }`}
              >
                {/* Highlight Badge */}
                <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mb-4 ${
                  colorClasses[feature.color as keyof typeof colorClasses]
                }`}>
                  {feature.comingSoon && (
                    <Calendar className="mr-1 h-3 w-3" />
                  )}
                  {feature.highlight}
                </div>

                {/* Icon */}
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${
                  feature.color === 'blue' ? 'bg-blue-100' :
                  feature.color === 'teal' ? 'bg-teal-100' :
                  feature.color === 'purple' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    feature.color === 'blue' ? 'text-blue-600' :
                    feature.color === 'teal' ? 'text-teal-600' :
                    feature.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  }`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-6">
                  {feature.description}
                </p>

                {/* Coming Soon Overlay */}
                {feature.comingSoon && (
                  <div className="absolute inset-0 bg-white/40 rounded-2xl flex items-center justify-center">
                    <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                      Coming Soon
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-2 text-blue-600">
              <Brain className="h-5 w-5" />
              <span className="font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2 text-teal-600">
              <Users className="h-5 w-5" />
              <span className="font-medium">Regional Focus</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600">
              <Target className="h-5 w-5" />
              <span className="font-medium">Actionable Insights</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
