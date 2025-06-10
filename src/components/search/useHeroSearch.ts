'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook personnalisé pour gérer la logique de recherche du Hero
 */
export const useHeroSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const router = useRouter();

  /**
   * Gestionnaire de sélection d'adresse via Google Places
   */
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    setSelectedPlace(place);
    setSearchValue(place.formatted_address || '');
  };

  /**
   * Gestionnaire de changement de valeur de l'input
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

  return {
    searchValue,
    selectedPlace,
    handlePlaceSelect,
    handleSearchChange,
    handleSubmit,
    canSearch: !!selectedPlace || !!searchValue.trim()
  };
};