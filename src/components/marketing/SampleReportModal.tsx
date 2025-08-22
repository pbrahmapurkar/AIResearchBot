'use client'

import { Fragment } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  TrendingUp, 
  MapPin, 
  Users, 
  DollarSign,
  Download,
  Eye
} from 'lucide-react'

interface SampleReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SampleReportModal({ isOpen, onClose }: SampleReportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Sample Consumer Insights Report</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Header */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Bharat Pulse Report: FMCG Snacks
              </h2>
              <Badge className="bg-green-100 text-green-800">
                Live Data
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">
              Consumer sentiment analysis across Tier-2 & Tier-3 markets for the snacks category
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-600">1,247</div>
                <div className="text-gray-600">Conversations</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-teal-600">4</div>
                <div className="text-gray-600">Languages</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">23</div>
                <div className="text-gray-600">Cities</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600">78%</div>
                <div className="text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Regional Heatmap */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Regional Hotspots
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Uttar Pradesh</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-16 bg-blue-200 rounded-full">
                      <div className="h-2 w-12 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-600">89%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tamil Nadu</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-16 bg-teal-200 rounded-full">
                      <div className="h-2 w-10 bg-teal-600 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-600">76%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Maharashtra</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-16 bg-purple-200 rounded-full">
                      <div className="h-2 w-8 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-600">64%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2 text-teal-600" />
                Vernacular Sentiment
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hindi (हिंदी)</span>
                  <Badge className="bg-green-100 text-green-800">+42%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tamil (தமிழ்)</span>
                  <Badge className="bg-green-100 text-green-800">+28%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Telugu (తెలుగు)</span>
                  <Badge className="bg-yellow-100 text-yellow-800">+12%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Marathi (मराठी)</span>
                  <Badge className="bg-green-100 text-green-800">+18%</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Price Intelligence */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
              Price Sensitivity Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">₹15-25</div>
                <div className="text-sm text-red-800">Sweet Spot Range</div>
                <div className="text-xs text-gray-600 mt-1">Maximum purchase intent</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">73%</div>
                <div className="text-sm text-yellow-800">Deal Sensitivity</div>
                <div className="text-xs text-gray-600 mt-1">Respond to discounts</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">45%</div>
                <div className="text-sm text-blue-800">Brand Loyalty</div>
                <div className="text-xs text-gray-600 mt-1">Willing to pay premium</div>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
              Key Actionable Insights
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                <span><strong>Regional Focus:</strong> Uttar Pradesh shows highest engagement with spicy variants mentioned in Hindi conversations</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-2 w-2 bg-teal-600 rounded-full mt-2 mr-3"></span>
                <span><strong>Price Strategy:</strong> ₹15-25 price range generates maximum positive sentiment across all regions</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-2 w-2 bg-purple-600 rounded-full mt-2 mr-3"></span>
                <span><strong>Cultural Calendar:</strong> Launch timing around Diwali shows 3x higher purchase intent in vernacular discussions</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-2 w-2 bg-orange-600 rounded-full mt-2 mr-3"></span>
                <span><strong>Vernacular Marketing:</strong> Tamil consumers respond 40% better to health-focused messaging</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
            <Button 
              size="lg" 
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              onClick={onClose}
            >
              <Eye className="h-4 w-4 mr-2" />
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Sample
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            This is a sample report. Real reports include deeper analysis across 50+ data points.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
