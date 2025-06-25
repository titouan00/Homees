import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';

interface CreateDemandeData {
  gestionnaire_id: string;
  propriete_id?: string;
  message_initial: string;
}

interface UseCreateDemandeReturn {
  createDemande: (data: CreateDemandeData) => Promise<{ success: boolean; demande?: any; error?: string }>;
  isCreating: boolean;
}

/**
 * Hook pour créer une nouvelle demande de gestion
 */
export function useCreateDemande(proprietaireId: string): UseCreateDemandeReturn {
  const [isCreating, setIsCreating] = useState(false);

  const createDemande = async (data: CreateDemandeData) => {
    try {
      setIsCreating(true);

      const { data: demande, error } = await supabase
        .from('demande')
        .insert({
          proprietaire_id: proprietaireId,
          gestionnaire_id: data.gestionnaire_id,
          propriete_id: data.propriete_id || null,
          message_initial: data.message_initial,
          statut: 'ouverte'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Déclencher la notification pour le gestionnaire
      try {
        const { NotificationTriggers } = await import('@/services/notificationService');
        await NotificationTriggers.onNewDemandeCreated({
          gestionnaireId: data.gestionnaire_id,
          proprietaireNom: 'Propriétaire', // TODO: récupérer le vrai nom
          demandeId: demande.id,
          serviceType: 'Gestion immobilière'
        });
      } catch (notifError) {
        console.warn('Erreur envoi notification:', notifError);
        // Ne pas faire échouer la création pour un problème de notification
      }

      return { success: true, demande };
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de la création de la demande' 
      };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createDemande,
    isCreating
  };
} 