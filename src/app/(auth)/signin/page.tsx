import AuthCard from '@/components/auth/AuthCard'
import { Suspense } from 'react'
import { Card } from '@/components/ui/card'

export default function SignInPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <Suspense fallback={<AuthCardSkeleton />}>
        <AuthCard />
      </Suspense>
    </div>
  )
}

function AuthCardSkeleton() {
  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </Card>
  )
}
