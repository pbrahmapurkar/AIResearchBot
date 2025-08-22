'use client'

import { useState } from 'react'
import { INDIAN_STATES, IndianState } from '@/types/mister-pb'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface RegionsStepProps {
  selectedRegions: IndianState[]
  onSelect: (regions: IndianState[]) => void
}

const regionCategories = {
  'Northern India': ['Delhi', 'Punjab', 'Haryana', 'Himachal Pradesh', 'Uttarakhand', 'Uttar Pradesh', 'Chandigarh'],
  'Western India': ['Maharashtra', 'Gujarat', 'Rajasthan', 'Goa', 'Dadra and Nagar Haveli and Daman and Diu'],
  'Southern India': ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Puducherry', 'Lakshadweep'],
  'Eastern India': ['West Bengal', 'Odisha', 'Jharkhand', 'Bihar'],
  'Central India': ['Madhya Pradesh', 'Chhattisgarh'],
  'Northeastern India': ['Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'],
  'Union Territories': ['Andaman and Nicobar Islands', 'Jammu and Kashmir', 'Ladakh']
}

const popularRegions: IndianState[] = [
  'Maharashtra', 'Uttar Pradesh', 'Gujarat', 'West Bengal', 'Karnataka', 
  'Tamil Nadu', 'Rajasthan', 'Delhi', 'Andhra Pradesh', 'Telangana'
]

export default function RegionsStep({ selectedRegions, onSelect }: RegionsStepProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'popular' | 'categories' | 'all'>('popular')

  const handleToggle = (region: IndianState, checked: boolean) => {
    if (checked) {
      onSelect([...selectedRegions, region])
    } else {
      onSelect(selectedRegions.filter(r => r !== region))
    }
  }

  const handleSelectCategory = (categoryRegions: string[]) => {
    const regions = categoryRegions.filter(r => INDIAN_STATES.includes(r as IndianState)) as IndianState[]
    const newSelections = regions.filter(r => !selectedRegions.includes(r))
    onSelect([...selectedRegions, ...newSelections])
  }

  const filteredStates = INDIAN_STATES.filter(state =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderRegionCard = (region: IndianState) => {
    const isSelected = selectedRegions.includes(region)
    
    return (
      <Card
        key={region}
        className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
          isSelected 
            ? 'ring-1 ring-blue-500 bg-blue-50 border-blue-200' 
            : 'hover:border-gray-300'
        }`}
        onClick={() => handleToggle(region, !isSelected)}
      >
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={isSelected}
              onChange={() => {}} // Handled by card click
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <span className={`font-medium text-sm ${
              isSelected ? 'text-blue-900' : 'text-gray-900'
            }`}>
              {region}
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for states or union territories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('popular')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'popular' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setViewMode('categories')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'categories' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            By Region
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'all' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All States
          </button>
        </div>
      </div>

      {searchQuery ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredStates.map(renderRegionCard)}
        </div>
      ) : (
        <>
          {viewMode === 'popular' && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Popular Regions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {popularRegions.map(renderRegionCard)}
              </div>
            </div>
          )}

          {viewMode === 'categories' && (
            <div className="space-y-4">
              {Object.entries(regionCategories).map(([category, regions]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{category}</h4>
                    <button
                      onClick={() => handleSelectCategory(regions)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Select All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {regions.filter(r => INDIAN_STATES.includes(r as IndianState)).map(region => 
                      renderRegionCard(region as IndianState)
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'all' && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">All States & Union Territories</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {INDIAN_STATES.map(renderRegionCard)}
              </div>
            </div>
          )}
        </>
      )}

      {selectedRegions.length > 0 && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
            <p className="text-sm font-semibold text-purple-800">
              {selectedRegions.length} region{selectedRegions.length > 1 ? 's' : ''} selected
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedRegions.map((region) => (
              <Badge key={region} variant="default" className="bg-purple-600">
                {region}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-purple-700">
            We&apos;ll focus our consumer insights analysis on these regions to provide 
            location-specific market intelligence.
          </p>
        </div>
      )}
    </div>
  )
}
