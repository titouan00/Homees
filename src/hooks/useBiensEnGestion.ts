'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface BienEnGestion {
  id: string;
  adresse: string;
  ville: string;
  type_bien: string;
  surface_m2: number;
  loyer_indicatif: number;
  statut_occupation: 'libre' | 'occupe' | 'en_travaux' | null;
  nb_pieces?: number;
  nb_chambres?: number;
  etage?: number;
  balcon?: boolean;
  parking?: boolean;
  charges_mensuelles?: number;
  proprietaire: {
    nom: string;
    email: string;
    telephone?: string;
  };
  contrat?: {
    montant: number;
    date_debut: string;
  };
  demande: {
    statut: string;
    date_creation: string;
  };
  rentabilite?: number;
  taux_occupation?: number;
  prochaine_echeance?: string;
  created_at: string;
}

interface StatistiquesGestion {
  total_biens: number;
  biens_occupes: number;
  biens_libres: number;
  biens_travaux: number;
  revenus_mensuels: number;
  taux_occupation_global: number;
  rentabilite_moyenne: number;
}

export const useBiensEnGestion = (gestionnaireId: string) => {
  const [biens, setBiens] = useState<BienEnGestion[]>([]);
  const [statistiques, setStatistiques] = useState<StatistiquesGestion>({
    total_biens: 0,
    biens_occupes: 0,
    biens_libres: 0,
    biens_travaux: 0,
    revenus_mensuels: 0,
    taux_occupation_global: 0,
    rentabilite_moyenne: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBiensEnGestion = useCallback(async () => {
    if (!gestionnaireId) return;
    
    try {
      setLoading(true);
      setError(null);

      // Vérifier la connexion avec une requête simple
      const { data: gestionnaireData, error: gestError } = await supabase
        .from('utilisateurs')
        .select('nom')
        .eq('id', gestionnaireId)
        .single();

      if (gestError) {
        throw gestError;
      }

      // Pour l'instant, utiliser des données simulées car les colonnes accentuées posent problème
      // TODO: Résoudre les problèmes de colonnes avec accents dans Supabase
      const biensSimules: BienEnGestion[] = [
        {
          id: 'bien-1',
          adresse: '15 rue de la Paix',
          ville: 'Paris 1er',
          type_bien: 'appartement',
          surface_m2: 45,
          loyer_indicatif: 1800,
          statut_occupation: 'occupe',
          nb_pieces: 2,
          nb_chambres: 1,
          etage: 3,
          balcon: false,
          parking: false,
          charges_mensuelles: 150,
          proprietaire: {
            nom: 'Marie Dubois',
            email: 'marie.dubois@email.com',
            telephone: '06 12 34 56 78'
          },
          contrat: {
            montant: 1800,
            date_debut: '2024-01-01'
          },
          demande: {
            statut: 'acceptee',
            date_creation: '2024-01-15T10:30:00Z'
          },
          rentabilite: 4.2,
          taux_occupation: 100,
          prochaine_echeance: '2024-12-31',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 'bien-2',
          adresse: '8 avenue des Champs',
          ville: 'Paris 8ème',
          type_bien: 'studio',
          surface_m2: 25,
          loyer_indicatif: 1200,
          statut_occupation: 'libre',
          nb_pieces: 1,
          nb_chambres: 0,
          etage: 2,
          balcon: true,
          parking: false,
          charges_mensuelles: 80,
          proprietaire: {
            nom: 'Jean Martin',
            email: 'jean.martin@email.com'
          },
          demande: {
            statut: 'acceptee',
            date_creation: '2024-01-10T09:15:00Z'
          },
          rentabilite: 3.8,
          taux_occupation: 0,
          created_at: '2024-01-10T09:15:00Z'
        },
        {
          id: 'bien-3',
          adresse: '22 boulevard Saint-Germain',
          ville: 'Paris 5ème',
          type_bien: 'appartement',
          surface_m2: 75,
          loyer_indicatif: 2500,
          statut_occupation: 'en_travaux',
          nb_pieces: 3,
          nb_chambres: 2,
          etage: 4,
          balcon: true,
          parking: true,
          charges_mensuelles: 200,
          proprietaire: {
            nom: 'Sophie Laurent',
            email: 'sophie.laurent@email.com',
            telephone: '07 98 76 54 32'
          },
          contrat: {
            montant: 2500,
            date_debut: '2024-02-01'
          },
          demande: {
            statut: 'acceptee',
            date_creation: '2024-01-05T14:20:00Z'
          },
          rentabilite: 5.1,
          taux_occupation: 85,
          prochaine_echeance: '2025-01-31',
          created_at: '2024-01-05T14:20:00Z'
        }
      ];

      setBiens(biensSimules);

      // Calculer les statistiques
      const stats: StatistiquesGestion = {
        total_biens: biensSimules.length,
        biens_occupes: biensSimules.filter(b => b.statut_occupation === 'occupe').length,
        biens_libres: biensSimules.filter(b => b.statut_occupation === 'libre').length,
        biens_travaux: biensSimules.filter(b => b.statut_occupation === 'en_travaux').length,
        revenus_mensuels: biensSimules.reduce((sum, b) => sum + (b.loyer_indicatif || 0), 0),
        taux_occupation_global: biensSimules.length > 0 ? 
          Math.round((biensSimules.filter(b => b.statut_occupation === 'occupe').length / biensSimules.length) * 100 * 10) / 10 : 0,
        rentabilite_moyenne: biensSimules.length > 0 ?
          Math.round((biensSimules.reduce((sum, b) => sum + (b.rentabilite || 0), 0) / biensSimules.length) * 10) / 10 : 0
      };

      setStatistiques(stats);

    } catch (err) {
      console.error('Erreur lors du chargement des biens en gestion:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      
      // En cas d'erreur, utiliser des données par défaut
      setBiens([]);
      setStatistiques({
        total_biens: 0,
        biens_occupes: 0,
        biens_libres: 0,
        biens_travaux: 0,
        revenus_mensuels: 0,
        taux_occupation_global: 0,
        rentabilite_moyenne: 0
      });
    } finally {
      setLoading(false);
    }
  }, [gestionnaireId]);

  useEffect(() => {
    fetchBiensEnGestion();
  }, [fetchBiensEnGestion]);

  const refreshBiens = () => {
    fetchBiensEnGestion();
  };

  return {
    biens,
    statistiques,
    loading,
    error,
    refreshBiens
  };
}; 