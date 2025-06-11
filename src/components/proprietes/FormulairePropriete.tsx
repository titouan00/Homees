'use client';

import { useState, useEffect } from 'react';
import { X, Save, MapPin, Home, Euro } from 'lucide-react';
import { 
  NouvelleProprieteForme, 
  Propriete,
  TYPES_BIEN, 
  TYPES_CHAUFFAGE, 
  DPE_CLASSES, 
  STATUTS_OCCUPATION 
} from '@/types/propriete';

interface FormulaireProprieteProp {
  propriete?: Propriete;
  onSubmit: (propriete: NouvelleProprieteForme) => Promise<boolean>;
  onAnnuler: () => void;
  loading: boolean;
}

export default function FormulairePropriete({ 
  propriete, 
  onSubmit, 
  onAnnuler, 
  loading 
}: FormulaireProprieteProp) {
  const [formData, setFormData] = useState<NouvelleProprieteForme>({
    adresse: '',
    ville: '',
    code_postal: '',
    type_bien: 'appartement',
    statut_occupation: 'libre',
    ascenseur: false,
    balcon: false,
    terrasse: false,
    parking: false,
    cave: false,
    meuble: false,
    copropriete: false,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (propriete) {
      setFormData({
        adresse: propriete.adresse,
        ville: propriete.ville || '',
        code_postal: propriete.code_postal || '',
        arrondissement: propriete.arrondissement,
        type_bien: propriete.type_bien,
        surface_m2: propriete.surface_m2,
        nb_pieces: propriete.nb_pieces,
        nb_chambres: propriete.nb_chambres,
        nb_salles_bain: propriete.nb_salles_bain,
        etage: propriete.etage,
        ascenseur: propriete.ascenseur,
        balcon: propriete.balcon,
        terrasse: propriete.terrasse,
        parking: propriete.parking,
        cave: propriete.cave,
        meuble: propriete.meuble,
        chauffage_type: propriete.chauffage_type,
        annee_construction: propriete.annee_construction,
        dpe_classe: propriete.dpe_classe,
        ges_classe: propriete.ges_classe,
        loyer_indicatif: propriete.loyer_indicatif,
        charges_mensuelles: propriete.charges_mensuelles,
        taxe_fonciere: propriete.taxe_fonciere,
        copropriete: propriete.copropriete,
        charges_copropriete: propriete.charges_copropriete,
        statut_occupation: propriete.statut_occupation,
        notes: propriete.notes || ''
      });
    }
  }, [propriete]);

  const handleChange = (field: keyof NouvelleProprieteForme, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const valider = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.adresse.trim()) {
      newErrors.adresse = 'L\'adresse est obligatoire';
    }
    if (!formData.ville.trim()) {
      newErrors.ville = 'La ville est obligatoire';
    }
    if (!formData.code_postal.trim()) {
      newErrors.code_postal = 'Le code postal est obligatoire';
    } else if (!/^\d{5}$/.test(formData.code_postal)) {
      newErrors.code_postal = 'Le code postal doit contenir 5 chiffres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!valider()) {
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      onAnnuler();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {propriete ? 'Modifier la propriété' : 'Ajouter une propriété'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Renseignez les informations de votre bien immobilier
            </p>
          </div>
          <button
            onClick={onAnnuler}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[70vh] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de bien *
                </label>
                <select
                  value={formData.type_bien}
                  onChange={(e) => handleChange('type_bien', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {TYPES_BIEN.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut d'occupation
                </label>
                <select
                  value={formData.statut_occupation}
                  onChange={(e) => handleChange('statut_occupation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {STATUTS_OCCUPATION.map((statut) => (
                    <option key={statut.value} value={statut.value}>
                      {statut.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse complète *
              </label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => handleChange('adresse', e.target.value)}
                placeholder="15 rue de Rivoli"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.adresse ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.adresse && (
                <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  value={formData.ville}
                  onChange={(e) => handleChange('ville', e.target.value)}
                  placeholder="Paris"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.ville ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.ville && (
                  <p className="text-red-500 text-sm mt-1">{errors.ville}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code postal *
                </label>
                <input
                  type="text"
                  value={formData.code_postal}
                  onChange={(e) => handleChange('code_postal', e.target.value)}
                  placeholder="75001"
                  maxLength={5}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.code_postal ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.code_postal && (
                  <p className="text-red-500 text-sm mt-1">{errors.code_postal}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arrondissement
                </label>
                <input
                  type="text"
                  value={formData.arrondissement || ''}
                  onChange={(e) => handleChange('arrondissement', e.target.value)}
                  placeholder="1er"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface (m²)
                </label>
                <input
                  type="number"
                  value={formData.surface_m2 || ''}
                  onChange={(e) => handleChange('surface_m2', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="65"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pièces
                </label>
                <input
                  type="number"
                  value={formData.nb_pieces || ''}
                  onChange={(e) => handleChange('nb_pieces', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chambres
                </label>
                <input
                  type="number"
                  value={formData.nb_chambres || ''}
                  onChange={(e) => handleChange('nb_chambres', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Étage
                </label>
                <input
                  type="number"
                  value={formData.etage || ''}
                  onChange={(e) => handleChange('etage', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Financier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loyer indicatif (€/mois)
                </label>
                <input
                  type="number"
                  value={formData.loyer_indicatif || ''}
                  onChange={(e) => handleChange('loyer_indicatif', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="1800"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Charges mensuelles (€)
                </label>
                <input
                  type="number"
                  value={formData.charges_mensuelles || ''}
                  onChange={(e) => handleChange('charges_mensuelles', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="150"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Équipements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Équipements
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { key: 'ascenseur', label: 'Ascenseur' },
                  { key: 'balcon', label: 'Balcon' },
                  { key: 'terrasse', label: 'Terrasse' },
                  { key: 'parking', label: 'Parking' },
                  { key: 'cave', label: 'Cave' },
                  { key: 'meuble', label: 'Meublé' }
                ].map((equip) => (
                  <label key={equip.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[equip.key as keyof NouvelleProprieteForme] as boolean}
                      onChange={(e) => handleChange(equip.key as keyof NouvelleProprieteForme, e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{equip.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes et commentaires
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Informations complémentaires..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onAnnuler}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Enregistrement...' : (propriete ? 'Modifier' : 'Enregistrer')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 