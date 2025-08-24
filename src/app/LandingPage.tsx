'use client'

import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Languages, 
  IndianRupee, 
  BarChart3, 
  ScanSearch,
  Check,
  Linkedin,
  Twitter,
  Youtube,
  Mail
} from 'lucide-react'



// Hero Section Component
const Hero = () => (
  <section className="min-h-screen flex items-center bg-gradient-to-br from-slate-50 to-white">
    <div className="container mx-auto px-4 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight font-heading">
            Decode Tier-2 & Tier-3{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Demand with AI
            </span>
          </h1>
          <p className="text-xl text-slate-700 leading-relaxed">
            Understand vernacular consumer behavior, price sensitivity, and purchase patterns in Bharat&apos;s regional markets—faster, deeper, and smarter than ever before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Free Analysis
            </motion.button>
            <motion.a
              href="#sample"
              whileHover={{ x: 5 }}
              className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium text-lg transition-colors duration-300"
            >
              See Sample Insights
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative w-full h-96 lg:h-[500px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            {/* India Map Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <path
                  d="M200 50 C250 60 280 80 300 120 C320 160 330 200 320 250 C310 300 280 330 250 350 C220 370 180 380 150 370 C120 360 100 340 90 310 C80 280 80 250 90 220 C100 190 120 170 150 160 C180 150 200 50 200 50 Z"
                  fill="currentColor"
                  className="text-blue-600"
                />
              </svg>
            </div>
            
            {/* Floating Chart Card */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700">Positive Sentiment</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-3 bg-green-400 rounded"></div>
                    <span className="text-xs text-slate-600">UP: 78%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-3 bg-blue-400 rounded"></div>
                    <span className="text-xs text-slate-600">MP: 65%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-3 bg-green-400 rounded"></div>
                    <span className="text-xs text-slate-600">Bihar: 82%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)

// Social Proof Section Component
const SocialProof = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-heading">
          Trusted by Data-Driven Teams Across Bharat
        </h2>
      </motion.div>

      {/* Logos Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16"
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-center">
            <div className="w-24 h-16 bg-slate-200 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
              <span className="text-slate-500 font-medium">Logo {i}</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-8"
      >
        {[
          {
            text: "Mister PB identified a regional demand spike in Uttar Pradesh three weeks before our competitors. Invaluable.",
            name: "Priya Sharma",
            title: "Head of Strategy, FMCG Brand",
            avatar: "PS"
          },
          {
            text: "The vernacular insights helped us tailor our pricing strategy perfectly for Madhya Pradesh markets.",
            name: "Rajesh Kumar",
            title: "Marketing Director, Consumer Goods",
            avatar: "RK"
          },
          {
            text: "Finally, a platform that understands the real India beyond metros. Game-changing insights.",
            name: "Anita Patel",
            title: "VP Research, Retail Chain",
            avatar: "AP"
          }
        ].map((testimonial, index) => (
          <div key={index} className="bg-slate-50 p-6 rounded-xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {testimonial.avatar}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                <p className="text-sm text-slate-600">{testimonial.title}</p>
              </div>
            </div>
            <p className="text-slate-700 italic">&ldquo;{testimonial.text}&rdquo;</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
)

// Features Section Component
const Features = () => (
  <section className="py-20 bg-slate-50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-heading">
          Go Beyond Metro Myths
        </h2>
        <p className="text-xl text-slate-700 max-w-3xl mx-auto">
          Get actionable, vernacular intelligence on what really drives consumers in India&apos;s heartland.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {[
          {
            icon: Languages,
            title: "Regional Consumer Insights",
            description: "Deep dive into vernacular consumer behavior across Tier-2 & Tier-3 cities"
          },
          {
            icon: IndianRupee,
            title: "Price Sensitivity Mapping",
            description: "Understand regional price elasticity and optimal pricing strategies"
          },
          {
            icon: BarChart3,
            title: "Purchase Pattern Discovery",
            description: "Uncover buying cycles, seasonal trends, and market dynamics"
          },
          {
            icon: ScanSearch,
            title: "Competitive Analysis",
            description: "Track competitor moves and identify market opportunities"
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
            <p className="text-slate-700 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
)

// How It Works Section Component
const HowItWorks = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-heading">
          From Question to Insight in Minutes
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-8 relative"
      >
        {/* Connecting Lines */}
        <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform -translate-y-1/2"></div>
        
        {[
          {
            step: "1",
            title: "Define Your Query",
            description: "Input your category, regions, and competitors of interest."
          },
          {
            step: "2",
            title: "AI Does The Heavy Lifting",
            description: "Our AI (Tavily + OpenAI) scours vernacular sources and synthesizes the data."
          },
          {
            step: "3",
            title: "Get Actionable Reports",
            description: "Receive clear, cited insights and exportable PDF/CSV reports."
          }
        ].map((step, index) => (
          <div key={index} className="text-center relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              {step.step}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
            <p className="text-slate-700 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
)

// Pricing Section Component
const Pricing = () => (
  <section id="pricing" className="py-20 bg-slate-50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-heading">
          Plans for Every Stage of Your Bharat Journey
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {/* Starter Plan */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Starter</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900">$29</span>
            <span className="text-slate-600">/mo</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-slate-700">50 reports/month</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-slate-700">1 user</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-slate-700">Basic insights</span>
            </li>
          </ul>
          <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors duration-300">
            Start Free Trial
          </button>
        </div>

        {/* Pro Plan - Highlighted */}
        <div className="bg-white p-8 rounded-xl shadow-xl border-2 border-blue-600 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Most Popular
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Pro</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900">$99</span>
            <span className="text-slate-600">/mo</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-slate-700">Unlimited reports</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-slate-700">3 users</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-slate-700">API access</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-slate-700">Priority support</span>
            </li>
          </ul>
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
            Start Free Trial
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Enterprise</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900">Custom</span>
            <span className="text-slate-600"> pricing</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-slate-700">Dedicated support</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-slate-700">Custom integrations</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-slate-700">White-label reports</span>
            </li>
          </ul>
          <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors duration-300">
            Contact Sales
          </button>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center text-slate-600 mt-8"
      >
        All plans include a 7-day free trial. No credit card required.
      </motion.p>
    </div>
  </section>
)

// Final CTA Section Component
const FinalCTA = () => (
  <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-heading">
          Ready to Decode Bharat&apos;s Consumer Markets?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join leading brands already unlocking growth in Tier-2 and Tier-3.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 mb-4"
        >
          Start Your Free Analysis
        </motion.button>
        <p className="text-blue-100 text-lg">
          No credit card required. Setup in 2 minutes.
        </p>
      </motion.div>
    </div>
  </section>
)

// Footer Component
const Footer = () => (
  <footer className="bg-slate-900 text-white py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        {/* Company */}
        <div>
          <h3 className="text-xl font-bold mb-4">Mister PB</h3>
          <p className="text-slate-400 mb-4">
            AI-powered consumer insights for Tier-2 & Tier-3 India markets
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#sample" className="hover:text-white transition-colors">Sample Report</a></li>
            <li><a href="#api" className="hover:text-white transition-colors">API</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
          </ul>
        </div>
      </div>

      {/* Contact & Social */}
      <div className="border-t border-slate-800 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Mail className="w-5 h-5 text-slate-400" />
            <span className="text-slate-400">support@misterpb.in</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
)

// Main Landing Page Component
export default function LandingPage() {
  return (
    <main>
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  )
}
