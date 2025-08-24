'use client';

import { useOnboarding, OnboardingProvider } from '@/contexts/OnboardingContext';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';
import Step1Industry from './Step1Industry';
import Step2Languages from './Step2Languages';
import Step3Regions from './Step3Regions';
import Step4Alerts from './Step4Alerts';

function OnboardingWizard() {
  const { currentStep, nextStep, prevStep, validateStep, isLoading } = useOnboarding();

  const steps = [
    { id: 1, component: <Step1Industry /> },
    { id: 2, component: <Step2Languages /> },
    { id: 3, component: <Step3Regions /> },
    { id: 4, component: <Step4Alerts /> },
  ];

  const isFinalStep = currentStep === 4;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={4} />

        {/* Animated Step Content */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {steps.find(step => step.id === currentStep)?.component}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1 || isLoading}
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:text-slate-900"
          >
            Back
          </button>

          <button
            onClick={isFinalStep ? undefined : nextStep}
            disabled={!validateStep(currentStep) || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-all disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Setting up...
              </span>
            ) : isFinalStep ? (
              'Complete Setup →'
            ) : (
              'Next →'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Export the page wrapped in the provider
export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingWizard />
    </OnboardingProvider>
  );
}
