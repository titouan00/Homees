'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Gear,
  Bell,
  MapPin,
  Buildings,
  CurrencyEur,
  Shield,
  Envelope,
  Phone,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  Warning,
  Info,
  CreditCard,
  ShieldCheck
} from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase-client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

// Types
interface ParametresGestionnaire {
  // Notifications
  notifications_email: boolean;
  notifications_sms: boolean;
  notifications_push: boolean;
  freq_notifications: 'temps_reel' | 'quotidien' | 'hebdomadaire';
  notifications_nouvelles_demandes: boolean;
  notifications_messages: boolean;
  notifications_evaluations: boolean;
  notifications_paiements: boolean;
  
  // Zones d'intervention prioritaires
  zones_prioritaires: string[];
  rayon_intervention_km: number;
  deplacement_accepte: boolean;
  frais_deplacement: number;
  
  // Types de biens acceptés
  types_biens_acceptes: string[];
  surface_min: number;
  surface_max: number;
  budget_min: number;
  budget_max: number;
  
  // Tarification par défaut
  tarif_gestion_locative: number;
  tarif_recherche_locataires: number;
  tarif_etat_lieux: number;
  tarif_travaux: number;
  commission_signature: number;
  
  // Préférences business
  accepte_meuble: boolean;
  accepte_colocation: boolean;
  accepte_courte_duree: boolean;
  accepte_professionnel: boolean;
  
  // Horaires
  horaires_contact: {
    lundi: { debut: string; fin: string; actif: boolean };
    mardi: { debut: string; fin: string; actif: boolean };
    mercredi: { debut: string; fin: string; actif: boolean };
    jeudi: { debut: string; fin: string; actif: boolean };
    vendredi: { debut: string; fin: string; actif: boolean };
    samedi: { debut: string; fin: string; actif: boolean };
    dimanche: { debut: string; fin: string; actif: boolean };
  };
}

