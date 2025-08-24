import { Metadata } from 'next'
import TopNavMarketing from '@/components/marketing/TopNavMarketing'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mister PB - AI-Powered Consumer Insights for Bharat\'s Tier-2 & Tier-3 Markets',
  description: 'Decode vernacular behavior, price sensitivity, and purchase patterns across Hindi, Tamil, Telugu, and Marathi audiences with AI-powered consumer insights.',
  keywords: 'consumer insights, AI analytics, tier 2 tier 3 India, vernacular analysis, regional market research, Hindi Tamil Telugu Marathi, price sensitivity, purchase patterns',
  authors: [{ name: 'Pratik Prakash Brahmapurkar' }],
  creator: 'Pratik Prakash Brahmapurkar',
  openGraph: {
    title: 'Mister PB - AI Consumer Insights for Regional India',
    description: 'Decode vernacular consumer behavior across Tier-2 & Tier-3 markets',
    url: 'https://misterpb.in',
    siteName: 'Mister PB',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mister PB - AI Consumer Insights Platform',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mister PB - AI Consumer Insights for Regional India',
    description: 'Decode vernacular consumer behavior across Tier-2 & Tier-3 markets',
    images: ['/twitter-image.png'],
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

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-white`}>
      <TopNavMarketing />
      <main>{children}</main>
    </div>
  )
}
