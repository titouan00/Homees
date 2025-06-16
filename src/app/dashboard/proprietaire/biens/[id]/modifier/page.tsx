'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FloppyDisk, MapPin, House, CurrencyEur, CircleNotch } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase-client';
import { 
  NouvelleProprieteForme, 
  Propriete,
  TYPES_BIEN, 
  TYPES_CHAUFFAGE, 
  DPE_CLASSES, 
  STATUTS_OCCUPATION 
} from '@/types/propriete';

/**
 * Page pour modifier un bien immobilier existant
 */
export default function ModifierBienPage() {
  const router = useRouter();
  const params = useParams();
  const proprieteId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [propriete, setPropriete] = useState<Propriete | null>(null);
  
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

  // Récupérer l'utilisateur et la propriété
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        
        // Vérifier l'authentification
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }
        
        setUserId(user.id);

        // Charger la propriété
        const { data: proprieteData, error } = await supabase
          .from('propriete')
          .select('*')
          .eq('id', proprieteId)
          .eq('proprietaire_id', user.id)
          .single();

        if (error) {
          console.error('Erreur lors du chargement:', error);
          router.push('/dashboard/proprietaire/biens');
          return;
        }

        if (proprieteData) {
          setPropriete(proprieteData);
          
          // Pré-remplir le formulaire
          setFormData({
            adresse: proprieteData.adresse,
            ville: proprieteData.ville || '',
            code_postal: proprieteData.code_postal || '',
            arrondissement: proprieteData.arrondissement,
            type_bien: proprieteData.type_bien,
            surface_m2: proprieteData.surface_m2,
            nb_pieces: proprieteData.nb_pieces,
            nb_chambres: proprieteData.nb_chambres,
            nb_salles_bain: proprieteData.nb_salles_bain,
            etage: proprieteData.etage,
            ascenseur: proprieteData.ascenseur,
            balcon: proprieteData.balcon,
            terrasse: proprieteData.terrasse,
            parking: proprieteData.parking,
            cave: proprieteData.cave,
            meuble: proprieteData.meuble,
            chauffage_type: proprieteData.chauffage_type,
            annee_construction: proprieteData.annee_construction,
            dpe_classe: proprieteData.dpe_classe,
            ges_classe: proprieteData.ges_classe,
            loyer_indicatif: proprieteData.loyer_indicatif,
            charges_mensuelles: proprieteData.charges_mensuelles,
            taxe_fonciere: proprieteData.taxe_fonciere,
            copropriete: proprieteData.copropriete,
            charges_copropriete: proprieteData.charges_copropriete,
            statut_occupation: proprieteData.statut_occupation,
            notes: proprieteData.notes || ''
          });
        }
      } catch (err) {
        console.error('Erreur:', err);
        router.push('/dashboard/proprietaire/biens');
      } finally {
        setLoadingData(false);
      }
    };

    if (proprieteId) {
      loadData();
    }
  }, [proprieteId, router]);

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
    
    if (!valider() || !userId || !proprieteId) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('propriete')
        .update(formData)
        .eq('id', proprieteId)
        .eq('proprietaire_id', userId);

      if (error) {
        throw error;
      }

      // Rediriger vers la liste des biens
      router.push('/dashboard/proprietaire/biens');
      
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setErrors({ general: 'Erreur lors de la modification du bien' });
    } finally {
      setLoading(false);
    }
  };

  const handleSupprimer = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce bien ? Cette action est irréversible.')) {
      return;
    }

    if (!userId || !proprieteId) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('propriete')
        .delete()
        .eq('id', proprieteId)
        .eq('proprietaire_id', userId);

      if (error) {
        throw error;
      }

      // Rediriger vers la liste des biens
      router.push('/dashboard/proprietaire/biens');
      
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setErrors({ general: 'Erreur lors de la suppression du bien' });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-16">
          <CircleNotch className="h-8 w-8 text-emerald-600 animate-spin" />
          <span className="ml-2 text-gray-600">Chargement du bien...</span>
        </div>
      </div>
    );
  }

  if (!propriete) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-16">
          <p className="text-gray-600">Bien introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-100 rounded-lg p-3">
            <House className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifier le bien</h1>
            <p className="text-gray-600">{propriete.adresse}</p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          {/* Erreur générale */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

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
              <MapPin className="inline h-4 w-4 mr-1" />
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
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Caractéristiques</h3>
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
          </div>

          {/* Informations financières */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              <CurrencyEur className="inline h-5 w-5 mr-1" />
              Informations financières
            </h3>
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
          </div>

          {/* Équipements */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Équipements</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'ascenseur', label: 'Ascenseur' },
                { key: 'balcon', label: 'Balcon' },
                { key: 'terrasse', label: 'Terrasse' },
                { key: 'parking', label: 'Parking' },
                { key: 'cave', label: 'Cave' },
                { key: 'meuble', label: 'Meublé' }
              ].map((equip) => (
                <label key={equip.key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[equip.key as keyof NouvelleProprieteForme] as boolean}
                    onChange={(e) => handleChange(equip.key as keyof NouvelleProprieteForme, e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{equip.label}</span>
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
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-center">
            {/* Bouton supprimer à gauche */}
            <button
              type="button"
              onClick={handleSupprimer}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer le bien
            </button>

            {/* Boutons d'action à droite */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <FloppyDisk className="h-4 w-4" />
                {loading ? 'Modification...' : 'Modifier le bien'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}