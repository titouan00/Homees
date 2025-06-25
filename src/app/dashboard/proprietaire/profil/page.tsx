'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  Envelope, 
  Phone, 
  MapPin, 
  Calendar,
  PencilSimple,
  Check,
  X,
  Camera,
  Buildings,
  CurrencyEur,
  Briefcase,
  Target,
  ChartLine,
  Shield,
  Lock,
  Users
} from '@phosphor-icons/react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
// import { toast } from 'react-hot-toast'; // Module non disponible

// Fonction toast simulée pour éviter l'erreur
const toast = {
  success: (message: string) => console.log('✅', message),
  error: (message: string) => console.error('❌', message)
};

interface UserProfile {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  créé_le: string;
  mis_a_jour_le: string;
}

interface ProprietaireProfile {
  utilisateur_id: string;
  type_investisseur?: string;
  nombre_biens: number;
  budget_investissement: number;
  zone_recherche?: string;
  profession?: string;
  objectifs?: string;
  revenus_annuels: number;
  situation_familiale?: string;
  date_naissance?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  created_at: string;
  updated_at: string;
}

export default function ProfilProprietairePage() {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [proprietaireProfile, setProprietaireProfile] = useState<ProprietaireProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userForm, setUserForm] = useState<Partial<UserProfile>>({});
  const [proprietaireForm, setProprietaireForm] = useState<Partial<ProprietaireProfile>>({});
  const [activeTab, setActiveTab] = useState<'personnel' | 'professionnel' | 'securite'>('personnel');
  const router = useRouter();
  const supabase = createClient();

  // Charger les profils
  useEffect(() => {
    const loadProfiles = async () => {
      if (!authUser) return;

      try {
        setIsLoading(true);

        // Récupérer le profil utilisateur
        const { data: userData, error: userError } = await supabase
          .from('utilisateurs')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (userError) {
          console.error('Erreur lors du chargement du profil utilisateur:', userError);
          return;
        }

        if (userData) {
          const userProfile: UserProfile = {
            id: userData.id,
            nom: userData.nom,
            prenom: userData.prenom,
            email: userData.email,
            bio: userData.bio,
            avatar_url: userData.avatar_url,
            créé_le: userData.créé_le,
            mis_a_jour_le: userData.mis_a_jour_le
          };
          setUserProfile(userProfile);
          setUserForm(userProfile);
        }

        // Récupérer le profil propriétaire
        const { data: proprietaireData, error: proprietaireError } = await supabase
          .from('profil_proprietaire')
          .select('*')
          .eq('utilisateur_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (proprietaireError) {
          console.error('Erreur lors du chargement du profil propriétaire:', proprietaireError);
          return;
        }

        if (proprietaireData) {
          const proprietaireProfile: ProprietaireProfile = {
            utilisateur_id: proprietaireData.utilisateur_id,
            type_investisseur: proprietaireData.type_investisseur,
            nombre_biens: proprietaireData.nombre_biens,
            budget_investissement: proprietaireData.budget_investissement,
            zone_recherche: proprietaireData.zone_recherche,
            profession: proprietaireData.profession,
            objectifs: proprietaireData.objectifs,
            revenus_annuels: proprietaireData.revenus_annuels,
            situation_familiale: proprietaireData.situation_familiale,
            date_naissance: proprietaireData.date_naissance,
            telephone: proprietaireData.telephone,
            adresse: proprietaireData.adresse,
            ville: proprietaireData.ville,
            code_postal: proprietaireData.code_postal,
            created_at: proprietaireData.created_at,
            updated_at: proprietaireData.updated_at
          };
          setProprietaireProfile(proprietaireProfile);
          setProprietaireForm(proprietaireProfile);
        }
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      loadProfiles();
    }
  }, [authUser, authLoading, supabase]);

  // Sauvegarder les modifications
  const handleSave = async () => {
    if (!userProfile) return;

    try {
      setIsSaving(true);

      // Validation des données
      if (!userForm.nom?.trim()) {
        toast.error('Le nom est obligatoire');
        return;
      }

      // Préparer les données utilisateur
      const userData = {
        nom: userForm.nom?.trim(),
        prenom: userForm.prenom?.trim(),
        bio: userForm.bio?.trim(),
        mis_a_jour_le: new Date().toISOString()
      };

      // Préparer les données propriétaire (uniquement les champs de base)
      const proprietaireData = {
        utilisateur_id: userProfile.id,
        type_investisseur: proprietaireForm.type_investisseur?.trim() || '',
        nombre_biens: proprietaireForm.nombre_biens || 0,
        budget_investissement: proprietaireForm.budget_investissement || 0,
        zone_recherche: proprietaireForm.zone_recherche?.trim() || '',
        profession: proprietaireForm.profession?.trim() || '',
        objectifs: proprietaireForm.objectifs?.trim() || '',
        revenus_annuels: proprietaireForm.revenus_annuels || 0,
        situation_familiale: proprietaireForm.situation_familiale?.trim() || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Sauvegarder le profil utilisateur
      const { error: userError } = await supabase
        .from('utilisateurs')
        .update(userData)
        .eq('id', userProfile.id);

      if (userError) {
        console.error('Erreur lors de la sauvegarde du profil utilisateur:', userError);
        toast.error('Erreur lors de la sauvegarde du profil utilisateur');
        return;
      }

      // Sauvegarder le profil propriétaire
      const { error: proprietaireError } = await supabase
        .from('profil_proprietaire')
        .upsert(proprietaireData);

      if (proprietaireError) {
        console.error('Erreur lors de la sauvegarde du profil propriétaire:', proprietaireError);
        toast.error('Erreur lors de la sauvegarde du profil propriétaire');
        return;
      }

      // Mettre à jour les états
      setUserProfile(prev => prev ? { ...prev, ...userData } : null);
      setProprietaireProfile(prev => prev ? { ...prev, ...proprietaireData } : null);
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      toast.error('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Annuler les modifications
  const handleCancel = () => {
    setUserForm(userProfile || {});
    setProprietaireForm(proprietaireProfile || {});
    setIsEditing(false);
  };

  // Formatage des dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profil non trouvé</h2>
          <p className="text-gray-600">Impossible de charger les informations du profil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-20 w-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                    {userProfile.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt="Avatar" 
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-gray-50">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Informations principales */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userProfile.prenom ? `${userProfile.prenom} ${userProfile.nom}` : userProfile.nom}
                  </h1>
                  <p className="text-gray-600">{userProfile.email}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <Badge variant="success">Propriétaire</Badge>
                    <span className="text-sm text-gray-500">
                      Membre depuis {formatDate(userProfile.créé_le)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <Button 
                      variant="secondary" 
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4" />
                      Annuler
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleSave}
                      loading={isSaving}
                    >
                      <Check className="h-4 w-4" />
                      Sauvegarder
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="primary" 
                    onClick={() => setIsEditing(true)}
                  >
                    <PencilSimple className="h-4 w-4" />
                    Modifier
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation des onglets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'personnel', label: 'Informations personnelles', icon: User },
                { id: 'professionnel', label: 'Profil investisseur', icon: Buildings },
                { id: 'securite', label: 'Sécurité', icon: Shield }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      isActive
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {activeTab === 'personnel' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userForm.nom || ''}
                        onChange={(e) => setUserForm({ ...userForm, nom: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile.nom}</p>
                    )}
                  </div>

                  {/* Prénom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userForm.prenom || ''}
                        onChange={(e) => setUserForm({ ...userForm, prenom: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile.prenom || 'Non renseigné'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Envelope className="inline h-4 w-4 mr-1" />
                      Email *
                    </label>
                    <p className="text-gray-900">{userProfile.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Pour modifier votre email, contactez le support
                    </p>
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Téléphone
                    </label>
                    <p className="text-gray-900">Non disponible</p>
                  </div>

                  {/* Adresse */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Adresse
                    </label>
                    <p className="text-gray-900">Non disponible</p>
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      À propos
                    </label>
                    {isEditing ? (
                      <textarea
                        value={userForm.bio || ''}
                        onChange={(e) => setUserForm({ ...userForm, bio: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Parlez-nous de vous..."
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile.bio || 'Aucune description'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'professionnel' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Profil investisseur</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Type d'investisseur */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Buildings className="inline h-4 w-4 mr-1" />
                      Type d'investisseur
                    </label>
                    {isEditing ? (
                      <select
                        value={proprietaireForm.type_investisseur || ''}
                        onChange={(e) => setProprietaireForm({ ...proprietaireForm, type_investisseur: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner...</option>
                        <option value="particulier">Particulier</option>
                        <option value="sci">SCI</option>
                        <option value="sas">SAS</option>
                        <option value="sarl">SARL</option>
                        <option value="societe_civile">Société Civile</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{proprietaireProfile?.type_investisseur || 'Non renseigné'}</p>
                    )}
                  </div>

                  {/* Profession */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="inline h-4 w-4 mr-1" />
                      Profession
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={proprietaireForm.profession || ''}
                        onChange={(e) => setProprietaireForm({ ...proprietaireForm, profession: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{proprietaireProfile?.profession || 'Non renseigné'}</p>
                    )}
                  </div>

                  {/* Nombre de biens */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ChartLine className="inline h-4 w-4 mr-1" />
                      Nombre de biens
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={proprietaireForm.nombre_biens || 0}
                        onChange={(e) => setProprietaireForm({ ...proprietaireForm, nombre_biens: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        min="0"
                      />
                    ) : (
                      <p className="text-gray-900">{proprietaireProfile?.nombre_biens || 0}</p>
                    )}
                  </div>

                  {/* Budget d'investissement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CurrencyEur className="inline h-4 w-4 mr-1" />
                      Budget d'investissement
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="number"
                          value={proprietaireForm.budget_investissement || 0}
                          onChange={(e) => setProprietaireForm({ ...proprietaireForm, budget_investissement: parseInt(e.target.value) })}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          min="0"
                        />
                        <span className="absolute left-3 top-2 text-gray-500">€</span>
                      </div>
                    ) : (
                      <p className="text-gray-900">
                        {proprietaireProfile?.budget_investissement 
                          ? `${proprietaireProfile.budget_investissement.toLocaleString()} €`
                          : 'Non renseigné'
                        }
                      </p>
                    )}
                  </div>

                  {/* Revenus annuels */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CurrencyEur className="inline h-4 w-4 mr-1" />
                      Revenus annuels
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="number"
                          value={proprietaireForm.revenus_annuels || 0}
                          onChange={(e) => setProprietaireForm({ ...proprietaireForm, revenus_annuels: parseInt(e.target.value) })}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          min="0"
                        />
                        <span className="absolute left-3 top-2 text-gray-500">€</span>
                      </div>
                    ) : (
                      <p className="text-gray-900">
                        {proprietaireProfile?.revenus_annuels 
                          ? `${proprietaireProfile.revenus_annuels.toLocaleString()} €`
                          : 'Non renseigné'
                        }
                      </p>
                    )}
                  </div>

                  {/* Situation familiale */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="inline h-4 w-4 mr-1" />
                      Situation familiale
                    </label>
                    {isEditing ? (
                      <select
                        value={proprietaireForm.situation_familiale || ''}
                        onChange={(e) => setProprietaireForm({ ...proprietaireForm, situation_familiale: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner...</option>
                        <option value="celibataire">Célibataire</option>
                        <option value="marie">Marié(e)</option>
                        <option value="pacs">PACS</option>
                        <option value="divorce">Divorcé(e)</option>
                        <option value="veuf">Veuf(ve)</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{proprietaireProfile?.situation_familiale || 'Non renseigné'}</p>
                    )}
                  </div>

                  {/* Zone de recherche */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Target className="inline h-4 w-4 mr-1" />
                      Zone de recherche
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={proprietaireForm.zone_recherche || ''}
                        onChange={(e) => setProprietaireForm({ ...proprietaireForm, zone_recherche: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Ex: Paris 11ème, Lyon 3ème..."
                      />
                    ) : (
                      <p className="text-gray-900">{proprietaireProfile?.zone_recherche || 'Non renseigné'}</p>
                    )}
                  </div>

                  {/* Objectifs */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Target className="inline h-4 w-4 mr-1" />
                      Objectifs d'investissement
                    </label>
                    {isEditing ? (
                      <textarea
                        value={proprietaireForm.objectifs || ''}
                        onChange={(e) => setProprietaireForm({ ...proprietaireForm, objectifs: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Décrivez vos objectifs d'investissement..."
                      />
                    ) : (
                      <p className="text-gray-900">{proprietaireProfile?.objectifs || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'securite' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Sécurité</h3>
                
                <div className="space-y-4">
                  {/* Mot de passe */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          <Lock className="inline h-4 w-4 mr-1" />
                          Mot de passe
                        </h4>
                        <p className="text-sm text-gray-600">
                          Dernière modification il y a plus de 30 jours
                        </p>
                      </div>
                      <Button variant="secondary">
                        Modifier
                      </Button>
                    </div>
                  </div>

                  {/* Authentification à deux facteurs */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Authentification à deux facteurs</h4>
                        <p className="text-sm text-gray-600">
                          Sécurisez votre compte avec une couche de protection supplémentaire
                        </p>
                      </div>
                      <Button variant="primary">
                        Activer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}