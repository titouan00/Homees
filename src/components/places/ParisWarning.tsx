'use client';

import { WarningCircle } from '@phosphor-icons/react';
import { MESSAGES } from '@/lib/constants';

interface ParisWarningProps {
  show: boolean;
}

/**
 * Composant d'avertissement "Paris uniquement"
 */
const ParisWarning: React.FC<ParisWarningProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50">
      <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <WarningCircle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-orange-100 font-medium text-sm mb-1">
              {MESSAGES.parisOnly.title}
            </h4>
            <p className="text-orange-200 text-xs leading-relaxed mb-2">
              {MESSAGES.parisOnly.description}
            </p>
            <p className="text-orange-300 text-xs font-medium">
              {MESSAGES.parisOnly.futureExpansion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParisWarning; 