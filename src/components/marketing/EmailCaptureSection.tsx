'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function EmailCaptureSection() {
  const [email, setEmail] = useState('')
  const [isOptedIn, setIsOptedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !isOptedIn) return

    setIsLoading(true)

    try {
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search)
      const utm = {
        source: urlParams.get('utm_source'),
        medium: urlParams.get('utm_medium'),
        campaign: urlParams.get('utm_campaign'),
        term: urlParams.get('utm_term'),
        content: urlParams.get('utm_content')
      }

      const response = await fetch('/api/convert/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          utm,
          source: 'landing_page_email_capture'
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        toast({
          title: 'Success!',
          description: 'We\'ll send your sample report shortly. Check your email!',
        })
      } else {
        throw new Error('Failed to submit')
      }
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-24 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Thank you! Your sample report is on the way.
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Check your email for your personalized consumer insights report. 
              In the meantime, why not start your free trial?
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
            >
              Start Free Trial
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-teal-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              Get Your Free Market Analysis
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              See how your industry performs across Hindi, Tamil, Telugu, and Marathi markets. 
              Get a personalized consumer insights report delivered to your inbox.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="capture-email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Work Email Address
                </label>
                <Input
                  id="capture-email"
                  type="email"
                  placeholder="Enter your work email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base"
                  disabled={isLoading}
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-start space-x-3 text-left">
                <Checkbox
                  id="opt-in"
                  checked={isOptedIn}
                  onCheckedChange={(checked) => setIsOptedIn(!!checked)}
                  disabled={isLoading}
                />
                <label htmlFor="opt-in" className="text-sm text-gray-600 leading-5">
                  Send me industry-specific consumer insights and updates about regional market trends. 
                  You can unsubscribe at any time.
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={!email || !isOptedIn || isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Get My Free Report
                  </>
                )}
              </Button>

              {/* Benefits */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">What you&apos;ll receive:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Regional sentiment analysis
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Price sensitivity insights
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Vernacular conversation trends
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Actionable recommendations
                  </div>
                </div>
              </div>

              {/* Legal */}
              <p className="text-xs text-gray-500">
                By submitting this form, you agree to our{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                . We respect your privacy and will never share your information.
              </p>
            </form>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-blue-100 text-sm mb-4">Trusted by 500+ businesses across India</p>
            <div className="flex justify-center items-center space-x-6 text-blue-200 text-xs">
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                No spam, ever
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Unsubscribe anytime
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                GDPR compliant
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
