'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut, Settings, User } from 'lucide-react'

interface AvatarMenuProps {
  user: {
    email: string | null
    name?: string | null
    avatar_url?: string | null
  }
}

export default function AvatarMenu({ user }: AvatarMenuProps) {
  const router = useRouter()
  const initials =
    user.name?.split(' ').map((n) => n[0]).join('') ||
    user.email?.[0]?.toUpperCase() ||
    'U'

  const [open, setOpen] = useState(false)

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/signin')
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <Avatar className="h-8 w-8">
            {user.avatar_url && (
              <AvatarImage src={user.avatar_url} alt={user.name ?? ''} />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/profile')} role="menuitem">
          <User className="mr-2 h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')} role="menuitem">
          <Settings className="mr-2 h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} role="menuitem">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
