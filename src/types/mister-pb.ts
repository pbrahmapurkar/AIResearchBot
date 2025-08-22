import { z } from "zod"

// === ENUMS ===
export const Role = z.enum(["ADMIN", "ANALYST", "VIEWER"])
export const Industry = z.enum([
  "FMCG", 
  "FINTECH", 
  "ECOMMERCE", 
  "HEALTHCARE", 
  "EDUCATION", 
  "AUTOMOTIVE", 
  "RETAIL", 
  "TRAVEL", 
  "REAL_ESTATE", 
  "OTHER"
])
export const Language = z.enum([
  "HINDI",
  "TAMIL", 
  "TELUGU",
  "MARATHI",
  "BENGALI",
  "GUJARATI",
  "KANNADA", 
  "MALAYALAM",
  "PUNJABI",
  "ODIA"
])
export const PlanType = z.enum(["FREE", "STARTER", "PRO"])
export const ReportStatus = z.enum(["GENERATING", "COMPLETED", "FAILED"])
export const UsageKind = z.enum(["REPORT_GENERATION", "API_CALL", "EXPORT"])

// === TYPE HELPERS ===
export type Role = z.infer<typeof Role>
export type Industry = z.infer<typeof Industry>
export type Language = z.infer<typeof Language>
export type PlanType = z.infer<typeof PlanType>
export type ReportStatus = z.infer<typeof ReportStatus>
export type UsageKind = z.infer<typeof UsageKind>

// === API SCHEMAS ===

// Onboarding wizard schemas
export const OnboardingStep1Schema = z.object({
  industry: Industry,
})

export const OnboardingStep2Schema = z.object({
  languages: z.array(Language).min(1, "Select at least one language"),
})

export const OnboardingStep3Schema = z.object({
  regions: z.array(z.string()).min(1, "Select at least one region"),
})

export const OnboardingStep4Schema = z.object({
  alertsEnabled: z.boolean(),
  alertThresholds: z.object({
    sentimentThreshold: z.number().min(-1).max(1),
    priceAlertThreshold: z.number().min(0).max(100),
  }).optional(),
})

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  industry: Industry,
  languages: z.array(Language).min(1, "Select at least one language"),
  regions: z.array(z.string()).min(1, "Select at least one region"),
  alertsEnabled: z.boolean().default(false),
  alertThresholds: z.object({
    sentimentThreshold: z.number().min(-1).max(1),
    priceAlertThreshold: z.number().min(0).max(100),
  }).optional(),
})

// Report generation schema
export const GenerateReportSchema = z.object({
  projectId: z.string().cuid(),
  period: z.string(), // e.g., "2024-01", "Q1-2024"
})

// === INSIGHTS DATA TYPES ===

export const RegionalInsightSchema = z.object({
  region: z.string(),
  sentiment: z.number().min(-1).max(1),
  pricesensitivity: z.number().min(0).max(100),
  topKeywords: z.array(z.string()),
  sourceCount: z.number(),
})

export const LanguageInsightSchema = z.object({
  language: Language,
  sentiment: z.number().min(-1).max(1),
  priceTerms: z.array(z.string()),
  culturalContext: z.string(),
  sourceCount: z.number(),
})

export const ReportDataSchema = z.object({
  summary: z.object({
    overallSentiment: z.number().min(-1).max(1),
    avgPriceSensitivity: z.number().min(0).max(100),
    totalSources: z.number(),
    timeframe: z.string(),
  }),
  regionalInsights: z.array(RegionalInsightSchema),
  languageInsights: z.array(LanguageInsightSchema),
  trendingTopics: z.array(z.object({
    topic: z.string(),
    mentions: z.number(),
    sentiment: z.number().min(-1).max(1),
    languages: z.array(Language),
  })),
  priceAlerts: z.array(z.object({
    region: z.string(),
    category: z.string(),
    alertType: z.enum(["SPIKE", "DROP", "VOLATILITY"]),
    severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
    description: z.string(),
  })),
})

// === API RESPONSE TYPES ===

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

// Usage tracking
export const UsageQuotaSchema = z.object({
  plan: PlanType,
  monthlyQuota: z.number(),
  usedThisMonth: z.number(),
  resetDate: z.date(),
  canGenerate: z.boolean(),
})

// === INDUSTRY MAPPINGS ===
export const INDUSTRY_LABELS: Record<Industry, string> = {
  FMCG: "FMCG & Consumer Goods",
  FINTECH: "Financial Services",
  ECOMMERCE: "E-commerce & Retail",
  HEALTHCARE: "Healthcare & Wellness",
  EDUCATION: "Education & EdTech",
  AUTOMOTIVE: "Automotive",
  RETAIL: "Retail & Fashion",
  TRAVEL: "Travel & Hospitality",
  REAL_ESTATE: "Real Estate",
  OTHER: "Other",
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  HINDI: "हिंदी (Hindi)",
  TAMIL: "தமிழ் (Tamil)",
  TELUGU: "తెలుగు (Telugu)",
  MARATHI: "मराठी (Marathi)",
  BENGALI: "বাংলা (Bengali)",
  GUJARATI: "ગુજરાતી (Gujarati)",
  KANNADA: "ಕನ್ನಡ (Kannada)",
  MALAYALAM: "മലയാളം (Malayalam)",
  PUNJABI: "ਪੰਜਾਬੀ (Punjabi)",
  ODIA: "ଓଡ଼ିଆ (Odia)",
}

export const PLAN_LABELS: Record<PlanType, string> = {
  FREE: "Free",
  STARTER: "Starter",
  PRO: "Pro",
}

export const PLAN_QUOTAS: Record<PlanType, number> = {
  FREE: 3,
  STARTER: 50,
  PRO: -1, // Unlimited
}

// === INDIAN STATES ===
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh", 
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const

export type IndianState = typeof INDIAN_STATES[number]

// === EXPORT TYPES ===
export type OnboardingStep1 = z.infer<typeof OnboardingStep1Schema>
export type OnboardingStep2 = z.infer<typeof OnboardingStep2Schema>
export type OnboardingStep3 = z.infer<typeof OnboardingStep3Schema>
export type OnboardingStep4 = z.infer<typeof OnboardingStep4Schema>
export type CreateProject = z.infer<typeof CreateProjectSchema>
export type GenerateReport = z.infer<typeof GenerateReportSchema>
export type RegionalInsight = z.infer<typeof RegionalInsightSchema>
export type LanguageInsight = z.infer<typeof LanguageInsightSchema>
export type ReportData = z.infer<typeof ReportDataSchema>
export type ApiResponse = z.infer<typeof ApiResponseSchema>
export type UsageQuota = z.infer<typeof UsageQuotaSchema>
