'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { UserMenu } from '@/components/auth/user-menu'
import { Button } from '@/components/ui/button'
import { Bell, Search } from 'lucide-react'

interface TopBarProps {
  user: User
  profile: { name?: string; avatar_url?: string } | null
}

export function TopBar({ user, profile }: TopBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Search */}
        <div className="flex items-center gap-4">
          {isSearchOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports, projects..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          )}
        </div>

        {/* Right Section - Notifications & User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <UserMenu user={user} profile={profile} />
        </div>
      </div>
    </header>
  )
}
