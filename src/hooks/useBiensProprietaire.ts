import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

interface Bien {
  id: string;
  adresse: string;
  ville: string;
  type_bien: string;
  surface_m2: number;
  nb_pieces: number;
  loyer_indicatif: number;
}

interface UseBiensProprietaireReturn {
  biens: Bien[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour récupérer les biens d'un propriétaire
 */
export function useBiensProprietaire(proprietaireId?: string): UseBiensProprietaireReturn {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!proprietaireId) {
      setLoading(false);
      setBiens([]);
      return;
    }

    const fetchBiens = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('propriete')
          .select('id, adresse, ville, type_bien, surface_m2, nb_pieces, loyer_indicatif')
          .eq('proprietaire_id', proprietaireId)
          .order('adresse');

        if (fetchError) {
          throw fetchError;
        }

        setBiens(data || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des biens:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des biens');
        setBiens([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBiens();
  }, [proprietaireId]);

  return {
    biens,
    loading,
    error
  };
} 