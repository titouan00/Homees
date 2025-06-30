'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ChatCircle, Envelope, User, MapPin, Phone, Globe, CircleNotch, WarningCircle, ArrowLeft, X, Check, PencilSimple } from '@phosphor-icons/react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useGestionnaire } from '@/hooks/useGestionnaire';
import { useCreateDemande } from '@/hooks/useCreateDemande';
import { useAuth } from '@/hooks/useAuth';
import { useBiensProprietaire, useBiensEnGestion, useAvisGestionnaireSimple } from '@/hooks';

const containerStyle = {
  width: '100%',
  height: '300px',
};

// Tarifs par défaut si non disponibles dans la DB
const tarifsDefaut = [
  { service: 'Gestion locative', prix: 'À définir' },
  { service: 'Mise en location', prix: 'À définir' },
  { service: 'État des lieux', prix: 'À définir' },
  { service: 'Autres services', prix: 'Sur demande' },
];

// Composant Modal pour créer une demande
function ModalCreerDemande({ isOpen, onClose, gestionnaire, biens, onSubmit, isSubmitting }: any) {
  const [selectedBien, setSelectedBien] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const messageFormate = `Bonjour ${gestionnaire?.nom_agence || 'Gestionnaire'},

${message.trim()}

Cordialement`;

    onSubmit({
      gestionnaire_id: gestionnaire?.gestionnaire_id || gestionnaire?.id,
      propriete_id: selectedBien || undefined,
      message_initial: messageFormate
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Faire une demande</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Sélection du bien */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bien concerné (optionnel)
            </label>
            <select
              value={selectedBien}
              onChange={(e) => setSelectedBien(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              disabled={isSubmitting}
            >
              <option value="">Aucun bien spécifique</option>
              {biens.map((bien: any) => (
                <option key={bien.id} value={bien.id}>
                  {bien.adresse} - {bien.ville} ({bien.type_bien})
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez votre demande de gestion immobilière..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isSubmitting || !message.trim()}
            >
              {isSubmitting ? (
                <>
                  <CircleNotch className="h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Envoyer la demande
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal pour laisser un avis
function ModalLaisserAvis({ isOpen, onClose, gestionnaire, hasBiensEnGestion, onSubmit, isSubmitting }: any) {
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasBiensEnGestion) return;
    
    onSubmit({
      gestionnaire_id: gestionnaire?.gestionnaire_id || gestionnaire?.id,
      note,
      commentaire: commentaire.trim() || undefined
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Laisser un avis</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!hasBiensEnGestion ? (
          <div className="text-center py-6">
            <WarningCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun bien en gestion
            </h4>
            <p className="text-gray-600 mb-4">
              Vous devez avoir au moins un bien en gestion avec ce gestionnaire pour pouvoir laisser un avis.
            </p>
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Note */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note *
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNote(star)}
                    className={`p-1 ${star <= note ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500`}
                    disabled={isSubmitting}
                  >
                    <Star className="h-6 w-6" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">{note}/5</span>
              </div>
            </div>

            {/* Commentaire */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire (optionnel)
              </label>
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Partagez votre expérience avec ce gestionnaire..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <CircleNotch className="h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Publier l'avis
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function HeaderProfilGestionnaire({ gestionnaire, onContact, onDemanderDevis, onLaisserAvis, hasBiensEnGestion }: any) {
  if (!gestionnaire) return null;

  return (
    <div className="flex items-start justify-between gap-6 p-6 bg-white rounded-xl border border-gray-200 mb-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">{gestionnaire.nom_agence}</h1>
          <span className="flex items-center gap-1 text-yellow-500 font-medium">
            {gestionnaire.note_moyenne} <Star className="h-5 w-5" />
          </span>
          <span className="text-gray-500 text-sm">basé sur {gestionnaire.nombre_avis} avis clients</span>
        </div>
        <div className="text-gray-700 mb-2">{gestionnaire.adresse || gestionnaire.zone_intervention}</div>
        <div className="text-gray-500 text-sm mb-2">{gestionnaire.description}</div>
        
        {/* Informations de contact */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
          {gestionnaire.telephone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{gestionnaire.telephone}</span>
            </div>
          )}
          {gestionnaire.site_web && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <a href={gestionnaire.site_web} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Site web
              </a>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-3">
        {gestionnaire.logo_url ? (
          <img src={gestionnaire.logo_url} alt="logo" className="w-20 h-20 object-contain rounded-full border bg-white" />
        ) : (
          <div className="w-20 h-20 bg-emerald-100 rounded-full border flex items-center justify-center">
            <User className="h-8 w-8 text-emerald-600" />
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <button 
            onClick={onLaisserAvis}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-yellow-600"
          >
            <PencilSimple className="h-4 w-4" /> Laisser un avis
          </button>
          <button 
            onClick={onDemanderDevis}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 font-medium flex items-center gap-2 hover:bg-gray-200"
          >
            <Envelope className="h-4 w-4" /> Faire une demande
          </button>
          <button 
            onClick={onContact}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-emerald-700"
          >
            <ChatCircle className="h-4 w-4" /> Contacter
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsGestionnaire({ gestionnaire }: any) {
  if (!gestionnaire) return null;

  const stats = [
    {
      label: 'Lots gérés',
      value: gestionnaire.lots_geres || 'N/A'
    },
    {
      label: 'Création',
      value: gestionnaire.annee_creation || new Date(gestionnaire.créé_le).getFullYear()
    },
    {
      label: 'Type',
      value: gestionnaire.type_gestionnaire || 'Gestionnaire'
    },
    {
      label: 'Note moyenne',
      value: `${gestionnaire.note_moyenne}/5`
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-gray-500 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

function ServicesTarifs({ gestionnaire }: any) {
  if (!gestionnaire) return null;

  const services = gestionnaire.services_offerts || [];
  const tarifs = gestionnaire.tarifs_detailles || tarifsDefaut;

  // Fonction pour extraire le texte d'un service (gère à la fois string et object)
  const getServiceText = (service: any): string => {
    if (typeof service === 'string') {
      return service;
    } else if (typeof service === 'object' && service !== null) {
      // Si c'est un objet, on utilise le nom ou on concatène les infos
      return service.nom || service.name || JSON.stringify(service);
    }
    return 'Service non défini';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
        <div className="font-semibold mb-2">Services proposés</div>
        {services.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {services.map((service: any, i: number) => (
              <span key={i} className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100">
                {getServiceText(service)}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Aucun service spécifié</div>
        )}
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="font-semibold mb-2">Tarifs</div>
        <ul className="space-y-1">
          {tarifs.map((tarif: any, i: number) => (
            <li key={i} className="flex justify-between text-sm">
              <span>{tarif.service}</span>
              <span className="font-medium">{tarif.prix}</span>
            </li>
          ))}
          {gestionnaire.tarif_base && (
            <li className="flex justify-between text-sm border-t border-gray-100 pt-1 mt-2">
              <span>Tarif de base</span>
              <span className="font-medium">{gestionnaire.tarif_base}€</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function DescriptionGestionnaire({ gestionnaire }: any) {
  if (!gestionnaire) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="font-semibold mb-2">Description</div>
      <div className="text-gray-700 text-sm">
        {gestionnaire.description_longue || gestionnaire.description || 'Aucune description disponible.'}
      </div>
      
      {gestionnaire.certifications && (
        <div className="mt-4">
          <div className="font-semibold mb-2">Certifications</div>
          <div className="text-gray-700 text-sm">{gestionnaire.certifications}</div>
        </div>
      )}
    </div>
  );
}

function CarteZoneIntervention({ gestionnaire }: any) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  if (!gestionnaire) return null;

  // Coordonnées par défaut (Paris) si pas de données spécifiques
  const mapCenter = { lat: 48.866667, lng: 2.333333 };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="font-semibold mb-2">Zone d'intervention</div>
      <div className="text-gray-600 text-sm mb-4">
        {gestionnaire.zone_intervention || 'Zone non spécifiée'}
      </div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={12}
        >
          <Marker position={mapCenter} />
        </GoogleMap>
      ) : (
        <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-gray-500">Chargement de la carte…</div>
        </div>
      )}
    </div>
  );
}

function AvisGestionnaire({ avis, loading, error, totalCount, moyenneNotes }: any) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <CircleNotch className="h-6 w-6 text-emerald-600 animate-spin" />
          <span className="ml-2 text-gray-600">Chargement des avis...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8 text-red-600">
          <WarningCircle className="h-6 w-6 mr-2" />
          <span>Erreur lors du chargement des avis</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold">Avis ({totalCount})</div>
        <div className="flex items-center gap-1 text-yellow-500 font-medium">
          {moyenneNotes} <Star className="h-4 w-4" />
        </div>
      </div>
      
      {avis.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun avis disponible pour ce gestionnaire
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {avis.map((avisItem: any) => (
            <div key={avisItem.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{avisItem.auteur?.[0]?.nom || 'Utilisateur anonyme'}</span>
                <span className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
                  {avisItem.note} <Star className="h-3 w-3" />
                </span>
              </div>
              <div className="text-xs text-gray-700 mb-1">{avisItem.commentaire}</div>
              <div className="text-xs text-gray-500">
                {new Date(avisItem.cree_le).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Page Profil Gestionnaire - Version simplifiée
 */
export default function PageProfilGestionnaire() {
  const params = useParams();
  const router = useRouter();
  const gestionnaireId = params.id as string;
  
  // États des modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAvisModalOpen, setIsAvisModalOpen] = useState(false);
  const [isCreatingAvis, setIsCreatingAvis] = useState(false);

  // Auth sans redirection (gérée par le layout parent)
  const { user } = useAuth(false);
  
  // Hooks pour les données
  const { gestionnaire, loading: gestionnaireLoading, error: gestionnaireError } = useGestionnaire(gestionnaireId);
  const { avis, loading: avisLoading, error: avisError, createAvis, canCreateAvis } = useAvisGestionnaireSimple(gestionnaireId);
  const { hasBiensEnGestion, loading: biensLoading } = useBiensEnGestion(user?.id, gestionnaireId);
  const { createDemande, isCreating } = useCreateDemande(user?.id || '');
  const { biens } = useBiensProprietaire(user?.id || '');

  const handleContact = async () => {
    if (!gestionnaire) return;
    
    // Rediriger vers la page des messages avec le gestionnaire comme paramètre  
    router.push(`/dashboard/messages?gestionnaire=${gestionnaire.gestionnaire_id}`);
  };

  const handleDemanderDevis = () => {
    setIsModalOpen(true);
  };

  const handleSubmitDemande = async (demandeData: any) => {
    const result = await createDemande(demandeData);
    
    if (result.success) {
      setIsModalOpen(false);
      // Rediriger vers la page mes demandes
      router.push('/dashboard/proprietaire/demandes');
    } else {
      // Afficher l'erreur (vous pouvez améliorer cela avec un toast)
      alert(result.error || 'Erreur lors de la création de la demande');
    }
  };

  const handleLaisserAvis = () => {
    setIsAvisModalOpen(true);
  };

  const handleSubmitAvis = async (avisData: any) => {
    setIsCreatingAvis(true);
    try {
      const success = await createAvis(avisData);
      
      if (success) {
        setIsAvisModalOpen(false);
        // Optionnel : afficher un message de succès
        alert('Votre avis a été publié avec succès !');
      } else {
        alert('Erreur lors de la publication de l\'avis');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'avis:', error);
      alert('Erreur lors de la publication de l\'avis');
    } finally {
      setIsCreatingAvis(false);
    }
  };

  // Écran de chargement
  if (gestionnaireLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <CircleNotch className="h-12 w-12 text-emerald-600 animate-spin" />
        <span className="ml-4 text-gray-600 text-lg">Chargement du profil gestionnaire...</span>
      </div>
    );
  }

  // Gestionnaire non trouvé
  if (gestionnaireError || !gestionnaire) {
    return (
      <div className="text-center py-16">
        <WarningCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Gestionnaire non trouvé</h2>
        <p className="text-gray-600 mb-6">
          {gestionnaireError || 'Le gestionnaire que vous recherchez n\'existe pas ou n\'est plus actif.'}
        </p>
        <button
          onClick={() => router.back()}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <HeaderProfilGestionnaire 
        gestionnaire={gestionnaire} 
        onContact={handleContact}
        onDemanderDevis={handleDemanderDevis}
        onLaisserAvis={handleLaisserAvis}
        hasBiensEnGestion={hasBiensEnGestion}
      />
      <StatsGestionnaire gestionnaire={gestionnaire} />
      <ServicesTarifs gestionnaire={gestionnaire} />
      <DescriptionGestionnaire gestionnaire={gestionnaire} />
      <CarteZoneIntervention gestionnaire={gestionnaire} />
      <AvisGestionnaire 
        avis={avis}
        loading={avisLoading}
        error={avisError}
        totalCount={avis.length}
        moyenneNotes={avis.length > 0 ? Math.round((avis.reduce((acc, a) => acc + a.note, 0) / avis.length) * 10) / 10 : 0}
      />

      {/* Modal pour créer une demande */}
      <ModalCreerDemande
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gestionnaire={gestionnaire}
        biens={biens}
        onSubmit={handleSubmitDemande}
        isSubmitting={isCreating}
      />

      {/* Modal pour laisser un avis */}
      <ModalLaisserAvis
        isOpen={isAvisModalOpen}
        onClose={() => setIsAvisModalOpen(false)}
        gestionnaire={gestionnaire}
        hasBiensEnGestion={hasBiensEnGestion}
        onSubmit={handleSubmitAvis}
        isSubmitting={isCreatingAvis}
      />
    </div>
  );
}
