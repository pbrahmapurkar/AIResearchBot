'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between">
        {[...Array(totalSteps)].map((_, i) => (
          <div
            key={i + 1}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              i + 1 <= currentStep
                ? 'bg-blue-600 text-white'
                : 'border border-slate-300 bg-white text-slate-400'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div className="h-2.5 w-full rounded-full bg-slate-200">
        <div
          className="h-2.5 rounded-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="mt-2 flex justify-between text-xs font-medium text-slate-500">
        <span>Industry</span>
        <span>Languages</span>
        <span>Regions</span>
        <span>Alerts</span>
      </div>
    </div>
  );
};

export default ProgressBar;
