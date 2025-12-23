'use client';

import { FaCheck } from 'react-icons/fa';

interface Step {
  id: number;
  title: string;
  icon: string;
}

interface FormStepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function FormSteps({ steps, currentStep, onStepClick }: FormStepsProps) {
  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-5 right-0 left-0 h-0.5 bg-gray-200">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick?.(step.id)}
              disabled={step.id > currentStep}
              className={`flex flex-col items-center ${
                step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
            >
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <FaCheck className="w-4 h-4" />
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>

              {/* Title */}
              <span
                className={`mt-2 text-sm font-medium ${
                  isCurrent ? 'text-emerald-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}