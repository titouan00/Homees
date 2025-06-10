'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { 
  GOOGLE_MAPS_CONFIG, 
  PARIS_BOUNDS, 
  MESSAGES, 
  PLACES_FIELDS, 
  PLACES_TYPES,
  LOCATION_RESTRICTIONS,
  TIMEOUTS
} from '@/lib/constants';
import { PlacesState, PlacesRefs } from './types';
import { isAddressInParis } from './placesUtils';

/**
 * Hook personnalisé pour gérer l'autocomplétion Google Places
 */
export const usePlacesAutocomplete = (onPlaceSelect: (place: google.maps.places.PlaceResult) => void) => {
  // États
  const [state, setState] = useState<PlacesState>({
    isLoaded: false,
    error: '',
    showParisWarning: false,
  });

  // Refs
  const refs: PlacesRefs = {
    inputRef: useRef<HTMLInputElement>(null),
    autocompleteRef: useRef<google.maps.places.Autocomplete | null>(null),
    warningTimeoutRef: useRef<NodeJS.Timeout | undefined>(undefined),
  };

  /**
   * Initialise l'API Google Maps
   */
  useEffect(() => {
    const initializeGoogleMaps = async () => {
      if (!GOOGLE_MAPS_CONFIG.apiKey) {
        setState(prev => ({ ...prev, error: MESSAGES.errors.apiKeyMissing }));
        return;
      }

      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_CONFIG.apiKey,
          version: GOOGLE_MAPS_CONFIG.version,
          libraries: GOOGLE_MAPS_CONFIG.libraries as any[]
        });

        await loader.load();
        setState(prev => ({ ...prev, isLoaded: true }));
      } catch (err) {
        console.error('Erreur lors du chargement de Google Maps:', err);
        setState(prev => ({ ...prev, error: MESSAGES.errors.mapLoadFailed }));
      }
    };

    initializeGoogleMaps();
  }, []);

  /**
   * Configure l'autocomplétion
   */
  useEffect(() => {
    if (!state.isLoaded || !refs.inputRef.current || !window.google) return;

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(refs.inputRef.current, {
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(PARIS_BOUNDS.south, PARIS_BOUNDS.west),
          new window.google.maps.LatLng(PARIS_BOUNDS.north, PARIS_BOUNDS.east)
        ),
        strictBounds: LOCATION_RESTRICTIONS.strictBounds,
        componentRestrictions: { country: LOCATION_RESTRICTIONS.country },
        fields: Array.from(PLACES_FIELDS),
        types: Array.from(PLACES_TYPES)
      });

      refs.autocompleteRef.current = autocomplete;

      const handlePlaceSelect = () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry?.location) {
          setState(prev => ({ ...prev, error: MESSAGES.errors.invalidAddress }));
          return;
        }

        const isInParis = isAddressInParis(place);
        
        if (!isInParis) {
          showParisOnlyWarning();
          return;
        }

        setState(prev => ({ ...prev, error: '' }));
        hideParisWarning();
        onPlaceSelect(place);
      };

      autocomplete.addListener('place_changed', handlePlaceSelect);

      return () => {
        if (refs.autocompleteRef.current && window.google) {
          window.google.maps.event.clearInstanceListeners(refs.autocompleteRef.current);
        }
      };
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de l\'autocomplétion:', err);
      setState(prev => ({ ...prev, error: 'Erreur lors de l\'initialisation' }));
    }
  }, [state.isLoaded, onPlaceSelect]);

  /**
   * Affiche l'avertissement Paris uniquement
   */
  const showParisOnlyWarning = () => {
    setState(prev => ({ ...prev, showParisWarning: true, error: '' }));
    
    if (refs.warningTimeoutRef.current) {
      clearTimeout(refs.warningTimeoutRef.current);
    }
    
    refs.warningTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, showParisWarning: false }));
    }, TIMEOUTS.warningDisplay);
  };

  /**
   * Masque l'avertissement Paris uniquement
   */
  const hideParisWarning = () => {
    setState(prev => ({ ...prev, showParisWarning: false }));
    if (refs.warningTimeoutRef.current) {
      clearTimeout(refs.warningTimeoutRef.current);
    }
  };

  /**
   * Gestionnaire de changement d'input
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, onChange?: (value: string) => void) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    
    if (state.error || state.showParisWarning) {
      setState(prev => ({ ...prev, error: '' }));
      hideParisWarning();
    }
  };

  /**
   * Nettoyage
   */
  useEffect(() => {
    return () => {
      if (refs.warningTimeoutRef.current) {
        clearTimeout(refs.warningTimeoutRef.current);
      }
    };
  }, []);

  return {
    state,
    refs,
    handleInputChange,
  };
}; 