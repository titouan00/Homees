'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Building, Loader2, Home, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useProprietes } from '@/hooks/useProprietes';
import { Propriete, NouvelleProprieteForme, FiltresProprietes } from '@/types/propriete';
import DashboardLayout from '@/components/navigation/DashboardLayout';
import CartePropriete from '@/components/proprietes/CartePropriete';
import FormulairePropriete from '@/components/proprietes/FormulairePropriete';

interface UserProfile {
  id: string;
  nom: string;
  email: string;
  rôle: string;
}

/**
 * Page "Mes biens" pour les propriétaires
 * Permet de visualiser, ajouter, modifier et supprimer des propriétés
 */
export default function MesBiensPage() {
  const router = useRouter();
  
  // État pour l'authentification
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // États locaux pour l'interface
  const [searchValue, setSearchValue] = useState('');
  const [filtres, setFiltres] = useState<FiltresProprietes>({
    tri_par: 'date',
    ordre: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  // États pour les modales
  const [showFormulaire, setShowFormulaire] = useState(false);
  const [proprieteEnEdition, setProprieteEnEdition] = useState<Propriete | undefined>();
  const [loading, setLoading] = useState(false);
  
  // Mémoriser les paramètres pour éviter les re-rendus inutiles
  const proprietesParams = useMemo(() => {
    if (!user?.id) {
      return { proprietaireId: undefined };
    }
    
    return {
      proprietaireId: user.id,
      filtres,
      page: currentPage,
      limit: 12
    };
  }, [user?.id, filtres, currentPage]);

  // Hook pour les propriétés (seulement si utilisateur authentifié)
  const { 
    proprietes, 
    loading: proprietesLoading, 
    error, 
    totalCount, 
    ajouterPropriete, 
    modifierPropriete, 
    supprimerPropriete,
    refetch 
  } = useProprietes(proprietesParams);

  // Vérification de l'authentification
  useEffect(() => {
    checkAuthAndRole();
  }, []);

  const checkAuthAndRole = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        router.push('/login?redirect=/dashboard/proprietaire/biens');
        return;
      }

      // Récupérer les données utilisateur
      const { data: userData, error: userError } = await supabase
        .from('utilisateurs')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError || userData.rôle !== 'proprietaire') {
        router.push('/login?redirect=/dashboard/proprietaire/biens');
        return;
      }

      setUser({
        id: userData.id,
        nom: userData.nom,
        email: userData.email,
        rôle: userData.rôle
      });

    } catch (err) {
      console.error('Erreur authentification:', err);
      router.push('/login?redirect=/dashboard/proprietaire/biens');
    } finally {
      setAuthLoading(false);
    }
  };

  // Gestionnaires d'événements
  const handleAjouterPropriete = useCallback(() => {
    setProprieteEnEdition(undefined);
    setShowFormulaire(true);
  }, []);

  const handleModifierPropriete = useCallback((propriete: Propriete) => {
    setProprieteEnEdition(propriete);
    setShowFormulaire(true);
  }, []);

  const handleSupprimerPropriete = useCallback(async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      return;
    }

    setLoading(true);
    const success = await supprimerPropriete(id);
    setLoading(false);

    if (success) {
      // Optionnel: afficher un message de succès
      console.log('Propriété supprimée avec succès');
    }
  }, [supprimerPropriete]);

  const handleSubmitFormulaire = useCallback(async (data: NouvelleProprieteForme): Promise<boolean> => {
    setLoading(true);
    
    let success = false;
    if (proprieteEnEdition) {
      // Modification
      success = await modifierPropriete(proprieteEnEdition.id, data);
    } else {
      // Ajout
      success = await ajouterPropriete(data);
    }
    
    setLoading(false);
    return success;
  }, [proprieteEnEdition, ajouterPropriete, modifierPropriete]);

  const handleFermerFormulaire = useCallback(() => {
    setShowFormulaire(false);
    setProprieteEnEdition(undefined);
  }, []);

  // Calcul de la pagination
  const totalPages = Math.ceil(totalCount / 12);

  // Écran de chargement pendant l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // Redirection si pas d'utilisateur
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout 
      userProfile={user}
      title="Mes biens"
      subtitle="Gérez votre portefeuille immobilier"
    >
      <div className="p-6">
        {/* Barre d'actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher par adresse, ville..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filtres
            </button>

            <button
              onClick={handleAjouterPropriete}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Ajouter un bien
            </button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Building className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total des biens</p>
                <p className="text-xl font-bold text-gray-900">{totalCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Biens libres</p>
                <p className="text-xl font-bold text-gray-900">
                  {proprietes.filter(p => p.statut_occupation === 'libre').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Biens occupés</p>
                <p className="text-xl font-bold text-gray-900">
                  {proprietes.filter(p => p.statut_occupation === 'occupe').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {proprietesLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          </div>
        ) : proprietes.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun bien enregistré
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par ajouter votre premier bien immobilier
            </p>
            <button
              onClick={handleAjouterPropriete}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors mx-auto"
            >
              <Plus className="h-4 w-4" />
              Ajouter mon premier bien
            </button>
          </div>
        ) : (
          <>
            {/* Grille des propriétés */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {proprietes.map((propriete) => (
                <CartePropriete
                  key={propriete.id}
                  propriete={propriete}
                  onModifier={handleModifierPropriete}
                  onSupprimer={handleSupprimerPropriete}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Précédent
                </button>

                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} sur {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}

        {/* Formulaire modal */}
        {showFormulaire && (
          <FormulairePropriete
            propriete={proprieteEnEdition}
            onSubmit={handleSubmitFormulaire}
            onAnnuler={handleFermerFormulaire}
            loading={loading}
          />
        )}
      </div>
    </DashboardLayout>
  );
} 