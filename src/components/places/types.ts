/**
 * Types et interfaces pour le système Google Places Autocomplete
 */

export interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export interface PlacesState {
  isLoaded: boolean;
  error: string;
  showParisWarning: boolean;
}

export interface PlacesRefs {
  inputRef: React.RefObject<HTMLInputElement>;
  autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>;
  warningTimeoutRef: React.MutableRefObject<NodeJS.Timeout | undefined>;
} 