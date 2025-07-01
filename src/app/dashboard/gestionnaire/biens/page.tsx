'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { useBiensEnGestion, type BienEnGestion } from '@/hooks/useBiensEnGestion';
import { useGestionnaire } from '@/hooks/useGestionnaire';
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
  Check,
  X,
  NotePencil,
  Warning
} from '@phosphor-icons/react';

// Ajout du type local pour enrichir BienEnGestion
interface BienEnGestionAvecFraisGestion extends BienEnGestion {
  frais_gestion_mensuel?: number;
}

// Composant carte de bien
function CarteBien({ 
  bien, 
  onContact, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  onRestore, 
  onModify, 
  viewMode,
  showDeleted = false 
}: {
  bien: BienEnGestionAvecFraisGestion;
  onContact: (bien: BienEnGestion) => void;
  onViewDetails: (bien: BienEnGestion) => void;
  onEdit: (bien: BienEnGestion) => void;
  onDelete: (bien: BienEnGestion) => void;
  onRestore: (bien: BienEnGestion) => void;
  onModify: (bienId: string, field: string, value: any) => void;
  viewMode: 'grid' | 'list';
  showDeleted?: boolean;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});

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

  const handleStartEdit = (field: string, currentValue: any) => {
    setIsEditing(field);
    setEditValues({ ...editValues, [field]: currentValue });
  };

  const handleSaveEdit = (field: string) => {
    const newValue = editValues[field];
    onModify(bien.id, field, newValue);
    setIsEditing(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditValues({});
  };

  const renderEditableField = (field: string, currentValue: any, label: string, type: 'text' | 'number' = 'text') => {
    if (isEditing === field) {
      return (
        <div className="flex items-center gap-2">
          <input
            type={type}
            value={editValues[field] || ''}
            onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            autoFocus
          />
          <button
            onClick={() => handleSaveEdit(field)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancelEdit}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between group">
        <span>{label}: <span className="font-medium">{currentValue || 'Non défini'}</span></span>
        <button
          onClick={() => handleStartEdit(field, currentValue)}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
        >
          <PencilSimple className="h-3 w-3" />
        </button>
      </div>
    );
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
            <div className="space-y-1">
              {renderEditableField('revenue_mensuel_custom', revenuAffiché, 'Revenu', 'number')}
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
                  onClick={() => router.push(`/dashboard/gestionnaire/biens/${bien.id}`)}
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

  // Vue grille
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${bien.supprime ? 'opacity-60 bg-gray-50' : ''}`}>
      {bien.supprime && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <Warning className="h-4 w-4" />
            <span>Supprimé le {new Date(bien.date_suppression!).toLocaleDateString()}</span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{bien.adresse}</h3>
            <p className="text-sm text-gray-600 mb-2">{bien.ville}</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(bien.statut_occupation)}`}>
              {getStatutLabel(bien.statut_occupation)}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium capitalize">{bien.type_bien}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Surface:</span>
            <span className="font-medium">{bien.surface_m2} m²</span>
          </div>
          <div className="text-sm">
            {renderEditableField('revenue_mensuel_custom', revenuAffiché, 'Revenu mensuel', 'number')}
          </div>
          {typeof bien.frais_gestion_mensuel === 'number' && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frais de gestion:</span>
              <span className="font-medium text-emerald-600">{bien.frais_gestion_mensuel.toLocaleString()}€ / mois</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">Propriétaire:</p>
          <p className="font-medium text-gray-900">{bien.proprietaire.nom}</p>
          {bien.proprietaire.telephone && (
            <p className="text-sm text-gray-600">{bien.proprietaire.telephone}</p>
          )}
        </div>

        {/* Zone de notes */}
        <div className="border-t pt-4 mt-4">
          <div className="text-sm">
            {renderEditableField('notes_gestion', bien.notes_gestion, 'Notes de gestion', 'text')}
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t flex justify-between">
        <button
          onClick={() => router.push(`/dashboard/gestionnaire/biens/${bien.id}`)}
          className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          <Eye className="h-4 w-4 mr-1" />
          Détails
        </button>
        <div className="flex gap-2">
          {!bien.supprime ? (
            <>
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
                title="Contacter"
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

/**
 * Page Gestion des Biens Gestionnaire
 * L'authentification est gérée par le layout.tsx
 */
export default function GestionBiensPage() {
  const router = useRouter();
  const [gestionnaireId, setGestionnaireId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDeleted, setShowDeleted] = useState(false);
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

  // Hook pour récupérer le profil gestionnaire (tarif gestion locative)
  const { gestionnaire } = useGestionnaire(gestionnaireId);
  const tarifGestionLocative = typeof gestionnaire?.tarif_base === 'number' ? gestionnaire.tarif_base : 0;

  // Calcul rentabilité nette pour chaque bien
  const biensAvecFraisGestion: BienEnGestionAvecFraisGestion[] = useMemo(() => {
    return biens.map(bien => {
      const revenuMensuel = bien.revenue_mensuel_custom && bien.revenue_mensuel_custom > 0 ? bien.revenue_mensuel_custom : bien.loyer_indicatif;
      const fraisGestion = tarifGestionLocative > 0 ? Math.round(revenuMensuel * (tarifGestionLocative / 100)) : 0;
      return { ...bien, frais_gestion_mensuel: fraisGestion };
    });
  }, [biens, tarifGestionLocative]);

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
    console.log('Modifier le bien:', bien.id);
    // TODO: Implémenter la page de modification du bien
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

  const handleModify = async (bienId: string, field: string, value: any) => {
    const modifications: any = {};
    
    // Traiter différemment selon le type de champ
    if (field === 'revenue_mensuel_custom') {
      modifications[field] = value ? Number(value) : 0;
    } else {
      modifications[field] = value;
    }

    const success = await modifierBien(bienId, modifications);
    if (success) {
      console.log('✅ Bien modifié avec succès');
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
          {biensFiltres.map((bien) => {
            const bienAvecFraisGestion = biensAvecFraisGestion.find(b => b.id === bien.id) || bien;
            return (
              <CarteBien
                key={bien.id}
                bien={bienAvecFraisGestion}
                onContact={handleContact}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onModify={handleModify}
                viewMode={viewMode}
                showDeleted={showDeleted}
              />
            );
          })}
        </div>
      )}
    </div>
  );
} 