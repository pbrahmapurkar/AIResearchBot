'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MarketResearchRequestSchema, MarketResearchRequest } from '@/types/market-research'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Search, Globe, Languages, Calendar, Target } from 'lucide-react'

interface MarketResearchFormProps {
  onSubmit: (data: MarketResearchRequest) => void
  isLoading?: boolean
}

const REGIONS = [
  'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh',
  'Kerala', 'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh',
  'Bihar', 'West Bengal', 'Odisha', 'Assam', 'Punjab'
]

const LANGUAGES = [
  'Hindi', 'Marathi', 'Kannada', 'Tamil', 'Telugu',
  'Malayalam', 'Gujarati', 'Bengali', 'Punjabi', 'Odia'
]

const TIMEFRAMES = [
  { value: '1W', label: '1 Week' },
  { value: '1M', label: '1 Month' },
  { value: '3M', label: '3 Months' },
  { value: '6M', label: '6 Months' },
  { value: '1Y', label: '1 Year' }
]

export function MarketResearchForm({ onSubmit, isLoading = false }: MarketResearchFormProps) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue
  } = useForm<MarketResearchRequest>({
    resolver: zodResolver(MarketResearchRequestSchema),
    mode: 'onChange'
  })

  const handleRegionToggle = (region: string) => {
    setSelectedRegions(prev => {
      if (prev.includes(region)) {
        const filtered = prev.filter(r => r !== region)
        setValue('regions', filtered)
        return filtered
      } else {
        const updated = [...prev, region]
        setValue('regions', updated)
        return updated
      }
    })
  }

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev => {
      if (prev.includes(language)) {
        const filtered = prev.filter(l => l !== language)
        setValue('languages', filtered)
        return filtered
      } else {
        const updated = [...prev, language]
        setValue('languages', updated)
        return updated
      }
    })
  }

  const handleFormSubmit = (data: MarketResearchRequest) => {
    onSubmit(data)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Market Research Brief
        </CardTitle>
        <CardDescription>
          Define your research topic, target regions, languages, and timeframe to generate AI-powered market insights
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Research Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-medium">
              Research Topic *
            </Label>
            <Textarea
              id="topic"
              placeholder="e.g., Consumer behavior analysis for FMCG products in Tier-2 cities of Maharashtra and Karnataka, focusing on digital payment adoption trends"
              className="min-h-[100px] resize-none"
              {...register('topic')}
            />
            {errors.topic && (
              <Alert variant="destructive">
                <AlertDescription>{errors.topic.message}</AlertDescription>
              </Alert>
            )}
            <p className="text-xs text-gray-500">
              Be specific about your research focus, target audience, and key areas of interest
            </p>
          </div>

          {/* Target Regions */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Target Regions * (Select 1-10)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {REGIONS.map((region) => (
                <div key={region} className="flex items-center space-x-2">
                  <Checkbox
                    id={`region-${region}`}
                    checked={selectedRegions.includes(region)}
                    onCheckedChange={() => handleRegionToggle(region)}
                  />
                  <Label htmlFor={`region-${region}`} className="text-sm cursor-pointer">
                    {region}
                  </Label>
                </div>
              ))}
            </div>
            {errors.regions && (
              <Alert variant="destructive">
                <AlertDescription>{errors.regions.message}</AlertDescription>
              </Alert>
            )}
            {selectedRegions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedRegions.map((region) => (
                  <Badge key={region} variant="secondary">
                    {region}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Target Languages */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Languages className="h-4 w-4" />
              Target Languages * (Select 1-5)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {LANGUAGES.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={`language-${language}`}
                    checked={selectedLanguages.includes(language)}
                    onCheckedChange={() => handleLanguageToggle(language)}
                  />
                  <Label htmlFor={`language-${language}`} className="text-sm cursor-pointer">
                    {language}
                  </Label>
                </div>
              ))}
            </div>
            {errors.languages && (
              <Alert variant="destructive">
                <AlertDescription>{errors.languages.message}</AlertDescription>
              </Alert>
            )}
            {selectedLanguages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedLanguages.map((language) => (
                  <Badge key={language} variant="secondary">
                    {language}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Timeframe and Max Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeframe" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeframe *
              </Label>
              <Select onValueChange={(value: '1W' | '1M' | '3M' | '6M' | '1Y') => setValue('timeframe', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEFRAMES.map((timeframe) => (
                    <SelectItem key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timeframe && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.timeframe.message}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxResults" className="text-sm font-medium">
                Max Search Results
              </Label>
              <Input
                id="maxResults"
                type="number"
                min="5"
                max="20"
                defaultValue={10}
                {...register('maxResults', { valueAsNumber: true })}
              />
              {errors.maxResults && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.maxResults.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={!isValid || isLoading || selectedRegions.length === 0 || selectedLanguages.length === 0}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Research...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Start Market Research
                </>
              )}
            </Button>
          </div>

          {/* Form Status */}
          {!isValid && (
            <Alert>
              <AlertDescription>
                Please fill in all required fields and select at least one region and language.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
