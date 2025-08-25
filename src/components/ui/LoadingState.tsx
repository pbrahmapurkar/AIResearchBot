'use client'

import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  className?: string
}

export default function LoadingState({ className }: Props) {
  return (
    <div className="p-4">
      <Skeleton className={className ?? 'h-24 w-full'} />
    </div>
  )
}
