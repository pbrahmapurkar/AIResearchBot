'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  CheckCircle2, 
  TrendingUp,
  Users,
  Lightbulb,
  Target
} from 'lucide-react'
import { profileData } from '../data/profile-data'

export default function ExperienceTimeline() {
  const { experience } = profileData

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

  const getCompanyColor = (index: number) => {
    const colors = [
      'blue', 'purple', 'indigo', 'green'
    ]
    return colors[index % colors.length]
  }

  const getIconForExperience = (title: string) => {
    if (title.includes('Business Analyst')) return Briefcase
    if (title.includes('QA')) return CheckCircle2
    if (title.includes('SAP')) return TrendingUp
    return Users
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
              Professional Experience
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A diverse journey across industries, from supply chain optimization to cutting-edge OTT platforms and B2B eCommerce innovation.
            </p>
          </motion.div>

          {/* Experience Timeline */}
          <div className="relative">
            {/* Timeline Line - Desktop */}
            <div className="hidden lg:block absolute left-12 top-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500 rounded-full"></div>

            {/* Experience Items */}
            <div className="space-y-8">
              {experience.map((exp, index) => {
                const color = getCompanyColor(index)
                const IconComponent = getIconForExperience(exp.title)
                
                return (
                  <motion.div
                    key={exp.id}
                    variants={itemVariants}
                    className="relative"
                  >
                    {/* Timeline Dot - Desktop */}
                    <div className="hidden lg:block absolute left-9 top-8 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>

                    {/* Experience Card */}
                    <Card className={`ml-0 lg:ml-24 border-2 border-${color}-200 dark:border-${color}-800 hover:shadow-xl transition-all duration-300 overflow-hidden`}>
                      <CardHeader className={`bg-gradient-to-r from-${color}-50 to-${color}-100 dark:from-${color}-900/20 dark:to-${color}-800/20 border-b border-${color}-200 dark:border-${color}-800`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-${color}-500 to-${color}-600 flex items-center justify-center`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              {exp.title}
                            </CardTitle>
                            <div className="space-y-2">
                              <div className={`flex items-center gap-2 text-${color}-600 dark:text-${color}-400 font-semibold`}>
                                <Briefcase className="w-4 h-4" />
                                <span>{exp.company}</span>
                              </div>
                              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{exp.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{exp.period}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className={`bg-${color}-100 dark:bg-${color}-900 text-${color}-800 dark:text-${color}-300 font-semibold`}>
                            {exp.industry}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6">
                        <Collapsible>
                          <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2 transition-colors">
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                View Details & Achievements
                              </span>
                              <ChevronDown className="w-5 h-5 transform transition-transform data-[state=open]:rotate-180" />
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent className="space-y-6 mt-4">
                            {/* Responsibilities */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <Target className="w-5 h-5 text-gray-600" />
                                Key Responsibilities
                              </h4>
                              <ul className="space-y-2">
                                {exp.responsibilities.map((resp, respIndex) => (
                                  <li key={respIndex} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                                    <CheckCircle2 className={`w-4 h-4 mt-1 text-${color}-500 flex-shrink-0`} />
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Skills */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-gray-600" />
                                Technologies & Skills
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {exp.skills.map((skill, skillIndex) => (
                                  <Badge 
                                    key={skillIndex} 
                                    variant="outline" 
                                    className={`border-${color}-300 text-${color}-700 dark:border-${color}-700 dark:text-${color}-300`}
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Achievements */}
                            {exp.achievements && exp.achievements.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                  <TrendingUp className="w-5 h-5 text-gray-600" />
                                  Key Achievements
                                </h4>
                                <div className="space-y-3">
                                  {exp.achievements.map((achievement, achIndex) => (
                                    <div key={achIndex} className={`p-3 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border-l-4 border-${color}-400`}>
                                      <p className={`text-${color}-700 dark:text-${color}-300 font-medium`}>
                                        {achievement}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Experience Summary */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">6+</div>
                <div className="text-gray-600 dark:text-gray-300">Years Experience</div>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">4</div>
                <div className="text-gray-600 dark:text-gray-300">Industries</div>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-indigo-600 mb-2">3</div>
                <div className="text-gray-600 dark:text-gray-300">Countries</div>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
                <div className="text-gray-600 dark:text-gray-300">Technologies</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
