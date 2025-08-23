'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { useState } from 'react';

const Step1Industry = () => {
  const { formData, updateFormData, industriesList } = useOnboarding();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIndustries = industriesList.filter(industry =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleIndustry = (industryId: string) => {
    const newIndustries = formData.industries.includes(industryId)
      ? formData.industries.filter(id => id !== industryId)
      : [...formData.industries, industryId];

    updateFormData({ industries: newIndustries });
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900">What industry are you in?</h2>
      <p className="mb-6 text-slate-600">Select one or more to tailor your insights. (You can add more later.)</p>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search industries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Industry Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {filteredIndustries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => toggleIndustry(industry.id)}
            className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all ${
              formData.industries.includes(industry.id)
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className="mb-2 text-2xl">{industry.icon}</span>
            <span className="text-sm font-medium">{industry.name}</span>
          </button>
        ))}
      </div>

      {formData.industries.length === 0 && (
        <p className="mt-4 text-sm text-red-500">Please select at least one industry.</p>
      )}
    </div>
  );
};

export default Step1Industry;
