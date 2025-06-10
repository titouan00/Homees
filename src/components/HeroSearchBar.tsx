'use client';

import { Search } from 'lucide-react';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';
import { useHeroSearch } from './search/useHeroSearch';

/**
 * Interface pour les props du composant HeroSearchBar
 */
interface HeroSearchBarProps {
  className?: string;
}

/**
 * Composant de barre de recherche refactorisé pour la section hero
 * 
 * Architecture modulaire :
 * - useHeroSearch : Hook pour la logique de recherche et navigation
 * - GooglePlacesAutocomplete : Composant d'autocomplétion Places refactorisé
 * 
 * @param className - Classes CSS supplémentaires
 */
export default function HeroSearchBar({ className = "" }: HeroSearchBarProps) {
  const {
    searchValue,
    selectedPlace,
    handlePlaceSelect,
    handleSearchChange,
    handleSubmit,
    canSearch
  } = useHeroSearch();

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
          disabled={!canSearch}
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