'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Book, ExternalLink, Star, Quote, Calendar, Award } from 'lucide-react'
import { profileData } from '../data/profile-data'

export default function AuthorSection() {
  const { publications } = profileData
  const book = publications.book

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
    <section className="py-20 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/20">
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
              Published Author
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Sharing wisdom through words, bridging Eastern philosophy with modern life challenges.
            </p>
          </motion.div>

          {/* Main Book Card */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5 gap-0">
                  {/* Book Cover Section */}
                  <div className="md:col-span-2 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-8 md:p-12 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="w-32 h-40 md:w-48 md:h-60 bg-white/20 backdrop-blur-sm rounded-lg shadow-2xl flex items-center justify-center mb-6 border border-white/30">
                        <Book className="w-16 h-16 md:w-20 md:h-20 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {book.year}
                      </Badge>
                    </div>
                  </div>

                  {/* Book Details Section */}
                  <div className="md:col-span-3 p-8 md:p-12">
                    <div className="space-y-6">
                      {/* Title & Genre */}
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                          {book.title}
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                          <Badge variant="outline" className="border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300">
                            <Calendar className="w-3 h-3 mr-1" />
                            {book.year}
                          </Badge>
                          <Badge variant="outline" className="border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300">
                            <Book className="w-3 h-3 mr-1" />
                            {book.genre}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border-l-4 border-amber-400">
                        <Quote className="w-6 h-6 text-amber-600 mb-3" />
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                          {book.description}
                        </p>
                      </div>

                      {/* Themes */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Star className="w-5 h-5 text-amber-600" />
                          Core Themes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {book.themes.map((theme, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300"
                            >
                              {theme}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Achievements */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-600" />
                          Recognition & Impact
                        </h4>
                        <div className="space-y-2">
                          {book.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                              <Star className="w-4 h-4 mt-1 text-amber-500 flex-shrink-0" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="pt-4">
                        <Button
                          asChild
                          size="lg"
                          className="w-full md:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <a
                            href={book.amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3"
                          >
                            <Book className="w-5 h-5" />
                            Buy on Amazon
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Inspirational Quote */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border-2 border-amber-200 dark:border-amber-800">
              <Quote className="w-12 h-12 text-amber-600 mx-auto mb-6" />
              <blockquote className="text-xl md:text-2xl font-light italic text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                &quot;In every asana, in every breath, in every moment of stillness, we discover not just flexibility of body, but resilience of spirit. This book is my offering to anyone seeking transformation through the ancient wisdom of yoga.&quot;
              </blockquote>
              <cite className="text-lg font-medium text-amber-600 dark:text-amber-400">
                — From the pages of &quot;Asanas in the Ganges&quot;
              </cite>
            </div>
          </motion.div>

          {/* Additional Call to Action */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Begin Your Own Journey
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Whether you&apos;re navigating corporate challenges, seeking personal transformation, or exploring mindfulness practices, this memoir offers insights from both Eastern wisdom and Western experiences.
              </p>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-amber-400 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/20"
              >
                <a
                  href={book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Book className="w-5 h-5" />
                  Read Sample Chapter
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
