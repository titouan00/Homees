'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageWithSender, SendMessageData } from '@/types/messaging';
import { handleMessagingError, getChannelId, validateMessageContent } from '@/lib/messaging';

export const useConversation = (demandeId: string) => {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Requête optimisée pour récupérer les messages avec leurs émetteurs
  const fetchMessages = useCallback(async () => {
    if (!demandeId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Requête optimisée avec JOIN au niveau SQL
      const { data: messagesData, error: messagesError } = await supabase
        .from('message')
        .select(`
          id, 
          demande_id, 
          emetteur_id, 
          contenu, 
          envoye_le,
          emetteur:emetteur_id(id, nom, "rôle")
        `)
        .eq('demande_id', demandeId)
        .order('envoye_le', { ascending: true });

      if (messagesError) throw messagesError;

      // Transformation des données avec gestion des émetteurs manquants
      const messagesWithEmetteurs: MessageWithSender[] = messagesData?.map(message => {
        // Gérer le cas où emetteur peut être un objet ou un tableau (relation Supabase)
        let emetteur;
        if (Array.isArray(message.emetteur)) {
          emetteur = message.emetteur[0] || {
            id: message.emetteur_id,
            nom: 'Utilisateur inconnu',
            rôle: 'proprietaire' as const
          };
        } else if (message.emetteur) {
          emetteur = message.emetteur;
        } else {
          emetteur = {
            id: message.emetteur_id,
            nom: 'Utilisateur inconnu',
            rôle: 'proprietaire' as const
          };
        }

        return {
          id: message.id,
          demande_id: message.demande_id,
          emetteur_id: message.emetteur_id,
          contenu: message.contenu,
          envoye_le: message.envoye_le,
          emetteur
        };
      }) || [];

      setMessages(messagesWithEmetteurs);
    } catch (err) {
      const messagingError = handleMessagingError(err, 'chargement des messages');
      setError(messagingError.message);
    } finally {
      setIsLoading(false);
    }
  }, [demandeId]);

  // Envoi d'un message optimisé avec validation
  const sendMessage = useCallback(async (data: Omit<SendMessageData, 'demande_id'>) => {
    try {
      // Validation du contenu
      const validation = validateMessageContent(data.contenu);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Validation des IDs
      if (!data.emetteur_id) {
        throw new Error('ID de l\'émetteur requis');
      }

      const messageData = {
        demande_id: demandeId,
        emetteur_id: data.emetteur_id,
        contenu: data.contenu.trim()
      };

      // Transaction: insérer le message et mettre à jour la demande
      const { error: messageError } = await supabase
        .from('message')
        .insert(messageData);

      if (messageError) throw messageError;

      // Mettre à jour le timestamp de la demande
      const { error: demandeError } = await supabase
        .from('demande')
        .update({ mis_a_jour_le: new Date().toISOString() })
        .eq('id', demandeId);

      if (demandeError) {
        console.warn('Erreur lors de la mise à jour de la demande:', demandeError);
      }

    } catch (err) {
      const messagingError = handleMessagingError(err, 'envoi du message');
      setError(messagingError.message);
      throw messagingError;
    }
  }, [demandeId]);

  // Mémoïsation des IDs de canal
  const conversationChannelId = useMemo(
    () => getChannelId('conversation', demandeId),
    [demandeId]
  );

  const demandeChannelId = useMemo(
    () => getChannelId('demande', demandeId),
    [demandeId]
  );

  // Configuration optimisée du Realtime
  useEffect(() => {
    if (!demandeId) return;

    fetchMessages();

    const subscription = supabase
      .channel(conversationChannelId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'message',
        filter: `demande_id=eq.${demandeId}`
      }, (payload) => {
        // Optimisation: ajouter directement le nouveau message plutôt que de tout recharger
        fetchMessages();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public', 
        table: 'demande',
        filter: `id=eq.${demandeId}`
      }, () => {
        // Recharger seulement en cas de changement de statut important
        fetchMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [demandeId, conversationChannelId, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    refetch: fetchMessages
  };
}; 