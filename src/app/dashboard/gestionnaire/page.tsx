'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Shield, MapPin, CurrencyEur, Medal, Users, TrendUp, Buildings } from '@phosphor-icons/react';
import DashboardLayout from '@/components/navigation/DashboardLayout';

interface UserProfile {
  id: string;
  nom: string;
  email: string;
  role: 'proprietaire' | 'gestionnaire' | 'admin';
  créé_le: string;
}

interface GestionnaireProfile {
  nom_agence: string;
  description: string;
  zone_intervention: string;
  tarif_base: number;
  certifications: string;
  services_offerts: string[];
}

/**
 * Dashboard Gestionnaire - Page protégée avec sidebar moderne
 * Accessible uniquement aux utilisateurs connectés avec le rôle "gestionnaire"
 */
export default function GestionnaireDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<GestionnaireProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuthAndRole();
  }, []);

  const checkAuthAndRole = async () => {
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Erreur utilisateur:', userError);
        router.push('/login?redirect=/dashboard/gestionnaire');
        return;
      }

      if (!user) {
        router.push('/login?redirect=/dashboard/gestionnaire');
        return;
      }

      // Récupérer les données utilisateur
      const { data: userData, error: userDataError } = await supabase
        .from('utilisateurs')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userDataError) {
        console.error('Erreur profil utilisateur:', userDataError);
        if (userDataError.code === 'PGRST116') {
          setError('Profil utilisateur introuvable. Veuillez vous réinscrire.');
        } else {
          setError('Erreur lors du chargement du profil');
        }
        setLoading(false);
        return;
      }

      // Vérifier le rôle
      if (userData.rôle !== 'gestionnaire') {
        if (userData.rôle === 'proprietaire') {
          router.push('/dashboard/proprietaire');
        } else if (userData.rôle === 'admin') {
          setError('Compte administrateur - Accès dashboard gestionnaire refusé');
          setLoading(false);
        } else {
          setError('Rôle utilisateur non reconnu');
          setLoading(false);
        }
        return;
      }

      // Utilisateur valide
      setUser({
        id: userData.id,
        nom: userData.nom,
        email: userData.email,
        role: userData.rôle,
        créé_le: userData.créé_le
      });

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
          nom_agence: profileData.nom_agence,
          description: profileData.description,
          zone_intervention: profileData.zone_intervention,
          tarif_base: profileData.tarif_base,
          certifications: profileData.certifications,
          services_offerts: profileData.services_offerts || []
        });
      }

    } catch (err) {
      console.error('Erreur authentification:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // Écran d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="block w-full border border-emerald-600 text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Créer un compte
            </Link>
            <Link
              href="/"
              className="block w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Statistiques fictives pour la démo
  const stats = [
    { name: 'Biens gérés', value: '24', icon: Buildings, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Demandes reçues', value: '16', icon: TrendUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Revenus ce mois', value: '3,250€', icon: CurrencyEur, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Note moyenne', value: '4.8/5', icon: Medal, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  if (!user) return null;

  // Dashboard principal avec nouvelle sidebar
  return (
    <DashboardLayout 
      userProfile={user}
      title="Tableau de bord"
      subtitle="Gérez vos biens et suivez vos performances"
    >
      <div className="p-6">
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

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profil gestionnaire */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profil Gestionnaire</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                  Bienvenue {user.nom} !
                </h3>
                <p className="text-gray-600">
                  Compte créé le {new Date(user.créé_le).toLocaleDateString('fr-FR')}
                </p>
              </div>

              {profile ? (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Buildings className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="font-medium">{profile.nom_agence}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <span>{profile.zone_intervention}</span>
                  </div>
                  <div className="flex items-center">
                    <CurrencyEur className="h-5 w-5 text-gray-400 mr-3" />
                    <span>{profile.tarif_base}€/mois</span>
                  </div>
                  {profile.certifications && (
                    <div className="flex items-start">
                      <Medal className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <span className="text-sm">{profile.certifications}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
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
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
            
            <div className="space-y-3">
              <Link
                href="/dashboard/gestionnaire/biens"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Buildings className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="font-medium">Gérer mes biens</span>
                </div>
              </Link>
              
              <Link
                href="/dashboard/gestionnaire/demandes"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium">Nouvelles demandes</span>
                </div>
              </Link>
              
              <Link
                href="/dashboard/gestionnaire/messagerie"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <TrendUp className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="font-medium">Messagerie</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 