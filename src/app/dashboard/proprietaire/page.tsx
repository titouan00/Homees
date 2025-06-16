'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { requireAuth } from '@/lib/auth-server';
import Link from 'next/link';
import { Buildings, CurrencyEur, Users, TrendUp, MapPin, Phone } from '@phosphor-icons/react';

interface ProprietaireProfile {
  type_investisseur: string;
  nombre_biens: number;
  budget_investissement: number;
  zone_recherche: string;
  telephone: string;
  profession: string;
}

/**
 * Dashboard Propriétaire - Page d'accueil Client Component
 */
export default function ProprietaireDashboard() {
  const [profile, setProfile] = useState<ProprietaireProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUserAndProfile();
  }, []);

  const loadUserAndProfile = async () => {
    try {
      setLoading(true);
      
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
      setLoading(false);
    }
  };

  // Statistiques du dashboard
  const stats = [
    { 
      name: 'Mes biens', 
      value: profile?.nombre_biens?.toString() || '0', 
      icon: Buildings, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100' 
    },
    { 
      name: 'Gestionnaires trouvés', 
      value: '8', 
      icon: Users, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-100' 
    },
    { 
      name: 'Budget d\'investissement', 
      value: profile?.budget_investissement ? `${profile.budget_investissement.toLocaleString()}€` : 'N/A', 
      icon: CurrencyEur, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100' 
    },
    { 
      name: 'Demandes actives', 
      value: '3', 
      icon: TrendUp, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100' 
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Gérez vos biens et trouvez les meilleurs gestionnaires</p>
        {user && <p className="text-sm text-gray-500 mt-1">Bienvenue, {user.nom}</p>}
      </div>

      {loading ? (
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
          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                      <span className="font-medium">Type d'investisseur : {profile.type_investisseur}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <span>Zone de recherche : {profile.zone_recherche}</span>
                    </div>
                    {profile.telephone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{profile.telephone}</span>
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
                  Gérer mes biens
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
                
                <div className="space-y-3">
                  <Link
                    href="/dashboard/proprietaire/comparateur"
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-emerald-600 mr-3" />
                      <span className="font-medium">Comparateur de gestionnaires</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-8">
                      Comparez les offres et services
                    </p>
                  </Link>
                  
                  <Link
                    href="/dashboard/proprietaire/demandes"
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <TrendUp className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="font-medium">Mes demandes</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-8">
                      Suivez vos demandes en cours
                    </p>
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