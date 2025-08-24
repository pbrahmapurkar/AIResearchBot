'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Linkedin, ExternalLink, MapPin, BookOpen } from 'lucide-react'
import { profileData } from '../data/profile-data'
import Image from 'next/image'

export default function HeroSection() {
  const { personal, socialLinks } = profileData

  const linkedinLink = socialLinks.find(link => link.name === 'LinkedIn')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background with Multiple Layers */}
      
      {/* Base Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"></div>
      
      {/* Animated Geometric Patterns */}
      <div className="absolute inset-0 opacity-30">
        {/* Floating Circles */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
        />
        
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-teal-400/20 to-blue-400/20 rounded-full blur-xl"
        />
        
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-32 left-32 w-20 h-20 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
        />
      </div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Floating Business Icons */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-32 right-20 text-blue-400/20 text-6xl"
        >
          📊
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-40 left-16 text-purple-400/20 text-5xl"
        >
          🚀
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 3, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-60 left-1/4 text-teal-400/20 text-4xl"
        >
          💡
        </motion.div>
      </div>
      
      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
      
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Professional Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative">
              {/* Main Profile Avatar */}
              <Avatar className="w-40 h-40 md:w-48 md:h-48 mx-auto border-4 border-white shadow-2xl shadow-purple-500/20">
                <AvatarImage src={personal.avatar} alt={personal.name} />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {personal.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              {/* Book Image Overlay - Top Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, x: 20, y: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -top-4 -right-4 md:-top-6 md:-right-6"
              >
                <div className="w-16 h-20 md:w-20 md:h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-lg border-2 border-white transform rotate-12 hover:rotate-0 transition-transform duration-300">
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs md:text-sm p-2 text-center">
                    📚
                    <br />
                    Book
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-2xl md:text-3xl font-light text-gray-700 mb-4"
          >
            About the Creator
          </motion.h1>

          {/* Name with gradient */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            {personal.name}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed"
          >
            {personal.title}
          </motion.p>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-gray-500 mb-8"
          >
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{personal.location}</span>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mb-12"
          >
            {linkedinLink && (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <a
                  href={linkedinLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <Linkedin className="w-6 h-6" />
                  Connect on LinkedIn
                </a>
              </Button>
            )}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Book Showcase Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center gap-4">
            {/* Book Cover */}
            <div className="relative">
              {profileData.publications.book.coverImage ? (
                <Image
                  src={profileData.publications.book.coverImage}
                  alt={profileData.publications.book.title}
                  width={80}
                  height={112}
                  className="rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-20 h-28 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-center p-2">
                  <BookOpen className="w-8 h-8" />
                </div>
              )}
            </div>
            
            {/* Book Details */}
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-lg">{profileData.publications.book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{profileData.publications.book.description.split('.')[0]}.</p>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                <a
                  href={profileData.publications.book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Amazon
                </a>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
