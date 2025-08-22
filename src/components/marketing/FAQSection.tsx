'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    id: 1,
    question: "Do I need a credit card to start?",
    answer: "No! You can start your 14-day free trial without providing any payment information. You only need to add a payment method when you decide to continue after your trial period."
  },
  {
    id: 2,
    question: "What data sources do you analyze?",
    answer: "We analyze consumer conversations from social media platforms, review sites, forums, and regional news sources. Our AI processes Hindi, Tamil, Telugu, and Marathi content to extract meaningful insights about consumer behavior and sentiment."
  },
  {
    id: 3,
    question: "How is my data kept secure?",
    answer: "We follow enterprise-grade security practices including data encryption, secure access controls, and compliance with Indian data protection regulations. Your data is processed only for insights generation and is never shared with third parties."
  },
  {
    id: 4,
    question: "Which languages are supported?",
    answer: "Currently, we support Hindi, Tamil, Telugu, and Marathi - covering over 70% of India's vernacular digital conversations. We're working on adding more regional languages based on user demand."
  },
  {
    id: 5,
    question: "How accurate are the insights?",
    answer: "Our AI models achieve 78-85% accuracy in sentiment analysis and 92% accuracy in regional classification. We continuously improve our models using real market feedback and validation from our users."
  },
  {
    id: 6,
    question: "Can I export the reports?",
    answer: "Yes! All insights can be exported as PDF reports, CSV data files, or PowerPoint presentations. You can also schedule automated reports to be delivered to your team weekly or monthly."
  },
  {
    id: 7,
    question: "Do you offer custom analysis?",
    answer: "Absolutely! Our enterprise plans include custom analysis for specific industries, regions, or campaigns. We can also train models for your specific brand or product categories."
  },
  {
    id: 8,
    question: "What's included in the free trial?",
    answer: "The 14-day free trial includes access to all core features: regional heatmaps, vernacular sentiment analysis, price intelligence, and basic reporting. You can analyze up to 1,000 conversations during the trial period."
  }
]

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <section id="faq" className="py-24 bg-white">
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
            Frequently asked
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> questions</span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Mister PB and regional consumer insights
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="mx-auto max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-gray-50 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <button
                  className="w-full px-6 py-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl"
                  onClick={() => toggleItem(faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openItems.includes(faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {openItems.includes(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you understand how Mister PB can transform your regional market strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@misterpb.in"
                className="inline-flex items-center justify-center px-6 py-3 border border-blue-300 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                Email Support
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-teal-700 transition-colors"
              >
                Schedule Demo
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
