'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';
import { MapPin, CurrencyEur, Medal, Users, TrendUp, Buildings } from '@phosphor-icons/react';

interface GestionnaireProfile {
  nom_agence: string;
  description: string;
  zone_intervention: string[];
  tarif_base: number;
  certifications: string[];
  services_offerts: string[];
}

/**
 * Dashboard Gestionnaire - Page principale
 * L'authentification est gérée par le layout.tsx
 */
export default function GestionnaireDashboard() {
  const [profile, setProfile] = useState<GestionnaireProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGestionnaireProfile();
  }, []);

  const loadGestionnaireProfile = async () => {
    try {
      // Récupérer l'utilisateur connecté (déjà vérifié par le layout)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return; // Normalement impossible car layout fait la vérification

      // Charger le profil gestionnaire
      const { data: profileData, error: profileError } = await supabase
        .from('profil_gestionnaire')
        .select('*')
        .eq('utilisateur_id', user.id)
        .single();

      if (profileError) {
        console.warn('Profil gestionnaire non trouvé:', profileError);
      } else {
        setProfile({
          nom_agence: profileData.nom_agence || '',
          description: profileData.description || '',
          zone_intervention: Array.isArray(profileData.zone_intervention)
            ? profileData.zone_intervention
            : (typeof profileData.zone_intervention === 'string' && profileData.zone_intervention.startsWith('['))
              ? JSON.parse(profileData.zone_intervention)
              : profileData.zone_intervention ? [profileData.zone_intervention] : [],
          tarif_base: profileData.tarif_base || 0,
          certifications: Array.isArray(profileData.certifications)
            ? profileData.certifications
            : (typeof profileData.certifications === 'string' && profileData.certifications.startsWith('['))
              ? JSON.parse(profileData.certifications)
              : profileData.certifications ? [profileData.certifications] : [],
          services_offerts: Array.isArray(profileData.services_offerts)
            ? profileData.services_offerts
            : (typeof profileData.services_offerts === 'string' && profileData.services_offerts.startsWith('['))
              ? JSON.parse(profileData.services_offerts)
              : profileData.services_offerts ? [profileData.services_offerts] : [],
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement du profil gestionnaire:', err);
    } finally {
      setLoading(false);
    }
  };

  // Statistiques fictives pour la démo
  const stats = [
    { name: 'Biens gérés', value: '24', icon: Buildings, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Demandes reçues', value: '16', icon: TrendUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Revenus ce mois', value: '3,250€', icon: CurrencyEur, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Note moyenne', value: '4.8/5', icon: Medal, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  return (
    <div className="space-y-6">
        {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`${stat.bg} rounded-lg p-3`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profil gestionnaire */}
          <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mon Profil</h2>
            
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : profile ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                  {profile.nom_agence}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {profile.description}
                </p>
              </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <span>{profile.zone_intervention}</span>
                  </div>
                  <div className="flex items-center">
                    <CurrencyEur className="h-5 w-5 text-gray-400 mr-3" />
                    <span>{profile.tarif_base}€/mois</span>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div className="flex flex-wrap gap-2">
                    {profile.zone_intervention.length === 0 ? (
                      <span className="text-gray-400 text-xs">Non renseigné</span>
                    ) : (
                      profile.zone_intervention.map((zone) => (
                        <span key={zone} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{zone}</span>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <CurrencyEur className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{profile.tarif_base}€/mois</span>
                </div>
                {profile.certifications.length > 0 && (
                  <div className="flex items-start">
                    <Medal className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div className="flex flex-wrap gap-2">
                      {profile.certifications.map((cert) => (
                        <span key={cert} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">{cert}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.services_offerts.length > 0 && (
                  <div className="flex items-start">
                    <span className="font-medium text-gray-700 mr-2">Services :</span>
                    <div className="flex flex-wrap gap-2">
                      {profile.services_offerts.map((service) => (
                        <span key={service} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">{service}</span>
                      ))}
                    </div>
                  </div>
                  {profile.certifications && (
                    <div className="flex items-start">
                      <Medal className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <span className="text-sm">{profile.certifications}</span>
                    </div>
                  )}
              </div>

              <div className="mt-4">
                <Link
                  href="/dashboard/gestionnaire/profil"
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Modifier mon profil →
                </Link>
              </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm mb-2">
                    Votre profil gestionnaire n'est pas encore complété.
                  </p>
                  <Link
                    href="/dashboard/gestionnaire/profil"
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Compléter mon profil →
                  </Link>
                </div>
              )}
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
            
            <div className="space-y-3">
              <Link
                href="/dashboard/gestionnaire/biens"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
               >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Buildings className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="font-medium">Gérer mes biens</span>
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-600">24 biens</span>
                </div>
              </Link>
              
              <Link
                href="/dashboard/gestionnaire/demandes"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium">Nouvelles demandes</span>
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-600">8 en attente</span>
                </div>
              </Link>
              
              <Link
              href="/dashboard/gestionnaire/messages"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendUp className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="font-medium">Messages</span>
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-600">3 non lus</span>
                </div>
              </Link>
            >
              <div className="flex items-center">
                <Buildings className="h-5 w-5 text-emerald-600 mr-3" />
                <span className="font-medium">Gérer mes biens</span>
              </div>
            </Link>
            
            <Link
              href="/dashboard/gestionnaire/demandes"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium">Nouvelles demandes</span>
              </div>
            </Link>
            
            <Link
              href="/dashboard/gestionnaire/messages"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center">
                <TrendUp className="h-5 w-5 text-purple-600 mr-3" />
                <span className="font-medium">Messages</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Activité récente</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm">Nouvelle demande reçue pour un appartement T3</span>
            </div>
            <span className="text-xs text-gray-400">Il y a 2h</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm">Contrat signé pour 15 Rue de la Paix</span>
            </div>
            <span className="text-xs text-gray-400">Hier</span>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-sm">Visite programmée pour 8 Avenue Victor Hugo</span>
            </div>
            <span className="text-xs text-gray-400">Il y a 2 jours</span>
          </div>
        </div>
      </div>
    </div>
  );
} 