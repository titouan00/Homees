'use client';

import { useState, useCallback } from 'react';
import { MagnifyingGlass, Funnel, X } from '@phosphor-icons/react';
import { FiltresDemandes } from '@/types/messaging';

interface FiltresDemandesSimpleProps {
  filtres: FiltresDemandes;
  onFiltresChange: (filtres: FiltresDemandes) => void;
  onSearch: (search: string) => void;
  searchValue: string;
  totalResults: number;
}

const STATUTS_OPTIONS = [
  { value: 'ouverte', label: 'Ouverte' },
  { value: 'acceptee', label: 'Acceptée' },
  { value: 'rejetee', label: 'Rejetée' },
  { value: 'terminee', label: 'Terminée' },
];

const TRI_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'statut', label: 'Statut' },
  { value: 'gestionnaire', label: 'Gestionnaire' },
  { value: 'adresse', label: 'Adresse' },
];

/**
 * Composant de filtres simplifié pour les demandes
 */
export default function FiltresDemandesSimple({
  filtres,
  onFiltresChange,
  onSearch,
  searchValue,
  totalResults
}: FiltresDemandesSimpleProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = useCallback((field: keyof FiltresDemandes, value: any) => {
    onFiltresChange({
      ...filtres,
      [field]: value
    });
  }, [filtres, onFiltresChange]);

  const handleStatutToggle = useCallback((statut: string) => {
    const currentStatuts = filtres.statut || [];
    const newStatuts = currentStatuts.includes(statut as any)
      ? currentStatuts.filter(s => s !== statut)
      : [...currentStatuts, statut as any];
    
    handleFilterChange('statut', newStatuts.length > 0 ? newStatuts : undefined);
  }, [filtres.statut, handleFilterChange]);

  const clearFilters = useCallback(() => {
    onFiltresChange({
      tri_par: 'date',
      ordre: 'desc'
    });
    onSearch('');
  }, [onFiltresChange, onSearch]);

  const hasActiveFilters = () => {
    return !!(
      filtres.statut?.length ||
      filtres.ville ||
      filtres.gestionnaire ||
      filtres.date_debut ||
      filtres.date_fin ||
      searchValue
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Barre de recherche principale */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlass className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Rechercher par gestionnaire, adresse, ville..."
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus-primary"
          />
        </div>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
            showAdvanced || hasActiveFilters()
              ? 'border-primary-300 bg-primary-50 text-primary-700'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Funnel className="h-5 w-5" />
          Filtres
          {hasActiveFilters() && (
            <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
              {(() => {
                const count = [
                  filtres.statut?.length || 0,
                  filtres.ville ? 1 : 0,
                  filtres.gestionnaire ? 1 : 0,
                  (filtres.date_debut || filtres.date_fin) ? 1 : 0,
                  searchValue ? 1 : 0
                ].reduce((a, b) => Number(a) + Number(b), 0);
                return count;
              })()}
            </span>
          )}
        </button>
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <div className="space-y-2">
                {STATUTS_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtres.statut?.includes(option.value as any) || false}
                      onChange={() => handleStatutToggle(option.value)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <input
                type="text"
                value={filtres.ville || ''}
                onChange={(e) => handleFilterChange('ville', e.target.value || undefined)}
                placeholder="Paris, Lyon..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
              />
            </div>

            {/* Gestionnaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gestionnaire
              </label>
              <input
                type="text"
                value={filtres.gestionnaire || ''}
                onChange={(e) => handleFilterChange('gestionnaire', e.target.value || undefined)}
                placeholder="Nom ou agence..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
              />
            </div>

            {/* Tri */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trier par
              </label>
              <div className="flex gap-2">
                <select
                  value={filtres.tri_par || 'date'}
                  onChange={(e) => handleFilterChange('tri_par', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus-primary"
                >
                  {TRI_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={filtres.ordre || 'desc'}
                  onChange={(e) => handleFilterChange('ordre', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus-primary"
                >
                  <option value="desc">↓</option>
                  <option value="asc">↑</option>
                </select>
              </div>
            </div>
          </div>

          {/* Période */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={filtres.date_debut || ''}
                onChange={(e) => handleFilterChange('date_debut', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={filtres.date_fin || ''}
                onChange={(e) => handleFilterChange('date_fin', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {totalResults} résultat{totalResults > 1 ? 's' : ''}
            </span>
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <X className="h-4 w-4" />
                Effacer les filtres
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 