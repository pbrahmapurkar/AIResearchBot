'use client';

import React, { createContext, useContext, useState } from 'react';

interface OnboardingContextType {
  currentStep: number;
  formData: {
    industries: string[];
    languages: string[];
    regions: string[];
    alerts: {
      sentimentThreshold: number;
      priceThreshold: number;
      channels: string[];
    };
  };
  isLoading: boolean;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (newData: Partial<OnboardingContextType['formData']>) => void;
  industriesList: Array<{ id: string; name: string; icon: string }>;
  languagesList: Array<{ id: string; name: string }>;
  languagePacks: {
    north: Array<{ id: string }>;
    south: Array<{ id: string }>;
    west: Array<{ id: string }>;
  };
  statesList: Array<{ id: string; name: string; lang: string[] }>;
  validateStep: (step: number) => boolean;
  setIsLoading: (loading: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const industriesList = [
  { id: 'fmcg', name: 'FMCG', icon: '🛒' },
  { id: 'retail', name: 'Retail', icon: '🏬' },
  { id: 'apparel', name: 'Apparel', icon: '👕' },
  { id: 'fintech', name: 'Fintech', icon: '💳' },
  { id: 'food-delivery', name: 'Food Delivery', icon: '🍔' },
  { id: 'automotive', name: 'Automotive', icon: '🚗' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
];

const languagesList = [
  { id: 'hindi', name: 'Hindi' },
  { id: 'marathi', name: 'Marathi' },
  { id: 'tamil', name: 'Tamil' },
  { id: 'telugu', name: 'Telugu' },
  { id: 'bengali', name: 'Bengali' },
  { id: 'gujarati', name: 'Gujarati' },
  { id: 'kannada', name: 'Kannada' },
  { id: 'malayalam', name: 'Malayalam' },
  { id: 'punjabi', name: 'Punjabi' },
  { id: 'bhojpuri', name: 'Bhojpuri' },
];

const languagePacks = {
  north: [{ id: 'hindi' }, { id: 'punjabi' }, { id: 'bhojpuri' }],
  south: [{ id: 'tamil' }, { id: 'telugu' }, { id: 'kannada' }, { id: 'malayalam' }],
  west: [{ id: 'marathi' }, { id: 'gujarati' }],
};

const statesList = [
  { id: 'maharashtra', name: 'Maharashtra', lang: ['marathi'] },
  { id: 'up', name: 'Uttar Pradesh', lang: ['hindi', 'bhojpuri'] },
  { id: 'delhi', name: 'Delhi', lang: ['hindi'] },
  { id: 'tamil-nadu', name: 'Tamil Nadu', lang: ['tamil'] },
  { id: 'karnataka', name: 'Karnataka', lang: ['kannada'] },
  { id: 'andhra', name: 'Andhra Pradesh', lang: ['telugu'] },
  { id: 'kerala', name: 'Kerala', lang: ['malayalam'] },
  { id: 'gujarat', name: 'Gujarat', lang: ['gujarati'] },
  { id: 'west-bengal', name: 'West Bengal', lang: ['bengali'] },
  { id: 'punjab', name: 'Punjab', lang: ['punjabi'] },
];

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    industries: [] as string[],
    languages: [] as string[],
    regions: [] as string[],
    alerts: {
      sentimentThreshold: 20,
      priceThreshold: 15,
      channels: ['email'],
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const nextStep = () => {
    if (currentStep < 4 && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (newData: Partial<OnboardingContextType['formData']>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: return formData.industries.length >= 1;
      case 2: return formData.languages.length >= 2 && formData.languages.length <= 5;
      case 3: return formData.regions.length >= 1;
      case 4: return true;
      default: return false;
    }
  };

  const value: OnboardingContextType = {
    currentStep,
    formData,
    isLoading,
    nextStep,
    prevStep,
    updateFormData,
    industriesList,
    languagesList,
    languagePacks,
    statesList,
    validateStep,
    setIsLoading,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
