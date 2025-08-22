'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Leaf, ShoppingBag, Target, TrendingUp, Users } from 'lucide-react'
import { profileData } from '../data/profile-data'

export default function VentureSpotlight() {
  const { ventures } = profileData
  const eHypermart = ventures.eHypermart

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Entrepreneurship Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Building bridges between sustainability, technology, and youth culture through conscious entrepreneurship.
            </p>
          </motion.div>

          {/* Main Venture Card */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 overflow-hidden shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-3xl md:text-4xl font-bold mb-2">
                      {eHypermart.name}
                    </CardTitle>
                    <p className="text-xl text-green-100">
                      {eHypermart.tagline}
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="bg-white text-green-600 hover:bg-green-50 font-semibold"
                  >
                    <a
                      href={eHypermart.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Visit eHypermart
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Mission & Description */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                      <Target className="w-6 h-6 text-green-600" />
                      Mission
                    </h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      {eHypermart.mission}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {eHypermart.description}
                    </p>
                  </div>

                  {/* Products & Platform */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                      <ShoppingBag className="w-6 h-6 text-green-600" />
                      Product Range
                    </h3>
                    <div className="grid gap-3 mb-6">
                      {eHypermart.products.map((product, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                          <Leaf className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">{product}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Platform & Philosophy */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Platform
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {eHypermart.platform}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      Philosophy
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {eHypermart.philosophy}
                    </p>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Key Achievements
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {eHypermart.achievements.map((achievement, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 p-3 text-sm font-medium rounded-lg"
                      >
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Explore Sustainable Fashion
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Discover eco-conscious fashion that doesn&apos;t compromise on style or values.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <a
                      href={eHypermart.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Shop at eHypermart India
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
