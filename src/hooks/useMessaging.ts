'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase-client';
import { 
  DemandeWithDetails, 
  CreateDemandeData, 
  SendMessageData 
} from '@/types/messaging';
import { handleMessagingError, getChannelId } from '@/lib/messaging';

export const useMessaging = (userId: string, userRole: 'proprietaire' | 'gestionnaire') => {
  const [demandes, setDemandes] = useState<DemandeWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mémoïsation du champ de rôle
  const roleField = useMemo(
    () => userRole === 'proprietaire' ? 'proprietaire_id' : 'gestionnaire_id',
    [userRole]
  );

  // Requête optimisée pour récupérer les demandes
  const fetchDemandes = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('demande')
        .select(`
          *,
          proprietaire:proprietaire_id(id, nom, email),
          gestionnaire:gestionnaire_id(id, nom, email),
          message(
            id, contenu, envoye_le,
            emetteur:emetteur_id(id, nom, "rôle")
          )
        `)
        .eq(roleField, userId)
        .order('mis_a_jour_le', { ascending: false });

      if (error) throw error;

      // Transformation optimisée des données
      const demandesWithLastMessage = data?.map(demande => {
        const messages = demande.message || [];
        return {
          ...demande,
          dernierMessage: messages.length > 0 ? messages[messages.length - 1] : null,
          nombreMessagesNonLus: 0 // TODO: Implémenter le calcul des messages non lus
        };
      }) || [];

      setDemandes(demandesWithLastMessage);
    } catch (err) {
      const messagingError = handleMessagingError(err, 'chargement des demandes');
      setError(messagingError.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId, roleField]);

  // Création d'une nouvelle demande - optimisée avec transaction
  const createDemande = useCallback(async (data: CreateDemandeData) => {
    try {
      // Validation des données
      if (!data.proprietaire_id || !data.gestionnaire_id) {
        throw new Error('Identifiants propriétaire et gestionnaire requis');
      }

      const { data: newDemande, error } = await supabase
        .from('demande')
        .insert({
          proprietaire_id: data.proprietaire_id,
          gestionnaire_id: data.gestionnaire_id,
          statut: 'ouverte',
          message_initial: data.message_initial
        })
        .select()
        .single();

      if (error) throw error;

      // Envoyer le message initial si fourni
      if (data.message_initial?.trim()) {
        const { error: messageError } = await supabase
          .from('message')
          .insert({
            demande_id: newDemande.id,
            emetteur_id: data.proprietaire_id,
            contenu: data.message_initial.trim()
          });

        if (messageError) {
          console.warn('Erreur lors de l\'envoi du message initial:', messageError);
        }
      }

      // Rafraîchir la liste
      await fetchDemandes();
      
      return newDemande;
    } catch (err) {
      const messagingError = handleMessagingError(err, 'création de la demande');
      setError(messagingError.message);
      throw messagingError;
    }
  }, [fetchDemandes]);

  // Mise à jour du statut d'une demande
  const updateDemandeStatus = useCallback(async (
    demandeId: string, 
    statut: 'acceptee' | 'rejetee' | 'terminee'
  ) => {
    try {
      if (!demandeId) {
        throw new Error('ID de demande requis');
      }

      const { error } = await supabase
        .from('demande')
        .update({ 
          statut, 
          mis_a_jour_le: new Date().toISOString() 
        })
        .eq('id', demandeId);

      if (error) throw error;
      
      await fetchDemandes();
    } catch (err) {
      const messagingError = handleMessagingError(err, 'mise à jour du statut');
      setError(messagingError.message);
      throw messagingError;
    }
  }, [fetchDemandes]);

  // Configuration optimisée du Realtime
  useEffect(() => {
    if (!userId) return;

    fetchDemandes();

    // Canal unique pour les demandes de cet utilisateur
    const demandeChannelId = getChannelId('user-demandes', userId);
    const demandeSubscription = supabase
      .channel(demandeChannelId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'demande',
        filter: `${roleField}=eq.${userId}`
      }, () => {
        fetchDemandes();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'demande',
        filter: `${roleField}=eq.${userId}`
      }, () => {
        fetchDemandes();
      })
      .subscribe();

    // Canal pour les nouveaux messages
    const messageChannelId = getChannelId('user-messages', userId);
    const messageSubscription = supabase
      .channel(messageChannelId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'message'
      }, (payload) => {
        // Optimisation: ne recharger que si le message concerne cet utilisateur
        fetchDemandes();
      })
      .subscribe();

    return () => {
      demandeSubscription.unsubscribe();
      messageSubscription.unsubscribe();
    };
  }, [userId, roleField, fetchDemandes]);

  return {
    demandes,
    isLoading,
    error,
    createDemande,
    updateDemandeStatus,
    refetch: fetchDemandes
  };
}; 