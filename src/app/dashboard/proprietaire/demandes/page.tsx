'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CircleNotch, 
  WarningCircle, 
  ChatCircle,
  MapPin,
  User,
  CaretLeft,
  CaretRight,
  Calendar,
  Plus
} from '@phosphor-icons/react';
import { useDemandes } from '@/hooks/useDemandes';
import { useAuth } from '@/hooks/useAuth';
import { DemandeWithDetails, FiltresDemandes } from '@/types/messaging';
import FiltresDemandesSimple from '@/components/demandes/FiltresDemandesSimple';
import Badge from '@/components/ui/Badge';
import CustomButton from '@/components/ui/CustomButton';

/**
 * Page "Mes demandes" pour les propriétaires - Version simplifiée
 */
export default function MesDemandesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  // États locaux pour les filtres et la recherche
  const [filtres, setFiltres] = useState<FiltresDemandes>({
    tri_par: 'date',
    ordre: 'desc'
  });
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Construction des paramètres de recherche
  const searchParams = useMemo(() => ({
    proprietaireId: user?.id,
    filtres,
    recherche: searchValue || undefined,
    page: currentPage,
    limit: 10
  }), [user?.id, filtres, searchValue, currentPage]);

  // Hook pour récupérer les données
  const { demandes, loading, error, totalCount } = useDemandes(searchParams);

  // Calcul de la pagination
  const totalPages = Math.ceil(totalCount / 10);

  // Gestionnaires de changement d'état
  const handleFiltresChange = useCallback((nouveauFiltres: FiltresDemandes) => {
    setFiltres(nouveauFiltres);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setSearchValue(search);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleViewProfile = useCallback((gestionnaire: any) => {
    if (gestionnaire?.id) {
      router.push(`/dashboard/proprietaire/profil-gestionnaire/${gestionnaire.id}`);
    }
  }, [router]);

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Fonction pour obtenir le badge de statut
  const getStatutBadge = (statut: string) => {
    const statutsConfig = {
      ouverte: { variant: 'info' as const, label: 'Ouverte' },
      acceptee: { variant: 'success' as const, label: 'Acceptée' },
      rejetee: { variant: 'error' as const, label: 'Rejetée' },
      terminee: { variant: 'neutral' as const, label: 'Terminée' },
    };

    const config = statutsConfig[statut as keyof typeof statutsConfig] || statutsConfig.ouverte;
    
    return (
      <Badge variant={config.variant} size="sm">
        {config.label}
      </Badge>
    );
  };

  // Ne pas afficher la page si pas d'utilisateur authentifié
  if (!user && !authLoading) {
    return null;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes demandes</h1>
          <p className="text-gray-600">Gérez vos demandes de gestion immobilière</p>
        </div>
        <CustomButton
          variant="primary"
          onClick={() => router.push('/dashboard/proprietaire/gestionnaires')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouvelle demande
        </CustomButton>
      </div>

      {/* Filtres */}
      <FiltresDemandesSimple
        filtres={filtres}
        onFiltresChange={handleFiltresChange}
        onSearch={handleSearchChange}
        searchValue={searchValue}
        totalResults={totalCount}
      />

      {/* Liste des demandes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {authLoading || loading ? (
          <div className="flex items-center justify-center py-12">
            <CircleNotch className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <WarningCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <CustomButton
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </CustomButton>
          </div>
        ) : demandes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ChatCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchValue || Object.keys(filtres).some(key => filtres[key as keyof FiltresDemandes]) 
                ? 'Aucune demande trouvée' 
                : 'Aucune demande'
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {searchValue || Object.keys(filtres).some(key => filtres[key as keyof FiltresDemandes])
                ? 'Essayez de modifier vos critères de recherche'
                : 'Vous n\'avez pas encore envoyé de demande de gestion'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {demandes.map((demande: DemandeWithDetails) => (
              <div key={demande.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Informations principales */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Statut */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-info-100 rounded-lg">
                          <ChatCircle className="h-4 w-4 text-info-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">Statut</p>
                          <div className="mt-1">
                            {getStatutBadge(demande.statut)}
                          </div>
                        </div>
                      </div>

                      {/* Date de demande */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Calendar className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">Date de demande</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(demande.créé_le)}
                          </p>
                          {demande.mis_a_jour_le !== demande.créé_le && (
                            <p className="text-xs text-gray-500">
                              Modifiée le {formatDate(demande.mis_a_jour_le)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bien concerné */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <MapPin className="h-4 w-4 text-primary-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">Bien concerné</p>
                          <p className="text-sm text-gray-600 truncate">
                            {demande.propriete?.adresse || 'Adresse non disponible'}
                          </p>
                          {demande.propriete?.ville && (
                            <p className="text-xs text-gray-500">
                              {demande.propriete.ville}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Gestionnaire */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-secondary-100 rounded-lg">
                          <User className="h-4 w-4 text-secondary-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">Gestionnaire</p>
                          <p className="text-sm text-gray-600 truncate">
                            {demande.gestionnaire?.nom || 'Non assigné'}
                          </p>
                          {demande.gestionnaire?.email && (
                            <p className="text-xs text-gray-500">
                              {demande.gestionnaire.email}
                            </p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {demande.gestionnaire && (
                      <CustomButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewProfile(demande.gestionnaire)}
                      >
                        <User className="h-4 w-4" />
                        Voir profil
                      </CustomButton>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Affichage de {((currentPage - 1) * 10) + 1} à {Math.min(currentPage * 10, totalCount)} sur {totalCount} demandes
          </div>
          
          <div className="flex items-center gap-2">
            <CustomButton
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <CaretLeft className="h-4 w-4" />
              Précédent
            </CustomButton>
            
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {currentPage} sur {totalPages}
            </span>
            
            <CustomButton
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <CaretRight className="h-4 w-4" />
              Suivant
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
}
