import React from 'react';
import { AppStep } from '../types';

interface StepIndicatorProps {
  currentStep: AppStep;
  setStep: (step: AppStep) => void;
}

const steps = [
  { id: AppStep.INITIAL_PETITION, label: "1. Petição Inicial" },
  { id: AppStep.CONTESTATION, label: "2. Contestações" },
  { id: AppStep.REVIEW_GENERATE, label: "3. Gerar" },
  { id: AppStep.RESULT, label: "4. Resultado" },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, setStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="flex items-center">
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-colors duration-200
                  ${isActive ? 'border-blue-600 bg-blue-600 text-white' : 
                    isCompleted ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 text-gray-400'}
                `}
                onClick={() => {
                  if (isCompleted) setStep(step.id);
                }}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <span className={`ml-2 mr-4 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'} hidden sm:block`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mr-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};