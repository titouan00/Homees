'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { User, Home, Building2, Settings, LogOut, Shield, MapPin, Euro, Award, Users } from 'lucide-react';

interface UserProfile {
  id: string;
  nom: string;
  email: string;
  rôle: string;
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
 * Dashboard Gestionnaire - Page protégée
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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Erreur session:', sessionError);
        router.push('/login?redirect=/dashboard/gestionnaire');
        return;
      }

      if (!session) {
        // Pas connecté → redirection vers login avec redirect
        router.push('/login?redirect=/dashboard/gestionnaire');
        return;
      }

      // Récupérer les données utilisateur depuis la table utilisateurs
      const { data: userData, error: userError } = await supabase
        .from('utilisateurs')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error('Erreur profil utilisateur:', userError);
        if (userError.code === 'PGRST116') {
          // Utilisateur n'existe pas dans la table utilisateurs
          setError('Profil utilisateur introuvable. Veuillez vous réinscrire.');
        } else {
          setError('Erreur lors du chargement du profil');
        }
        setLoading(false);
        return;
      }

      // Vérifier le rôle
      if (userData.rôle !== 'gestionnaire') {
        // Mauvais rôle → redirection intelligente
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

      // Utilisateur valide → charger le profil complet
      setUser({
        id: userData.id,
        nom: userData.nom,
        email: userData.email,
        rôle: userData.rôle,
        créé_le: userData.créé_le
      });

      // Charger le profil gestionnaire spécifique
      const { data: profileData, error: profileError } = await supabase
        .from('profil_gestionnaire')
        .select('*')
        .eq('utilisateur_id', session.user.id)
        .single();

      if (profileError) {
        console.warn('Profil gestionnaire non trouvé:', profileError);
        // Profil gestionnaire optionnel - peut ne pas exister
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Erreur déconnexion:', err);
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

  // Dashboard principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et navigation */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-8 w-8 text-emerald-600" />
                <span className="text-xl font-bold text-gray-900">Homees</span>
              </Link>
              <div className="hidden sm:block">
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                  Dashboard Gestionnaire
                </span>
              </div>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="font-medium">{user?.nom}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-100 rounded-full p-3">
              <Building2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bienvenue, {user?.nom} ! 🏢
              </h1>
              <p className="text-gray-600">
                Vous êtes connecté en tant que <span className="font-medium text-emerald-600">Gestionnaire</span>
                {profile?.nom_agence && (
                  <span> - {profile.nom_agence}</span>
                )}
              </p>
              <p className="text-sm text-gray-500">
                Membre depuis le {user?.créé_le ? new Date(user.créé_le).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Informations du profil */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Infos de base */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Vos informations</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Email :</span>
                <span className="ml-2 font-medium">{user?.email}</span>
              </div>
              <div>
                <span className="text-gray-500">Rôle :</span>
                <span className="ml-2 font-medium capitalize">{user?.rôle}</span>
              </div>
              {profile?.nom_agence && (
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-500">Agence :</span>
                  <span className="ml-2 font-medium">{profile.nom_agence}</span>
                </div>
              )}
              {profile?.zone_intervention && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-500">Zone :</span>
                  <span className="ml-2 font-medium">{profile.zone_intervention}</span>
                </div>
              )}
            </div>
          </div>

          {/* Profil professionnel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Profil professionnel</h3>
            {profile ? (
              <div className="space-y-2 text-sm">
                {profile.tarif_base && (
                  <div className="flex items-center">
                    <Euro className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-500">Tarif base :</span>
                    <span className="ml-2 font-medium">{profile.tarif_base}%</span>
                  </div>
                )}
                {profile.certifications && (
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-500">Certifications :</span>
                    <span className="ml-2 font-medium">{profile.certifications}</span>
                  </div>
                )}
                {profile.services_offerts && profile.services_offerts.length > 0 && (
                  <div>
                    <span className="text-gray-500">Services :</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {profile.services_offerts.slice(0, 3).map((service, index) => (
                        <span key={index} className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                      {profile.services_offerts.length > 3 && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          +{profile.services_offerts.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {profile.description && (
                  <div className="mt-2">
                    <span className="text-gray-500">Description :</span>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-3">{profile.description}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Profil non complété</p>
                <button className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  Compléter le profil
                </button>
              </div>
            )}
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Actions rapides</h3>
            <div className="space-y-2">
              <button className="w-full text-left text-sm text-emerald-600 hover:text-emerald-700 p-2 hover:bg-emerald-50 rounded">
                Voir les demandes reçues
              </button>
              <button className="w-full text-left text-sm text-emerald-600 hover:text-emerald-700 p-2 hover:bg-emerald-50 rounded">
                Modifier mon profil
              </button>
              <button className="w-full text-left text-sm text-emerald-600 hover:text-emerald-700 p-2 hover:bg-emerald-50 rounded">
                Gérer mes mandats
              </button>
              <button className="w-full text-left text-sm text-emerald-600 hover:text-emerald-700 p-2 hover:bg-emerald-50 rounded">
                Statistiques
              </button>
            </div>
          </div>
        </div>

        {/* Section principale du dashboard */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tableau de bord gestionnaire</h2>
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Bienvenue sur votre espace gestionnaire !
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Ici vous pourrez gérer vos demandes, suivre vos mandats en cours 
              et optimiser votre visibilité sur la plateforme.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Voir les demandes
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Modifier mon profil
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 