'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { TrendingUp, MapPin, User, Shield } from 'lucide-react'
import MisterPBLogo from '@/components/logos/MisterPBLogo'
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
  // const [loading, setLoading] = useState(true) // Unused for now
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
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
            <MisterPBLogo variant="horizontal" size="md" />
          </Link>

          {/* Navigation Links - Show different links based on auth state */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              // Public navigation
              <>
                <Link 
                  href="/" 
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname === '/' ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname === '/about' ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  About
                </Link>
              </>
            ) : (
              // Authenticated navigation
              <>
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
                  href="/settings" 
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname === '/settings' ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Settings
                </Link>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              // Public actions
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/signin">
                    <Shield className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  <Link href="/signin">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Get Started
                  </Link>
                </Button>
              </>
            ) : (
              // Authenticated actions
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
                        <User className="mr-2 h-4 w-4" />
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
        </div>
      </div>
    </nav>
  )
}
