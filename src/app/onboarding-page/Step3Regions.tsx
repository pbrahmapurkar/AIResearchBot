'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { useState, useMemo } from 'react';

const Step3Regions = () => {
  const { formData, updateFormData, statesList } = useOnboarding();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter states based on selected languages and search term
  const filteredStates = useMemo(() => {
    return statesList.filter(state => {
      const matchesSearch = state.name.toLowerCase().includes(searchTerm.toLowerCase());
      const hasMatchingLanguage = state.lang.some(lang => formData.languages.includes(lang));
      return matchesSearch && hasMatchingLanguage;
    });
  }, [statesList, formData.languages, searchTerm]);

  // Get suggested states based on selected languages
  const suggestedStates = useMemo(() => {
    const suggested = statesList.filter(state => 
      state.lang.some(lang => formData.languages.includes(lang))
    );
    return suggested.slice(0, 6); // Show top 6 suggestions
  }, [statesList, formData.languages]);

  const toggleRegion = (regionId: string) => {
    const newRegions = formData.regions.includes(regionId)
      ? formData.regions.filter(id => id !== regionId)
      : [...formData.regions, regionId];

    updateFormData({ regions: newRegions });
  };

  const addSuggestedRegions = () => {
    const suggestedIds = suggestedStates.map(state => state.id);
    const newRegions = [...new Set([...formData.regions, ...suggestedIds])];
    updateFormData({ regions: newRegions });
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900">Where are your target regions?</h2>
      <p className="mb-6 text-slate-600">Select states to focus our analysis. We&apos;ve suggested some based on your languages.</p>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search states..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Suggested Regions */}
      {suggestedStates.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Suggested based on your languages:</h3>
            <button
              onClick={addSuggestedRegions}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Add All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {suggestedStates.map((state) => (
              <button
                key={state.id}
                onClick={() => toggleRegion(state.id)}
                className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                  formData.regions.includes(state.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-sm font-medium">{state.name}</span>
                {formData.regions.includes(state.id) && (
                  <span className="text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Available States */}
      <div className="mb-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">All Available States</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {filteredStates.map((state) => (
            <button
              key={state.id}
              onClick={() => toggleRegion(state.id)}
              className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                formData.regions.includes(state.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-medium">{state.name}</span>
              {formData.regions.includes(state.id) && (
                <span className="text-blue-600">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Regions Chips */}
      {formData.regions.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Selected Regions:</h3>
          <div className="flex flex-wrap gap-2">
            {formData.regions.map((regionId) => {
              const region = statesList.find(s => s.id === regionId);
              return (
                <span key={regionId} className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {region?.name}
                  <button
                    type="button"
                    onClick={() => toggleRegion(regionId)}
                    className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-600 hover:bg-blue-200"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {formData.regions.length === 0 && (
        <p className="mt-4 text-sm text-red-500">Please select at least one region.</p>
      )}
    </div>
  );
};

export default Step3Regions;
