import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import type { Notification, NotificationWithMeta, NotificationStats, CreateNotificationData } from '@/types/notification';

/**
 * Hook pour gérer les notifications en temps réel
 */
export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<NotificationWithMeta[]>([]);
  const [stats, setStats] = useState<NotificationStats>({ total: 0, unread: 0, byType: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour formater le temps écoulé
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  // Fonction pour enrichir les notifications avec metadata
  const enrichNotifications = useCallback((notifications: Notification[]): NotificationWithMeta[] => {
    return notifications.map(notification => ({
      ...notification,
      timeAgo: getTimeAgo(notification.created_at),
      actionUrl: getActionUrl(notification),
      canDismiss: true
    }));
  }, []);

  // Fonction pour déterminer l'URL d'action selon le type
  const getActionUrl = (notification: Notification): string | undefined => {
    switch (notification.type) {
      case 'nouveau_message':
        return `/dashboard/messages?conversation=${notification.data?.conversation_id}`;
      case 'demande_update':
      case 'demande_acceptee':
      case 'demande_rejetee':
        return `/dashboard/proprietaire/demandes?demande=${notification.data?.demande_id}`;
      default:
        return undefined;
    }
  };

  // Charger les notifications initiales
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      const enrichedNotifications = enrichNotifications(data || []);
      setNotifications(enrichedNotifications);

      // Calculer les stats
      const unread = data?.filter(n => !n.read).length || 0;
      const byType = data?.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      setStats({
        total: data?.length || 0,
        unread,
        byType
      });

    } catch (err) {
      console.error('Erreur chargement notifications:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [userId, enrichNotifications]);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      // Mettre à jour localement
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read: true }
            : n
        )
      );

      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }));

    } catch (err) {
      console.error('Erreur mark as read:', err);
    }
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;

      // Mettre à jour localement
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );

      setStats(prev => ({
        ...prev,
        unread: 0
      }));

    } catch (err) {
      console.error('Erreur mark all as read:', err);
    }
  }, [userId]);

  // Supprimer une notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      // Mettre à jour localement
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      setStats(prev => ({
        total: prev.total - 1,
        unread: notification && !notification.read ? prev.unread - 1 : prev.unread,
        byType: {
          ...prev.byType,
          [notification?.type || '']: Math.max(0, (prev.byType[notification?.type || ''] || 1) - 1)
        }
      }));

    } catch (err) {
      console.error('Erreur delete notification:', err);
    }
  }, [notifications]);

  // S'abonner aux nouvelles notifications en temps réel
  useEffect(() => {
    if (!userId) return;

    // Charger les notifications initiales
    loadNotifications();

    // S'abonner aux changements en temps réel
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          const enrichedNotification = enrichNotifications([newNotification])[0];
          
          setNotifications(prev => [enrichedNotification, ...prev]);
          setStats(prev => ({
            total: prev.total + 1,
            unread: prev.unread + 1,
            byType: {
              ...prev.byType,
              [newNotification.type]: (prev.byType[newNotification.type] || 0) + 1
            }
          }));

          // Afficher une notification toast si l'utilisateur est actif
          if (document.visibilityState === 'visible') {
            showToastNotification(enrichedNotification);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          setNotifications(prev => 
            prev.map(n => 
              n.id === updatedNotification.id 
                ? enrichNotifications([updatedNotification])[0]
                : n
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId, loadNotifications, enrichNotifications]);

  return {
    notifications,
    stats,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: loadNotifications
  };
}

// Fonction pour afficher une toast notification
function showToastNotification(notification: NotificationWithMeta) {
  // Utiliser l'API Notification du navigateur si disponible
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/icon-192x192.png',
      tag: notification.id
    });
  }
  
  // Ici vous pouvez aussi utiliser une bibliothèque de toast comme react-hot-toast
  console.log('Nouvelle notification:', notification.title);
}

/**
 * Hook pour créer des notifications
 */
export function useCreateNotification() {
  const createNotification = useCallback(async (data: CreateNotificationData) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          ...data,
          read: false,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Erreur création notification:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erreur inconnue' 
      };
    }
  }, []);

  return { createNotification };
} 