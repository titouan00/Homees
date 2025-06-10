'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Shield, Phone, MapPin, TrendingUp, Building, Euro, Users } from 'lucide-react';
import DashboardLayout from '@/components/navigation/DashboardLayout';

interface UserProfile {
  id: string;
  nom: string;
  email: string;
  rôle: string;
  créé_le: string;
}

interface ProprietaireProfile {
  type_investisseur: string;
  nombre_biens: number;
  budget_investissement: number;
  zone_recherche: string;
  telephone: string;
  profession: string;
}

/**
 * Dashboard Propriétaire - Page protégée avec sidebar moderne
 * Accessible uniquement aux utilisateurs connectés avec le rôle "proprietaire"
 */
export default function ProprietaireDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<ProprietaireProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuthAndRole();
  }, []);

  const checkAuthAndRole = async () => {
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Erreur session:', sessionError);
        router.push('/login?redirect=/dashboard/proprietaire');
        return;
      }

      if (!session) {
        router.push('/login?redirect=/dashboard/proprietaire');
        return;
      }

      // Récupérer les données utilisateur
      const { data: userData, error: userError } = await supabase
        .from('utilisateurs')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error('Erreur profil utilisateur:', userError);
        if (userError.code === 'PGRST116') {
          setError('Profil utilisateur introuvable. Veuillez vous réinscrire.');
        } else {
          setError('Erreur lors du chargement du profil');
        }
        setLoading(false);
        return;
      }

      // Vérifier le rôle
      if (userData.rôle !== 'proprietaire') {
        if (userData.rôle === 'gestionnaire') {
          router.push('/dashboard/gestionnaire');
        } else if (userData.rôle === 'admin') {
          setError('Compte administrateur - Accès dashboard propriétaire refusé');
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
        rôle: userData.rôle,
        créé_le: userData.créé_le
      });

      // Charger le profil propriétaire
      const { data: profileData, error: profileError } = await supabase
        .from('profil_proprietaire')
        .select('*')
        .eq('utilisateur_id', session.user.id)
        .single();

      if (profileError) {
        console.warn('Profil propriétaire non trouvé:', profileError);
      } else {
        setProfile({
          type_investisseur: profileData.type_investisseur,
          nombre_biens: profileData.nombre_biens,
          budget_investissement: profileData.budget_investissement,
          zone_recherche: profileData.zone_recherche,
          telephone: profileData.telephone,
          profession: profileData.profession
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="block w-full border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
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
    { name: 'Mes biens', value: profile?.nombre_biens?.toString() || '0', icon: Building, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Gestionnaires trouvés', value: '8', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Budget d\'investissement', value: profile?.budget_investissement ? `${profile.budget_investissement.toLocaleString()}€` : 'N/A', icon: Euro, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Demandes actives', value: '3', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  if (!user) return null;

  // Dashboard principal avec nouvelle sidebar
  return (
    <DashboardLayout 
      userProfile={user}
      title="Tableau de bord"
      subtitle="Gérez vos biens et trouvez les meilleurs gestionnaires"
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
          {/* Profil propriétaire */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profil Propriétaire</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  Bienvenue {user.nom} !
                </h3>
                <p className="text-gray-600">
                  Compte créé le {new Date(user.créé_le).toLocaleDateString('fr-FR')}
                </p>
              </div>

              {profile ? (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="font-medium">{profile.type_investisseur}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <span>{profile.zone_recherche}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span>{profile.telephone}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <span>{profile.nombre_biens} bien{profile.nombre_biens > 1 ? 's' : ''}</span>
                  </div>
                  {profile.profession && (
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <span className="text-sm">{profile.profession}</span>
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
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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
                href="/dashboard/proprietaire/biens"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium">Gérer mes biens</span>
                </div>
              </Link>
              
              <Link
                href="/dashboard/proprietaire/comparateur"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="font-medium">Comparer les gestionnaires</span>
                </div>
              </Link>
              
              <Link
                href="/dashboard/proprietaire/demandes"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="font-medium">Mes demandes</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 