'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    content: "Mister PB transformed how we understand our regional customers. The vernacular sentiment analysis revealed insights we never knew existed in Hindi and Tamil markets.",
    author: "Rajesh Kumar",
    title: "Marketing Director",
    company: "FreshMart Foods",
    rating: 5,
    result: "43% increase in Tier-2 market penetration"
  },
  {
    id: 2,
    content: "The price sensitivity analysis helped us optimize our pricing strategy across different regions. We now understand exactly what drives purchase decisions in each market.",
    author: "Priya Sharma",
    title: "Regional Head",
    company: "QuickBite Snacks",
    rating: 5,
    result: "₹2.3 CR additional revenue in 6 months"
  },
  {
    id: 3,
    content: "Finally, a platform that understands the nuances of regional Indian markets. The cultural calendar feature helps us time our campaigns perfectly with local festivals.",
    author: "Arjun Patel",
    title: "Brand Manager",
    company: "HomeTaste Products",
    rating: 5,
    result: "67% improvement in campaign ROI"
  }
]

export default function TestimonialCarousel() {
  return (
    <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-teal-900/20" />
      <div className="absolute -top-4 -right-4 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/10 to-teal-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by regional
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent"> business leaders</span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
            See how companies are using Mister PB to unlock growth in India&apos;s Tier-2 & Tier-3 markets
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-blue-400 mb-4" />

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-200 mb-6 leading-relaxed">
                &quot;{testimonial.content}&quot;
              </blockquote>

              {/* Result Highlight */}
              <div className="bg-gradient-to-r from-blue-500/20 to-teal-500/20 border border-blue-500/30 rounded-lg p-3 mb-6">
                <p className="text-blue-200 text-sm font-medium">
                  Result: {testimonial.result}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-gray-400 text-sm">
                    {testimonial.title}, {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">500+</div>
              <div className="text-gray-400 text-sm">Businesses</div>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400">23</div>
              <div className="text-gray-400 text-sm">States</div>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">4.8/5</div>
              <div className="text-gray-400 text-sm">Rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
