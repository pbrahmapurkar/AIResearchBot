'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Briefcase, 
  Code, 
  Rocket, 
  Heart,
  TrendingUp,
  Users,
  Target,
  Lightbulb
} from 'lucide-react'
import { profileData } from '../data/profile-data'

export default function SkillsGrid() {
  const { skills } = profileData

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  const categoryConfig = {
    business: {
      title: 'Business & Analysis',
      icon: Briefcase,
      color: 'blue',
      description: 'Strategic thinking, process optimization, and stakeholder management'
    },
    technical: {
      title: 'Technical Expertise',
      icon: Code,
      color: 'purple',
      description: 'Platforms, tools, and technologies for modern business solutions'
    },
    entrepreneurial: {
      title: 'Entrepreneurial Skills',
      icon: Rocket,
      color: 'green',
      description: 'Building sustainable ventures and innovative business models'
    },
    personal: {
      title: 'Personal Development',
      icon: Heart,
      color: 'pink',
      description: 'Life philosophy, mindfulness, and continuous learning'
    }
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof skills[number][]>)

  const getSkillStats = () => {
    const totalSkills = skills.length
    const categories = Object.keys(groupedSkills).length
    const businessSkills = groupedSkills.business?.length || 0
    const technicalSkills = groupedSkills.technical?.length || 0
    
    return { totalSkills, categories, businessSkills, technicalSkills }
  }

  const stats = getSkillStats()

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
              Skills & Expertise
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A comprehensive toolkit spanning business analysis, technology, entrepreneurship, and personal development.
            </p>
          </motion.div>

          {/* Skills Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalSkills}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Total Skills</div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.categories}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Categories</div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.businessSkills}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Business Skills</div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-pink-600 mb-2">{stats.technicalSkills}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Tech Skills</div>
            </div>
          </motion.div>

          {/* Skills Categories */}
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(categoryConfig).map(([categoryKey, config]) => {
              const categorySkills = groupedSkills[categoryKey] || []
              const IconComponent = config.icon
              
              return (
                <motion.div
                  key={categoryKey}
                  variants={itemVariants}
                  className="h-full"
                >
                  <Card className={`h-full border-2 border-${config.color}-200 dark:border-${config.color}-800 hover:shadow-xl transition-all duration-300 overflow-hidden`}>
                    <CardHeader className={`bg-gradient-to-r from-${config.color}-50 to-${config.color}-100 dark:from-${config.color}-900/20 dark:to-${config.color}-800/20`}>
                      <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-gray-100">{config.title}</div>
                          <div className={`text-sm font-normal text-${config.color}-600 dark:text-${config.color}-400 mt-1`}>
                            {categorySkills.length} skills
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {config.description}
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {categorySkills.map((skill, skillIndex) => (
                            <motion.div
                              key={skill.name}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: skillIndex * 0.1, duration: 0.3 }}
                              viewport={{ once: true }}
                            >
                              <Badge 
                                variant="secondary" 
                                className={`bg-${config.color}-100 dark:bg-${config.color}-900 text-${config.color}-800 dark:text-${config.color}-300 hover:bg-${config.color}-200 dark:hover:bg-${config.color}-800 transition-colors cursor-default text-sm py-1 px-3`}
                              >
                                {skill.name}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Category-specific highlights */}
                      {categoryKey === 'business' && (
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-semibold mb-2">
                            <Target className="w-4 h-4" />
                            Specialty Focus
                          </div>
                          <p className="text-blue-700 dark:text-blue-400 text-sm">
                            End-to-end product lifecycle management and agile delivery optimization
                          </p>
                        </div>
                      )}

                      {categoryKey === 'technical' && (
                        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-semibold mb-2">
                            <TrendingUp className="w-4 h-4" />
                            Current Focus
                          </div>
                          <p className="text-purple-700 dark:text-purple-400 text-sm">
                            AI-driven research platforms and advanced analytics solutions
                          </p>
                        </div>
                      )}

                      {categoryKey === 'entrepreneurial' && (
                        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold mb-2">
                            <Lightbulb className="w-4 h-4" />
                            Innovation
                          </div>
                          <p className="text-green-700 dark:text-green-400 text-sm">
                            Sustainable business models that create positive environmental and social impact
                          </p>
                        </div>
                      )}

                      {categoryKey === 'personal' && (
                        <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                          <div className="flex items-center gap-2 text-pink-800 dark:text-pink-300 font-semibold mb-2">
                            <Users className="w-4 h-4" />
                            Philosophy
                          </div>
                          <p className="text-pink-700 dark:text-pink-400 text-sm">
                            Integrating mindfulness and Eastern wisdom with modern professional challenges
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Skills Philosophy */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Holistic Skill Development
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                My approach to skill development is holistic – combining technical expertise with business acumen, 
                entrepreneurial thinking with mindful practices. Each skill is not just a tool, but a lens through 
                which to view and solve complex challenges.
              </p>
              <div className="flex justify-center items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Continuous Learning</span>
                <span>•</span>
                <span>Practical Application</span>
                <span>•</span>
                <span>Mindful Growth</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
