import type { Metadata } from 'next'
import HeroSection from './components/HeroSection'
import BiographySection from './components/BiographySection'
import VentureSpotlight from './components/VentureSpotlight'
import EducationTimeline from './components/EducationTimeline'
import ExperienceTimeline from './components/ExperienceTimeline'
import AuthorSection from './components/AuthorSection'
import SkillsGrid from './components/SkillsGrid'
import AboutFooter from './components/AboutFooter'

export const metadata: Metadata = {
  title: 'About Pratik Prakash Brahmapurkar | Creator of Mister PB Regional Insights Platform',
  description: 'Meet Pratik Prakash Brahmapurkar: Business Analyst, Entrepreneur behind eHypermart India, and Author of "Asanas in the Ganges". Creator of Mister PB - AI-powered regional consumer insights for Tier-2/3 India.',
  keywords: 'Pratik Brahmapurkar, Business Analyst, Mister PB, Regional Consumer Insights, Tier-2 India, eHypermart India, Entrepreneur, Author, Business Analytics, Sustainable Fashion',
  authors: [{ name: 'Pratik Prakash Brahmapurkar' }],
  creator: 'Pratik Prakash Brahmapurkar',
  openGraph: {
    title: 'About Pratik Prakash Brahmapurkar | Creator of Mister PB Regional Insights Platform',
    description: 'Meet Pratik Prakash Brahmapurkar: Business Analyst, Entrepreneur behind eHypermart India, and Author of "Asanas in the Ganges". Creator of Mister PB - AI-powered regional consumer insights for Tier-2/3 India.',
    type: 'profile',
    locale: 'en_US',
    siteName: 'Mister PB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Pratik Prakash Brahmapurkar | Creator of Mister PB Regional Insights Platform',
    description: 'Meet Pratik Prakash Brahmapurkar: Business Analyst, Entrepreneur behind eHypermart India, and Author of "Asanas in the Ganges". Creator of Mister PB - AI-powered regional consumer insights for Tier-2/3 India.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Personal Journey */}
      <BiographySection />
      
      {/* Featured Venture */}
      <VentureSpotlight />
      
      {/* Education Timeline */}
      <EducationTimeline />
      
      {/* Professional Experience */}
      <ExperienceTimeline />
      
      {/* Author Spotlight */}
      <AuthorSection />
      
      {/* Skills & Expertise */}
      <SkillsGrid />
      
      {/* Footer */}
      <AboutFooter />
    </main>
  )
}
