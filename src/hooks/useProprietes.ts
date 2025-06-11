'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Propriete, NouvelleProprieteForme, FiltresProprietes } from '@/types/propriete';

interface UseProprietesReturn {
  proprietes: Propriete[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  ajouterPropriete: (propriete: NouvelleProprieteForme) => Promise<boolean>;
  modifierPropriete: (id: string, propriete: Partial<NouvelleProprieteForme>) => Promise<boolean>;
  supprimerPropriete: (id: string) => Promise<boolean>;
  refetch: () => void;
}

interface UseProprietesParams {
  proprietaireId?: string;
  filtres?: FiltresProprietes;
  page?: number;
  limit?: number;
}

/**
 * Hook pour gérer les propriétés d'un propriétaire
 */
export function useProprietes(params: UseProprietesParams): UseProprietesReturn {
  const [proprietes, setProprietes] = useState<Propriete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Mémoriser les paramètres pour éviter les re-rendus inutiles
  const { proprietaireId, filtres, page = 1, limit = 10 } = params;

  const fetchProprietes = useCallback(async () => {
    if (!proprietaireId) {
      setLoading(false);
      setProprietes([]);
      setTotalCount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('propriete')
        .select('*', { count: 'exact' })
        .eq('proprietaire_id', proprietaireId);

      // Appliquer les filtres
      if (filtres) {
        if (filtres.type_bien && filtres.type_bien.length > 0) {
          query = query.in('type_bien', filtres.type_bien);
        }

        if (filtres.statut_occupation && filtres.statut_occupation.length > 0) {
          query = query.in('statut_occupation', filtres.statut_occupation);
        }

        if (filtres.ville) {
          query = query.ilike('ville', `%${filtres.ville}%`);
        }

        if (filtres.surface_min !== undefined) {
          query = query.gte('surface_m2', filtres.surface_min);
        }

        if (filtres.surface_max !== undefined) {
          query = query.lte('surface_m2', filtres.surface_max);
        }

        if (filtres.loyer_min !== undefined) {
          query = query.gte('loyer_indicatif', filtres.loyer_min);
        }

        if (filtres.loyer_max !== undefined) {
          query = query.lte('loyer_indicatif', filtres.loyer_max);
        }

        // Tri
        const orderColumn = filtres.tri_par === 'surface' ? 'surface_m2' :
                           filtres.tri_par === 'loyer' ? 'loyer_indicatif' :
                           filtres.tri_par === 'adresse' ? 'adresse' : 'créé_le';

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

      setProprietes(data || []);
      setTotalCount(count || 0);

    } catch (err) {
      console.error('Erreur lors de la récupération des propriétés:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setProprietes([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [proprietaireId, filtres, page, limit]);

  const ajouterPropriete = useCallback(async (propriete: NouvelleProprieteForme): Promise<boolean> => {
    if (!proprietaireId) {
      setError('ID propriétaire manquant');
      return false;
    }

    try {
      setError(null);

      const nouvellePropriet = {
        ...propriete,
        proprietaire_id: proprietaireId,
        photos: [],
        documents: []
      };

      const { data, error: insertError } = await supabase
        .from('propriete')
        .insert([nouvellePropriet])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Actualiser la liste
      await fetchProprietes();
      return true;

    } catch (err) {
      console.error('Erreur lors de l\'ajout de la propriété:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
      return false;
    }
  }, [proprietaireId, fetchProprietes]);

  const modifierPropriete = useCallback(async (id: string, propriete: Partial<NouvelleProprieteForme>): Promise<boolean> => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('propriete')
        .update(propriete)
        .eq('id', id)
        .eq('proprietaire_id', proprietaireId);

      if (updateError) {
        throw updateError;
      }

      // Actualiser la liste
      await fetchProprietes();
      return true;

    } catch (err) {
      console.error('Erreur lors de la modification de la propriété:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
      return false;
    }
  }, [proprietaireId, fetchProprietes]);

  const supprimerPropriete = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('propriete')
        .delete()
        .eq('id', id)
        .eq('proprietaire_id', proprietaireId);

      if (deleteError) {
        throw deleteError;
      }

      // Actualiser la liste
      await fetchProprietes();
      return true;

    } catch (err) {
      console.error('Erreur lors de la suppression de la propriété:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      return false;
    }
  }, [proprietaireId, fetchProprietes]);

  // Effet pour charger les données
  useEffect(() => {
    fetchProprietes();
  }, [fetchProprietes]);

  return {
    proprietes,
    loading,
    error,
    totalCount,
    ajouterPropriete,
    modifierPropriete,
    supprimerPropriete,
    refetch: fetchProprietes
  };
} 