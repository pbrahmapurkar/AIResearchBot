'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { useRouter } from 'next/navigation';

const Step4Alerts = () => {
  const { formData, updateFormData, setIsLoading } = useOnboarding();
  const router = useRouter();

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // 1. Call API to create project
      const projectResponse = await fetch('/api/projects/default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!projectResponse.ok) throw new Error('Project creation failed');

      const { projectId } = await projectResponse.json();

      // 2. Mark onboarding as complete for the user
      await fetch('/api/user/onboarding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingComplete: true }),
      });

      // 3. Redirect to the new project dashboard
      router.push(`/app/projects/${projectId}`);
    } catch (error) {
      console.error('Onboarding error:', error);
      // Handle error (show a message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  const updateAlerts = (field: 'sentimentThreshold' | 'priceThreshold' | 'channels', value: number | string[]) => {
    updateFormData({
      alerts: {
        ...formData.alerts,
        [field]: value,
      },
    });
  };

  const toggleChannel = (channel: string) => {
    const newChannels = formData.alerts.channels.includes(channel)
      ? formData.alerts.channels.filter(c => c !== channel)
      : [...formData.alerts.channels, channel];

    updateAlerts('channels', newChannels);
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900">Set up your alerts</h2>
      <p className="mb-6 text-slate-600">Get notified about critical shifts in consumer sentiment and price perception.</p>

      {/* Sentiment Threshold */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700">
            Sentiment Change Threshold: {formData.alerts.sentimentThreshold}%
          </label>
          <span className="text-xs text-slate-500">Alert when sentiment changes by this %</span>
        </div>
        <input
          type="range"
          min="10"
          max="50"
          step="5"
          value={formData.alerts.sentimentThreshold}
          onChange={(e) => updateAlerts('sentimentThreshold', parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>10%</span>
          <span>30%</span>
          <span>50%</span>
        </div>
      </div>

      {/* Price Threshold */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700">
            Price Change Threshold: {formData.alerts.priceThreshold}%
          </label>
          <span className="text-xs text-slate-500">Alert when price perception changes by this %</span>
        </div>
        <input
          type="range"
          min="5"
          max="30"
          step="5"
          value={formData.alerts.priceThreshold}
          onChange={(e) => updateAlerts('priceThreshold', parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>5%</span>
          <span>15%</span>
          <span>30%</span>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Notification Channels</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.alerts.channels.includes('email')}
              onChange={() => toggleChannel('email')}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Email notifications</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.alerts.channels.includes('push')}
              onChange={() => toggleChannel('push')}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Push notifications</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.alerts.channels.includes('sms')}
              onChange={() => toggleChannel('sms')}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">SMS alerts (for critical changes)</span>
          </label>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-lg bg-slate-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Your Setup Summary</h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Industries:</span>
            <span className="font-medium">{formData.industries.length} selected</span>
          </div>
          <div className="flex justify-between">
            <span>Languages:</span>
            <span className="font-medium">{formData.languages.length} selected</span>
          </div>
          <div className="flex justify-between">
            <span>Regions:</span>
            <span className="font-medium">{formData.regions.length} selected</span>
          </div>
          <div className="flex justify-between">
            <span>Alert Frequency:</span>
            <span className="font-medium">Sentiment: {formData.alerts.sentimentThreshold}%, Price: {formData.alerts.priceThreshold}%</span>
          </div>
        </div>
      </div>

      {/* Complete Setup Button */}
      <button
        onClick={handleComplete}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
      >
        Complete Setup & Start Monitoring
      </button>
    </div>
  );
};

export default Step4Alerts;
