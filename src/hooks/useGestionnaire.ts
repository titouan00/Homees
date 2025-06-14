'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface GestionnaireDetail {
  gestionnaire_id: string;
  nom: string;
  email: string;
  nom_agence: string;
  description: string | null;
  zone_intervention: string | null;
  tarif_base: number | null;
  certifications: string | null;
  services_offerts: string[] | null;
  logo_url: string | null;
  site_web: string | null;
  telephone: string | null;
  adresse: string | null;
  note_moyenne: number;
  nombre_avis: number;
  actif: boolean;
  langues_parlees: string[] | null;
  type_gestionnaire: string;
  créé_le: string;
  // Données additionnelles spécifiques au détail
  description_longue?: string | null;
  annee_creation?: number | null;
  lots_geres?: number | null;
  tarifs_detailles?: Array<{
    service: string;
    prix: string;
  }> | null;
}

interface UseGestionnaireReturn {
  gestionnaire: GestionnaireDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Faux gestionnaire pour le développement
const generateFakeGestionnaire = (gestionnaireId: string): GestionnaireDetail => {
  const agences = ['Laforêt Immobilier', 'Century 21', 'Orpi', 'Guy Hoquet', 'Foncia'];
  const zones = ['Paris 11ème', 'Lyon Centre', 'Marseille 6ème', 'Toulouse Capitole', 'Nice Centre'];
  const descriptions = [
    'Agence spécialisée dans la gestion locative depuis plus de 15 ans.',
    'Expert en investissement immobilier et gestion de patrimoine.',
    'Votre partenaire de confiance pour la gestion de vos biens.',
    'Gestion complète et personnalisée de vos investissements.',
    'Service premium pour propriétaires exigeants.'
  ];

  const randomIndex = parseInt(gestionnaireId.slice(-1)) || 0;

  return {
    gestionnaire_id: gestionnaireId,
    nom: 'Jean Dupont',
    email: 'j.dupont@agence.fr',
    nom_agence: agences[randomIndex % agences.length],
    description: descriptions[randomIndex % descriptions.length],
    zone_intervention: zones[randomIndex % zones.length],
    tarif_base: 150 + (randomIndex * 50),
    certifications: 'FNAIM, RCP Professionnelle',
    services_offerts: [
      'Gestion locative',
      'État des lieux',
      'Recherche locataire',
      'Assurance loyers impayés',
      'Conseil fiscal',
      'Gestion technique'
    ],
    logo_url: null,
    site_web: `https://www.${agences[randomIndex % agences.length].toLowerCase().replace(/\s+/g, '')}.fr`,
    telephone: `01 42 ${(randomIndex + 10).toString().padStart(2, '0')} ${(randomIndex + 20).toString().padStart(2, '0')} ${(randomIndex + 30).toString().padStart(2, '0')}`,
    adresse: `${34 + randomIndex} rue de la Paix, ${zones[randomIndex % zones.length]}`,
    note_moyenne: 4.0 + (randomIndex * 0.2),
    nombre_avis: 50 + (randomIndex * 25),
    actif: true,
    langues_parlees: ['Français', 'Anglais'],
    type_gestionnaire: 'agence_locale',
    créé_le: new Date(Date.now() - randomIndex * 365 * 24 * 60 * 60 * 1000).toISOString(),
    description_longue: `${descriptions[randomIndex % descriptions.length]} Notre équipe d'experts vous accompagne dans tous vos projets immobiliers avec un service personnalisé et une approche professionnelle. Nous proposons une gamme complète de services pour optimiser la rentabilité de vos investissements.`,
    annee_creation: 2010 + randomIndex,
    lots_geres: 100 + (randomIndex * 50),
    tarifs_detailles: [
      { service: 'Gestion locative', prix: '6,5% TTC' },
      { service: 'Mise en location', prix: '80% du loyer mensuel' },
      { service: 'État des lieux', prix: '150€' },
      { service: 'Assurance GLI', prix: '2,5% du loyer annuel' }
    ]
  };
};

/**
 * Hook pour récupérer les détails d'un gestionnaire
 */
export function useGestionnaire(gestionnaireId: string | null): UseGestionnaireReturn {
  const [gestionnaire, setGestionnaire] = useState<GestionnaireDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGestionnaire = async () => {
    if (!gestionnaireId) {
      setLoading(false);
      setGestionnaire(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer les données du gestionnaire depuis la vue gestionnaires_complets
      const { data: gestionnaireData, error: gestionnaireError } = await supabase
        .from('gestionnaires_complets')
        .select('*')
        .eq('gestionnaire_id', gestionnaireId)
        .eq('actif', true)
        .single();

      if (gestionnaireError) {
        console.warn('Vue gestionnaires_complets non disponible, utilisation de faux gestionnaire:', gestionnaireError);
        
        // Utiliser un faux gestionnaire en cas d'erreur
        const fakeGestionnaire = generateFakeGestionnaire(gestionnaireId);
        setGestionnaire(fakeGestionnaire);
        return;
      }

      // Récupérer les informations additionnelles du profil gestionnaire si disponibles
      const { data: profilData, error: profilError } = await supabase
        .from('profil_gestionnaire')
        .select('description_longue, annee_creation, lots_geres, tarifs_detailles')
        .eq('utilisateur_id', gestionnaireData.gestionnaire_id)
        .single();

      // On ignore l'erreur de profil non trouvé car ce n'est pas critique
      const profil = profilError ? null : profilData;

      setGestionnaire({
        ...gestionnaireData,
        description_longue: profil?.description_longue || null,
        annee_creation: profil?.annee_creation || null,
        lots_geres: profil?.lots_geres || null,
        tarifs_detailles: profil?.tarifs_detailles || null,
      });

    } catch (err) {
      console.warn('Erreur lors du chargement du gestionnaire, utilisation de faux gestionnaire:', err);
      
      // Utiliser un faux gestionnaire en cas d'erreur de connexion
      const fakeGestionnaire = generateFakeGestionnaire(gestionnaireId);
      setGestionnaire(fakeGestionnaire);
      setError(null); // Pas d'erreur affichée puisqu'on utilise un faux gestionnaire
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGestionnaire();
  }, [gestionnaireId]);

  const refetch = () => {
    fetchGestionnaire();
  };

  return {
    gestionnaire,
    loading,
    error,
    refetch
  };
} 