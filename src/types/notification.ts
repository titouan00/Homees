export interface Notification {
  id: string;
  user_id: string;
  type: 'nouveau_message' | 'demande_update' | 'demande_acceptee' | 'demande_rejetee' | 'nouveau_gestionnaire';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
  expires_at?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface NotificationWithMeta extends Notification {
  timeAgo: string;
  actionUrl?: string;
  canDismiss: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
}

export interface CreateNotificationData {
  user_id: string;
  type: Notification['type'];
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: Notification['priority'];
  expires_at?: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  types: {
    nouveau_message: boolean;
    demande_update: boolean;
    demande_acceptee: boolean;
    demande_rejetee: boolean;
    nouveau_gestionnaire: boolean;
  };
} 