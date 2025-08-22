// Placeholder toast hook - replace with actual implementation
import { toast as sonnerToast } from 'sonner'

interface ToastProps {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  return {
    toast: ({ title, description, variant }: ToastProps) => {
      if (variant === 'destructive') {
        sonnerToast.error(title, { description })
      } else {
        sonnerToast.success(title, { description })
      }
    }
  }
}
