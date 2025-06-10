'use client';

import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  show: boolean;
}

/**
 * Composant message de succès - Design préservé exactement
 */
const SuccessMessage: React.FC<SuccessMessageProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-4 mb-6 flex items-center animate-fade-in">
      <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
      <div>
        <h3 className="text-emerald-300 font-semibold text-sm">Message envoyé !</h3>
        <p className="text-emerald-200 text-xs">Nous vous répondrons rapidement.</p>
      </div>
    </div>
  );
};

export default SuccessMessage; 