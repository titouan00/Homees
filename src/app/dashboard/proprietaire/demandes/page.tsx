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
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Eye
} from '@phosphor-icons/react';
import { useDemandesProprietaire, DemandeWithDetails } from '@/hooks/useDemandesProprietaire';
import { useAuth } from '@/hooks/useAuth';
import { FiltresDemandes } from '@/types/messaging';
import FiltresDemandesSimple from '@/components/demandes/FiltresDemandesSimple';
import Badge from '@/components/ui/Badge';
import CustomButton from '@/components/ui/CustomButton';

/**
 * Page "Mes demandes" pour les propriétaires - Version avec système de couleurs amélioré
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
  const { demandes, loading, error, totalCount } = useDemandesProprietaire(searchParams);

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

  const handleContactGestionnaire = useCallback((demande: DemandeWithDetails) => {
    if (demande.gestionnaire?.id) {
      router.push(`/dashboard/messages?gestionnaire=${demande.gestionnaire.id}`);
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

  // Configuration des statuts avec couleurs et icônes
  const getStatutConfig = (statut: string) => {
    switch (statut) {
      case 'ouverte':
        return { 
          label: 'En attente',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
          borderClass: 'border-l-blue-500',
          bgClass: 'bg-blue-50/30',
          icon: Clock,
          iconClass: 'text-blue-600',
          description: 'En attente de réponse du gestionnaire'
        };
      case 'acceptee':
        return { 
          label: 'Acceptée',
          badgeClass: 'bg-green-100 text-green-800 border-green-200',
          borderClass: 'border-l-green-500',
          bgClass: 'bg-green-50/30',
          icon: CheckCircle,
          iconClass: 'text-green-600',
          description: 'Demande acceptée par le gestionnaire'
        };
      case 'rejetee':
        return { 
          label: 'Rejetée',
          badgeClass: 'bg-red-100 text-red-800 border-red-200',
          borderClass: 'border-l-red-500',
          bgClass: 'bg-red-50/30',
          icon: XCircle,
          iconClass: 'text-red-600',
          description: 'Demande rejetée par le gestionnaire'
        };
      case 'terminee':
        return { 
          label: 'Terminée',
          badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
          borderClass: 'border-l-gray-500',
          bgClass: 'bg-gray-50/30',
          icon: FileText,
          iconClass: 'text-gray-600',
          description: 'Processus terminé'
        };
      default:
        return { 
          label: statut,
          badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
          borderClass: 'border-l-gray-500',
          bgClass: 'bg-gray-50/30',
          icon: Clock,
          iconClass: 'text-gray-600',
          description: 'Statut inconnu'
        };
    }
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
      <div className="space-y-4">
        {authLoading || loading ? (
          <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <CircleNotch className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg shadow-sm border border-gray-200">
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
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg shadow-sm border border-gray-200">
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
          demandes.map((demande: DemandeWithDetails) => {
            const statutConfig = getStatutConfig(demande.statut);
            const StatutIcon = statutConfig.icon;
            
            return (
              <div 
                key={demande.id} 
                className={`bg-white rounded-xl shadow-sm border-l-4 ${statutConfig.borderClass} ${statutConfig.bgClass} hover:shadow-md transition-all duration-200`}
              >
                <div className="p-6">
                  {/* Header avec statut et date */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${statutConfig.bgClass}`}>
                        <StatutIcon className={`h-5 w-5 ${statutConfig.iconClass}`} />
                        </div>
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statutConfig.badgeClass}`}>
                          {statutConfig.label}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{statutConfig.description}</p>
                      </div>
                        </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Envoyée le</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(demande.créé_le)}</p>
                          {demande.mis_a_jour_le !== demande.créé_le && (
                            <p className="text-xs text-gray-500">
                          Mise à jour le {formatDate(demande.mis_a_jour_le)}
                            </p>
                          )}
                        </div>
                      </div>

                  {/* Informations du gestionnaire */}
                  {demande.gestionnaire && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <User className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">Gestionnaire</p>
                          <p className="text-sm text-gray-600">{demande.gestionnaire.nom_agence || demande.gestionnaire.nom}</p>
                          <p className="text-xs text-gray-500">{demande.gestionnaire.email}</p>
                        </div>
                      </div>

                      {/* Propriété associée */}
                      {demande.propriete && (
                      <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <MapPin className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900">Propriété</p>
                            <p className="text-sm text-gray-600">{demande.propriete.adresse}</p>
                            <p className="text-xs text-gray-500">{demande.propriete.ville} • {demande.propriete.type_bien}</p>
                          </div>
                        </div>
                      )}
                      </div>
                  )}

                  {/* Message initial */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Message initial</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {demande.message_initial}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      {demande.gestionnaire && (
                        <button
                          onClick={() => handleContactGestionnaire(demande)}
                          className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          <ChatCircle className="h-4 w-4 mr-1" />
                          Contacter ({demande.nombre_messages})
                        </button>
                      )}
                      
                    {demande.gestionnaire && (
                        <button
                        onClick={() => handleViewProfile(demande.gestionnaire)}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                          <Eye className="h-4 w-4 mr-1" />
                        Voir profil
                        </button>
                      )}
                    </div>

                    {/* Indicateur d'action possible */}
                    {demande.statut === 'acceptee' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Vous pouvez signer le contrat</span>
                      </div>
                    )}
                    
                    {demande.statut === 'ouverte' && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">En attente de réponse</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <p className="text-sm text-gray-700">
            Page {currentPage} sur {totalPages} ({totalCount} demande{totalCount > 1 ? 's' : ''})
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CaretLeft className="h-4 w-4" />
            </button>
            
            <span className="px-3 py-2 text-sm font-medium text-gray-900">
              {currentPage}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CaretRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
