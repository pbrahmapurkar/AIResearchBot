'use client'

import { Industry, INDUSTRY_LABELS } from '@/types/mister-pb'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  CreditCard, 
  Heart, 
  GraduationCap, 
  Car, 
  Store, 
  Plane, 
  Home,
  // Building, // Commented out as not used
  MoreHorizontal
} from 'lucide-react'

interface IndustryStepProps {
  selectedIndustry: Industry | null
  onSelect: (industry: Industry) => void
}

const industryIcons: Record<Industry, React.ComponentType<{ className?: string }>> = {
  FMCG: ShoppingCart,
  FINTECH: CreditCard,
  ECOMMERCE: Store,
  HEALTHCARE: Heart,
  EDUCATION: GraduationCap,
  AUTOMOTIVE: Car,
  RETAIL: Store,
  TRAVEL: Plane,
  REAL_ESTATE: Home,
  OTHER: MoreHorizontal
}

const industryDescriptions: Record<Industry, string> = {
  FMCG: 'Fast-moving consumer goods and packaged products',
  FINTECH: 'Financial services and digital payments',
  ECOMMERCE: 'Online retail and marketplace platforms',
  HEALTHCARE: 'Medical services and wellness products',
  EDUCATION: 'Educational services and EdTech platforms',
  AUTOMOTIVE: 'Vehicles, parts, and automotive services',
  RETAIL: 'Physical retail stores and fashion',
  TRAVEL: 'Travel booking and hospitality services',
  REAL_ESTATE: 'Property buying, selling, and rentals',
  OTHER: 'Other business categories'
}

export default function IndustryStep({ selectedIndustry, onSelect }: IndustryStepProps) {
  const industries = Object.keys(INDUSTRY_LABELS) as Industry[]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {industries.map((industry) => {
          const Icon = industryIcons[industry]
          const isSelected = selectedIndustry === industry
          
          return (
            <Card
              key={industry}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => onSelect(industry)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {INDUSTRY_LABELS[industry]}
                      </h3>
                      {isSelected && (
                        <Badge variant="default" className="bg-blue-600">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${
                      isSelected ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {industryDescriptions[industry]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedIndustry && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
            <p className="text-sm text-blue-800">
              <strong>Selected:</strong> {INDUSTRY_LABELS[selectedIndustry]}
            </p>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            We&apos;ll tailor our analysis and insights specifically for the {INDUSTRY_LABELS[selectedIndustry].toLowerCase()} industry.
          </p>
        </div>
      )}
    </div>
  )
}
