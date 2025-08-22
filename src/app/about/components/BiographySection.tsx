'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Lightbulb, Globe, Heart } from 'lucide-react'
import { profileData } from '../data/profile-data'

export default function BiographySection() {
  const { personal } = profileData

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              The Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From engineering corridors to entrepreneurial ventures, every step has shaped a unique perspective on technology and human potential.
            </p>
          </motion.div>

          {/* Biography Cards */}
          <div className="grid gap-8 md:gap-12">
            {/* Introduction */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">
                        The Foundation
                      </h3>
                      <p className="text-lg text-blue-700 dark:text-blue-400 leading-relaxed">
                        {personal.bio.introduction}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Journey */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-300 mb-4">
                        The Evolution
                      </h3>
                      <p className="text-lg text-purple-700 dark:text-purple-400 leading-relaxed">
                        {personal.bio.journey}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Philosophy */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mb-4">
                        The Philosophy
                      </h3>
                      <p className="text-lg text-indigo-700 dark:text-indigo-400 leading-relaxed">
                        {personal.bio.philosophy}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quote Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center mt-16 py-12 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 rounded-2xl"
          >
            <blockquote className="text-2xl md:text-3xl font-light italic text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              &quot;Mister PB democratizes consumer insights for India&apos;s real markets - the Tier-2 and Tier-3 cities where authentic consumer behavior drives economic growth. Understanding regional consumers in their native languages is key to building successful businesses in modern India.&quot;
            </blockquote>
            <cite className="block mt-4 text-lg font-medium text-gray-500 dark:text-gray-400">
              — Pratik Prakash Brahmapurkar, Creator of Mister PB
            </cite>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
