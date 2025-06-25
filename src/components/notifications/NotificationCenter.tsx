'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  X, 
  Check, 
  CheckCircle, 
  Trash, 
  ChatCircle, 
  FileText, 
  User,
  Clock,
  Dot
} from '@phosphor-icons/react';
import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationWithMeta } from '@/types/notification';

interface NotificationCenterProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Centre de notifications avec dropdown
 */
export default function NotificationCenter({ userId, isOpen, onClose }: NotificationCenterProps) {
  const router = useRouter();
  const { notifications, stats, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications(userId);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleNotificationClick = async (notification: NotificationWithMeta) => {
    // Marquer comme lu si pas encore lu
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Rediriger vers l'URL d'action si disponible
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      onClose();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'nouveau_message':
        return <ChatCircle className="w-5 h-5 text-blue-500" />;
      case 'demande_update':
        return <FileText className="w-5 h-5 text-amber-500" />;
      case 'demande_acceptee':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'demande_rejetee':
        return <X className="w-5 h-5 text-red-500" />;
      case 'nouveau_gestionnaire':
        return <User className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-amber-500 bg-amber-50';
      case 'medium':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {stats.unread > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.unread}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filtres et actions */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Toutes ({stats.total})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'unread' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Non lues ({stats.unread})
            </button>
          </div>

          {stats.unread > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              Tout marquer lu
            </button>
          )}
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center p-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
                  getPriorityColor(notification.priority)
                } ${!notification.read ? 'bg-gray-50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  {/* Icône */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className={`text-sm font-medium ${
                        notification.read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h4>
                      
                      {/* Point non lu */}
                      {!notification.read && (
                        <Dot className="w-6 h-6 text-emerald-500 -mt-1" />
                      )}
                    </div>

                    <p className={`text-sm mt-1 ${
                      notification.read ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {notification.timeAgo}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-emerald-600 rounded"
                            title="Marquer comme lu"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                        
                        {notification.canDismiss && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                            title="Supprimer"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              router.push('/dashboard/notifications');
              onClose();
            }}
            className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Voir toutes les notifications
          </button>
        </div>
      )}
    </div>
  );
} 