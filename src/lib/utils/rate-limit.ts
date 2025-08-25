import { RateLimitInfo } from '@/types/market-research'

// In-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 100, // 100 requests per window
  windowMs: 60000,  // 1 minute window
  maxMarketResearch: 10, // 10 market research requests per window
  marketResearchWindowMs: 300000 // 5 minute window for market research
}

/**
 * Check rate limit for market research
 */
export function checkMarketResearchRateLimit(
  identifier: string,
  isAuthenticated: boolean = false
): RateLimitInfo {
  const key = `market_research:${identifier}`
  const now = Date.now()
  const windowMs = RATE_LIMIT_CONFIG.marketResearchWindowMs
  const maxRequests = RATE_LIMIT_CONFIG.maxMarketResearch

  // Get current rate limit info
  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    // Reset or create new rate limit entry
    const resetTime = now + windowMs
    rateLimitStore.set(key, { count: 1, resetTime })
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime
    }
  }

  if (current.count >= maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((current.resetTime - now) / 1000)
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
      retryAfter
    }
  }

  // Increment count
  current.count++
  rateLimitStore.set(key, current)

  return {
    allowed: true,
    remaining: maxRequests - current.count,
    resetTime: current.resetTime
  }
}

/**
 * Check general rate limit
 */
export function checkRateLimit(identifier: string): RateLimitInfo {
  const key = `general:${identifier}`
  const now = Date.now()
  const windowMs = RATE_LIMIT_CONFIG.windowMs
  const maxRequests = RATE_LIMIT_CONFIG.maxRequests

  // Get current rate limit info
  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    // Reset or create new rate limit entry
    const resetTime = now + windowMs
    rateLimitStore.set(key, { count: 1, resetTime })
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime
    }
  }

  if (current.count >= maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((current.resetTime - now) / 1000)
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
      retryAfter
    }
  }

  // Increment count
  current.count++
  rateLimitStore.set(key, current)

  return {
    allowed: true,
    remaining: maxRequests - current.count,
    resetTime: current.resetTime
  }
}

/**
 * Get client identifier (IP + userId if available)
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded || realIp || 'unknown'
  
  if (userId) {
    return `${ip}:${userId}`
  }
  
  return ip
}

/**
 * Clean up expired rate limit entries
 */
export function cleanupExpiredRateLimits(): void {
  const now = Date.now()
  
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Clean up expired entries every 5 minutes
setInterval(cleanupExpiredRateLimits, 5 * 60 * 1000)

/**
 * Simple utility to rate limit arbitrary routes. Returns true if the request is
 * allowed, false otherwise.
 */
const routeRateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRouteRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const current = routeRateLimitStore.get(identifier)

  if (!current || now > current.resetTime) {
    routeRateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return { allowed: true }
  }

  if (current.count >= limit) {
    const retryAfter = Math.ceil((current.resetTime - now) / 1000)
    return { allowed: false, retryAfter }
  }

  current.count++
  routeRateLimitStore.set(identifier, current)
  return { allowed: true }
}
