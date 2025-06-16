'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Gestionnaire, ComparateurParams } from '@/types/gestionnaire';

interface UseComparateurReturn {
  gestionnaires: Gestionnaire[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  refetch: () => void;
}

/**
 * Hook pour gérer la récupération et le filtrage des gestionnaires
 */
export function useComparateur(params: ComparateurParams): UseComparateurReturn {
  const [gestionnaires, setGestionnaires] = useState<Gestionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchGestionnaires = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('gestionnaires_complets')
        .select('*', { count: 'exact' });

      // Filtre par zone d'intervention
      if (params.zone_intervention) {
        query = query.ilike('zone_intervention', `%${params.zone_intervention}%`);
      }

      // Filtre par tarif
      if (params.tarif_min !== undefined) {
        query = query.gte('tarif_base', params.tarif_min);
      }
      if (params.tarif_max !== undefined) {
        query = query.lte('tarif_base', params.tarif_max);
      }

      // Filtre par note minimum
      if (params.note_min !== undefined) {
        query = query.gte('note_moyenne', params.note_min);
      }

      // Filtre par langues parlées
      if (params.langues_parlees && params.langues_parlees.length > 0) {
        console.log('Filtrage par langues demandé:', params.langues_parlees);
        
        // Utilisons l'approche recommandée par Supabase pour les arrays JSON
        // Créons une condition OR pour chaque langue
        const langueConditions = params.langues_parlees.map(langue => 
          `langues_parlees.cs.[\"${langue}\"]`
        );
        
        if (langueConditions.length > 0) {
          query = query.or(langueConditions.join(','));
        }
      }

      // Filtre par type de gestionnaire
      if (params.type_gestionnaire && params.type_gestionnaire.length > 0) {
        query = query.in('type_gestionnaire', params.type_gestionnaire);
      }

      // Recherche textuelle
      if (params.search) {
        query = query.or(`nom_agence.ilike.%${params.search}%,nom.ilike.%${params.search}%,description.ilike.%${params.search}%`);
      }

      // Tri
      const orderColumn = params.tri_par === 'prix' ? 'tarif_base' : 
                         params.tri_par === 'avis' ? 'nombre_avis' :
                         params.tri_par === 'note' ? 'note_moyenne' : 'nom_agence';
      
      query = query.order(orderColumn, { 
        ascending: params.ordre === 'asc',
        nullsFirst: false 
      });

      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 12;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setGestionnaires(data || []);
      setTotalCount(count || 0);

    } catch (err) {
      console.error('Erreur lors de la récupération des gestionnaires:', err);
      console.error('Paramètres de recherche:', params);
      console.error('Détails de l\'erreur:', {
        message: err instanceof Error ? err.message : 'Erreur inconnue',
        stack: err instanceof Error ? err.stack : undefined,
        params: params
      });
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setGestionnaires([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchGestionnaires();
  }, [fetchGestionnaires]);

  return {
    gestionnaires,
    loading,
    error,
    totalCount,
    refetch: fetchGestionnaires
  };
} 