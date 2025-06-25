'use client';

import { useState } from 'react';
import { Bell, Plus, X } from '@phosphor-icons/react';
import type { NotificationWithMeta } from '@/types/notification';

interface NotificationDemoProps {
  onAddNotification: (notification: NotificationWithMeta) => void;
}

/**
 * Composant de démonstration pour tester les notifications
 */
export default function NotificationDemo({ onAddNotification }: NotificationDemoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const createTestNotification = (type: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const notifications = {
      message: {
        title: 'Nouveau message de Jean Dupont',
        message: 'Bonjour, j\'aimerais discuter de la gestion de mon appartement...',
        type: 'nouveau_message' as const,
        data: { conversation_id: 'conv-123', sender_name: 'Jean Dupont' }
      },
      demande_acceptee: {
        title: '🎉 Demande acceptée !',
        message: 'Immobilier Paris a accepté de gérer votre bien (15 rue de la Paix)',
        type: 'demande_acceptee' as const,
        data: { demande_id: 'dem-456', gestionnaire_nom: 'Immobilier Paris' }
      },
      demande_update: {
        title: 'Mise à jour de votre demande',
        message: 'Votre demande est maintenant en cours de traitement',
        type: 'demande_update' as const,
        data: { demande_id: 'dem-789' }
      },
      demande_rejetee: {
        title: 'Demande déclinée',
        message: 'Malheureusement, nous ne pouvons pas traiter votre demande pour le moment',
        type: 'demande_rejetee' as const,
        data: { demande_id: 'dem-101' }
      }
    };

    const template = notifications[type as keyof typeof notifications];
    if (!template) return;

    const notification: NotificationWithMeta = {
      id: `demo-${Date.now()}`,
      user_id: 'demo-user',
      ...template,
      read: false,
      created_at: new Date().toISOString(),
      priority,
      timeAgo: 'À l\'instant',
      actionUrl: type.includes('message') ? '/dashboard/messages' : '/dashboard/proprietaire/demandes',
      canDismiss: true
    };

    onAddNotification(notification);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors z-40"
        title="Tester les notifications"
      >
        <Bell className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-80 z-40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Test Notifications
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => createTestNotification('message', 'medium')}
          className="w-full text-left p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div className="font-medium text-blue-900">Nouveau message</div>
          <div className="text-sm text-blue-700">Simuler réception d'un message</div>
        </button>

        <button
          onClick={() => createTestNotification('demande_acceptee', 'high')}
          className="w-full text-left p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          <div className="font-medium text-emerald-900">Demande acceptée</div>
          <div className="text-sm text-emerald-700">Gestionnaire accepte votre demande</div>
        </button>

        <button
          onClick={() => createTestNotification('demande_update', 'medium')}
          className="w-full text-left p-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
        >
          <div className="font-medium text-amber-900">Mise à jour demande</div>
          <div className="text-sm text-amber-700">Changement statut demande</div>
        </button>

        <button
          onClick={() => createTestNotification('demande_rejetee', 'medium')}
          className="w-full text-left p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          <div className="font-medium text-red-900">Demande rejetée</div>
          <div className="text-sm text-red-700">Gestionnaire décline votre demande</div>
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 Ces notifications de test simulent le comportement réel du système
        </p>
      </div>
    </div>
  );
} 