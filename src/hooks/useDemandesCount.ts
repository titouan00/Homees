'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';

/**
 * Hook pour récupérer le nombre de demandes d'un propriétaire
 */
export function useDemandesCount(proprietaireId?: string) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    if (!proprietaireId) {
      setCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { count: demandesCount, error: countError } = await supabase
        .from('demande')
        .select('*', { count: 'exact', head: true })
        .eq('proprietaire_id', proprietaireId);

      if (countError) throw countError;

      setCount(demandesCount || 0);
    } catch (err) {
      console.error('Erreur lors du chargement du nombre de demandes:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [proprietaireId]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return { count, loading, error, refetch: fetchCount };
} 