'use client';

import { useState } from 'react';
import { X, Funnel, CaretUpDown } from '@phosphor-icons/react';
import { FiltresProprietes, TYPES_BIEN, STATUTS_OCCUPATION } from '@/types/propriete';

interface FiltresProprietesProps {
  filtres: FiltresProprietes;
  onFiltresChange: (filtres: FiltresProprietes) => void;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Composant de filtres pour les propriétés
 */
export default function FiltresProprietesComponent({ 
  filtres, 
  onFiltresChange, 
  isOpen, 
  onClose 
}: FiltresProprietesProps) {
  const [filtresLocaux, setFiltresLocaux] = useState<FiltresProprietes>(filtres);

  const handleChange = (field: keyof FiltresProprietes, value: any) => {
    setFiltresLocaux(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filtresLocaux.type_bien || [];
    if (checked) {
      handleChange('type_bien', [...currentTypes, type]);
    } else {
      handleChange('type_bien', currentTypes.filter(t => t !== type));
    }
  };

  const handleStatutChange = (statut: string, checked: boolean) => {
    const currentStatuts = filtresLocaux.statut_occupation || [];
    if (checked) {
      handleChange('statut_occupation', [...currentStatuts, statut]);
    } else {
      handleChange('statut_occupation', currentStatuts.filter(s => s !== statut));
    }
  };

  const appliquerFiltres = () => {
    onFiltresChange(filtresLocaux);
    onClose();
  };

  const reinitialiserFiltres = () => {
    const filtresVides: FiltresProprietes = {
      tri_par: 'date',
      ordre: 'desc'
    };
    setFiltresLocaux(filtresVides);
    onFiltresChange(filtresVides);
  };

  const nombreFiltresActifs = () => {
    let count = 0;
    if (filtresLocaux.type_bien?.length) count++;
    if (filtresLocaux.statut_occupation?.length) count++;
    if (filtresLocaux.ville) count++;
    if (filtresLocaux.surface_min || filtresLocaux.surface_max) count++;
    if (filtresLocaux.loyer_min || filtresLocaux.loyer_max) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Funnel className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
            {nombreFiltresActifs() > 0 && (
              <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                {nombreFiltresActifs()} actif{nombreFiltresActifs() > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tri */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <CaretUpDown className="h-5 w-5" />
              Tri
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trier par
                </label>
                <select
                  value={filtresLocaux.tri_par || 'date'}
                  onChange={(e) => handleChange('tri_par', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
                >
                  <option value="date">Date d'ajout</option>
                  <option value="surface">Surface</option>
                  <option value="loyer">Loyer</option>
                  <option value="adresse">Adresse</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordre
                </label>
                <select
                  value={filtresLocaux.ordre || 'desc'}
                  onChange={(e) => handleChange('ordre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
                >
                  <option value="desc">Décroissant</option>
                  <option value="asc">Croissant</option>
                </select>
              </div>
            </div>
          </div>

          {/* Type de bien */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Type de bien</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TYPES_BIEN.map((type) => (
                <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtresLocaux.type_bien?.includes(type.value) || false}
                    onChange={(e) => handleTypeChange(type.value, e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    {type.icon} {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Statut d'occupation */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statut d'occupation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {STATUTS_OCCUPATION.map((statut) => (
                <label key={statut.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtresLocaux.statut_occupation?.includes(statut.value) || false}
                    onChange={(e) => handleStatutChange(statut.value, e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{statut.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ville */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Localisation</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <input
                type="text"
                value={filtresLocaux.ville || ''}
                onChange={(e) => handleChange('ville', e.target.value)}
                placeholder="Paris, Lyon, Marseille..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
              />
            </div>
          </div>

          {/* Surface */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Surface (m²)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum
                </label>
                <input
                  type="number"
                  value={filtresLocaux.surface_min || ''}
                  onChange={(e) => handleChange('surface_min', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum
                </label>
                <input
                  type="number"
                  value={filtresLocaux.surface_max || ''}
                  onChange={(e) => handleChange('surface_max', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
                />
              </div>
            </div>
          </div>

          {/* Loyer */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Loyer indicatif (€/mois)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum
                </label>
                <input
                  type="number"
                  value={filtresLocaux.loyer_min || ''}
                  onChange={(e) => handleChange('loyer_min', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum
                </label>
                <input
                  type="number"
                  value={filtresLocaux.loyer_max || ''}
                  onChange={(e) => handleChange('loyer_max', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="3000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between gap-3">
            <button
              onClick={reinitialiserFiltres}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Réinitialiser
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={appliquerFiltres}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover-primary transition-colors font-medium"
              >
                Appliquer les filtres
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}