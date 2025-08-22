'use client'

import { Language, LANGUAGE_LABELS } from '@/types/mister-pb'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

interface LanguagesStepProps {
  selectedLanguages: Language[]
  onSelect: (languages: Language[]) => void
}

const languageRegions: Record<Language, string[]> = {
  HINDI: ['Delhi', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Madhya Pradesh', 'Haryana'],
  TAMIL: ['Tamil Nadu', 'Puducherry'],
  TELUGU: ['Andhra Pradesh', 'Telangana'],
  MARATHI: ['Maharashtra'],
  BENGALI: ['West Bengal'],
  GUJARATI: ['Gujarat', 'Dadra and Nagar Haveli and Daman and Diu'],
  KANNADA: ['Karnataka'],
  MALAYALAM: ['Kerala', 'Lakshadweep'],
  PUNJABI: ['Punjab', 'Chandigarh'],
  ODIA: ['Odisha']
}

const languageStats: Record<Language, { speakers: string; states: number }> = {
  HINDI: { speakers: '602M', states: 6 },
  TAMIL: { speakers: '75M', states: 2 },
  TELUGU: { speakers: '82M', states: 2 },
  MARATHI: { speakers: '83M', states: 1 },
  BENGALI: { speakers: '97M', states: 1 },
  GUJARATI: { speakers: '56M', states: 2 },
  KANNADA: { speakers: '44M', states: 1 },
  MALAYALAM: { speakers: '34M', states: 2 },
  PUNJABI: { speakers: '33M', states: 2 },
  ODIA: { speakers: '38M', states: 1 }
}

export default function LanguagesStep({ selectedLanguages, onSelect }: LanguagesStepProps) {
  const languages = Object.keys(LANGUAGE_LABELS) as Language[]

  const handleToggle = (language: Language, checked: boolean) => {
    if (checked) {
      onSelect([...selectedLanguages, language])
    } else {
      onSelect(selectedLanguages.filter(l => l !== language))
    }
  }

  const handleSelectAll = () => {
    if (selectedLanguages.length === languages.length) {
      onSelect([])
    } else {
      onSelect(languages)
    }
  }

  const allSelected = selectedLanguages.length === languages.length

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            Select the languages you want to monitor for consumer insights.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            We recommend selecting at least 2-3 languages for comprehensive coverage.
          </p>
        </div>
        <button
          onClick={handleSelectAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {languages.map((language) => {
          const isSelected = selectedLanguages.includes(language)
          const stats = languageStats[language]
          
          return (
            <Card
              key={language}
              className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
                isSelected 
                  ? 'ring-1 ring-blue-500 bg-blue-50 border-blue-200' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleToggle(language, !isSelected)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => {}} // Handled by card click
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {LANGUAGE_LABELS[language]}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {stats.speakers} speakers
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {stats.states} state{stats.states > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Primary regions: {languageRegions[language].slice(0, 3).join(', ')}
                      {languageRegions[language].length > 3 && ' +more'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedLanguages.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-2 w-2 bg-green-600 rounded-full"></div>
            <p className="text-sm font-semibold text-green-800">
              {selectedLanguages.length} language{selectedLanguages.length > 1 ? 's' : ''} selected
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.map((language) => (
              <Badge key={language} variant="default" className="bg-green-600">
                {LANGUAGE_LABELS[language]}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-green-700 mt-2">
            We&apos;ll monitor consumer sentiment and behavior across these languages to provide 
            comprehensive insights for your target markets.
          </p>
        </div>
      )}
    </div>
  )
}
