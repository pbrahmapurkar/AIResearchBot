'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  ChevronDown, 
  Home, 
  FolderOpen, 
  FileText, 
  Plus,
  Search
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/app', icon: Home },
  { name: 'Projects', href: '/app/projects', icon: FolderOpen },
  { name: 'Reports', href: '/reports-page', icon: FileText },
  { name: 'Search', href: '/search-page', icon: Search },
  { name: 'Onboarding', href: '/onboarding-page', icon: Plus },
]

export function Sidebar() {
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Mister PB</h1>
        <p className="text-sm text-gray-500">AI-Powered Insights</p>
      </div>

      {/* Project Switcher */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
          >
            <span className="truncate">All Projects</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          {isProjectMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-2">
                <div className="flex items-center gap-2 p-2 text-sm text-gray-600 border-b border-gray-100">
                  <Search className="h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="flex-1 bg-transparent outline-none"
                  />
                </div>
                <div className="py-2">
                  <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recent Projects
                  </div>
                  <div className="mt-1 space-y-1">
                    <button className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                      Consumer Insights Q4
                    </button>
                    <button className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                      Regional Analysis
                    </button>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Need help?</p>
          <p className="text-blue-600">Contact your administrator</p>
        </div>
      </div>
    </div>
  )
}
