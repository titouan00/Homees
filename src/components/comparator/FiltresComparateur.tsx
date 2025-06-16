'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlass, Funnel, X, Star, MapPin, CurrencyEur, Globe, Buildings, Plus } from '@phosphor-icons/react';
import { FiltresComparateur, LangueDisponible, TypeGestionnaire } from '@/types/gestionnaire';
import { LANGUES_DISPONIBLES, TYPES_GESTIONNAIRE } from '@/lib/constants';

interface FiltresComparateurProps {
  filtres: FiltresComparateur;
  onFiltresChange: (nouveauFiltres: FiltresComparateur) => void;
  onSearch: (search: string) => void;
  searchValue: string;
  totalResults: number;
}

/**
 * Composant de filtres pour le comparateur de gestionnaires
 */
export default function FiltresComparateurComponent({
  filtres,
  onFiltresChange,
  onSearch,
  searchValue,
  totalResults
}: FiltresComparateurProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLangueDropdown, setShowLangueDropdown] = useState(false);
  const langueDropdownRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = (key: keyof FiltresComparateur, value: any) => {
    onFiltresChange({
      ...filtres,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltresChange({});
    onSearch('');
  };

  const hasActiveFilters = (filtres && Object.keys(filtres).length > 0) || (searchValue && searchValue.length > 0);

  // Fermer le dropdown des langues quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langueDropdownRef.current && !langueDropdownRef.current.contains(event.target as Node)) {
        setShowLangueDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Barre de recherche et bouton filtres */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Recherche */}
        <div className="flex-1 relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher par nom d'agence, gestionnaire..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
              isExpanded 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Funnel className="h-5 w-5" />
            Filtres
            {hasActiveFilters && (
              <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                {Object.keys(filtres).length + (searchValue ? 1 : 0)}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Résultats count */}
      <div className="text-sm text-gray-600 mb-4">
        {totalResults} gestionnaire{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
      </div>

              {/* Filtres avancés */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            {/* Zone d'intervention */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4" />
                Zone d'intervention
              </label>
              <input
                type="text"
                placeholder="Ex: Paris 16e, Lyon..."
                value={filtres.zone_intervention || ''}
                onChange={(e) => handleFilterChange('zone_intervention', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Tarif minimum */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CurrencyEur className="h-4 w-4" />
                Tarif minimum (€)
              </label>
              <input
                type="number"
                placeholder="0"
                value={filtres.tarif_min || ''}
                onChange={(e) => handleFilterChange('tarif_min', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Tarif maximum */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CurrencyEur className="h-4 w-4" />
                Tarif maximum (€)
              </label>
              <input
                type="number"
                placeholder="1000"
                value={filtres.tarif_max || ''}
                onChange={(e) => handleFilterChange('tarif_max', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Note minimum */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Star className="h-4 w-4" />
                Note minimum
              </label>
              <select
                value={filtres.note_min || ''}
                onChange={(e) => handleFilterChange('note_min', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Toutes les notes</option>
                <option value="1">1 étoile et +</option>
                <option value="2">2 étoiles et +</option>
                <option value="3">3 étoiles et +</option>
                <option value="4">4 étoiles et +</option>
                <option value="5">5 étoiles</option>
              </select>
            </div>

            {/* Langues parlées - Interface compacte */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Globe className="h-4 w-4" />
                Langues parlées
              </label>
              <div className="relative" ref={langueDropdownRef}>
                <div className="flex items-start gap-2 min-h-[42px] max-h-[84px] overflow-y-auto p-2 border border-gray-300 rounded-lg bg-white">
                  {/* Langues sélectionnées */}
                  {filtres.langues_parlees && filtres.langues_parlees.length > 0 ? (
                    <>
                      <div className="flex items-center gap-1 flex-wrap flex-1">
                        {filtres.langues_parlees.map((langueCode) => {
                          const langue = LANGUES_DISPONIBLES.find(l => l.code === langueCode);
                          return (
                            <div
                              key={langueCode}
                              className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-xs border border-emerald-200"
                            >
                              <span>{langue?.flag}</span>
                              <span>{langue?.label}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newLangues = filtres.langues_parlees!.filter(l => l !== langueCode);
                                  handleFilterChange('langues_parlees', newLangues.length > 0 ? newLangues : undefined);
                                }}
                                className="ml-1 text-emerald-600 hover:text-emerald-800"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setShowLangueDropdown(!showLangueDropdown)}
                        className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors mt-0.5"
                      >
                        <Plus className="h-3 w-3 text-gray-600" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowLangueDropdown(!showLangueDropdown)}
                      className="flex items-center gap-2 text-gray-500 text-sm w-full"
                    >
                      <span>Sélectionner</span>
                      <Plus className="h-4 w-4 ml-auto" />
                    </button>
                  )}
                </div>

                {/* Dropdown des langues */}
                {showLangueDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs text-gray-500 mb-2 px-2">Cliquez pour ajouter/retirer</div>
                      {LANGUES_DISPONIBLES.map((langue) => {
                        const isSelected = filtres.langues_parlees?.includes(langue.code as LangueDisponible) || false;
                        return (
                          <button
                            key={langue.code}
                            onClick={() => {
                              const currentLangues = filtres.langues_parlees || [];
                              const newLangues = isSelected
                                ? currentLangues.filter(l => l !== langue.code)
                                : [...currentLangues, langue.code as LangueDisponible];
                              handleFilterChange('langues_parlees', newLangues.length > 0 ? newLangues : undefined);
                            }}
                            className={`flex items-center gap-2 w-full px-2 py-2 rounded-md transition-colors text-left ${
                              isSelected
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <span className="text-lg">{langue.flag}</span>
                            <span className="text-sm">{langue.label}</span>
                            {isSelected && (
                              <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filtres par type de gestionnaire */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Buildings className="h-4 w-4" />
              Type de gestionnaire
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {TYPES_GESTIONNAIRE.map((type) => {
                const isSelected = filtres.type_gestionnaire?.includes(type.code as TypeGestionnaire) || false;
                return (
                  <button
                    key={type.code}
                    onClick={() => {
                      const currentTypes = filtres.type_gestionnaire || [];
                      const newTypes = isSelected
                        ? currentTypes.filter(t => t !== type.code)
                        : [...currentTypes, type.code as TypeGestionnaire];
                      handleFilterChange('type_gestionnaire', newTypes.length > 0 ? newTypes : undefined);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tri */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Trier par
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'note', label: 'Note', icon: Star },
                { value: 'prix', label: 'Prix', icon: CurrencyEur },
                { value: 'avis', label: 'Nombre d\'avis', icon: Star },
                { value: 'nom', label: 'Nom', icon: MapPin }
              ].map(({ value, label, icon: IconComponent }) => (
                <button
                  key={value}
                  onClick={() => {
                    if (filtres.tri_par === value) {
                      handleFilterChange('ordre', filtres.ordre === 'asc' ? 'desc' : 'asc');
                    } else {
                      handleFilterChange('tri_par', value);
                      handleFilterChange('ordre', value === 'prix' ? 'asc' : 'desc');
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    filtres.tri_par === value
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {label}
                  {filtres.tri_par === value && (
                    <span className="text-xs">
                      {filtres.ordre === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 