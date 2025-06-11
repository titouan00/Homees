'use client';

import { WarningCircle } from 'phosphor-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

/**
 * Composant pour afficher les messages d'erreur de façon uniforme
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`bg-red-500/20 border border-red-500/30 rounded-xl p-3 flex items-center ${className}`}>
      <WarningCircle className="h-4 w-4 text-red-300 mr-2 flex-shrink-0" />
      <p className="text-red-200 text-sm">{message}</p>
    </div>
  );
};

export default ErrorMessage; 