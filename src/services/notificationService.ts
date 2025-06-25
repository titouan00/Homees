import { supabase } from '@/lib/supabase-client';
import type { CreateNotificationData } from '@/types/notification';

/**
 * Service centralisé pour la gestion des notifications
 */
export class NotificationService {
  /**
   * Créer une notification
   */
  static async createNotification(data: CreateNotificationData): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: data.user_id,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data || {},
          priority: data.priority || 'medium',
          expires_at: data.expires_at,
          read: false,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      console.log('✅ Notification créée:', data.title);
      return { success: true };
    } catch (err) {
      console.error('❌ Erreur création notification:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erreur inconnue' 
      };
    }
  }

  /**
   * Notification pour nouveau message
   */
  static async notifyNewMessage(params: {
    recipientId: string;
    senderName: string;
    conversationId: string;
    messagePreview: string;
  }) {
    return this.createNotification({
      user_id: params.recipientId,
      type: 'nouveau_message',
      title: `Nouveau message de ${params.senderName}`,
      message: params.messagePreview.length > 100 
        ? `${params.messagePreview.substring(0, 100)}...` 
        : params.messagePreview,
      data: {
        conversation_id: params.conversationId,
        sender_name: params.senderName
      },
      priority: 'medium'
    });
  }

  /**
   * Notification pour mise à jour de demande
   */
  static async notifyDemandeUpdate(params: {
    proprietaireId: string;
    gestionnaireNom: string;
    demandeId: string;
    nouveauStatut: string;
    proprieteAdresse?: string;
  }) {
    const statusMessages = {
      acceptee: `${params.gestionnaireNom} a accepté votre demande`,
      rejetee: `${params.gestionnaireNom} a décliné votre demande`,
      en_cours: `${params.gestionnaireNom} traite votre demande`,
      terminee: `Votre demande avec ${params.gestionnaireNom} est terminée`
    };

    const title = statusMessages[params.nouveauStatut as keyof typeof statusMessages] || 
                   `Mise à jour de votre demande`;

    const message = params.proprieteAdresse 
      ? `Concernant le bien : ${params.proprieteAdresse}`
      : 'Consultez les détails de votre demande';

    const priority = params.nouveauStatut === 'acceptee' ? 'high' : 'medium';

    return this.createNotification({
      user_id: params.proprietaireId,
      type: 'demande_update',
      title,
      message,
      data: {
        demande_id: params.demandeId,
        gestionnaire_nom: params.gestionnaireNom,
        nouveau_statut: params.nouveauStatut,
        propriete_adresse: params.proprieteAdresse
      },
      priority
    });
  }

  /**
   * Notification pour demande acceptée (spécifique)
   */
  static async notifyDemandeAcceptee(params: {
    proprietaireId: string;
    gestionnaireNom: string;
    demandeId: string;
    proprieteAdresse?: string;
  }) {
    return this.createNotification({
      user_id: params.proprietaireId,
      type: 'demande_acceptee',
      title: '🎉 Demande acceptée !',
      message: `${params.gestionnaireNom} a accepté de gérer votre bien${
        params.proprieteAdresse ? ` (${params.proprieteAdresse})` : ''
      }`,
      data: {
        demande_id: params.demandeId,
        gestionnaire_nom: params.gestionnaireNom,
        propriete_adresse: params.proprieteAdresse
      },
      priority: 'high'
    });
  }

  /**
   * Notification pour demande rejetée
   */
  static async notifyDemandeRejetee(params: {
    proprietaireId: string;
    gestionnaireNom: string;
    demandeId: string;
    raison?: string;
  }) {
    return this.createNotification({
      user_id: params.proprietaireId,
      type: 'demande_rejetee',
      title: 'Demande déclinée',
      message: `${params.gestionnaireNom} ne peut pas traiter votre demande${
        params.raison ? ` : ${params.raison}` : ''
      }`,
      data: {
        demande_id: params.demandeId,
        gestionnaire_nom: params.gestionnaireNom,
        raison: params.raison
      },
      priority: 'medium'
    });
  }

  /**
   * Notification pour nouveau gestionnaire disponible
   */
  static async notifyNouveauGestionnaire(params: {
    proprietaireId: string;
    gestionnaireNom: string;
    gestionnaireId: string;
    zone: string;
  }) {
    return this.createNotification({
      user_id: params.proprietaireId,
      type: 'nouveau_gestionnaire',
      title: 'Nouveau gestionnaire dans votre zone',
      message: `${params.gestionnaireNom} propose ses services dans ${params.zone}`,
      data: {
        gestionnaire_id: params.gestionnaireId,
        gestionnaire_nom: params.gestionnaireNom,
        zone: params.zone
      },
      priority: 'low'
    });
  }

  /**
   * Nettoyer les anciennes notifications
   */
  static async cleanupOldNotifications(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;

      console.log('🧹 Anciennes notifications nettoyées');
    } catch (err) {
      console.error('❌ Erreur nettoyage notifications:', err);
    }
  }

  /**
   * Marquer les notifications expirées comme lues
   */
  static async markExpiredAsRead(): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .not('expires_at', 'is', null)
        .lt('expires_at', new Date().toISOString())
        .eq('read', false);

      if (error) throw error;

      console.log('⏰ Notifications expirées marquées comme lues');
    } catch (err) {
      console.error('❌ Erreur mise à jour notifications expirées:', err);
    }
  }
}

