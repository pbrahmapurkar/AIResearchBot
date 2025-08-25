// lib/rateLimit.ts
// Simple in-memory token bucket per key
export type RateLimitOptions = {
  capacity?: number // maximum tokens
  refillInterval?: number // milliseconds
}

type Bucket = {
  tokens: number
  lastRefill: number
}

const BUCKETS: Map<string, Bucket> =
  (globalThis as any).__RATE_BUCKETS__ ?? ((globalThis as any).__RATE_BUCKETS__ = new Map())

export async function consume(key: string, opts: RateLimitOptions = {}): Promise<boolean> {
  const capacity = opts.capacity ?? 5
  const interval = opts.refillInterval ?? 60_000 // 1 minute
  const now = Date.now()
  const bucket = BUCKETS.get(key) ?? { tokens: capacity, lastRefill: now }
  const elapsed = now - bucket.lastRefill
  if (elapsed > interval) {
    const refill = Math.floor(elapsed / interval)
    bucket.tokens = Math.min(capacity, bucket.tokens + refill)
    bucket.lastRefill = now
  }
  if (bucket.tokens <= 0) {
    BUCKETS.set(key, bucket)
    return false
  }
  bucket.tokens -= 1
  BUCKETS.set(key, bucket)
  return true
}
