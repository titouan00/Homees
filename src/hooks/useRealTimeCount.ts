import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface CountQuery {
  table: string;
  countColumn?: string;
  filterColumn?: string;
  filterValue?: string;
  matchConditions?: Record<string, any>;
}

interface UseRealTimeCountResult {
  count: number;
  loading: boolean;
  error: string | null;
}

/**
 * Hook générique pour compter des éléments en temps réel
 * Remplace useProprietesCount et peut être utilisé pour d'autres entités
 */
export function useRealTimeCount(
  query: CountQuery | null,
  enabled: boolean = true
): UseRealTimeCountResult {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled || !query) {
      setCount(0);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchCount = async () => {
      try {
        let supabaseQuery = supabase
          .from(query.table)
          .select(query.countColumn || '*', { count: 'exact', head: true });

        // Appliquer les filtres
        if (query.filterColumn && query.filterValue) {
          supabaseQuery = supabaseQuery.eq(query.filterColumn, query.filterValue);
        }

        if (query.matchConditions) {
          Object.entries(query.matchConditions).forEach(([key, value]) => {
            supabaseQuery = supabaseQuery.eq(key, value);
          });
        }

        const { count: fetchedCount, error: fetchError } = await supabaseQuery;

        if (fetchError) {
          throw fetchError;
        }

        if (isMounted) {
          setCount(fetchedCount || 0);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error(`Erreur lors du comptage ${query.table}:`, err);
          setError(err instanceof Error ? err.message : 'Erreur inconnue');
          setLoading(false);
        }
      }
    };

    const setupRealTime = () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      const channel = supabase
        .channel(`${query.table}_count_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: query.table,
            ...(query.filterColumn && query.filterValue && {
              filter: `${query.filterColumn}=eq.${query.filterValue}`
            })
          },
          () => {
            // Recompter à chaque changement
            fetchCount();
          }
        )
        .subscribe();

      channelRef.current = channel;
    };

    fetchCount();
    setupRealTime();

    return () => {
      isMounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [enabled, query?.table, query?.filterColumn, query?.filterValue, JSON.stringify(query?.matchConditions)]);

  return { count, loading, error };
} 