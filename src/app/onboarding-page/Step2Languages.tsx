'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';

const Step2Languages = () => {
  const { formData, updateFormData, languagesList, languagePacks } = useOnboarding();

  const toggleLanguage = (languageId: string) => {
    const newLanguages = formData.languages.includes(languageId)
      ? formData.languages.filter(id => id !== languageId)
      : [...formData.languages, languageId];

    updateFormData({ languages: newLanguages });
  };

  const applyPack = (pack: Array<{ id: string }>) => {
    const packLanguageIds = pack.map(lang => lang.id);
    // Add pack languages, avoiding duplicates
    const newLanguages = [...new Set([...formData.languages, ...packLanguageIds])];
    updateFormData({ languages: newLanguages });
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900">Which languages do you need to monitor?</h2>
      <p className="mb-6 text-slate-600">Choose 2-3 core languages to start. We offer pre-built packs for key regions.</p>

      {/* Helper Packs */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Quick Select Packs</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPack(languagePacks.north)}
            className="rounded-full bg-slate-100 px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-200"
          >
            North Pack
          </button>
          <button
            onClick={() => applyPack(languagePacks.south)}
            className="rounded-full bg-slate-100 px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-200"
          >
            South Pack
          </button>
          <button
            onClick={() => applyPack(languagePacks.west)}
            className="rounded-full bg-slate-100 px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-200"
          >
            West Pack
          </button>
        </div>
      </div>

      {/* Language Checkboxes */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {languagesList.map((language) => (
          <label key={language.id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.languages.includes(language.id)}
              onChange={() => toggleLanguage(language.id)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">{language.name}</span>
          </label>
        ))}
      </div>

      {/* Selected Languages Chips */}
      {formData.languages.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Selected:</h3>
          <div className="flex flex-wrap gap-2">
            {formData.languages.map((langId) => {
              const lang = languagesList.find(l => l.id === langId);
              return (
                <span key={langId} className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {lang?.name}
                  <button
                    type="button"
                    onClick={() => toggleLanguage(langId)}
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

      {formData.languages.length < 2 && (
        <p className="mt-4 text-sm text-red-500">Please select at least 2 languages.</p>
      )}
      {formData.languages.length > 5 && (
        <p className="mt-4 text-sm text-orange-500">For best results, we recommend starting with 2-3 core languages.</p>
      )}
    </div>
  );
};

export default Step2Languages;
