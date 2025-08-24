'use client'

import HeroSection from '@/components/marketing/HeroSection'
import FeatureGrid from '@/components/marketing/FeatureGrid'
import HowItWorksSection from '@/components/marketing/HowItWorksSection'
import TestimonialCarousel from '@/components/marketing/TestimonialCarousel'
import EmailCaptureSection from '@/components/marketing/EmailCaptureSection'
import FAQSection from '@/components/marketing/FAQSection'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import TopNavMarketing from '@/components/marketing/TopNavMarketing'

export const dynamic = 'force-dynamic'

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-white">
      <TopNavMarketing />
      <main>
        <HeroSection />
        <FeatureGrid />
        <HowItWorksSection />
        <TestimonialCarousel />
        <EmailCaptureSection />
        <FAQSection />
        <MarketingFooter />
      </main>
    </div>
  )
}
