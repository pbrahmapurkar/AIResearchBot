'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Twitter, Linkedin, Github } from 'lucide-react'
import MisterPBLogo from '@/components/logos/MisterPBLogo'

const footerSections = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '/#features' },
      { name: 'How it Works', href: '/#how-it-works' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'API Documentation', href: '/docs' },
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Case Studies', href: '/case-studies' },
      { name: 'Webinars', href: '/webinars' },
      { name: 'Regional Insights', href: '/insights' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Security', href: '/security' },
    ]
  }
]

export default function MarketingFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <MisterPBLogo variant="horizontal" size="lg" />
            <p className="text-gray-400 leading-relaxed max-w-md">
              AI-powered consumer insights for Bharat&apos;s Tier-2 & Tier-3 markets. 
              Decode vernacular behavior and unlock regional growth opportunities.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>hello@misterpb.in</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/misterpb"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/company/misterpb"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/misterpb"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Links Columns */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-400 text-sm">
              <p>© 2024 Mister PB. All rights reserved.</p>
              <p>Made with ❤️ for Bharat&apos;s entrepreneurs</p>
            </div>
            
            {/* Language Badges */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Languages:</span>
              <div className="flex space-x-1">
                <span className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded">हिंदी</span>
                <span className="px-2 py-1 bg-teal-900 text-teal-200 text-xs rounded">தமிழ்</span>
                <span className="px-2 py-1 bg-purple-900 text-purple-200 text-xs rounded">తెలుగు</span>
                <span className="px-2 py-1 bg-orange-900 text-orange-200 text-xs rounded">मराठी</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
