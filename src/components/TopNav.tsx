'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { TrendingUp, MapPin } from 'lucide-react'
import MisterPBLogo from '@/components/logos/MisterPBLogo'

export default function TopNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <MisterPBLogo variant="horizontal" size="md" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === '/' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/app/projects" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname?.startsWith('/app/projects') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Projects
            </Link>
            <Link 
              href="/app/reports" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname?.startsWith('/app/reports') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Reports
            </Link>
            <Link 
              href="/insights" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === '/insights' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Insights
            </Link>
            <Link 
              href="/about" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === '/about' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              About
            </Link>
            <Link 
              href="/settings" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === '/settings' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Settings
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link href="/app/projects">
                <MapPin className="h-4 w-4 mr-2" />
                View Projects
              </Link>
            </Button>
            <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
              <Link href="/app/onboarding">
                <TrendingUp className="h-4 w-4 mr-2" />
                Start Analysis
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
