'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Menu, 
  TrendingUp,
  X 
} from 'lucide-react'
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

          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            
            <Link href="/search-page" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Search
            </Link>
            
            <Link href="/onboarding-page" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Onboarding
            </Link>
            
            <Link href="/reports-page" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Reports
            </Link>
            
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
          </div>

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
              {/* Mobile Main Links */}
              <div className="space-y-2">
                <Link href="/" className="block text-sm text-gray-600 hover:text-blue-600">Home</Link>
                <Link href="/search-page" className="block text-sm text-gray-600 hover:text-blue-600">Search</Link>
                <Link href="/onboarding-page" className="block text-sm text-gray-600 hover:text-blue-600">Onboarding</Link>
                <Link href="/reports-page" className="block text-sm text-gray-600 hover:text-blue-600">Reports</Link>
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
