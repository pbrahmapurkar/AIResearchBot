'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/signout', { method: 'POST' })
      if (!res.ok) {
        toast.error('Error signing out')
      } else {
        toast.success('Signed out successfully')
        router.push('/signin')
      }
    } catch {
      toast.error('Error signing out')
    }
  }

  return (
    <Button
      onClick={handleSignOut}
      variant="ghost"
      size="sm"
      className="text-gray-600 hover:text-gray-900"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign out
    </Button>
  )
}
