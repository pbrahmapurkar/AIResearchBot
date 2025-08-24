'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { TrendingUp, MapPin, User as UserIcon, ArrowRight, Brain, Search, BarChart, FileText, Lightbulb, Target, Zap, Menu, X } from 'lucide-react'
import { SignOutButton } from '@/components/auth/SignOutButton'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function TopNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const isAuthenticated = !!user
  const isAppRoute = pathname?.startsWith('/app')

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold text-lg">
              PB
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">Mister PB</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Product Links */}
            <div className="relative group">
              <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Products
                <ArrowRight className="ml-1 h-4 w-4 rotate-90 transition-transform group-hover:rotate-0" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4 space-y-3">
                  <Link href="/planning" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Brain className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">AI Mission Planning</div>
                      <div className="text-sm text-gray-500">Break down complex missions</div>
                    </div>
                  </Link>
                  <Link href="/research" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Search className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Research Tools</div>
                      <div className="text-sm text-gray-500">Web research & citations</div>
                    </div>
                  </Link>
                  <Link href="/insights" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Insights Dashboard</div>
                      <div className="text-sm text-gray-500">Real-time analytics</div>
                    </div>
                  </Link>
                  <Link href="/reports" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <FileText className="h-5 w-5 text-orange-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Report Generation</div>
                      <div className="text-sm text-gray-500">Comprehensive insights</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Solutions Links */}
            <div className="relative group">
              <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Solutions
                <ArrowRight className="ml-1 h-4 w-4 rotate-90 transition-transform group-hover:rotate-0" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4 space-y-3">
                  <Link href="/solutions/market-research" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <TrendingUp className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Market Research</div>
                      <div className="text-sm text-gray-500">Competitive analysis</div>
                    </div>
                  </Link>
                  <Link href="/solutions/content-strategy" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Lightbulb className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Content Strategy</div>
                      <div className="text-sm text-gray-500">Topic research & planning</div>
                    </div>
                  </Link>
                  <Link href="/solutions/technical-analysis" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Zap className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Technical Analysis</div>
                      <div className="text-sm text-gray-500">Tool comparisons</div>
                    </div>
                  </Link>
                  <Link href="/solutions/strategic-planning" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Target className="h-5 w-5 text-orange-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Strategic Planning</div>
                      <div className="text-sm text-gray-500">Business strategy</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Regional Focus */}
            <div className="relative group">
              <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Regional Focus
                <ArrowRight className="ml-1 h-4 w-4 rotate-90 transition-transform group-hover:rotate-0" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4 space-y-3">
                  <Link href="/regions/hindi" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="h-5 w-5 bg-blue-600 rounded mr-3"></div>
                    <div>
                      <div className="font-medium text-gray-900">Hindi Markets</div>
                      <div className="text-sm text-gray-500">UP, Bihar, Rajasthan</div>
                    </div>
                  </Link>
                  <Link href="/regions/tamil" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="h-5 w-5 bg-green-600 rounded mr-3"></div>
                    <div>
                      <div className="font-medium text-gray-900">Tamil Markets</div>
                      <div className="text-sm text-gray-500">Tamil Nadu, Karnataka</div>
                    </div>
                  </Link>
                  <Link href="/regions/telugu" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="h-5 w-5 bg-purple-600 rounded mr-3"></div>
                    <div>
                      <div className="font-medium text-gray-900">Telugu Markets</div>
                      <div className="text-sm text-gray-500">Andhra Pradesh, Telangana</div>
                    </div>
                  </Link>
                  <Link href="/regions/marathi" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="h-5 w-5 bg-orange-600 rounded mr-3"></div>
                    <div>
                      <div className="font-medium text-gray-900">Marathi Markets</div>
                      <div className="text-sm text-gray-500">Maharashtra, Goa</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Resources */}
            <Link href="/resources" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Resources
            </Link>

            {/* Pricing */}
            <Link href="#pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </Link>

            {/* About */}
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link href="/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {!isAppRoute && (
                  <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                    <Link href="/app/projects">
                      <MapPin className="h-4 w-4 mr-2" />
                      View Projects
                    </Link>
                  </Button>
                )}
                <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  <Link href="/app/onboarding">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Start Analysis
                  </Link>
                </Button>
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.user_metadata?.full_name || 'User'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/app/projects">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>My Projects</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <SignOutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Mobile Product Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Products</h3>
                <div className="space-y-2 pl-4">
                  <Link href="/planning" className="block text-sm text-gray-600 hover:text-blue-600">AI Mission Planning</Link>
                  <Link href="/research" className="block text-sm text-gray-600 hover:text-blue-600">Research Tools</Link>
                  <Link href="/insights" className="block text-sm text-gray-600 hover:text-blue-600">Insights Dashboard</Link>
                  <Link href="/reports" className="block text-sm text-gray-600 hover:text-blue-600">Report Generation</Link>
                </div>
              </div>

              {/* Mobile Solutions Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Solutions</h3>
                <div className="space-y-2 pl-4">
                  <Link href="/solutions/market-research" className="block text-sm text-gray-600 hover:text-blue-600">Market Research</Link>
                  <Link href="/solutions/content-strategy" className="block text-sm text-gray-600 hover:text-blue-600">Content Strategy</Link>
                  <Link href="/solutions/technical-analysis" className="block text-sm text-gray-600 hover:text-blue-600">Technical Analysis</Link>
                  <Link href="/solutions/strategic-planning" className="block text-sm text-gray-600 hover:text-blue-600">Strategic Planning</Link>
                </div>
              </div>

              {/* Mobile Regional Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Regional Focus</h3>
                <div className="space-y-2 pl-4">
                  <Link href="/regions/hindi" className="block text-sm text-gray-600 hover:text-blue-600">Hindi Markets</Link>
                  <Link href="/regions/tamil" className="block text-sm text-gray-600 hover:text-blue-600">Tamil Markets</Link>
                  <Link href="/regions/telugu" className="block text-sm text-gray-600 hover:text-blue-600">Telugu Markets</Link>
                  <Link href="/regions/marathi" className="block text-sm text-gray-600 hover:text-blue-600">Marathi Markets</Link>
                </div>
              </div>

              {/* Mobile Other Links */}
              <div className="space-y-2">
                <Link href="/resources" className="block text-sm text-gray-600 hover:text-blue-600">Resources</Link>
                <Link href="#pricing" className="block text-sm text-gray-600 hover:text-blue-600">Pricing</Link>
                <Link href="/about" className="block text-sm text-gray-600 hover:text-blue-600">About</Link>
              </div>

              {/* Mobile CTA Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {!isAuthenticated ? (
                  <>
                    <Link href="/signin" className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Sign In
                    </Link>
                    <Link href="/signup" className="block w-full text-center py-2 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-md text-sm font-medium hover:from-blue-700 hover:to-teal-700">
                      Get Started
                    </Link>
                  </>
                ) : (
                  <Link href="/app/projects" className="block w-full text-center py-2 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-md text-sm font-medium hover:from-blue-700 hover:to-teal-700">
                    View Projects
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
