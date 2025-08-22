'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { 
  Linkedin, 
  ExternalLink, 
  Book, 
  Heart,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { profileData } from '../data/profile-data'

export default function AboutFooter() {
  const { socialLinks, quote } = profileData

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

  const linkedinLink = socialLinks.find(link => link.name === 'LinkedIn')
  const eHypermartLink = socialLinks.find(link => link.name === 'eHypermart India')
  const bookLink = socialLinks.find(link => link.name === 'Amazon Author')

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Inspirational Quote */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
              <blockquote className="text-2xl md:text-4xl font-light leading-relaxed mb-8 text-gray-100">
                &quot;{quote}&quot;
              </blockquote>
              <cite className="text-xl text-gray-300 font-medium">
                — Pratik Prakash Brahmapurkar
              </cite>
            </div>
          </motion.div>

          {/* Action Cards */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Connect Card */}
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Linkedin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Let&apos;s Connect</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Join my professional network and stay updated on projects, insights, and opportunities for collaboration.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full bg-white text-blue-600 hover:bg-gray-100"
                >
                  <a
                    href={linkedinLink?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Connect on LinkedIn
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Venture Card */}
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Sustainable Fashion</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Explore eco-conscious fashion at eHypermart India – where sustainability meets style and purpose.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full bg-white text-green-600 hover:bg-gray-100"
                >
                  <a
                    href={eHypermartLink?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Visit eHypermart India
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Book Card */}
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Book className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Transformative Memoir</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Discover the journey of transformation through yoga, mindfulness, and self-discovery in my latest book.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full bg-white text-amber-600 hover:bg-gray-100"
                >
                  <a
                    href={bookLink?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Buy on Amazon
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Final Message */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                Ready to Build Something Meaningful Together?
              </h3>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Whether you&apos;re looking for business analysis expertise, entrepreneurial collaboration, 
                or simply want to connect with someone who believes in the power of mindful innovation – 
                I&apos;d love to hear from you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <a
                    href={linkedinLink?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <Linkedin className="w-5 h-5" />
                    Let&apos;s Connect
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-3"
                >
                  <Link href="/" className="flex items-center gap-2" aria-label="Go to Home">
                    Try AI Mission Planner
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <div className="flex justify-center items-center gap-4 text-white/60">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/30"></div>
              <Sparkles className="w-6 h-6" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/30"></div>
            </div>
            <p className="mt-4 text-white/80 text-sm">
              Built with passion, purpose, and a commitment to meaningful innovation.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
