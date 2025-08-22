'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, MapPin } from 'lucide-react'
import { profileData } from '../data/profile-data'

export default function EducationTimeline() {
  const { education } = profileData

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
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Educational Foundation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From engineering fundamentals to advanced analytics, each degree shaped a unique perspective on problem-solving and innovation.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500 rounded-full"></div>

            {/* Education Items */}
            <div className="space-y-12">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  variants={itemVariants}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>

                  {/* Card */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <CardContent className="p-8">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <GraduationCap className="w-6 h-6 text-purple-600" />
                              <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">
                                {edu.period}
                              </Badge>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                              {edu.degree}
                            </h3>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold">
                                <GraduationCap className="w-4 h-4" />
                                <span>{edu.institution}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span>{edu.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {edu.description}
                        </p>

                        {/* Additional Details */}
                        {edu.id === 'queens-university' && (
                          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Key Focus Areas</h4>
                            <div className="flex flex-wrap gap-2">
                              {['Data Science', 'Business Intelligence', 'Analytics Strategy', 'Industry Partnerships'].map((skill) => (
                                <Badge key={skill} variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {edu.id === 'vit-mumbai' && (
                          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Foundation Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {['Problem Solving', 'Analytical Thinking', 'Technical Foundation', 'Engineering Principles'].map((skill) => (
                                <Badge key={skill} variant="outline" className="border-indigo-300 text-indigo-700 dark:border-indigo-700 dark:text-indigo-300">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Year Badge (Mobile) */}
                  <div className="md:hidden absolute -left-4 top-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {edu.period.split('–')[0].slice(-2)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">2</div>
                <div className="text-gray-600 dark:text-gray-300">Degrees Earned</div>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
                <div className="text-gray-600 dark:text-gray-300">Countries Studied</div>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-indigo-600 mb-2">6+</div>
                <div className="text-gray-600 dark:text-gray-300">Years of Learning</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
