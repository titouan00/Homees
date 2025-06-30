'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User,
  MapPin,
  CurrencyEur,
  Medal,
  Star,
  Buildings,
  CheckCircle,
  PencilSimple,
  Plus,
  Trash,
  Eye,
  Globe,
  Camera,
  Upload,
  Phone,
  Envelope,
  Calendar,
  Target
} from '@phosphor-icons/react';

// Types
interface ProfilGestionnaire {
  nom_agence: string;
  description: string;
  zone_intervention: string[];
  tarif_base: number;
  type_gestionnaire: 'syndic' | 'agence_immobiliere' | 'gestionnaire_independant' | 'autre';
  nombre_lots_geres: number;
  services_offerts: string[];
  certifications: string[];
  horaires_disponibilite: string;
  telephone_professionnel?: string;
  site_web?: string;
  photo_profil?: string;
  photos_agence: string[];
  specialites: string[];
  langues_parlees: string[];
  experience_annees: number;
  assurance_responsabilite: boolean;
  numero_carte_pro?: string;
}

// Types pour les formulaires
interface SelectableBadgeProps {
  text: string;
  selected: boolean;
  onClick: () => void;
  color?: 'emerald' | 'blue' | 'purple' | 'yellow';
}

function SelectableBadge({ text, selected, onClick, color = 'emerald' }: SelectableBadgeProps) {
  const colorClasses = {
    emerald: selected ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    blue: selected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    purple: selected ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    yellow: selected ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${colorClasses[color]}`}
    >
      {text}
    </button>
  );
}

// Composant section réutilisable
interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function Section({ title, description, children, className = '' }: SectionProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function ProfilGestionnaireePage() {
  const router = useRouter();
  
  const [profil, setProfil] = useState<ProfilGestionnaire>({
    nom_agence: '',
    description: '',
    zone_intervention: [],
    tarif_base: 0,
    type_gestionnaire: 'gestionnaire_independant',
    nombre_lots_geres: 0,
    services_offerts: [],
    certifications: [],
    horaires_disponibilite: '',
    specialites: [],
    langues_parlees: ['Français'],
    experience_annees: 0,
    assurance_responsabilite: false,
    photos_agence: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Simuler le chargement du profil
  useEffect(() => {
    // Ici on chargerait le profil depuis la base de données
    setProfil({
      nom_agence: 'Immobilier Paris Centre',
      description: 'Agence spécialisée dans la gestion locative haut de gamme sur Paris. Plus de 10 ans d\'expérience dans l\'accompagnement des propriétaires investisseurs.',
      zone_intervention: ['Paris 1er', 'Paris 4ème', 'Paris 6ème', 'Paris 7ème'],
      tarif_base: 8.5,
      type_gestionnaire: 'agence_immobiliere',
      nombre_lots_geres: 150,
      services_offerts: ['Gestion locative complète', 'Recherche de locataires', 'État des lieux', 'Suivi des travaux'],
      certifications: ['Carte professionnelle T', 'Assurance RC Professionnelle', 'Garantie financière'],
      horaires_disponibilite: 'Lundi-Vendredi 9h-18h',
      telephone_professionnel: '01 42 86 75 43',
      site_web: 'www.immobilier-paris-centre.fr',
      specialites: ['Logement haut de gamme', 'Investissement locatif'],
      langues_parlees: ['Français', 'Anglais'],
      experience_annees: 12,
      assurance_responsabilite: true,
      numero_carte_pro: 'T75120240001',
      photos_agence: []
    });
  }, []);

  const handleSave = () => {
    console.log('Sauvegarde du profil:', profil);
    setIsEditing(false);
    // Ici on sauvegarderait en base
  };

  const handleServiceToggle = (service: string) => {
    setProfil(prev => ({
      ...prev,
      services_offerts: prev.services_offerts.includes(service)
        ? prev.services_offerts.filter(s => s !== service)
        : [...prev.services_offerts, service]
    }));
  };

  const handleCertificationToggle = (certification: string) => {
    setProfil(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter(c => c !== certification)
        : [...prev.certifications, certification]
    }));
  };

  const handleSpecialiteToggle = (specialite: string) => {
    setProfil(prev => ({
      ...prev,
      specialites: prev.specialites.includes(specialite)
        ? prev.specialites.filter(s => s !== specialite)
        : [...prev.specialites, specialite]
    }));
  };

  const handleZoneToggle = (zone: string) => {
    setProfil(prev => ({
      ...prev,
      zone_intervention: prev.zone_intervention.includes(zone)
        ? prev.zone_intervention.filter(z => z !== zone)
        : [...prev.zone_intervention, zone]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header avec boutons d'action */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/profil-gestionnaire/user-id`)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            <Eye className="h-4 w-4" />
            Voir profil public
          </button>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-2 text-gray-600">
            <Globe className="h-4 w-4" />
            Profil {profil.nom_agence ? 'complété' : 'incomplet'}
          </div>
        </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Sauvegarder
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
            >
              <PencilSimple className="h-4 w-4" />
              Modifier
            </button>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'general', label: 'Informations générales', icon: User },
              { id: 'services', label: 'Services & Tarifs', icon: CurrencyEur },
              { id: 'zones', label: 'Zones d\'intervention', icon: MapPin },
              { id: 'certifications', label: 'Certifications', icon: Medal },
              { id: 'photos', label: 'Photos & Médias', icon: Camera }
            ].map((tab) => {
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
      <div className="bg-white rounded-lg shadow p-6">
        {/* Onglet Général */}
        {activeTab === 'general' && (
          <div className="space-y-8">
            <Section title="Informations de base">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'agence/société
                  </label>
                  <input
                    type="text"
                    value={profil.nom_agence}
                    onChange={(e) => setProfil(prev => ({ ...prev, nom_agence: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de gestionnaire
                  </label>
                  <select
                    value={profil.type_gestionnaire}
                    onChange={(e) => setProfil(prev => ({ ...prev, type_gestionnaire: e.target.value as any }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                  >
                    <option value="syndic">Syndic</option>
                    <option value="agence_immobiliere">Agence immobilière</option>
                    <option value="gestionnaire_independant">Gestionnaire indépendant</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description de votre activité
                </label>
                <textarea
                  value={profil.description}
                  onChange={(e) => setProfil(prev => ({ ...prev, description: e.target.value }))}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                  placeholder="Décrivez votre agence, votre expérience, vos spécialités..."
                />
              </div>
            </Section>

            <Section title="Contact professionnel">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone professionnel
                  </label>
                  <input
                    type="tel"
                    value={profil.telephone_professionnel || ''}
                    onChange={(e) => setProfil(prev => ({ ...prev, telephone_professionnel: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={profil.site_web || ''}
                    onChange={(e) => setProfil(prev => ({ ...prev, site_web: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* Onglet Services & Tarifs */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <Section title="Services proposés" description="Sélectionnez les services que vous proposez">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Gestion locative complète',
                  'Recherche de locataires',
                  'État des lieux',
                  'Suivi des travaux',
                  'Comptabilité propriétaire',
                  'Assurance loyers impayés',
                  'Déclaration fiscale',
                  'Visites virtuelles'
                ].map((service) => (
                  <SelectableBadge
                    key={service}
                    text={service}
                    selected={profil.services_offerts.includes(service)}
                    onClick={() => isEditing && handleServiceToggle(service)}
                    color="emerald"
                  />
                ))}
              </div>
            </Section>

            <Section title="Tarification" description="Configurez vos tarifs de base">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarif gestion locative (% du loyer)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={profil.tarif_base}
                      onChange={(e) => setProfil(prev => ({ ...prev, tarif_base: parseFloat(e.target.value) }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de lots actuellement gérés
                  </label>
                  <input
                    type="number"
                    value={profil.nombre_lots_geres}
                    onChange={(e) => setProfil(prev => ({ ...prev, nombre_lots_geres: parseInt(e.target.value) }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </Section>

            <Section title="Spécialités" description="Mettez en avant vos domaines d'expertise">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Logement haut de gamme',
                  'Investissement locatif',
                  'Logement étudiant',
                  'Colocation',
                  'Meublé',
                  'Commercial',
                  'Résidence principale',
                  'Courte durée'
                ].map((specialite) => (
                  <SelectableBadge
                    key={specialite}
                    text={specialite}
                    selected={profil.specialites.includes(specialite)}
                    onClick={() => isEditing && handleSpecialiteToggle(specialite)}
                    color="purple"
                  />
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* Onglet Zones */}
        {activeTab === 'zones' && (
          <div className="space-y-8">
            <Section title="Zones d'intervention prioritaires" description="Sélectionnez vos zones de prédilection">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {Array.from({ length: 20 }, (_, i) => `Paris ${i + 1}${i < 9 ? 'er' : 'ème'}`).map((zone) => (
                  <SelectableBadge
                    key={zone}
                    text={zone}
                    selected={profil.zone_intervention.includes(zone)}
                    onClick={() => isEditing && handleZoneToggle(zone)}
                    color="blue"
                  />
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* Onglet Certifications */}
        {activeTab === 'certifications' && (
          <div className="space-y-8">
            <Section title="Certifications et assurances" description="Ajoutez vos certifications professionnelles">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Carte professionnelle T',
                  'Assurance RC Professionnelle',
                  'Garantie financière',
                  'Certification FNAIM',
                  'Formation loi ALUR',
                  'Certification AMO'
                ].map((certification) => (
                  <SelectableBadge
                    key={certification}
                    text={certification}
                    selected={profil.certifications.includes(certification)}
                    onClick={() => isEditing && handleCertificationToggle(certification)}
                    color="yellow"
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de carte professionnelle
                  </label>
                  <input
                    type="text"
                    value={profil.numero_carte_pro || ''}
                    onChange={(e) => setProfil(prev => ({ ...prev, numero_carte_pro: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Années d'expérience
                  </label>
                  <input
                    type="number"
                    value={profil.experience_annees}
                    onChange={(e) => setProfil(prev => ({ ...prev, experience_annees: parseInt(e.target.value) }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* Onglet Photos */}
        {activeTab === 'photos' && (
          <div className="space-y-8">
            <Section title="Photos de l'agence" description="Ajoutez des photos pour illustrer votre agence">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Glissez-déposez vos photos ou cliquez pour sélectionner</p>
                <button
                  disabled={!isEditing}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4 inline mr-2" />
                  Choisir des fichiers
                </button>
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}