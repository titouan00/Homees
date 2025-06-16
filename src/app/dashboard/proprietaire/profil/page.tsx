 'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
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
  Shield,
  Bell,
  Eye,
  Lock
} from '@phosphor-icons/react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface UserProfile {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  date_naissance?: string;
  bio?: string;
  avatar_url?: string;
  créé_le: string;
  mis_a_jour_le: string;
  preferences?: {
    notifications_email: boolean;
    notifications_sms: boolean;
    visibilite_profil: 'public' | 'prive';
    langue: string;
  };
}

/**
 * Page de profil du propriétaire connecté
 */
export default function ProfilProprietairePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [activeTab, setActiveTab] = useState<'informations' | 'preferences' | 'securite'>('informations');
  const router = useRouter();

  // Charger le profil utilisateur
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          router.push('/login');
          return;
        }

        // Récupérer le profil complet
        const { data: userData, error } = await supabase
          .from('utilisateurs')
          .select('*')
          .eq('id', authUser.id)
          .eq('rôle', 'proprietaire')
          .single();

        if (error) {
          console.error('Erreur lors du chargement du profil:', error);
          return;
        }

        if (userData) {
          setProfile(userData);
          setEditForm(userData);
        }
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  // Sauvegarder les modifications
  const handleSave = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('utilisateurs')
        .update({
          ...editForm,
          mis_a_jour_le: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, ...editForm } as UserProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Annuler les modifications
  const handleCancel = () => {
    setEditForm(profile || {});
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!profile) {
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
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
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
                    {profile.prenom ? `${profile.prenom} ${profile.nom}` : profile.nom}
                  </h1>
                  <p className="text-gray-600">{profile.email}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <Badge variant="success">Propriétaire</Badge>
                    <span className="text-sm text-gray-500">
                      Membre depuis {formatDate(profile.créé_le)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
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
                { id: 'informations', label: 'Informations personnelles', icon: User },
                { id: 'preferences', label: 'Préférences', icon: Bell },
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
            {activeTab === 'informations' && (
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
                        value={editForm.nom || ''}
                        onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.nom}</p>
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
                        value={editForm.prenom || ''}
                        onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.prenom || 'Non renseigné'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Envelope className="inline h-4 w-4 mr-1" />
                      Email *
                    </label>
                    <p className="text-gray-900">{profile.email}</p>
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
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.telephone || ''}
                        onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="06 12 34 56 78"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.telephone || 'Non renseigné'}</p>
                    )}
                  </div>

                  {/* Date de naissance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Date de naissance
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.date_naissance || ''}
                        onChange={(e) => setEditForm({ ...editForm, date_naissance: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {profile.date_naissance ? formatDate(profile.date_naissance) : 'Non renseigné'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Adresse
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.adresse || ''}
                        onChange={(e) => setEditForm({ ...editForm, adresse: e.target.value })}
                        placeholder="Adresse complète"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editForm.ville || ''}
                          onChange={(e) => setEditForm({ ...editForm, ville: e.target.value })}
                          placeholder="Ville"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={editForm.code_postal || ''}
                          onChange={(e) => setEditForm({ ...editForm, code_postal: e.target.value })}
                          placeholder="Code postal"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-900">
                      {profile.adresse || profile.ville || profile.code_postal ? (
                        <>
                          {profile.adresse && <span>{profile.adresse}<br /></span>}
                          {profile.ville && <span>{profile.ville} </span>}
                          {profile.code_postal && <span>{profile.code_postal}</span>}
                        </>
                      ) : (
                        'Non renseigné'
                      )}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    À propos
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio || ''}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Parlez-nous de vous..."
                    />
                  ) : (
                    <p className="text-gray-900">{profile.bio || 'Aucune description'}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Préférences</h3>
                
                <div className="space-y-4">
                  {/* Notifications */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Notifications par email</span>
                        <input
                          type="checkbox"
                          checked={editForm.preferences?.notifications_email ?? true}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            preferences: {
                              ...editForm.preferences,
                              notifications_email: e.target.checked
                            }
                          })}
                          className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Notifications par SMS</span>
                        <input
                          type="checkbox"
                          checked={editForm.preferences?.notifications_sms ?? false}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            preferences: {
                              ...editForm.preferences,
                              notifications_sms: e.target.checked
                            }
                          })}
                          className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Visibilité */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      <Eye className="inline h-4 w-4 mr-1" />
                      Visibilité du profil
                    </h4>
                    <select
                      value={editForm.preferences?.visibilite_profil ?? 'prive'}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        preferences: {
                          ...editForm.preferences,
                          visibilite_profil: e.target.value as 'public' | 'prive'
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="prive">Privé</option>
                      <option value="public">Public</option>
                    </select>
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

                  {/* Sessions actives */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Sessions actives</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">Session actuelle</span>
                          <span className="text-gray-500 ml-2">• Chrome sur Mac</span>
                        </div>
                        <Badge variant="success">Active</Badge>
                      </div>
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