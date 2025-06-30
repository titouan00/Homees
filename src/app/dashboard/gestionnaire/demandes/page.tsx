'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { useDemandes, DemandeGestionnaire } from '@/hooks/useDemandes';
import { 
  Funnel,
  Plus,
  Eye,
  ChatCircle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  TrendUp,
  MapPin,
  Buildings,
  CurrencyEur,
  Phone,
  Envelope,
  Calendar,
  Bell,
  Star,
  CircleNotch,
  CaretDown,
  Check
} from '@phosphor-icons/react';

// Types pour les filtres
interface FiltresState {
  statut: string[];
  priorite: string[];
  recherche: string;
}

/**
 * Page Gestion des Demandes Gestionnaire
 * L'authentification est gérée par le layout.tsx
 */
export default function GestionDemandesPage() {
  const router = useRouter();
  const [gestionnaireId, setGestionnaireId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [filtres, setFiltres] = useState<FiltresState>({
    statut: [],
    priorite: [],
    recherche: ''
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
      } finally {
        setLoading(false);
      }
    };

    getGestionnaireId();
  }, []);

  // Hook pour récupérer les demandes
  const { 
    demandes, 
    loading: demandesLoading, 
    error, 
    updateStatutDemande 
  } = useDemandes(gestionnaireId);

  // Filtrer les demandes
  const demandesFiltrees = useMemo(() => {
    return demandes.filter(demande => {
      // Filtre par statut
      if (filtres.statut.length > 0 && !filtres.statut.includes(demande.statut)) {
        return false;
      }

      // Filtre par priorité
      if (filtres.priorite.length > 0 && !filtres.priorite.includes(demande.priorite)) {
        return false;
      }

      // Filtre par recherche
      if (filtres.recherche.trim()) {
        const recherche = filtres.recherche.toLowerCase();
        const matchNom = demande.proprietaire.nom.toLowerCase().includes(recherche);
        const matchEmail = demande.proprietaire.email.toLowerCase().includes(recherche);
        const matchAdresse = demande.bien?.adresse?.toLowerCase().includes(recherche) || false;
        const matchVille = demande.bien?.ville?.toLowerCase().includes(recherche) || false;
        
        if (!matchNom && !matchEmail && !matchAdresse && !matchVille) {
          return false;
        }
      }

      return true;
    });
  }, [demandes, filtres]);

  // Grouper les demandes par statut
  const demandesParStatut = useMemo(() => {
    const groupes = {
      ouverte: demandesFiltrees.filter(d => d.statut === 'ouverte'),
      acceptee: demandesFiltrees.filter(d => d.statut === 'acceptee'),
      rejetee: demandesFiltrees.filter(d => d.statut === 'rejetee'),
      terminee: demandesFiltrees.filter(d => d.statut === 'terminee')
    };
    return groupes;
  }, [demandesFiltrees]);

  // Statistiques
  const stats = useMemo(() => {
    return {
      nouvelles: demandesParStatut.ouverte.length,
      acceptees: demandesParStatut.acceptee.length,
      rejetees: demandesParStatut.rejetee.length,
      total: demandes.length
    };
  }, [demandesParStatut, demandes.length]);

  // Handlers
  const handleViewDetails = (demande: DemandeGestionnaire) => {
    // TODO: Implémenter la vue détaillée
    console.log('Voir détails:', demande.id);
  };

  const handleContact = (demande: DemandeGestionnaire) => {
    router.push(`/dashboard/gestionnaire/messages?demande=${demande.id}`);
  };

  const handleChangeStatut = async (demande: DemandeGestionnaire, nouveauStatut: string) => {
    const result = await updateStatutDemande(demande.id, nouveauStatut);
    if (!result.success) {
      alert(`Erreur: ${result.error}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || demandesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircleNotch className="h-8 w-8 text-emerald-600 animate-spin" />
        <span className="ml-2 text-gray-600">Chargement des demandes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Erreur lors du chargement des demandes : {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des demandes</h1>
          <p className="text-gray-600">Pipeline de prospects et demandes de gestion</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <Plus className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Nouvelles</p>
              <p className="text-2xl font-bold text-blue-900">{stats.nouvelles}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Acceptées</p>
              <p className="text-2xl font-bold text-green-900">{stats.acceptees}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Refusées</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejetees}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendUp className="h-8 w-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Recherche */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                value={filtres.recherche}
                onChange={(e) => setFiltres({ ...filtres, recherche: e.target.value })}
                placeholder="Rechercher par nom, email, adresse..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dropdown Statut */}
          <DropdownFilter
            label="Statut"
            options={[
              { value: 'ouverte', label: 'Ouverte', color: 'bg-blue-100 text-blue-800' },
              { value: 'acceptee', label: 'Acceptée', color: 'bg-green-100 text-green-800' },
              { value: 'rejetee', label: 'Rejetée', color: 'bg-red-100 text-red-800' },
              { value: 'terminee', label: 'Terminée', color: 'bg-gray-100 text-gray-800' }
            ]}
            selectedValues={filtres.statut}
            onChange={(values) => setFiltres({ ...filtres, statut: values })}
          />

          {/* Dropdown Priorité */}
          <DropdownFilter
            label="Priorité"
            options={[
              { value: 'haute', label: 'Haute', color: 'bg-red-100 text-red-800' },
              { value: 'moyenne', label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' },
              { value: 'basse', label: 'Basse', color: 'bg-green-100 text-green-800' }
            ]}
            selectedValues={filtres.priorite}
            onChange={(values) => setFiltres({ ...filtres, priorite: values })}
          />

          {/* Bouton reset filtres */}
          <button
            onClick={() => setFiltres({ statut: [], priorite: [], recherche: '' })}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Réinitialiser
          </button>
        </div>

        {/* Filtres actifs */}
        {(filtres.statut.length > 0 || filtres.priorite.length > 0 || filtres.recherche) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Filtres actifs:</span>
              {filtres.statut.map(statut => (
                <span key={statut} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {statut}
                  <button
                    onClick={() => setFiltres({ ...filtres, statut: filtres.statut.filter(s => s !== statut) })}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filtres.priorite.map(priorite => (
                <span key={priorite} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  {priorite}
                  <button
                    onClick={() => setFiltres({ ...filtres, priorite: filtres.priorite.filter(p => p !== priorite) })}
                    className="ml-1 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filtres.recherche && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                  "{filtres.recherche}"
                  <button
                    onClick={() => setFiltres({ ...filtres, recherche: '' })}
                    className="ml-1 text-gray-600 hover:text-gray-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Liste des demandes */}
      <div className="space-y-4">
        {demandesFiltrees.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande trouvée</h3>
            <p className="text-gray-500">
              {filtres.recherche || filtres.statut.length > 0 || filtres.priorite.length > 0
                ? 'Aucune demande ne correspond à vos critères'
                : 'Vous n\'avez pas encore reçu de demande'
              }
            </p>
          </div>
        ) : (
          demandesFiltrees.map((demande) => (
            <CarteDemande
              key={demande.id}
              demande={demande}
              onViewDetails={handleViewDetails}
              onContact={handleContact}
              onChangeStatut={handleChangeStatut}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Composant dropdown avec checkboxes pour les filtres
function DropdownFilter({ 
  label, 
  options, 
  selectedValues, 
  onChange 
}: {
  label: string;
  options: { value: string; label: string; color?: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const selectedCount = selectedValues.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 min-w-[120px]"
      >
        <span className="text-sm text-gray-700">
          {label}
          {selectedCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs">
              {selectedCount}
            </span>
          )}
        </span>
        <CaretDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
          <div className="p-2 max-h-64 overflow-y-auto">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                  className="mr-3 h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <div className="flex items-center flex-1">
                  <span className="text-sm text-gray-900">{option.label}</span>
                  {option.color && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${option.color}`}>
                      {option.label}
                    </span>
                  )}
                </div>
                {selectedValues.includes(option.value) && (
                  <Check className="h-4 w-4 text-emerald-600 ml-2" />
                )}
              </label>
            ))}
          </div>
          
          {selectedCount > 0 && (
            <div className="border-t border-gray-200 p-2">
              <button
                onClick={() => onChange([])}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
              >
                Effacer tout ({selectedCount})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay pour fermer le dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Composant carte de demande
function CarteDemande({ demande, onViewDetails, onContact, onChangeStatut, formatDate }: {
  demande: DemandeGestionnaire;
  onViewDetails: (demande: DemandeGestionnaire) => void;
  onContact: (demande: DemandeGestionnaire) => void;
  onChangeStatut: (demande: DemandeGestionnaire, nouveauStatut: string) => void;
  formatDate: (dateString: string) => string;
}) {
  const getStatutConfig = (statut: string) => {
    switch (statut) {
      case 'ouverte':
        return { label: 'Ouverte', color: 'bg-blue-100 text-blue-800', icon: Plus };
      case 'acceptee':
        return { label: 'Acceptée', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'rejetee':
        return { label: 'Rejetée', color: 'bg-red-100 text-red-800', icon: XCircle };
      case 'terminee':
        return { label: 'Terminée', color: 'bg-gray-100 text-gray-800', icon: FileText };
      default:
        return { label: statut, color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'haute':
        return 'border-l-red-500';
      case 'moyenne':
        return 'border-l-yellow-500';
      case 'basse':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const statutConfig = getStatutConfig(demande.statut);
  const StatutIcon = statutConfig.icon;

  return (
    <div className={`bg-white rounded-lg border-l-4 ${getPrioriteColor(demande.priorite)} shadow-sm p-6 hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {demande.proprietaire.nom}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statutConfig.color}`}>
              <StatutIcon className="h-3 w-3 mr-1" />
              {statutConfig.label}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              demande.priorite === 'haute' ? 'bg-red-100 text-red-800' :
              demande.priorite === 'moyenne' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              Priorité {demande.priorite}
            </span>
          </div>
          <p className="text-sm text-gray-600">{demande.proprietaire.email}</p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">Reçue le</p>
          <p className="text-sm font-medium text-gray-900">{formatDate(demande.created_at)}</p>
        </div>
      </div>

      {/* Informations du bien */}
      {demande.bien && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <Buildings className="h-4 w-4 mr-2" />
            Bien concerné
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Adresse:</span>
              <p className="font-medium">{demande.bien.adresse}</p>
            </div>
            <div>
              <span className="text-gray-500">Ville:</span>
              <p className="font-medium">{demande.bien.ville}</p>
            </div>
            <div>
              <span className="text-gray-500">Type:</span>
              <p className="font-medium capitalize">{demande.bien.type_bien}</p>
            </div>
            <div>
              <span className="text-gray-500">Surface:</span>
              <p className="font-medium">{demande.bien.surface_m2} m²</p>
            </div>
          </div>
          {demande.bien.loyer_indicatif > 0 && (
            <div className="mt-2">
              <span className="text-gray-500">Loyer indicatif:</span>
              <span className="ml-2 font-medium text-emerald-600">
                {demande.bien.loyer_indicatif.toLocaleString()} €/mois
              </span>
            </div>
          )}
        </div>
      )}

      {/* Message initial */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Message initial</h4>
        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
          {demande.message_initial}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onViewDetails(demande)}
            className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700"
          >
            <Eye className="h-4 w-4 mr-1" />
            Voir détails
          </button>
          
          <button
            onClick={() => onContact(demande)}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <ChatCircle className="h-4 w-4 mr-1" />
            Contacter ({demande.nombre_messages})
          </button>

          {demande.proprietaire.telephone && (
            <a
              href={`tel:${demande.proprietaire.telephone}`}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700"
            >
              <Phone className="h-4 w-4 mr-1" />
              Appeler
            </a>
          )}
        </div>

        {/* Actions de changement de statut */}
        <div className="flex gap-2">
          {demande.statut === 'ouverte' && (
            <>
              <button
                onClick={() => onChangeStatut(demande, 'acceptee')}
                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
              >
                Accepter
              </button>
              <button
                onClick={() => onChangeStatut(demande, 'rejetee')}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
              >
                Rejeter
              </button>
            </>
          )}
          
          {demande.statut === 'acceptee' && (
            <button
              onClick={() => onChangeStatut(demande, 'terminee')}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
            >
              Terminer
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 