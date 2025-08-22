'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import IndustryStep from '@/components/onboarding/IndustryStep'
import LanguagesStep from '@/components/onboarding/LanguagesStep'
import RegionsStep from '@/components/onboarding/RegionsStep'
import AlertsStep from '@/components/onboarding/AlertsStep'
import { Industry, Language, IndianState } from '@/types/mister-pb'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface OnboardingData {
  industry: Industry | null
  languages: Language[]
  regions: IndianState[]
  alertsEnabled: boolean
  alertThresholds: {
    sentimentThreshold: number
    priceAlertThreshold: number
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    industry: null,
    languages: [],
    regions: [],
    alertsEnabled: false,
    alertThresholds: {
      sentimentThreshold: -0.3,
      priceAlertThreshold: 20
    }
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    try {
      // Create project with onboarding data
      const projectData = {
        name: `${data.industry} Project`,
        industry: data.industry!,
        languages: data.languages,
        regions: data.regions,
        alertsEnabled: data.alertsEnabled,
        alertThresholds: data.alertsEnabled ? data.alertThresholds : undefined
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      })

      if (response.ok) {
        const project = await response.json()
        router.push(`/app/projects/${project.id}`)
      } else {
        console.error('Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.industry !== null
      case 2:
        return data.languages.length > 0
      case 3:
        return data.regions.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const stepTitles = [
    'Choose Your Industry',
    'Select Languages',
    'Pick Regions',
    'Configure Alerts'
  ]

  const stepDescriptions = [
    'What industry do you want to analyze?',
    'Which languages should we monitor?',
    'Which regions are you interested in?',
    'Set up alerts for important changes'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MP</span>
            </div>
            <span className="ml-2 text-xl font-bold">Mister PB</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {stepTitles[currentStep - 1]}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {stepDescriptions[currentStep - 1]}
          </CardDescription>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <IndustryStep
              selectedIndustry={data.industry}
              onSelect={(industry) => setData({ ...data, industry })}
            />
          )}

          {currentStep === 2 && (
            <LanguagesStep
              selectedLanguages={data.languages}
              onSelect={(languages) => setData({ ...data, languages })}
            />
          )}

          {currentStep === 3 && (
            <RegionsStep
              selectedRegions={data.regions}
              onSelect={(regions) => setData({ ...data, regions })}
            />
          )}

          {currentStep === 4 && (
            <AlertsStep
              alertsEnabled={data.alertsEnabled}
              alertThresholds={data.alertThresholds}
              onUpdate={(alertsEnabled, alertThresholds) => 
                setData({ ...data, alertsEnabled, alertThresholds })
              }
            />
          )}

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              {currentStep === totalSteps ? 'Complete Setup' : 'Continue'}
              {currentStep < totalSteps && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
