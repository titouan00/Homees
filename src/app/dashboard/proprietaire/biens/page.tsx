'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MagnifyingGlass, Funnel, Buildings, CircleNotch, House, WarningCircle, X } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';
import { useProprietes } from '@/hooks/useProprietes';
import { Propriete, FiltresProprietes } from '@/types/propriete';
import CartePropriete from '@/components/proprietes/CartePropriete';
import FiltresProprietesComponent from '@/components/proprietes/FiltresProprietes';

/**
 * Page "Mes biens" pour les propriétaires - Version avec recherche et filtres fonctionnels
 */
export default function MesBiensPage() {
  const router = useRouter();
  
  // États locaux pour l'interface
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Valeur de recherche appliquée
  const [filtres, setFiltres] = useState<FiltresProprietes>({
    tri_par: 'date',
    ordre: 'desc'
  });
  const [showFiltres, setShowFiltres] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Récupérer l'ID utilisateur depuis Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  // Debounce pour la recherche (attendre 500ms après la dernière frappe)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchValue);
      setCurrentPage(1); // Remettre à la première page lors d'une nouvelle recherche
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);
  
  // Mémoriser les paramètres pour éviter les re-rendus inutiles
  const proprietesParams = useMemo(() => {
    if (!userId) {
      return { proprietaireId: undefined };
    }
    
    return {
      proprietaireId: userId,
      filtres,
      recherche: searchQuery.trim() || undefined,
      page: currentPage,
      limit: 12
    };
  }, [userId, filtres, searchQuery, currentPage]);

  // Hook pour les propriétés
  const { 
    proprietes, 
    loading: proprietesLoading, 
    error, 
    totalCount, 
    supprimerPropriete 
  } = useProprietes(proprietesParams);

  // Gestionnaires d'événements
  const handleAjouterPropriete = useCallback(() => {
    router.push('/dashboard/proprietaire/biens/nouveau');
  }, [router]);

  const handleModifierPropriete = useCallback((propriete: Propriete) => {
    router.push(`/dashboard/proprietaire/biens/${propriete.id}/modifier`);
  }, [router]);

  const handleSupprimerPropriete = useCallback(async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      return;
    }

    const success = await supprimerPropriete(id);
    if (success) {
      console.log('Propriété supprimée avec succès');
    }
  }, [supprimerPropriete]);

  const handleFiltresChange = useCallback((nouveauxFiltres: FiltresProprietes) => {
    setFiltres(nouveauxFiltres);
    setCurrentPage(1); // Remettre à la première page lors d'un changement de filtres
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    setSearchQuery('');
  }, []);

  // Compter le nombre de filtres actifs
  const nombreFiltresActifs = useMemo(() => {
    let count = 0;
    if (filtres.type_bien?.length) count++;
    if (filtres.statut_occupation?.length) count++;
    if (filtres.ville) count++; // Filtre ville séparé de la recherche
    if (filtres.surface_min || filtres.surface_max) count++;
    if (filtres.loyer_min || filtres.loyer_max) count++;
    return count;
  }, [filtres]);

  // Calcul de la pagination
  const totalPages = Math.ceil(totalCount / 12);

  return (
    <div className="p-6">
      {/* Header avec titre */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes biens</h1>
        <p className="text-gray-600">Gérez votre portefeuille immobilier</p>
      </div>

      {/* Barre d'actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Recherche */}
        <div className="flex-1 relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher par adresse, ville..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus-primary"
          />
          {searchValue && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFiltres(true)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              nombreFiltresActifs > 0
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Funnel className="h-4 w-4" />
            Filtres
            {nombreFiltresActifs > 0 && (
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                {nombreFiltresActifs}
              </span>
            )}
          </button>
          
          <button
            onClick={handleAjouterPropriete}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover-primary transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            Ajouter un bien
          </button>
        </div>
      </div>

      {/* Indicateurs de recherche et filtres actifs */}
      {(searchQuery || nombreFiltresActifs > 0) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {searchQuery && (
            <div className="flex items-center gap-2 bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm">
              <MagnifyingGlass className="h-3 w-3" />
              Recherche: "{searchQuery}"
              <button
                onClick={handleClearSearch}
                className="hover:bg-secondary-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {nombreFiltresActifs > 0 && (
            <div className="flex items-center gap-2 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
              <Funnel className="h-3 w-3" />
              {nombreFiltresActifs} filtre{nombreFiltresActifs > 1 ? 's' : ''} actif{nombreFiltresActifs > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Résultats */}
      {!proprietesLoading && (searchQuery || nombreFiltresActifs > 0) && (
        <div className="mb-4 text-sm text-gray-600">
          {totalCount} résultat{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}
        </div>
      )}

      {/* Contenu principal */}
      {error && (
        <div className="bg-error-light border border-error rounded-xl p-6 text-center mb-6">
          <WarningCircle className="h-8 w-8 text-error mx-auto mb-2" />
          <div className="text-error font-medium">Erreur lors du chargement</div>
          <div className="text-error-light text-sm">{error}</div>
        </div>
      )}

      {proprietesLoading ? (
        <div className="flex items-center justify-center py-16">
          <CircleNotch className="h-8 w-8 text-primary-600 animate-spin" />
          <span className="ml-2 text-gray-600">Chargement de vos biens...</span>
        </div>
      ) : proprietes.length === 0 ? (
        <div className="text-center py-16">
          <House className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          {searchQuery || nombreFiltresActifs > 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun bien trouvé</h3>
              <p className="text-gray-500 mb-6">
                Aucun bien ne correspond à vos critères de recherche
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    handleClearSearch();
                    setFiltres({ tri_par: 'date', ordre: 'desc' });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Effacer les filtres
                </button>
                <button
                  onClick={handleAjouterPropriete}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover-primary transition-colors font-medium"
                >
                  Ajouter un bien
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun bien enregistré</h3>
              <p className="text-gray-500 mb-6">Commencez par ajouter votre premier bien immobilier</p>
              <button
                onClick={handleAjouterPropriete}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover-primary transition-colors font-medium"
              >
                Ajouter mon premier bien
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Grille des propriétés */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {proprietes.map((propriete) => (
              <CartePropriete
                key={propriete.id}
                propriete={propriete}
                onModifier={() => handleModifierPropriete(propriete)}
                onSupprimer={() => handleSupprimerPropriete(propriete.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Composant de filtres */}
      <FiltresProprietesComponent
        filtres={filtres}
        onFiltresChange={handleFiltresChange}
        isOpen={showFiltres}
        onClose={() => setShowFiltres(false)}
      />
    </div>
  );
} 