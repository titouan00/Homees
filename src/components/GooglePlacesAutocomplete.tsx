'use client';

import { WarningCircle } from '@phosphor-icons/react';
import { usePlacesAutocomplete } from './places/usePlacesAutocomplete';
import { GooglePlacesAutocompleteProps } from './places/types';
import PlacesInput from './places/PlacesInput';
import ParisWarning from './places/ParisWarning';

/**
 * Composant d'autocomplétion Google Places refactorisé avec restriction à Paris
 * 
 * Architecture modulaire :
 * - usePlacesAutocomplete : Hook pour la logique Google Maps
 * - placesUtils : Utilitaires de validation des adresses
 * - PlacesInput : Input avec icône et état de chargement
 * - ParisWarning : Avertissement pour les adresses hors Paris
 * 
 * @param onPlaceSelect - Callback appelé quand une adresse est sélectionnée
 * @param placeholder - Texte de placeholder pour l'input
 * @param className - Classes CSS supplémentaires
 * @param value - Valeur contrôlée de l'input
 * @param onChange - Callback pour les changements de valeur
 */
export default function GooglePlacesAutocomplete({
  onPlaceSelect,
  placeholder = "Rechercher une adresse à Paris...",
  className = "",
  value,
  onChange
}: GooglePlacesAutocompleteProps) {
  
  const { state, refs, handleInputChange } = usePlacesAutocomplete(onPlaceSelect);

  // Gestionnaire d'input avec callback onChange
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e, onChange);
  };

  // Affichage en cas d'erreur de configuration
  if (state.error && !state.showParisWarning) {
    return (
      <div className="relative">
        <div className="flex items-center bg-red-500/20 border border-red-500/30 rounded-xl p-3">
          <WarningCircle className="h-4 w-4 text-red-400 mr-2" />
          <span className="text-red-200 text-sm">{state.error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <PlacesInput
        inputRef={refs.inputRef}
        isLoaded={state.isLoaded}
        placeholder={placeholder}
        value={value}
        className={className}
        onInputChange={onInputChange}
      />
      
      <ParisWarning show={state.showParisWarning} />
    </div>
  );
} 