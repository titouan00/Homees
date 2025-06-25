'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlass, Funnel, X, CaretUpDown, Buildings, User, CurrencyEur, Ruler } from '@phosphor-icons/react';
import { FiltresProprietes, TYPES_BIEN, STATUTS_OCCUPATION } from '@/types/propriete';

interface FiltresProprietesProps {
  filtres: FiltresProprietes;
  onFiltresChange: (filtres: FiltresProprietes) => void;
  onSearch: (search: string) => void;
  searchValue: string;
  totalResults: number;
}

/**
 * Composant de filtres pour les propriétés - Style menu déroulant
 */
export default function FiltresProprietesComponent({ 
  filtres, 
  onFiltresChange, 
  onSearch,
  searchValue,
  totalResults
}: FiltresProprietesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FiltresProprietes, value: any) => {
    onFiltresChange({
      ...filtres,
      [key]: value
    });
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filtres.type_bien || [];
    if (checked) {
      handleFilterChange('type_bien', [...currentTypes, type]);
    } else {
      handleFilterChange('type_bien', currentTypes.filter(t => t !== type));
    }
  };

  const handleStatutChange = (statut: string, checked: boolean) => {
    const currentStatuts = filtres.statut_occupation || [];
    if (checked) {
      handleFilterChange('statut_occupation', [...currentStatuts, statut]);
    } else {
      handleFilterChange('statut_occupation', currentStatuts.filter(s => s !== statut));
    }
  };

  const clearFilters = () => {
    onFiltresChange({
      tri_par: 'date',
      ordre: 'desc'
    });
    onSearch('');
  };

  const nombreFiltresActifs = () => {
    let count = 0;
    if (filtres.type_bien?.length) count++;
    if (filtres.statut_occupation?.length) count++;
    if (filtres.ville) count++;
    if (filtres.surface_min || filtres.surface_max) count++;
    if (filtres.loyer_min || filtres.loyer_max) count++;
    return count;
  };

  const hasActiveFilters = nombreFiltresActifs() > 0 || (searchValue && searchValue.length > 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Barre de recherche et bouton filtres */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Recherche */}
        <div className="flex-1 relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher par adresse, ville..."
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
            {nombreFiltresActifs() > 0 && (
              <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                {nombreFiltresActifs()}
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
        {totalResults} bien{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
      </div>

      {/* Filtres avancés */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-6">
          {/* Première ligne: Tri et ordre */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
            {/* Tri par */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CaretUpDown className="h-4 w-4" />
                Trier par
              </label>
              <select
                value={filtres.tri_par || 'date'}
                onChange={(e) => handleFilterChange('tri_par', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="date">Date d'ajout</option>
                <option value="surface">Surface</option>
                <option value="loyer">Loyer</option>
                <option value="adresse">Adresse</option>
              </select>
            </div>

            {/* Ordre */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Ordre
              </label>
              <select
                value={filtres.ordre || 'desc'}
                onChange={(e) => handleFilterChange('ordre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="desc">Décroissant</option>
                <option value="asc">Croissant</option>
              </select>
            </div>

            {/* Ville */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Buildings className="h-4 w-4" />
                Ville
              </label>
              <input
                type="text"
                placeholder="Paris, Lyon..."
                value={filtres.ville || ''}
                onChange={(e) => handleFilterChange('ville', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Surface minimum */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Ruler className="h-4 w-4" />
                Surface min (m²)
              </label>
              <input
                type="number"
                placeholder="0"
                value={filtres.surface_min || ''}
                onChange={(e) => handleFilterChange('surface_min', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Surface maximum */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Ruler className="h-4 w-4" />
                Surface max (m²)
              </label>
              <input
                type="number"
                placeholder="500"
                value={filtres.surface_max || ''}
                onChange={(e) => handleFilterChange('surface_max', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

                         {/* Loyer minimum */}
             <div>
               <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                 <CurrencyEur className="h-4 w-4" />
                 Loyer min (€)
               </label>
               <input
                 type="number"
                 placeholder="0"
                 value={filtres.loyer_min || ''}
                 onChange={(e) => handleFilterChange('loyer_min', e.target.value ? Number(e.target.value) : undefined)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
               />
             </div>
           </div>

           {/* Deuxième ligne: Loyer maximum */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
             {/* Loyer maximum */}
             <div>
               <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                 <CurrencyEur className="h-4 w-4" />
                 Loyer max (€)
               </label>
               <input
                 type="number"
                 placeholder="3000"
                 value={filtres.loyer_max || ''}
                 onChange={(e) => handleFilterChange('loyer_max', e.target.value ? Number(e.target.value) : undefined)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
               />
             </div>
           </div>

          {/* Deuxième ligne: Type de bien */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Buildings className="h-4 w-4" />
              Type de bien
            </label>
            <div className="flex flex-wrap gap-3">
              {TYPES_BIEN.map((type) => (
                <label key={type.value} className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg border transition-colors">
                  <input
                    type="checkbox"
                    checked={filtres.type_bien?.includes(type.value) || false}
                    onChange={(e) => handleTypeChange(type.value, e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">
                    {type.icon} {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Troisième ligne: Statut d'occupation */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <User className="h-4 w-4" />
              Statut d'occupation
            </label>
            <div className="flex flex-wrap gap-3">
              {STATUTS_OCCUPATION.map((statut) => (
                <label key={statut.value} className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg border transition-colors">
                  <input
                    type="checkbox"
                    checked={filtres.statut_occupation?.includes(statut.value) || false}
                    onChange={(e) => handleStatutChange(statut.value, e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{statut.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}