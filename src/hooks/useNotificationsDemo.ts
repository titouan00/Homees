import { useState, useCallback } from 'react';
import type { NotificationWithMeta, NotificationStats } from '@/types/notification';

/**
 * Hook de démonstration pour tester les notifications sans Supabase
 */
export function useNotificationsDemo() {
  const [notifications, setNotifications] = useState<NotificationWithMeta[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Calculer les stats en temps réel
  const stats: NotificationStats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    byType: notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  // Ajouter une notification de test
  const addNotification = useCallback((notification: NotificationWithMeta) => {
    setNotifications(prev => [notification, ...prev]);
  }, []);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, read: true }
          : n
      )
    );
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  // Supprimer une notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Vider toutes les notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    stats,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    clearAll,
    refresh: () => {} // Pas besoin de refresh en mode demo
  };
} 