'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface DashboardProprietaireStats {
  nombreBiens: number;
  nombreDemandes: number;
  nombreDemandesAcceptees: number;
  nombreGestionnaires: number;
  budgetInvestissement: number | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour récupérer les statistiques du dashboard propriétaire
 */
export function useDashboardProprietaire(proprietaireId?: string): DashboardProprietaireStats {
  const [stats, setStats] = useState<DashboardProprietaireStats>({
    nombreBiens: 0,
    nombreDemandes: 0,
    nombreDemandesAcceptees: 0,
    nombreGestionnaires: 0,
    budgetInvestissement: null,
    loading: true,
    error: null
  });

  const fetchStats = useCallback(async () => {
    if (!proprietaireId) {
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Récupérer le nombre de biens
      const { count: biensCount, error: biensError } = await supabase
        .from('propriete')
        .select('*', { count: 'exact', head: true })
        .eq('proprietaire_id', proprietaireId);

      if (biensError) throw biensError;

      // Récupérer le nombre de demandes
      const { count: demandesCount, error: demandesError } = await supabase
        .from('demande')
        .select('*', { count: 'exact', head: true })
        .eq('proprietaire_id', proprietaireId);

      if (demandesError) throw demandesError;

      // Récupérer le nombre de demandes acceptées
      const { count: demandesAccepteesCount, error: demandesAccepteesError } = await supabase
        .from('demande')
        .select('*', { count: 'exact', head: true })
        .eq('proprietaire_id', proprietaireId)
        .eq('statut', 'acceptee');

      if (demandesAccepteesError) throw demandesAccepteesError;

      // Récupérer le nombre de gestionnaires uniques contactés
      const { data: gestionnairesData, error: gestionnairesError } = await supabase
        .from('demande')
        .select('gestionnaire_id')
        .eq('proprietaire_id', proprietaireId)
        .not('gestionnaire_id', 'is', null);

      if (gestionnairesError) throw gestionnairesError;

      const gestionnairesUniques = new Set(gestionnairesData?.map(d => d.gestionnaire_id) || []).size;

      // Récupérer le budget d'investissement du profil propriétaire
      const { data: profilData, error: profilError } = await supabase
        .from('profil_proprietaire')
        .select('budget_investissement')
        .eq('utilisateur_id', proprietaireId)
        .single();

      if (profilError && profilError.code !== 'PGRST116') { // Ignore not found
        throw profilError;
      }

      setStats({
        nombreBiens: biensCount || 0,
        nombreDemandes: demandesCount || 0,
        nombreDemandesAcceptees: demandesAccepteesCount || 0,
        nombreGestionnaires: gestionnairesUniques,
        budgetInvestissement: profilData?.budget_investissement || null,
        loading: false,
        error: null
      });

    } catch (err) {
      console.error('Erreur lors du chargement des statistiques dashboard:', err);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Erreur inconnue'
      }));
    }
  }, [proprietaireId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return stats;
} 