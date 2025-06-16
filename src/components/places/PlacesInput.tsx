'use client';

import { MapPin } from '@phosphor-icons/react';
import { MESSAGES } from '@/lib/constants';

interface PlacesInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  isLoaded: boolean;
  placeholder: string;
  value?: string;
  className: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Composant d'input pour l'autocomplétion Places
 */
const PlacesInput: React.FC<PlacesInputProps> = ({
  inputRef,
  isLoaded,
  placeholder,
  value,
  className,
  onInputChange
}) => {
  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
      <input
        ref={inputRef}
        type="text"
        placeholder={isLoaded ? placeholder : MESSAGES.loading.googleMaps}
        disabled={!isLoaded}
        value={value}
        onChange={onInputChange}
        className={`w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      />
      
      {/* Indicateur de chargement */}
      {!isLoaded && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
        </div>
      )}
    </div>
  );
};

export default PlacesInput; 