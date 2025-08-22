import HeroSection from '@/components/marketing/HeroSection'
import FeatureGrid from '@/components/marketing/FeatureGrid'
import HowItWorksSection from '@/components/marketing/HowItWorksSection'
import TestimonialCarousel from '@/components/marketing/TestimonialCarousel'
import EmailCaptureSection from '@/components/marketing/EmailCaptureSection'
import FAQSection from '@/components/marketing/FAQSection'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureGrid />
      <HowItWorksSection />
      <TestimonialCarousel />
      <EmailCaptureSection />
      <FAQSection />
      <MarketingFooter />
    </>
  )
}