/**
 * Hooks d'événements pour déclencher automatiquement les notifications
 */
export class NotificationTriggers {
  /**
   * Déclencher lors de l'envoi d'un message
   */
  static async onMessageSent(params: {
    senderId: string;
    recipientId: string;
    senderName: string;
    conversationId: string;
    messageContent: string;
  }) {
    // Ne pas notifier l'expéditeur
    if (params.senderId === params.recipientId) return;

    await NotificationService.notifyNewMessage({
      recipientId: params.recipientId,
      senderName: params.senderName,
      conversationId: params.conversationId,
      messagePreview: params.messageContent
    });
  }

  /**
   * Déclencher lors d'un changement de statut de demande
   */
  static async onDemandeStatusChanged(params: {
    demandeId: string;
    proprietaireId: string;
    gestionnaireNom: string;
    nouveauStatut: string;
    ancienStatut: string;
    proprieteAdresse?: string;
    raison?: string;
  }) {
    // Notifications spécifiques selon le changement de statut
    switch (params.nouveauStatut) {
      case 'acceptee':
        await NotificationService.notifyDemandeAcceptee({
          proprietaireId: params.proprietaireId,
          gestionnaireNom: params.gestionnaireNom,
          demandeId: params.demandeId,
          proprieteAdresse: params.proprieteAdresse
        });
        break;

      case 'rejetee':
        await NotificationService.notifyDemandeRejetee({
          proprietaireId: params.proprietaireId,
          gestionnaireNom: params.gestionnaireNom,
          demandeId: params.demandeId,
          raison: params.raison
        });
        break;

      default:
        // Notification générique pour les autres changements
        await NotificationService.notifyDemandeUpdate({
          proprietaireId: params.proprietaireId,
          gestionnaireNom: params.gestionnaireNom,
          demandeId: params.demandeId,
          nouveauStatut: params.nouveauStatut,
          proprieteAdresse: params.proprieteAdresse
        });
        break;
    }
  }

  /**
   * Déclencher lors de la création d'une nouvelle demande (côté gestionnaire)
   */
  static async onNewDemandeCreated(params: {
    gestionnaireId: string;
    proprietaireNom: string;
    demandeId: string;
    proprieteAdresse?: string;
    serviceType: string;
  }) {
    await NotificationService.createNotification({
      user_id: params.gestionnaireId,
      type: 'demande_update',
      title: 'Nouvelle demande reçue',
      message: `${params.proprietaireNom} souhaite un service de ${params.serviceType}${
        params.proprieteAdresse ? ` pour ${params.proprieteAdresse}` : ''
      }`,
      data: {
        demande_id: params.demandeId,
        proprietaire_nom: params.proprietaireNom,
        propriete_adresse: params.proprieteAdresse,
        service_type: params.serviceType
      },
      priority: 'high'
    });
  }
} 