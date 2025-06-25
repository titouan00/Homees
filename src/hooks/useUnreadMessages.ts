'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';

export const useUnreadMessages = (userId: string, userRole: 'proprietaire' | 'gestionnaire') => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUnreadCount = useCallback(async () => {
    try {
      if (!userId) return;

      // Ici on simule un comptage des messages non lus
      // En réalité, il faudrait une table ou un champ pour tracker les messages lus
      const roleField = userRole === 'proprietaire' ? 'proprietaire_id' : 'gestionnaire_id';
      
      const { data: demandes } = await supabase
        .from('demande')
        .select('id')
        .eq(roleField, userId)
        .eq('statut', 'ouverte');

      // Pour l'instant, on compte les demandes ouvertes comme "non lues"
      setUnreadCount(demandes?.length || 0);
    } catch (error) {
      console.error('Erreur comptage messages non lus:', error);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userRole]);

  useEffect(() => {
    fetchUnreadCount();

    // Écouter les changements en temps réel
    const subscription = supabase
      .channel('unread-messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'demande',
        filter: userRole === 'proprietaire' 
          ? `proprietaire_id=eq.${userId}`
          : `gestionnaire_id=eq.${userId}`
      }, () => {
        fetchUnreadCount();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'message'
      }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUnreadCount, userId, userRole]);

  return { unreadCount, isLoading, refetch: fetchUnreadCount };
}; 