'use client';

import React from 'react';
import { WarningCircle, ArrowCounterClockwise } from '@phosphor-icons/react';
import Button from '@/components/ui/Button';

interface ErrorDisplayProps {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/**
 * Composant réutilisable pour afficher les erreurs de messagerie
 */
const ErrorDisplay = React.memo<ErrorDisplayProps>(({
  title,
  message,
  onRetry,
  retryLabel = 'Réessayer',
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center max-w-md">
        <div className="mb-4">
          <WarningCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600">
            {message}
          </p>
        </div>
        
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            icon={ArrowCounterClockwise}
            className="mt-4"
          >
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
});

ErrorDisplay.displayName = 'ErrorDisplay';

export default ErrorDisplay; 