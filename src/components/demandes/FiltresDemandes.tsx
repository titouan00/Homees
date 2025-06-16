'use client';

import { useState } from 'react';
import { X, Funnel, CaretUpDown } from '@phosphor-icons/react';
import { FiltresDemandes } from '@/types/messaging';

interface FiltresDemandesProps {
  filtres: FiltresDemandes;
  onFiltresChange: (filtres: FiltresDemandes) => void;
  isOpen: boolean;
  onClose: () => void;
}

const STATUTS_DEMANDE = [
  { value: 'ouverte', label: 'Ouverte', color: 'bg-blue-100 text-blue-800' },
  { value: 'acceptee', label: 'Acceptée', color: 'bg-green-100 text-green-800' },
  { value: 'rejetee', label: 'Rejetée', color: 'bg-red-100 text-red-800' },
  { value: 'terminee', label: 'Terminée', color: 'bg-gray-100 text-gray-800' },
];

/**
 * Composant de filtres pour les demandes
 */
export default function FiltresDemandesComponent({ 
  filtres, 
  onFiltresChange, 
  isOpen, 
  onClose 
}: FiltresDemandesProps) {
  const [filtresLocaux, setFiltresLocaux] = useState<FiltresDemandes>(filtres);

  const handleChange = (field: keyof FiltresDemandes, value: any) => {
    setFiltresLocaux(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatutChange = (statut: string, checked: boolean) => {
    const currentStatuts = filtresLocaux.statut || [];
    if (checked) {
      handleChange('statut', [...currentStatuts, statut as any]);
    } else {
      handleChange('statut', currentStatuts.filter(s => s !== statut));
    }
  };

  const appliquerFiltres = () => {
    onFiltresChange(filtresLocaux);
    onClose();
  };

  const reinitialiserFiltres = () => {
    const filtresVides: FiltresDemandes = {
      tri_par: 'date',
      ordre: 'desc'
    };
    setFiltresLocaux(filtresVides);
    onFiltresChange(filtresVides);
  };

  const nombreFiltresActifs = () => {
    let count = 0;
    if (filtresLocaux.statut?.length) count++;
    if (filtresLocaux.ville) count++;
    if (filtresLocaux.gestionnaire) count++;
    if (filtresLocaux.date_debut || filtresLocaux.date_fin) count++;
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
                  <option value="date">Date de création</option>
                  <option value="statut">Statut</option>
                  <option value="gestionnaire">Gestionnaire</option>
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

          {/* Statut */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statut</h3>
            <div className="grid grid-cols-2 gap-3">
              {STATUTS_DEMANDE.map((statut) => (
                <label key={statut.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtresLocaux.statut?.includes(statut.value as any) || false}
                    onChange={(e) => handleStatutChange(statut.value, e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className={`text-xs px-2 py-1 rounded-full ${statut.color}`}>
                    {statut.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Localisation */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Localisation</h3>
            <div className="space-y-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={filtresLocaux.adresse || ''}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                  placeholder="Rue, avenue, boulevard..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
                />
              </div>
            </div>
          </div>

          {/* Gestionnaire */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gestionnaire</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du gestionnaire
              </label>
              <input
                type="text"
                value={filtresLocaux.gestionnaire || ''}
                onChange={(e) => handleChange('gestionnaire', e.target.value)}
                placeholder="Nom ou agence..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
              />
            </div>
          </div>

          {/* Période */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Période</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={filtresLocaux.date_debut || ''}
                  onChange={(e) => handleChange('date_debut', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={filtresLocaux.date_fin || ''}
                  onChange={(e) => handleChange('date_fin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={reinitialiserFiltres}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Réinitialiser
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={appliquerFiltres}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 