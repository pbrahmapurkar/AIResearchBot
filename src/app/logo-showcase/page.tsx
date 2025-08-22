import { Metadata } from 'next'
import LogoShowcase from '@/components/logos/LogoShowcase'

export const metadata: Metadata = {
  title: 'MisterPB.in Logo Design System | AI Testing Platform',
  description: 'Modern, minimal, and professional logo design for MisterPB.in - an AI-powered testing and research platform.',
  keywords: 'MisterPB logo, AI testing platform, brand design, logo system',
}

export default function LogoShowcasePage() {
  return <LogoShowcase />
}
