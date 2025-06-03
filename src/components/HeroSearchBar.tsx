'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';

/**
 * Interface pour les props du composant HeroSearchBar
 */
interface HeroSearchBarProps {
  className?: string;
}

/**
 * Composant de barre de recherche pour la section hero de la landing page
 * Intègre l'autocomplétion Google Places avec restriction à Paris
 * 
 * @param className - Classes CSS supplémentaires
 */
export default function HeroSearchBar({ className = "" }: HeroSearchBarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const router = useRouter();

  /**
   * Gestionnaire de sélection d'adresse via Google Places
   * 
   * @param place - Résultat sélectionné depuis Google Places
   */
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    setSelectedPlace(place);
    setSearchValue(place.formatted_address || '');
  };

  /**
   * Gestionnaire de changement de valeur de l'input
   * 
   * @param value - Nouvelle valeur de l'input
   */
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    
    // Si l'utilisateur modifie manuellement, réinitialiser la sélection
    if (selectedPlace && value !== selectedPlace.formatted_address) {
      setSelectedPlace(null);
    }
  };

  /**
   * Gestionnaire de soumission de recherche
   * Redirige vers la page de recherche avec l'adresse sélectionnée
   */
  const handleSearch = () => {
    if (!selectedPlace && !searchValue.trim()) {
      return; // Ne rien faire si aucune adresse n'est saisie
    }

    // Si une adresse Google Places est sélectionnée, utiliser ses données
    if (selectedPlace) {
      const searchParams = new URLSearchParams({
        address: selectedPlace.formatted_address || '',
        place_id: selectedPlace.place_id || '',
        lat: selectedPlace.geometry?.location?.lat()?.toString() || '',
        lng: selectedPlace.geometry?.location?.lng()?.toString() || ''
      });
      
      router.push(`/recherche?${searchParams.toString()}`);
    } else {
      // Recherche manuelle (pas recommandée mais possible)
      const searchParams = new URLSearchParams({
        q: searchValue.trim()
      });
      
      router.push(`/recherche?${searchParams.toString()}`);
    }
  };

  /**
   * Gestionnaire de soumission du formulaire
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className={`bg-white/10 backdrop-blur-md p-3 rounded-2xl shadow-2xl ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* Champ d'autocomplétion Google Places */}
        <div className="flex-1">
          <GooglePlacesAutocomplete
            onPlaceSelect={handlePlaceSelect}
            placeholder="Où se trouve votre bien à Paris ?"
            value={searchValue}
            onChange={handleSearchChange}
            className="rounded-xl"
          />
        </div>
        
        {/* Bouton de recherche */}
        <button 
          type="submit"
          disabled={!selectedPlace && !searchValue.trim()}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          <Search className="h-5 w-5 mr-2" />
          Rechercher
        </button>
      </form>
      
      {/* Texte d'information sous la barre de recherche */}
      <div className="mt-3 text-center">
        <p className="text-white/80 text-sm">
          🏢 Service actuellement disponible à <span className="font-semibold">Paris</span> uniquement
        </p>
      </div>
    </div>
  );
} 