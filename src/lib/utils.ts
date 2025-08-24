import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Rate limiting utilities
interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const rateLimitStore: RateLimitStore = {}

export function checkRateLimit(
  identifier: string, 
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier
  const { maxRequests, windowMs } = config

  if (!rateLimitStore[key] || now > rateLimitStore[key].resetTime) {
    // Reset or initialize
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + windowMs
    }
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs }
  }

  if (rateLimitStore[key].count >= maxRequests) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: rateLimitStore[key].resetTime 
    }
  }

  rateLimitStore[key].count++
  return { 
    allowed: true, 
    remaining: maxRequests - rateLimitStore[key].count, 
    resetTime: rateLimitStore[key].resetTime 
  }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return 'unknown'
}

// Security utilities
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
