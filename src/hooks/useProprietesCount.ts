import { useMemo } from 'react';
import { useRealTimeCount } from './useRealTimeCount';

interface UseProprietesCountResult {
  count: number;
  loading: boolean;
  error: string | null;
  refresh?: () => void;
}

/**
 * Hook optimisé pour compter les biens d'un propriétaire
 * Utilise le hook générique useRealTimeCount pour éliminer la duplication
 */
export function useProprietesCount(proprietaireId?: string): UseProprietesCountResult {
  const query = useMemo(() => {
    if (!proprietaireId) return null;
    
    return {
      table: 'propriete', // Nom correct de la table
      filterColumn: 'proprietaire_id',
      filterValue: proprietaireId
    };
  }, [proprietaireId]);

  const result = useRealTimeCount(query, !!proprietaireId);
  
  return {
    ...result,
    refresh: () => {} // Pour compatibilité avec l'ancienne API
  };
} 