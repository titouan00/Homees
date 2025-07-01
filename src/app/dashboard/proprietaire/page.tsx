'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useDashboardProprietaire } from '@/hooks/useDashboardProprietaire';
import Link from 'next/link';
import { Buildings, CurrencyEur, Users, TrendUp, MapPin, Phone, CheckCircle } from '@phosphor-icons/react';

interface ProprietaireProfile {
  type_investisseur: string;
  nombre_biens: number;
  budget_investissement: number;
  zone_recherche: string;
  telephone: string;
  profession: string;
}

/**
 * Dashboard Propriétaire - Page d'accueil avec données réelles
 */
export default function ProprietaireDashboard() {
  const [profile, setProfile] = useState<ProprietaireProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Hook pour récupérer les statistiques réelles
  const dashboardStats = useDashboardProprietaire(user?.id);

  useEffect(() => {
    loadUserAndProfile();
  }, []);

  const loadUserAndProfile = async () => {
    try {
      setProfileLoading(true);
      
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer les données utilisateur
      const { data: userData } = await supabase
        .from('utilisateurs')
        .select('id, nom, email, "rôle"')
        .eq('id', user.id)
        .single();

      if (userData) {
        setUser(userData);
        
        // Charger le profil propriétaire
        const { data: profileData } = await supabase
          .from('profil_proprietaire')
          .select('*')
          .eq('utilisateur_id', userData.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }
      }
    } catch (err) {
      console.warn('Erreur chargement données:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Statistiques du dashboard avec données réelles
  const stats = [
    { 
      name: 'Mes biens', 
      value: dashboardStats.nombreBiens.toString(), 
      icon: Buildings, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100',
      href: '/dashboard/proprietaire/biens'
    },
    { 
      name: 'Gestionnaires contactés', 
      value: dashboardStats.nombreGestionnaires.toString(), 
      icon: Users, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-100',
      href: '/dashboard/proprietaire/comparateur'
    },
    { 
      name: 'Budget d\'investissement', 
      value: dashboardStats.budgetInvestissement ? `${dashboardStats.budgetInvestissement.toLocaleString()}€` : 'N/A', 
      icon: CurrencyEur, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100',
      href: '/dashboard/proprietaire/profil'
    },
    { 
      name: 'Demandes envoyées', 
      value: dashboardStats.nombreDemandes.toString(), 
      icon: TrendUp, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100',
      href: '/dashboard/proprietaire/demandes'
    }
  ];

  const isLoading = profileLoading || dashboardStats.loading;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Gérez vos biens et trouvez les meilleurs gestionnaires</p>
        {user && <p className="text-sm text-gray-500 mt-1">Bienvenue, {user.nom}</p>}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-lg p-3 w-12 h-12"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Statistiques avec données réelles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link 
                  key={stat.name} 
                  href={stat.href}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className={`${stat.bg} rounded-lg p-3`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Erreur de chargement */}
          {dashboardStats.error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                Erreur lors du chargement des données : {dashboardStats.error}
              </p>
            </div>
          )}

          {/* Actions rapides */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mes biens */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mes biens</h2>
              
              <div className="space-y-4">
                {profile ? (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Buildings className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="font-medium">Type d'investisseur : {profile.type_investisseur || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <span>Zone de recherche : {profile.zone_recherche || 'Non renseigné'}</span>
                    </div>
                    {profile.telephone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{profile.telephone}</span>
                      </div>
                    )}
                    {dashboardStats.nombreBiens > 0 && (
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-green-700 font-medium">
                          {dashboardStats.nombreBiens} bien{dashboardStats.nombreBiens > 1 ? 's' : ''} enregistré{dashboardStats.nombreBiens > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      Votre profil propriétaire n'est pas encore complété.
                    </p>
                    <Link
                      href="/dashboard/proprietaire/profil"
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      Compléter mon profil →
                    </Link>
                  </div>
                )}
                
                <Link
                  href="/dashboard/proprietaire/biens"
                  className="block w-full bg-emerald-600 text-white text-center px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Gérer mes biens ({dashboardStats.nombreBiens})
                </Link>
              </div>
            </div>

            {/* Recherche de gestionnaires */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recherche de gestionnaires</h2>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  Trouvez le gestionnaire parfait pour vos biens immobiliers
                </p>
                
                {dashboardStats.nombreGestionnaires > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-500 mr-3" />
                      <span className="text-blue-700 font-medium">
                        {dashboardStats.nombreGestionnaires} gestionnaire{dashboardStats.nombreGestionnaires > 1 ? 's' : ''} contacté{dashboardStats.nombreGestionnaires > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}

                {dashboardStats.nombreDemandesAcceptees > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-green-700 font-medium">
                        {dashboardStats.nombreDemandesAcceptees} demande{dashboardStats.nombreDemandesAcceptees > 1 ? 's' : ''} acceptée{dashboardStats.nombreDemandesAcceptees > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Link
                    href="/dashboard/proprietaire/comparateur"
                    className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Chercher des gestionnaires
                  </Link>
                  
                  <Link
                    href="/dashboard/proprietaire/demandes"
                    className="block w-full bg-purple-600 text-white text-center px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Voir mes demandes ({dashboardStats.nombreDemandes})
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}