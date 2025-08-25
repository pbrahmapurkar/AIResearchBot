'use client'

import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  message: string
  onRetry?: () => void
}

export default function ErrorInline({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 text-center text-sm text-red-600">
      <AlertCircle className="h-5 w-5" />
      <p>{message}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}
