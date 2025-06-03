'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, AlertCircle } from 'lucide-react';
import { 
  GOOGLE_MAPS_CONFIG, 
  PARIS_BOUNDS, 
  PARIS_POSTAL_CODES, 
  MESSAGES, 
  PLACES_FIELDS, 
  PLACES_TYPES,
  LOCATION_RESTRICTIONS,
  TIMEOUTS
} from '@/lib/constants';

/**
 * Interface pour les props du composant GooglePlacesAutocomplete
 */
interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * Composant d'autocomplétion Google Places avec restriction à Paris
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
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');
  const [showParisWarning, setShowParisWarning] = useState(false);
  const warningTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * Initialise l'API Google Maps et l'autocomplétion
   */
  useEffect(() => {
    const initializeGoogleMaps = async () => {
      if (!GOOGLE_MAPS_CONFIG.apiKey) {
        setError(MESSAGES.errors.apiKeyMissing);
        return;
      }

      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_CONFIG.apiKey,
          version: GOOGLE_MAPS_CONFIG.version,
          libraries: GOOGLE_MAPS_CONFIG.libraries as any[]
        });

        await loader.load();
        setIsLoaded(true);
      } catch (err) {
        console.error('Erreur lors du chargement de Google Maps:', err);
        setError(MESSAGES.errors.mapLoadFailed);
      }
    };

    initializeGoogleMaps();
  }, []);

  /**
   * Configure l'autocomplétion une fois Google Maps chargé
   */
  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google) return;

    try {
      // Configuration de l'autocomplétion avec restriction à Paris
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(PARIS_BOUNDS.south, PARIS_BOUNDS.west),
          new window.google.maps.LatLng(PARIS_BOUNDS.north, PARIS_BOUNDS.east)
        ),
        strictBounds: LOCATION_RESTRICTIONS.strictBounds,
        componentRestrictions: { country: LOCATION_RESTRICTIONS.country },
        fields: Array.from(PLACES_FIELDS),
        types: Array.from(PLACES_TYPES)
      });

      autocompleteRef.current = autocomplete;

      // Gestionnaire de sélection d'adresse
      const handlePlaceSelect = () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry?.location) {
          setError(MESSAGES.errors.invalidAddress);
          return;
        }

        // Vérifier si l'adresse est à Paris
        const isInParis = isAddressInParis(place);
        
        if (!isInParis) {
          showParisOnlyWarning();
          return;
        }

        setError('');
        hideParisWarning();
        onPlaceSelect(place);
      };

      autocomplete.addListener('place_changed', handlePlaceSelect);

      return () => {
        if (autocompleteRef.current && window.google) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de l\'autocomplétion:', err);
      setError('Erreur lors de l\'initialisation');
    }
  }, [isLoaded, onPlaceSelect]);

  /**
   * Affiche l'avertissement "Paris uniquement" avec auto-masquage
   */
  const showParisOnlyWarning = () => {
    setShowParisWarning(true);
    setError('');
    
    // Nettoyer le timeout précédent s'il existe
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    
    // Programmer le masquage automatique
    warningTimeoutRef.current = setTimeout(() => {
      setShowParisWarning(false);
    }, TIMEOUTS.warningDisplay);
  };

  /**
   * Masque l'avertissement "Paris uniquement"
   */
  const hideParisWarning = () => {
    setShowParisWarning(false);
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
  };

  /**
   * Vérifie si une adresse est située à Paris
   * 
   * @param place - Résultat de Google Places
   * @returns true si l'adresse est à Paris
   */
  const isAddressInParis = (place: google.maps.places.PlaceResult): boolean => {
    if (!place.address_components) return false;

    const addressComponents = place.address_components;
    
    for (const component of addressComponents) {
      const types = component.types;
      const longName = component.long_name.toLowerCase();

      // Vérifier le nom de la ville
      if (types.includes('locality') && longName === 'paris') {
        return true;
      }

      // Vérifier les codes postaux parisiens
      if (types.includes('postal_code')) {
        const postalCode = component.long_name;
        if (PARIS_POSTAL_CODES.pattern.test(postalCode)) {
          return true;
        }
      }

      // Vérifier les arrondissements
      if (types.includes('sublocality') && longName.includes('arrondissement')) {
        return true;
      }
    }

    return false;
  };

  /**
   * Gestionnaire de changement de valeur de l'input
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    
    // Réinitialiser les erreurs et avertissements quand l'utilisateur tape
    if (error || showParisWarning) {
      setError('');
      hideParisWarning();
    }
  };

  /**
   * Nettoyage lors du démontage du composant
   */
  useEffect(() => {
    return () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, []);

  // Affichage en cas d'erreur de configuration
  if (error && !showParisWarning) {
    return (
      <div className="relative">
        <div className="flex items-center bg-red-500/20 border border-red-500/30 rounded-xl p-3">
          <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
          <span className="text-red-200 text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Input d'autocomplétion */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
        <input
          ref={inputRef}
          type="text"
          placeholder={isLoaded ? placeholder : MESSAGES.loading.googleMaps}
          disabled={!isLoaded}
          value={value}
          onChange={handleInputChange}
          className={`w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        />
        
        {/* Indicateur de chargement */}
        {!isLoaded && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
          </div>
        )}
      </div>

      {/* Avertissement Paris uniquement */}
      {showParisWarning && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
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
      )}
    </div>
  );
} 