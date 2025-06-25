'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase-client';
import { DemandeWithDetails, FiltresDemandes } from '@/types/messaging';

interface UseDemandesParams {
  proprietaireId?: string;
  filtres?: FiltresDemandes;
  recherche?: string;
  page?: number;
  limit?: number;
}

interface UseDemandesReturn {
  demandes: DemandeWithDetails[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  refetch: () => void;
}

/**
 * Hook pour gérer les demandes d'un propriétaire avec filtres et recherche
 */
export function useDemandes(params: UseDemandesParams): UseDemandesReturn {
  const [demandes, setDemandes] = useState<DemandeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const { proprietaireId, filtres, recherche, page = 1, limit = 10 } = params;

  const fetchDemandes = useCallback(async () => {
    if (!proprietaireId) {
      setLoading(false);
      setDemandes([]);
      setTotalCount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('demande')
        .select(`
          *,
          proprietaire:proprietaire_id(id, nom, email),
          gestionnaire:gestionnaire_id(id, nom, email),
          propriete:propriete_id(id, adresse, ville, type_bien)
        `, { count: 'exact' })
        .eq('proprietaire_id', proprietaireId);

      // Appliquer la recherche
      if (recherche && recherche.trim()) {
        const searchTerm = recherche.trim();
        query = query.or(`
          gestionnaire.nom.ilike.%${searchTerm}%,
          propriete.adresse.ilike.%${searchTerm}%,
          propriete.ville.ilike.%${searchTerm}%
        `);
      }

      // Appliquer les filtres
      if (filtres) {
        if (filtres.statut && filtres.statut.length > 0) {
          query = query.in('statut', filtres.statut);
        }

        if (filtres.ville) {
          query = query.ilike('propriete.ville', `%${filtres.ville}%`);
        }

        if (filtres.adresse) {
          query = query.ilike('propriete.adresse', `%${filtres.adresse}%`);
        }

        if (filtres.gestionnaire) {
          query = query.ilike('gestionnaire.nom', `%${filtres.gestionnaire}%`);
        }

        if (filtres.date_debut) {
          query = query.gte('créé_le', filtres.date_debut);
        }

        if (filtres.date_fin) {
          query = query.lte('créé_le', filtres.date_fin);
        }

        // Tri
        const orderColumn = filtres.tri_par === 'statut' ? 'statut' :
                           filtres.tri_par === 'gestionnaire' ? 'gestionnaire.nom' :
                           filtres.tri_par === 'adresse' ? 'propriete.adresse' : 'créé_le';

        query = query.order(orderColumn, {
          ascending: filtres.ordre === 'asc',
          nullsFirst: false
        });
      } else {
        // Tri par défaut par date de création
        query = query.order('créé_le', { ascending: false });
      }

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setDemandes(data || []);
      setTotalCount(count || 0);

    } catch (err) {
      console.error('Erreur lors de la récupération des demandes:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setDemandes([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [proprietaireId, filtres, recherche, page, limit]);

  // Effet pour charger les données
  useEffect(() => {
    fetchDemandes();
  }, [fetchDemandes]);

  // Écouter les changements en temps réel
  useEffect(() => {
    if (!proprietaireId) return;

    const subscription = supabase
      .channel('demandes-proprietaire')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'demande',
        filter: `proprietaire_id=eq.${proprietaireId}`
      }, () => {
        fetchDemandes();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [proprietaireId, fetchDemandes]);

  return {
    demandes,
    loading,
    error,
    totalCount,
    refetch: fetchDemandes
  };
} 