// Composant toggle
function Toggle({ enabled, onChange, disabled = false }: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-emerald-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// Composant section
interface SectionProps {
  title: string;
  icon: any;
  children: React.ReactNode;
}

function Section({ title, icon: Icon, children }: SectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 rounded-lg p-2">
          <Icon className="h-5 w-5 text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// Composant badge sélectionnable
function SelectableBadge({ text, selected, onClick }: {
  text: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        selected
          ? 'bg-emerald-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {text}
    </button>
  );
}

export default function ParametresGestionnairePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [abonnementLoading, setAbonnementLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState(user);

  const [parametres, setParametres] = useState<ParametresGestionnaire>({
    // Notifications
    notifications_email: true,
    notifications_sms: false,
    notifications_push: true,
    freq_notifications: 'temps_reel',
    notifications_nouvelles_demandes: true,
    notifications_messages: true,
    notifications_evaluations: true,
    notifications_paiements: true,
    
    // Zones
    zones_prioritaires: [],
    rayon_intervention_km: 20,
    deplacement_accepte: true,
    frais_deplacement: 0,
    
    // Types de biens
    types_biens_acceptes: [],
    surface_min: 10,
    surface_max: 200,
    budget_min: 500,
    budget_max: 5000,
    
    // Tarification
    tarif_gestion_locative: 8.5,
    tarif_recherche_locataires: 150,
    tarif_etat_lieux: 80,
    tarif_travaux: 15,
    commission_signature: 10,
    
    // Préférences
    accepte_meuble: true,
    accepte_colocation: false,
    accepte_courte_duree: false,
    accepte_professionnel: true,
    
    // Horaires
    horaires_contact: {
      lundi: { debut: '09:00', fin: '18:00', actif: true },
      mardi: { debut: '09:00', fin: '18:00', actif: true },
      mercredi: { debut: '09:00', fin: '18:00', actif: true },
      jeudi: { debut: '09:00', fin: '18:00', actif: true },
      vendredi: { debut: '09:00', fin: '18:00', actif: true },
      samedi: { debut: '10:00', fin: '16:00', actif: false },
      dimanche: { debut: '10:00', fin: '16:00', actif: false }
    }
  });

  const [activeTab, setActiveTab] = useState('notifications');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  // Simuler le chargement des paramètres
  useEffect(() => {
    // Ici on chargerait les paramètres depuis la base de données
    setParametres(prev => ({
      ...prev,
      zones_prioritaires: ['Paris 1er', 'Paris 4ème', 'Paris 6ème'],
      types_biens_acceptes: ['Studio', 'Appartement T1', 'Appartement T2', 'Appartement T3']
    }));
  }, []);

  const handleSave = () => {
    console.log('Sauvegarde des paramètres:', parametres);
    setHasChanges(false);
    // Ici on sauvegarderait en base
    // Afficher un toast de succès
  };

  const handleZoneToggle = (zone: string) => {
    setParametres(prev => ({
      ...prev,
      zones_prioritaires: prev.zones_prioritaires.includes(zone)
        ? prev.zones_prioritaires.filter(z => z !== zone)
        : [...prev.zones_prioritaires, zone]
    }));
    setHasChanges(true);
  };

  const handleTypeBienToggle = (type: string) => {
    setParametres(prev => ({
      ...prev,
      types_biens_acceptes: prev.types_biens_acceptes.includes(type)
        ? prev.types_biens_acceptes.filter(t => t !== type)
        : [...prev.types_biens_acceptes, type]
    }));
    setHasChanges(true);
  };

  const handleHoraireChange = (jour: string, field: string, value: string | boolean) => {
    setParametres(prev => ({
      ...prev,
      horaires_contact: {
        ...prev.horaires_contact,
        [jour]: {
          ...prev.horaires_contact[jour as keyof typeof prev.horaires_contact],
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  // Souscription à Pro
  const handleSubscribePro = async () => {
    setShowPaymentModal(false);
    setAbonnementLoading(true);
    const expiration = new Date();
    expiration.setMonth(expiration.getMonth() + 1);
    const expirationISO = expiration.toISOString();
    const { error } = await supabase
      .from('utilisateurs')
      .update({ abonnement: 'pro', abonnement_expiration: expirationISO })
      .eq('id', user?.id);
    if (!error) {
      setLocalUser(prev => prev ? { ...prev, abonnement: 'pro', abonnement_expiration: expirationISO } : prev);
      setSuccessMessage(`Votre paiement a bien été validé. Vous êtes abonné à Homees Pro jusqu'au ${format(expiration, 'dd MMMM yyyy', { locale: fr })}.`);
      router.refresh();
    }
    setAbonnementLoading(false);
  };

  // Annulation de l'abonnement
  const handleCancelPro = async () => {
    setShowCancelModal(false);
    setAbonnementLoading(true);
    const { error } = await supabase
      .from('utilisateurs')
      .update({ abonnement: 'free', abonnement_expiration: null })
      .eq('id', user?.id);
    if (!error) {
      setLocalUser(prev => prev ? { ...prev, abonnement: 'free', abonnement_expiration: null } : prev);
      setSuccessMessage('Votre abonnement Pro a bien été annulé. Vous êtes repassé à la formule Free.');
      router.refresh();
    }
    setAbonnementLoading(false);
  };

  // Affichage de la date d'expiration
  const expirationDate = localUser?.abonnement_expiration ? format(new Date(localUser.abonnement_expiration), "dd MMMM yyyy", { locale: fr }) : null;
  const isPro = localUser?.abonnement === 'pro' && localUser.abonnement_expiration && new Date(localUser.abonnement_expiration) > new Date();

  // Ajout de l'onglet Abonnement uniquement pour les gestionnaires
  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'zones', label: 'Zones & Déplacements', icon: MapPin },
    { id: 'biens', label: 'Types de biens', icon: Buildings },
    { id: 'tarifs', label: 'Tarification', icon: CurrencyEur },
    { id: 'horaires', label: 'Horaires', icon: Clock },
  ];
  if (user && user.role === 'gestionnaire') {
    tabs.push({ id: 'abonnement', label: 'Abonnement', icon: CreditCard });
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton de sauvegarde */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">Configurez vos préférences de travail</p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Sauvegarder
          </button>
        )}
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="space-y-6">
        {/* Onglet Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Section title="Préférences de notification" icon={Bell}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Canaux de notification</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Email</span>
                        <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
                      </div>
                      <Toggle
                        enabled={parametres.notifications_email}
                        onChange={(enabled) => {
                          setParametres(prev => ({ ...prev, notifications_email: enabled }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">SMS</span>
                        <p className="text-sm text-gray-500">Recevoir les notifications urgentes par SMS</p>
                      </div>
                      <Toggle
                        enabled={parametres.notifications_sms}
                        onChange={(enabled) => {
                          setParametres(prev => ({ ...prev, notifications_sms: enabled }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Push (navigateur)</span>
                        <p className="text-sm text-gray-500">Notifications directes dans le navigateur</p>
                      </div>
                      <Toggle
                        enabled={parametres.notifications_push}
                        onChange={(enabled) => {
                          setParametres(prev => ({ ...prev, notifications_push: enabled }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Fréquence des notifications</h3>
                  <select
                    value={parametres.freq_notifications}
                    onChange={(e) => {
                      setParametres(prev => ({ ...prev, freq_notifications: e.target.value as any }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="temps_reel">Temps réel</option>
                    <option value="quotidien">Résumé quotidien</option>
                    <option value="hebdomadaire">Résumé hebdomadaire</option>
                  </select>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Types de notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Nouvelles demandes</span>
                      <Toggle
                        enabled={parametres.notifications_nouvelles_demandes}
                        onChange={(enabled) => {
                          setParametres(prev => ({ ...prev, notifications_nouvelles_demandes: enabled }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Messages</span>
                      <Toggle
                        enabled={parametres.notifications_messages}
                        onChange={(enabled) => {
                          setParametres(prev => ({ ...prev, notifications_messages: enabled }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Évaluations</span>
                      <Toggle
                        enabled={parametres.notifications_evaluations}
                        onChange={(enabled) => {
                          setParametres(prev => ({ ...prev, notifications_evaluations: enabled }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Paiements</span>
                      <Toggle
                        enabled={parametres.notifications_paiements}
                        onChange={(enabled) => {
                          setParametres(prev => ({ ...prev, notifications_paiements: enabled }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* Onglet Zones */}
        {activeTab === 'zones' && (
          <div className="space-y-6">
            <Section title="Zones d'intervention prioritaires" icon={MapPin}>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Sélectionnez vos zones de prédilection pour recevoir des demandes ciblées
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {Array.from({ length: 20 }, (_, i) => `Paris ${i + 1}${i < 9 ? 'er' : 'ème'}`).map((zone) => (
                      <SelectableBadge
                        key={zone}
                        text={zone}
                        selected={parametres.zones_prioritaires.includes(zone)}
                        onClick={() => handleZoneToggle(zone)}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rayon d'intervention (km)
                      </label>
                      <input
                        type="number"
                        value={parametres.rayon_intervention_km}
                        onChange={(e) => {
                          setParametres(prev => ({ ...prev, rayon_intervention_km: parseInt(e.target.value) }));
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frais de déplacement (€)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={parametres.frais_deplacement}
                        onChange={(e) => {
                          setParametres(prev => ({ ...prev, frais_deplacement: parseFloat(e.target.value) }));
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* Onglet Types de biens */}
        {activeTab === 'biens' && (
          <div className="space-y-6">
            <Section title="Types de biens acceptés" icon={Buildings}>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Sélectionnez les types de biens que vous souhaitez gérer
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Studio', 'Appartement T1', 'Appartement T2', 'Appartement T3',
                      'Appartement T4+', 'Maison', 'Loft', 'Local commercial'
                    ].map((type) => (
                      <SelectableBadge
                        key={type}
                        text={type}
                        selected={parametres.types_biens_acceptes.includes(type)}
                        onClick={() => handleTypeBienToggle(type)}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Critères de surface</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Surface minimum (m²)
                      </label>
                      <input
                        type="number"
                        value={parametres.surface_min}
                        onChange={(e) => {
                          setParametres(prev => ({ ...prev, surface_min: parseInt(e.target.value) }));
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Surface maximum (m²)
                      </label>
                      <input
                        type="number"
                        value={parametres.surface_max}
                        onChange={(e) => {
                          setParametres(prev => ({ ...prev, surface_max: parseInt(e.target.value) }));
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Critères de budget</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget minimum (€/mois)
                      </label>
                      <input
                        type="number"
                        value={parametres.budget_min}
                        onChange={(e) => {
                          setParametres(prev => ({ ...prev, budget_min: parseInt(e.target.value) }));
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget maximum (€/mois)
                      </label>
                      <input
                        type="number"
                        value={parametres.budget_max}
                        onChange={(e) => {
                          setParametres(prev => ({ ...prev, budget_max: parseInt(e.target.value) }));
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Préférences business</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Accepter les biens meublés</span>
                      <Toggle
                        enabled={parametres.accepte_meuble}
                        onChange={(enabled) => {
                          setParametres(prev => ({ ...prev, accepte_meuble: enabled }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Accepter les colocations</span>
                      <Toggle
                        enabled={parametres.accepte_colocation}
                        onChange={(enabled) => {
                          setParametres(prev => ({ ...prev, accepte_colocation: enabled }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Accepter la courte durée</span>
                      <Toggle
                        enabled={parametres.accepte_courte_duree}
                        onChange={(enabled) => {
                          setParametres(prev => ({ ...prev, accepte_courte_duree: enabled }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Accepter les baux professionnels</span>
                      <Toggle
                        enabled={parametres.accepte_professionnel}
                        onChange={(enabled) => {
                          setParametres(prev => ({ ...prev, accepte_professionnel: enabled }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* Onglet Tarification */}
        {activeTab === 'tarifs' && (
          <div className="space-y-6">
            <Section title="Tarification par défaut" icon={CurrencyEur}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gestion locative (% du loyer)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={parametres.tarif_gestion_locative}
                        onChange={(e) => {
                          setParametres(prev => ({ ...prev, tarif_gestion_locative: parseFloat(e.target.value) }));
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <span className="absolute right-3 top-2 text-gray-500">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recherche de locataires (€)
                    </label>
                    <input
                      type="number"
                      value={parametres.tarif_recherche_locataires}
                      onChange={(e) => {
                        setParametres(prev => ({ ...prev, tarif_recherche_locataires: parseInt(e.target.value) }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      État des lieux (€)
                    </label>
                    <input
                      type="number"
                      value={parametres.tarif_etat_lieux}
                      onChange={(e) => {
                        setParametres(prev => ({ ...prev, tarif_etat_lieux: parseInt(e.target.value) }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suivi travaux (% du montant)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={parametres.tarif_travaux}
                        onChange={(e) => {
                          setParametres(prev => ({ ...prev, tarif_travaux: parseFloat(e.target.value) }));
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <span className="absolute right-3 top-2 text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* Onglet Horaires */}
        {activeTab === 'horaires' && (
          <div className="space-y-6">
            <Section title="Horaires de contact" icon={Clock}>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Définissez vos horaires de disponibilité pour être contacté
                </p>
                
                {Object.entries(parametres.horaires_contact).map(([jour, horaire]) => (
                  <div key={jour} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Toggle
                        enabled={horaire.actif}
                        onChange={(enabled) => handleHoraireChange(jour, 'actif', enabled)}
                      />
                      <span className="text-sm font-medium text-gray-900 capitalize w-20">
                        {jour}
                      </span>
                    </div>
                    
                    {horaire.actif && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={horaire.debut}
                          onChange={(e) => handleHoraireChange(jour, 'debut', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="time"
                          value={horaire.fin}
                          onChange={(e) => handleHoraireChange(jour, 'fin', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* Onglet Abonnement */}
        {activeTab === 'abonnement' && user && user.role === 'gestionnaire' && (
          <div className="space-y-6">
            <Section title="Votre abonnement" icon={CreditCard}>
              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-4 py-3 mb-4 text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  {successMessage}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Carte Free */}
                <div className={`bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm ${!isPro ? 'ring-2 ring-emerald-400' : ''}`}>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">Formule Free <Shield className="h-5 w-5 text-gray-400" /></h3>
                    <p className="text-gray-600 mt-2 mb-4">Idéal pour démarrer gratuitement sur Homees.</p>
                    <ul className="space-y-2 text-gray-700 text-sm mb-6">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Visibilité dans le comparateur</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> 3 conversations actives</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Support par email</li>
                    </ul>
                  </div>
                  <div className="mt-auto flex flex-col gap-2">
                    <span className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold">Gratuit</span>
                    {!isPro && (
                      <span className="mt-2 text-xs text-emerald-600 font-semibold">Votre formule actuelle</span>
                    )}
                  </div>
                </div>
                {/* Carte Pro */}
                <div className={`bg-white rounded-xl border-2 border-emerald-500 p-6 flex flex-col justify-between shadow-lg relative ${isPro ? 'ring-2 ring-emerald-500' : ''}`}>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">Formule Pro <ShieldCheck className="h-5 w-5 text-emerald-500" /></h3>
                    <p className="text-gray-600 mt-2 mb-4">Débloquez tout le potentiel de Homees pour booster votre activité.</p>
                    <ul className="space-y-2 text-gray-700 text-sm mb-6">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Visibilité prioritaire dans le comparateur</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Messagerie illimitée</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Accès aux statistiques avancées</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Support prioritaire</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Badge "Gestionnaire Pro" sur votre profil</li>
                    </ul>
                  </div>
                  <div className="mt-auto flex flex-col gap-2">
                    <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-semibold mb-2">59€ / mois</span>
                    {isPro ? (
                      <>
                        <span className="text-xs text-emerald-700 font-semibold">Votre formule actuelle</span>
                        <span className="text-xs text-gray-600">Expiration : {expirationDate}</span>
                        <button
                          className="mt-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                          onClick={() => setShowCancelModal(true)}
                          disabled={abonnementLoading}
                        >
                          Annuler l'abonnement
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                        onClick={() => setShowPaymentModal(true)}
                        disabled={abonnementLoading}
                      >
                        Passer à Pro
                      </button>
                    )}
                  </div>
                  {isPro && (
                    <span className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">Pro</span>
                  )}
                </div>
              </div>

              {/* Modal paiement factice */}
              {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full relative">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowPaymentModal(false)}><XCircle className="h-5 w-5" /></button>
                    <h3 className="text-lg font-bold mb-4">Paiement de l'abonnement Pro</h3>
                    <p className="text-gray-600 mb-6">Ce formulaire est factice. Cliquez sur "Valider le paiement" pour simuler la souscription.</p>
                    <button
                      className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                      onClick={handleSubscribePro}
                      disabled={abonnementLoading}
                    >
                      Valider le paiement
                    </button>
                  </div>
                </div>
              )}

              {/* Modal annulation */}
              {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full relative">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowCancelModal(false)}><XCircle className="h-5 w-5" /></button>
                    <h3 className="text-lg font-bold mb-4 text-red-700">Annuler l'abonnement Pro</h3>
                    <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir annuler votre abonnement Pro ? Vous conserverez les avantages Pro jusqu'à la prochaine échéance.</p>
                    <button
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors mb-2"
                      onClick={handleCancelPro}
                      disabled={abonnementLoading}
                    >
                      Confirmer l'annulation
                    </button>
                    <button
                      className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      onClick={() => setShowCancelModal(false)}
                    >
                      Retour
                    </button>
                  </div>
                </div>
              )}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}