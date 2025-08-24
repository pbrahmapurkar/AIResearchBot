// Security configuration for the application
export const SECURITY_CONFIG = {
  // Rate limiting configurations
  rateLimits: {
    // General API endpoints
    default: {
      maxRequests: 100,
      windowMs: 60000, // 1 minute
    },
    // Search API (more permissive)
    search: {
      maxRequests: 100,
      windowMs: 60000, // 1 minute
    },
    // Research API (resource-intensive)
    research: {
      maxRequests: 30,
      windowMs: 300000, // 5 minutes
    },
    // Planning API (resource-intensive)
    planning: {
      maxRequests: 50,
      windowMs: 300000, // 5 minutes
    },
    // Orchestrator API (resource-intensive)
    orchestrator: {
      maxRequests: 50,
      windowMs: 60000, // 1 minute
    },
    // Authentication endpoints (stricter)
    auth: {
      maxRequests: 10,
      windowMs: 300000, // 5 minutes
    }
  },

  // Input validation limits
  validation: {
    maxPromptLength: 10000,
    maxQueryLength: 500,
    maxMissionLength: 1000,
    allowedFileTypes: ['.pdf', '.docx', '.txt', '.csv'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },

  // Security headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  },

  // CORS configuration
  cors: {
    allowedOrigins: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com', 'https://www.yourdomain.com']
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
  },

  // Authentication settings
  auth: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    requireMFA: false, // Can be enabled for production
  },

  // API security
  api: {
    maxRequestSize: '10mb',
    timeout: 30000, // 30 seconds
    requireApiKey: false, // Can be enabled for external APIs
  },

  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': ["'self'", 'https://api.openai.com', 'https://generativelanguage.googleapis.com'],
    'frame-ancestors': ["'none'"],
  }
}

// Helper function to get rate limit config for a specific endpoint
export function getRateLimitConfig(endpoint: keyof typeof SECURITY_CONFIG.rateLimits) {
  return SECURITY_CONFIG.rateLimits[endpoint] || SECURITY_CONFIG.rateLimits.default
}

// Helper function to check if origin is allowed
export function isOriginAllowed(origin: string): boolean {
  return SECURITY_CONFIG.cors.allowedOrigins.includes(origin)
}

// Helper function to get security headers
export function getSecurityHeaders(): Record<string, string> {
  return { ...SECURITY_CONFIG.headers }
}

// Helper function to get CORS headers
export function getCorsHeaders(origin?: string): Record<string, string> {
  const allowedOrigin = origin && isOriginAllowed(origin) ? origin : SECURITY_CONFIG.cors.allowedOrigins[0]
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': SECURITY_CONFIG.cors.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': SECURITY_CONFIG.cors.allowedHeaders.join(', '),
    'Access-Control-Max-Age': SECURITY_CONFIG.cors.maxAge.toString(),
  }
}
