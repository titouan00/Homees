'use client';

import { Check } from 'phosphor-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

/**
 * Composant indicateur d'étapes pour le signup
 */
const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <div key={stepNumber} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
              isCompleted 
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : isCurrent 
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10'
                  : 'border-purple-300/50 text-purple-300/50'
            }`}>
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm font-semibold">{stepNumber}</span>
              )}
            </div>
            
            {stepNumber < totalSteps && (
              <div className={`w-12 h-0.5 mx-2 transition-all ${
                stepNumber < currentStep ? 'bg-emerald-500' : 'bg-purple-300/30'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator; 