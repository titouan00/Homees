'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { useBiensEnGestion, type BienEnGestion } from '@/hooks/useBiensEnGestion';
import { 
  Buildings, 
  MagnifyingGlass, 
  Funnel, 
  MapPin,
  CurrencyEur,
  Calendar,
  Phone,
  Eye,
  PencilSimple,
  ChatCircle,
  SquaresFour,
  List as ListIcon,
  TrendUp,
  CircleNotch,
  Trash,
  ArrowClockwise,
  NotePencil,
  Warning,
  X,
  User
} from '@phosphor-icons/react';

// Composant carte de bien
function CarteBien({ 
  bien, 
  onContact, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  onRestore, 
  viewMode,
  showDeleted = false 
}: {
  bien: BienEnGestion;
  onContact: (bien: BienEnGestion) => void;
  onViewDetails: (bien: BienEnGestion) => void;
  onEdit: (bien: BienEnGestion) => void;
  onDelete: (bien: BienEnGestion) => void;
  onRestore: (bien: BienEnGestion) => void;
  viewMode: 'grid' | 'list';
  showDeleted?: boolean;
}) {
  const getStatutColor = (statut: string | null) => {
    switch (statut) {
      case 'occupe':
        return 'bg-green-100 text-green-800';
      case 'libre':
        return 'bg-red-100 text-red-800';
      case 'en_travaux':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string | null) => {
    switch (statut) {
      case 'occupe':
        return 'Occupé';
      case 'libre':
        return 'Libre';
      case 'en_travaux':
        return 'En travaux';
      default:
        return 'Non défini';
    }
  };

  const revenuAffiché = bien.revenue_mensuel_custom && bien.revenue_mensuel_custom > 0 
    ? bien.revenue_mensuel_custom 
    : bien.loyer_indicatif;

  if (viewMode === 'list') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${bien.supprime ? 'opacity-60 bg-gray-50' : ''}`}>
        {bien.supprime && (
          <div className="flex items-center gap-2 mb-3 text-red-600 text-sm">
            <Warning className="h-4 w-4" />
            <span>Bien supprimé le {new Date(bien.date_suppression!).toLocaleDateString()}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex-1 grid grid-cols-6 gap-4 items-center">
            <div className="col-span-2">
              <h3 className="font-semibold text-gray-900">{bien.adresse}</h3>
              <p className="text-sm text-gray-600">{bien.ville}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium capitalize">{bien.type_bien}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Surface</p>
              <p className="font-medium">{bien.surface_m2} m²</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenu mensuel</p>
              <p className="text-xl font-bold text-emerald-600">{revenuAffiché.toLocaleString()}€</p>
            </div>
            <div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(bien.statut_occupation)}`}>
                {getStatutLabel(bien.statut_occupation)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {!bien.supprime ? (
              <>
                <button
                  onClick={() => onViewDetails(bien)}
                  className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  title="Voir détails"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(bien)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Modifier"
                >
                  <PencilSimple className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onContact(bien)}
                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                  title="Contacter propriétaire"
                >
                  <ChatCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(bien)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Supprimer"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => onRestore(bien)}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                title="Restaurer"
              >
                <ArrowClockwise className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vue grille - design premium et moderne
  return (
    <div className={`relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden ${bien.supprime ? 'opacity-60 bg-gray-50' : ''}`}>  
      {/* Badge statut en haut à droite */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatutColor(bien.statut_occupation)} border border-white`}>{getStatutLabel(bien.statut_occupation)}</span>
      </div>

      <div className="p-6 pb-4 flex flex-col gap-4">
        {/* Header: Adresse + Loyer */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">{bien.adresse}</h3>
            <p className="text-xs text-gray-500 truncate">{bien.ville}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-lg shadow-sm">
              <CurrencyEur className="h-5 w-5 mr-1 text-emerald-500" />
              {revenuAffiché.toLocaleString()}€
            </span>
            {bien.revenue_mensuel_custom && bien.revenue_mensuel_custom > 0 && (
              <span className="text-xs text-emerald-500 mt-1">Revenu réel</span>
            )}
          </div>
        </div>

        {/* Infos clés en grille */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-400" />
            <span className="font-medium capitalize">{bien.type_bien}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendUp className="h-4 w-4 text-amber-400" />
            <span>{bien.rentabilite ? `${bien.rentabilite}%` : '--'} rentabilité</span>
          </div>
          <div className="flex items-center gap-2">
            <SquaresFour className="h-4 w-4 text-gray-400" />
            <span>{bien.surface_m2} m²</span>
          </div>
          <div className="flex items-center gap-2">
            <CurrencyEur className="h-4 w-4 text-gray-400" />
            <span>{bien.charges_mensuelles ? `${bien.charges_mensuelles}€/mois` : 'Charges --'}</span>
          </div>
        </div>

        {/* Équipements */}
        {(bien.balcon || bien.parking) && (
          <div className="flex gap-2 mt-2">
            {bien.balcon && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                <NotePencil className="h-3 w-3" /> Balcon
              </span>
            )}
            {bien.parking && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium">
                <NotePencil className="h-3 w-3" /> Parking
              </span>
            )}
          </div>
        )}

        {/* Propriétaire */}
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <User className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-700">{bien.proprietaire.nom}</span>
          {bien.proprietaire.telephone && <span className="ml-2">• {bien.proprietaire.telephone}</span>}
        </div>

        {/* Notes */}
        {bien.notes_gestion && (
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 mt-2 border border-gray-100">
            <span className="font-semibold text-gray-500">Note :</span> {bien.notes_gestion}
          </div>
        )}
      </div>

      {/* Actions en bas */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t flex flex-col gap-2">
        <button
          onClick={() => onEdit(bien)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all text-base"
        >
          <PencilSimple className="h-5 w-5" /> Modifier
        </button>
        <div className="flex gap-2 justify-between">
          <button
            onClick={() => onViewDetails(bien)}
            className="flex-1 flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-emerald-600 font-medium transition-colors"
          >
            <Eye className="h-4 w-4" /> Détails
          </button>
          <button
            onClick={() => onContact(bien)}
            className="flex-1 flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-purple-600 font-medium transition-colors"
          >
            <ChatCircle className="h-4 w-4" /> Contacter
          </button>
          {!bien.supprime ? (
            <button
              onClick={() => onDelete(bien)}
              className="flex-1 flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
            >
              <Trash className="h-4 w-4" /> Supprimer
            </button>
          ) : (
            <button
              onClick={() => onRestore(bien)}
              className="flex-1 flex items-center justify-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              <ArrowClockwise className="h-4 w-4" /> Restaurer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Page Gestion des Biens Gestionnaire
 * L'authentification est gérée par le layout.tsx
 */
export default function GestionBiensPage() {
  const router = useRouter();
  const [gestionnaireId, setGestionnaireId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDeleted, setShowDeleted] = useState(false);
  const [editingBien, setEditingBien] = useState<BienEnGestion | null>(null);
  const [editForm, setEditForm] = useState<Partial<BienEnGestion>>({});
  const [filtres, setFiltres] = useState({
    recherche: '',
    type: '',
    statut: '',
    ville: ''
  });

  // Récupérer l'ID du gestionnaire connecté
  useEffect(() => {
    const getGestionnaireId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setGestionnaireId(user.id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    };

    getGestionnaireId();
  }, []);

  // Hook pour récupérer les biens en gestion
  const { biens, statistiques, loading, error, refreshBiens, modifierBien, supprimerBien, restaurerBien } = useBiensEnGestion(gestionnaireId);

  // Statistiques de la corbeille
  const biensSupprimes = biens.filter(bien => bien.supprime);
  const biensActifs = biens.filter(bien => !bien.supprime);

  // Filtrage des biens
  const biensFiltres = useMemo(() => {
    const biensAFiltrer = showDeleted ? biensSupprimes : biensActifs;
    
    return biensAFiltrer.filter(bien => {
      const rechercheMatch = !filtres.recherche || 
        bien.adresse.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
        bien.ville.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
        bien.proprietaire.nom.toLowerCase().includes(filtres.recherche.toLowerCase());

      const typeMatch = !filtres.type || bien.type_bien === filtres.type;
      const statutMatch = !filtres.statut || bien.statut_occupation === filtres.statut;
      const villeMatch = !filtres.ville || bien.ville.includes(filtres.ville);

      return rechercheMatch && typeMatch && statutMatch && villeMatch;
    });
  }, [biens, filtres, showDeleted, biensSupprimes, biensActifs]);

  const handleContact = (bien: BienEnGestion) => {
    router.push(`/dashboard/gestionnaire/messages?contact=${bien.proprietaire.email}`);
  };

  const handleViewDetails = (bien: BienEnGestion) => {
    console.log('Voir détails du bien:', bien.id);
    // TODO: Implémenter la page de détails du bien
  };

  const handleEdit = (bien: BienEnGestion) => {
    setEditingBien(bien);
    setEditForm({
      statut_occupation: bien.statut_occupation,
      loyer_indicatif: bien.loyer_indicatif,
      revenue_mensuel_custom: bien.revenue_mensuel_custom,
      charges_mensuelles: bien.charges_mensuelles,
      notes_gestion: bien.notes_gestion,
      balcon: bien.balcon,
      parking: bien.parking
    });
  };

  const handleSaveEdit = async () => {
    if (!editingBien) return;

    const success = await modifierBien(editingBien.id, editForm);
    if (success) {
      setEditingBien(null);
      setEditForm({});
      console.log('✅ Modifications sauvegardées');
    }
  };

  const handleCancelEdit = () => {
    setEditingBien(null);
    setEditForm({});
  };

  const handleDelete = async (bien: BienEnGestion) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le bien "${bien.adresse}" ?\n\nVous pourrez le restaurer depuis la corbeille.`)) {
      const success = await supprimerBien(bien.id);
      if (success) {
        console.log('✅ Bien supprimé avec succès');
      }
    }
  };

  const handleRestore = async (bien: BienEnGestion) => {
    if (window.confirm(`Restaurer le bien "${bien.adresse}" ?`)) {
      const success = await restaurerBien(bien.id);
      if (success) {
        console.log('✅ Bien restauré avec succès');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircleNotch className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Chargement des biens...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Erreur: {error}</p>
        <button 
          onClick={refreshBiens}
          className="mt-2 text-red-600 hover:text-red-700 font-medium"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {showDeleted ? 'Corbeille' : 'Gestion des biens'}
        </h1>
        <p className="text-gray-600">
          {showDeleted 
            ? `${biensSupprimes.length} bien(s) supprimé(s) - Vous pouvez les restaurer` 
            : 'Gérez votre portefeuille immobilier'
          }
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 rounded-lg p-3">
              <Buildings className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total biens</p>
              <p className="text-2xl font-bold text-gray-900">{statistiques.total_biens}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <TrendUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taux d'occupation</p>
              <p className="text-2xl font-bold text-gray-900">{statistiques.taux_occupation_global}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CurrencyEur className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus mensuels</p>
              <p className="text-2xl font-bold text-gray-900">{statistiques.revenus_mensuels.toLocaleString()}€</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`${showDeleted ? 'bg-red-100' : 'bg-purple-100'} rounded-lg p-3`}>
              {showDeleted ? (
                <Trash className="h-6 w-6 text-red-600" />
              ) : (
                <Calendar className="h-6 w-6 text-purple-600" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {showDeleted ? 'Biens supprimés' : 'Rentabilité moy.'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {showDeleted ? biensSupprimes.length : `${statistiques.rentabilite_moyenne}%`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation biens actifs / corbeille */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleted(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !showDeleted
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Buildings className="h-4 w-4 inline mr-2" />
              Biens actifs ({biensActifs.length})
            </button>
            <button
              onClick={() => setShowDeleted(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showDeleted
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Trash className="h-4 w-4 inline mr-2" />
              Corbeille ({biensSupprimes.length})
            </button>
          </div>
          
          {biensSupprimes.length > 0 && showDeleted && (
            <button
              onClick={() => {
                if (window.confirm(`Restaurer tous les ${biensSupprimes.length} biens supprimés ?`)) {
                  biensSupprimes.forEach(bien => restaurerBien(bien.id));
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowClockwise className="h-4 w-4 inline mr-2" />
              Tout restaurer
            </button>
          )}
        </div>
      </div>

      {/* Filtres et vue */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Barre de recherche */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par adresse, ville ou propriétaire..."
                value={filtres.recherche}
                onChange={(e) => setFiltres(prev => ({ ...prev, recherche: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Filtres */}
          <div className="flex gap-3">
            <select
              value={filtres.type}
              onChange={(e) => setFiltres(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Tous les types</option>
              <option value="appartement">Appartement</option>
              <option value="studio">Studio</option>
              <option value="maison">Maison</option>
              <option value="loft">Loft</option>
            </select>

            <select
              value={filtres.statut}
              onChange={(e) => setFiltres(prev => ({ ...prev, statut: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Tous les statuts</option>
              <option value="occupe">Occupé</option>
              <option value="libre">Libre</option>
              <option value="en_travaux">En travaux</option>
            </select>

            {/* Toggle vue */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <SquaresFour className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ListIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des biens */}
      {biensFiltres.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          {showDeleted ? (
            <>
              <Trash className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Corbeille vide</h3>
              <p className="text-gray-600 mb-4">
                {filtres.recherche || filtres.type || filtres.statut ? 
                  'Aucun bien supprimé ne correspond aux critères de recherche.' :
                  'Aucun bien supprimé. Les biens que vous supprimez apparaîtront ici et pourront être restaurés.'
                }
              </p>
              <button
                onClick={() => setShowDeleted(false)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Buildings className="h-5 w-5 mr-2" />
                Voir les biens actifs
              </button>
            </>
          ) : (
            <>
              <Buildings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun bien trouvé</h3>
              <p className="text-gray-600 mb-4">
                {filtres.recherche || filtres.type || filtres.statut ? 
                  'Aucun bien ne correspond aux critères de recherche.' :
                  'Vous n\'avez pas encore de biens en gestion. Les propriétaires peuvent vous envoyer des demandes de gestion depuis leur tableau de bord.'
                }
              </p>
              <button
                onClick={() => router.push('/dashboard/gestionnaire/demandes')}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Funnel className="h-5 w-5 mr-2" />
                Voir les demandes
              </button>
            </>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
          'space-y-4'
        }>
          {biensFiltres.map((bien) => (
            <CarteBien
              key={bien.id}
              bien={bien}
              onContact={handleContact}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestore={handleRestore}
              viewMode={viewMode}
              showDeleted={showDeleted}
            />
          ))}
        </div>
      )}

      {/* Modal de modification */}
      {editingBien && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Modifier le bien
                  </h2>
                  <p className="text-blue-100 text-sm">{editingBien.adresse} - {editingBien.ville}</p>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-blue-100 hover:text-white hover:bg-blue-600 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-8">
                {/* Informations de base (non modifiables) */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Buildings className="h-5 w-5 mr-2 text-gray-600" />
                    Informations de base
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Type de bien</p>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{editingBien.type_bien}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Surface</p>
                        <p className="text-sm font-semibold text-gray-900">{editingBien.surface_m2} m²</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Ville</p>
                        <p className="text-sm font-semibold text-gray-900">{editingBien.ville}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Propriétaire</p>
                        <p className="text-sm font-semibold text-gray-900">{editingBien.proprietaire.nom}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statut d'occupation */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Warning className="h-5 w-5 mr-2 text-amber-500" />
                    Statut d'occupation
                  </h3>
                  <select
                    value={editForm.statut_occupation || ''}
                    onChange={(e) => setEditForm({...editForm, statut_occupation: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Non défini</option>
                    <option value="libre">🏠 Libre</option>
                    <option value="occupe">👥 Occupé</option>
                    <option value="en_travaux">🔧 En travaux</option>
                  </select>
                </div>

                {/* Informations financières */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <CurrencyEur className="h-5 w-5 mr-2 text-emerald-500" />
                    Informations financières
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loyer indicatif
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={editForm.loyer_indicatif || ''}
                          onChange={(e) => setEditForm({...editForm, loyer_indicatif: Number(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                          placeholder="1500"
                        />
                        <span className="absolute right-3 top-3 text-gray-500">€</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Revenu mensuel réel
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={editForm.revenue_mensuel_custom || ''}
                          onChange={(e) => setEditForm({...editForm, revenue_mensuel_custom: Number(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                          placeholder="1450"
                        />
                        <span className="absolute right-3 top-3 text-gray-500">€</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Si différent du loyer indicatif</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Charges mensuelles
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={editForm.charges_mensuelles || ''}
                          onChange={(e) => setEditForm({...editForm, charges_mensuelles: Number(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                          placeholder="150"
                        />
                        <span className="absolute right-3 top-3 text-gray-500">€</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Équipements */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <NotePencil className="h-5 w-5 mr-2 text-purple-500" />
                    Équipements
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={editForm.balcon || false}
                        onChange={(e) => setEditForm({...editForm, balcon: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                      />
                      <span className="text-sm font-medium text-gray-700">🌿 Balcon</span>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={editForm.parking || false}
                        onChange={(e) => setEditForm({...editForm, parking: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                      />
                      <span className="text-sm font-medium text-gray-700">🚗 Parking</span>
                    </label>
                  </div>
                </div>

                {/* Notes de gestion */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <PencilSimple className="h-5 w-5 mr-2 text-gray-600" />
                    Notes de gestion
                  </h3>
                  <textarea
                    value={editForm.notes_gestion || ''}
                    onChange={(e) => setEditForm({...editForm, notes_gestion: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Notes privées sur la gestion de ce bien (réparations, contact locataire, etc.)"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium"
                >
                  💾 Sauvegarder les modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 