import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';

interface UseUpdateDemandeReturn {
  updateStatut: (demandeId: string, nouveauStatut: string) => Promise<{ success: boolean; error?: string }>;
  isUpdating: boolean;
}

/**
 * Hook pour mettre à jour le statut d'une demande
 */
export function useUpdateDemande(): UseUpdateDemandeReturn {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatut = async (demandeId: string, nouveauStatut: string) => {
    try {
      setIsUpdating(true);

      const { error } = await supabase
        .from('demande')
        .update({ 
          statut: nouveauStatut,
          mis_a_jour_le: new Date().toISOString()
        })
        .eq('id', demandeId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la demande:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour' 
      };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateStatut,
    isUpdating
  };
} 